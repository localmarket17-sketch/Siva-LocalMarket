import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CategoryNavBar from '../../components/CategoryNavBar';
import ProductFilter from '../../components/FilterSortPanel';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import RImg from '../../assets/R.png';
import './BrandPage.css';
import { Plus, Minus } from 'lucide-react';

const BrandPage = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, getCartQty, updateQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [brandName, setBrandName] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        const brandRes = await axios.get(`/api/brands/${brandId}`);
        setBrandName(brandRes.data.name);

        const productRes = await axios.get(`/api/brands/${brandId}/products`);
        const productsWithBrands = productRes.data.map(p => ({
          ...p,
          brands: Array.isArray(p.brands) ? p.brands : [],
        }));
        setProducts(productsWithBrands);
        setFilteredProducts(productsWithBrands);
      } catch (err) {
        console.error('Failed to fetch brand or products:', err);
      }
    };

    fetchBrandProducts();
  }, [brandId]);

  const handleApplyFilters = (selectedFilters) => {
    let filtered = [...products];

    if (selectedFilters.category) {
      const categoryId = Number(selectedFilters.category);
      filtered = filtered.filter(p => p.category_id === categoryId);
    }

    if (selectedFilters.subcategory) {
      const subcategoryId = Number(selectedFilters.subcategory);
      filtered = filtered.filter(p => p.subcategory_id === subcategoryId);
    }

    if (selectedFilters.brand) {
      const brandIdNum = Number(selectedFilters.brand);
      filtered = filtered.filter(p => p.brands.includes(brandIdNum));
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

  const handleAdd = (product) => {
    const cartItem = cartItems.find(item => item.product_id === product.id);
    if (!cartItem) addToCart(product);
    else updateQuantity(cartItem.id, cartItem.quantity + 1);
  };

  const handleRemove = (product) => {
    const cartItem = cartItems.find(item => item.product_id === product.id);
    if (cartItem) {
      if (cartItem.quantity === 1) removeFromCart(cartItem.id);
      else updateQuantity(cartItem.id, cartItem.quantity - 1);
    }
  };

  return (
    <div className="brand-page">
      <Navbar />
      <CategoryNavBar />

      {/* Breadcrumb */}
      <div className="breadcrumb container">
        <Link to="/">Home</Link> <span>&gt;</span> <span>{brandName || 'Brand'}</span>
      </div>

      {/* Flex container for filter + products */}
      <div className="brand-content container">
        {/* Sidebar filter */}
        <div className="filter-sidebar">
          <ProductFilter onApplyFilters={handleApplyFilters} />
        </div>

        {/* Products section */}
        <div className="category-products">
          <h2 className="brand-title">Brand: {brandName}</h2>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => {
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
                    {product.tagline && <p className="product-tagline">{product.tagline}</p>}

                    <div className="cart-control">
                      {quantity === 0 ? (
                        <button className="plus-icon" onClick={() => handleAdd(product)}>
                          <Plus size={18} />
                        </button>
                      ) : (
                        <div className="qty-control">
                          <button onClick={() => handleRemove(product)}>
                            <Minus size={16} />
                          </button>
                          <span>{quantity}</span>
                          <button onClick={() => handleAdd(product)}>
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
            <p className="no-products">No products available for this brand.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BrandPage;
