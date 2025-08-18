import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebarvd from '../../components/Sidebarvd';
import Select from 'react-select';
import './AddProduct.css';

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    subcategory_id: '',
    brand_ids: []
  });

  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/categories')
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));

    axios.get('/api/brands')
      .then(res => setBrands(res.data))
      .catch(() => setBrands([]));

    fetchProducts();
  }, []);

  useEffect(() => {
    if (product.category_id) {
      axios.get(`/api/subcategories?categoryId=${product.category_id}`)
        .then(res => setSubcategories(res.data))
        .catch(() => setSubcategories([]));
    } else {
      setSubcategories([]);
    }
  }, [product.category_id]);

  const fetchProducts = () => {
    axios.get('/api/vendor/products', { withCredentials: true })
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  };

  const handleChange = (e) => {
    const { name, options } = e.target;
    if (name === "brand_ids") {
      const selectedValues = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setProduct(prev => ({ ...prev, [name]: selectedValues }));
    } else {
      setProduct(prev => ({ ...prev, [name]: e.target.value }));
    }
  };


  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, price, stock } = product;

    if (!title || !description || !price || !stock) {
      setMessage('Please fill in all required fields.');
      return;
    }

    let imageUrl = '';

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );

        imageUrl = uploadRes.data.secure_url;
      }

      const productData = { ...product, image: imageUrl };

      if (editingId) {
        await axios.put(`/api/vendor/products/${editingId}`, productData, { withCredentials: true });
        setMessage('Product updated successfully!');
      } else {
        await axios.post('/api/vendor/add-product', productData, { withCredentials: true });
        setMessage('Product added successfully!');
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Upload/Add Error:', error);
      setMessage('Failed to add/update product.');
    }
  };

  const resetForm = () => {
    setProduct({
      title: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      subcategory_id: '',
      brand_ids: []
    });
    setImageFile(null);
    setEditingId(null);
    setMessage('');
  };

  const handleEdit = (prod) => {
    setProduct({
      title: prod.title,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      category_id: prod.category_id,
      subcategory_id: prod.subcategory_id,
      brand_ids: prod.brand_ids || [] // ✅ array of IDs
    });
    setEditingId(prod.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios.delete(`/api/vendor/products/${id}`, { withCredentials: true })
        .then(() => {
          fetchProducts();
          setMessage('Product deleted successfully.');
        })
        .catch(() => setMessage('Failed to delete product.'));
    }
  };

  const handleStockUpdate = (id, newStock) => {
    axios.put(`/api/vendor/inventory/${id}`, { stock: newStock }, { withCredentials: true })
      .then(() => fetchProducts())
      .catch(() => setMessage('Failed to update stock.'));
  };

  return (
    <div className="add-product-layout">
      <Sidebarvd role="vendor" />
      <div className="add-product-container">
        <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="add-product-form">
          <input type="text" name="title" value={product.title} onChange={handleChange} placeholder="Product Title" required />
          <textarea name="description" value={product.description} onChange={handleChange} placeholder="Description" required />
          <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price" required />
          <input type="number" name="stock" value={product.stock} onChange={handleChange} placeholder="Stock Quantity" required />

          <select name="category_id" value={product.category_id} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select name="subcategory_id" value={product.subcategory_id} onChange={handleChange} required>
            <option value="">Select Subcategory</option>
            {subcategories.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>

          <Select
            isMulti
            name="brand_ids"
            options={brands.map(b => ({ value: b.id, label: b.name }))}
            value={brands
              .filter(b => product.brand_ids.includes(String(b.id)))
              .map(b => ({ value: b.id, label: b.name }))}
            onChange={(selected) => {
              setProduct(prev => ({ ...prev, brand_ids: selected ? selected.map(s => String(s.value)) : [] }));
            }}
          />

          <input type="file" accept="image/*" onChange={handleImageChange} />

          <button type="submit">{editingId ? 'Update Product' : 'Add Product'}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </form>

        {message && <p className="form-message">{message}</p>}

        <h3>📋 Manage Products</h3>
        <table className="product-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id}>
                <td>{prod.title}</td>
                <td>₹{prod.price}</td>
                <td>
                  <input
                    type="number"
                    value={prod.stock}
                    onChange={(e) => handleStockUpdate(prod.id, e.target.value)}
                    className="stock-input"
                  />
                </td>
                <td>
                  <button onClick={() => handleEdit(prod)}>Edit</button>
                  <button onClick={() => handleDelete(prod.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddProduct;
