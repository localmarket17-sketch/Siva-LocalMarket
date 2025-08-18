import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebarvd';
import './ManageProducts.css';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/admin/products');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const filteredProducts = products.filter((p) =>
    (p.title?.toLowerCase() || '').includes(search.toLowerCase())
  );


  return (
    <div className="admin-dashboard-layout">
      <Sidebar />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Manage Products</h2>

        <input
          type="text"
          placeholder="Search by title..."
          className="border p-2 rounded mb-4 w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2">ID</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-t">
                      <td className="p-2">{product.id}</td>
                      <td className="p-2">{product.title}</td>
                      <td className="p-2">₹{product.price}</td>
                      <td className="p-2">{product.stock || 'N/A'}</td>
                      <td className="p-2">
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                        {/* Optional: Add Edit button here */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-2 text-center">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
