import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CategoryNavbar from '../../components/CategoryNavBar';
import ProductFilter from '../../components/FilterSortPanel';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import './SubcategoryPage.css';
import RImg from '../../assets/R.png';
import { Plus, Minus } from 'lucide-react';

const SubcategoryPage = () => {
  const { subcategoryId } = useParams();
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { cartItems, addToCart, removeFromCart, getCartQty, updateQuantity } = useCart();

  const [subcategory, setSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchSubcategoryAndProducts = async () => {
      try {
        const subRes = await axios.get(`/api/subcategories/${subcategoryId}`);
        setSubcategory(subRes.data.subcategory);

        const res = await axios.get(`/api/subcategories/${subcategoryId}/products`);
        const productsWithBrands = res.data.map(p => ({
          ...p,
          brands: Array.isArray(p.brands) ? p.brands : [],
        }));
        setProducts(productsWithBrands);
        setFilteredProducts(productsWithBrands);
      } catch (err) {
        console.error('Error fetching subcategory or products:', err);
      }
    };

    fetchSubcategoryAndProducts();
  }, [subcategoryId]);

  const handleApplyFilters = (selectedFilters) => {
    let filtered = [...products];

    if (selectedFilters.category) {
      const categoryId = Number(selectedFilters.category);
      filtered = filtered.filter(p => p.category_id === categoryId);
    }

    if (selectedFilters.subcategory) {
      const subcategoryIdNum = Number(selectedFilters.subcategory);
      filtered = filtered.filter(p => p.subcategory_id === subcategoryIdNum);
    }

    if (selectedFilters.brand) {
      const brandId = Number(selectedFilters.brand);
      filtered = filtered.filter(p => p.brands.includes(brandId));
    }

    if (selectedFilters.priceMin !== null && !isNaN(selectedFilters.priceMin)) {
      filtered = filtered.filter(p => parseFloat(p.price) >= selectedFilters.priceMin);
    }

    if (selectedFilters.priceMax !== null && !isNaN(selectedFilters.priceMax)) {
      filtered = filtered.filter(p => parseFloat(p.price) <= selectedFilters.priceMax);
    }

    if (selectedFilters.sort === 'price_asc') {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (selectedFilters.sort === 'price_desc') {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    setFilteredProducts(filtered);
  };

  const toggleWishlist = (e, product) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  const handleAdd = (e, product) => {
    e.stopPropagation();
    const cartItem = cartItems.find(item => item.product_id === product.id);
    if (!cartItem) addToCart(product);
    else updateQuantity(cartItem.id, cartItem.quantity + 1);
  };

  const handleRemove = (e, product) => {
    e.stopPropagation();
    const cartItem = cartItems.find(item => item.product_id === product.id);
    if (cartItem) {
      if (cartItem.quantity === 1) removeFromCart(cartItem.id);
      else updateQuantity(cartItem.id, cartItem.quantity - 1);
    }
  };

  return (
    <div className="subcategory-page">
      <Navbar />
      <CategoryNavbar activeCategoryId={subcategory?.category_id || null} />

      <div className="breadcrumb container">
        <Link to="/">Home</Link> <span>&gt;</span>
        <span>{subcategory?.name || 'Subcategory'}</span>
      </div>

      {/* Flex container wrapping filter + products */}
      <div className="subcategory-content container">
        {/* Sidebar filter */}
        <div className="filter-sidebar">
          <ProductFilter onApplyFilters={handleApplyFilters} />
        </div>

        {/* Products section */}
        <div className="category-products">
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => {
                const quantity = getCartQty(product.id);
                return (
                  <div className="product-card" key={`${product.id}-${quantity}`}>
                    <div className="image-container" onClick={() => navigate(`/product/${product.id}`)}>
                      <img
                        src={product.image || RImg}
                        alt={product.title}
                        onError={(e) => (e.target.src = RImg)}
                        className="product-img"
                      />
                      <div className="more-overlay">+6 more</div>

                      <div
                        className={`wishlist-icon ${isInWishlist(product.id) ? 'active' : ''}`}
                        onClick={(e) => toggleWishlist(e, product)}
                      >
                        {isInWishlist(product.id) ? '❤️' : '🤍'}
                      </div>
                    </div>

                    <h4 className="product-title">{product.title}</h4>
                    <p className="product-price">₹{Number(product.price).toFixed(2)}</p>
                    <p className="free-delivery">Free Delivery</p>

                    <div className="cart-control">
                      {quantity === 0 ? (
                        <button className="plus-icon" onClick={(e) => handleAdd(e, product)}>
                          <Plus size={18} />
                        </button>
                      ) : (
                        <div className="qty-control">
                          <button onClick={(e) => handleRemove(e, product)}>
                            <Minus size={16} />
                          </button>
                          <span>{quantity}</span>
                          <button onClick={(e) => handleAdd(e, product)}>
                            <Plus size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-products">No products found under this subcategory.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SubcategoryPage;
