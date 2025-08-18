import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebarvd'; // Adjust if needed
import './ManageCatalog.css'; // Optional CSS

const ManageCatalog = () => {
    const [category, setCategory] = useState({ name: '', image: null });
    const [subcategory, setSubcategory] = useState({ name: '', category_id: '', image: null });
    const [brand, setBrand] = useState({ name: '', image: null });
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');

    // Load categories for subcategory dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('/api/categories');
                setCategories(res.data);
            } catch (err) {
                console.error('Failed to load categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Helper: Upload image and return URL
    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const res = await axios.post('/api/upload/image', formData);
        return res.data.imageUrl; // Backend should return { imageUrl: '...' }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const imageUrl = category.image ? await handleImageUpload(category.image) : '';
            await axios.post('/api/categories', {
                name: category.name,
                image: imageUrl
            });
            setMessage('Category added!');
            setCategory({ name: '', image: null });
        } catch (err) {
            console.error('Add category failed:', err);
        }
    };

    const handleAddSubcategory = async (e) => {
        e.preventDefault();
        try {
            const imageUrl = subcategory.image ? await handleImageUpload(subcategory.image) : '';
            await axios.post(`/api/categories/${subcategory.category_id}/subcategories`, {
                name: subcategory.name,
                image: imageUrl
            });
            setMessage('Subcategory added!');
            setSubcategory({ name: '', category_id: '', image: null });
        } catch (err) {
            console.error('Add subcategory failed:', err);
        }
    };


    const handleAddBrand = async (e) => {
        e.preventDefault();
        try {
            const imageUrl = brand.image ? await handleImageUpload(brand.image) : '';
            await axios.post('/api/brands', {
                name: brand.name,
                image: imageUrl
            });
            setMessage('Brand added!');
            setBrand({ name: '', image: null });
        } catch (err) {
            console.error('Add brand failed:', err);
        }
    };

    return (
        <div className="admin-dashboard-layout">
            <Sidebar />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Manage Catalog</h1>

                {message && <div className="text-green-600 mb-4">{message}</div>}

                {/* Add Category */}
                <form onSubmit={handleAddCategory} className="catalog-form">
                    <h3>Add Category</h3>
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={category.name}
                        onChange={(e) => setCategory({ ...category, name: e.target.value })}
                        required
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCategory({ ...category, image: e.target.files[0] })}
                    />
                    <button type="submit">Add Category</button>
                </form>

                {/* Add Subcategory */}
                <form onSubmit={handleAddSubcategory} className="catalog-form">
                    <h3>Add Subcategory</h3>
                    <input
                        type="text"
                        placeholder="Subcategory Name"
                        value={subcategory.name}
                        onChange={(e) => setSubcategory({ ...subcategory, name: e.target.value })}
                        required
                    />
                    <select
                        value={subcategory.category_id}
                        onChange={(e) => setSubcategory({ ...subcategory, category_id: e.target.value })}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSubcategory({ ...subcategory, image: e.target.files[0] })}
                    />
                    <button type="submit">Add Subcategory</button>
                </form>

                {/* Add Brand */}
                <form onSubmit={handleAddBrand} className="catalog-form">
                    <h3>Add Brand</h3>
                    <input
                        type="text"
                        placeholder="Brand Name"
                        value={brand.name}
                        onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                        required
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBrand({ ...brand, image: e.target.files[0] })}
                    />
                    <button type="submit">Add Brand</button>
                </form>
            </div>
        </div>
    );
};

export default ManageCatalog;
