import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CategoriesPage.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CategoryNavBar from '../../components/CategoryNavBar';
import RImg from '../../assets/R.png';

const CategoriesAndBrandsPage = () => {
  const [view, setView] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [popupSubcategories, setPopupSubcategories] = useState([]);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get('/api/categories');
        setCategories(catRes.data);

        const brandRes = await axios.get('/api/brands');
        setBrands(brandRes.data);
      } catch (err) {
        console.error('Failed to load categories or brands:', err);
      }
    };

    fetchData();
  }, []);

  // Close popup on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setExpandedCategory(null);
        setPopupSubcategories([]);
      }
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setExpandedCategory(null);
        setPopupSubcategories([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleCategoryClick = async (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      setPopupSubcategories([]);
      return;
    }

    try {
      const res = await axios.get(`/api/categories/${categoryId}/subcategories`);
      setExpandedCategory(categoryId);
      setPopupSubcategories(res.data);
    } catch (err) {
      console.error('Failed to load subcategories:', err);
    }
  };

  const handleSubcategorySelect = (subcategoryId) => {
    navigate(`/subcategory/${subcategoryId}`);
    setExpandedCategory(null);
    setPopupSubcategories([]);
  };

  const handleBrandSelect = (brandId) => {
    navigate(`/brand/${brandId}`);
  };

  return (
    <div className="categories-page">
      <Navbar />
      <CategoryNavBar />

      <div className="tab-switcher">
        <button className={view === 'categories' ? 'active' : ''} onClick={() => setView('categories')}>
          Categories
        </button>
        <button className={view === 'brands' ? 'active' : ''} onClick={() => setView('brands')}>
          Brands
        </button>
      </div>

      <div className="content-section">
        {view === 'categories' && (
          <div className="category-list">
            {categories.map((cat) => (
              <div key={cat.id} className="category-block">
                <div className="category-header" onClick={() => handleCategoryClick(cat.id)}>
                  <img src={cat.image || RImg} alt={cat.name} onError={(e) => (e.target.src = RImg)} />
                  <span>{cat.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'brands' && (
          <div className="brand-list">
            {brands.map((brand) => (
              <div key={brand.id} className="brand-icon" onClick={() => handleBrandSelect(brand.id)}>
                <img src={brand.image || RImg} alt={brand.name} onError={(e) => (e.target.src = RImg)} />
                <p>{brand.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen popup overlay for subcategories */}
      {expandedCategory && (
        <div className="subcategory-popup-overlay">
          <div className="subcategory-popup" ref={popupRef}>
            <h3>Select Subcategory</h3>
            <div className="subcategory-popup-list">
              {popupSubcategories.map((sub) => (
                <div
                  key={sub.id}
                  className="subcategory-item"
                  onClick={() => handleSubcategorySelect(sub.id)}
                >
                  {sub.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CategoriesAndBrandsPage;
