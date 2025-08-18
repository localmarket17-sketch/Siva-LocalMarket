import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CategoryNavbar from '../../components/CategoryNavBar';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import RImg from '../../assets/R.png';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [cartQty, setCartQty] = useState(0);

  const isInWishlist = wishlist.some((item) => item.id === product?.id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${productId}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to load product:', err);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    addToCart(product);
    setCartQty(1);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const breadcrumb = location.state?.from || 'Home';

  return (
    <div className="product-details-page">
      <Navbar />
      <CategoryNavbar />

      {product ? (
        <div className="product-details container">
          <div className="breadcrumb">
            <Link to="/">{breadcrumb}</Link> &gt; <span>{product.name}</span>
          </div>

          <div className="details-grid">
            <div className="product-image">
              <img
                src={product.image || RImg}
                alt={product.name}
                onError={(e) => (e.target.src = RImg)}
              />

              {/* Wishlist Icon */}
              <div className="wishlist-icon" onClick={handleWishlistToggle}>
                {isInWishlist ? '💖' : '❤️'}
              </div>

              {/* Desktop Add/Buy Buttons */}
              <div className="desktop-buttons">
                <button
                  className="add-to-cart"
                  onClick={cartQty === 0 ? handleAddToCart : () => navigate('/cart')}
                >
                  {cartQty === 0 ? 'Add to Cart' : 'Go to Cart'}
                </button>
                <button className="buy-now" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>
            </div>

            <div className="product-info">
              <h2 className="product-title">{product.name}</h2>
              <p className="product-price">₹{product.price}</p>
              <p className="free-delivery">Free Delivery</p>

              <div className="offers">
                <h4>Offers</h4>
                {product.offers?.length > 0 ? (
                  <ul>
                    {product.offers.map((offer, index) => (
                      <li key={index}>{offer}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-text">No current offers</p>
                )}
              </div>

              <p className="product-quantity">
                <strong>Quantity:</strong> {product.quantityInfo || ''}
              </p>

              <div className="highlights">
                <h4>Highlights</h4>
                {product.highlights?.length > 0 ? (
                  <ul>
                    {product.highlights.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-text">No highlights available</p>
                )}
              </div>

              <p><strong>Seller:</strong> {product.vendor || ''}</p>
              <p><strong>Manufacturer:</strong> {product.manufacturer || ''}</p>

              <div className="product-meta-details">
                <h3>Product Details</h3>
                <ul>
                  <li><strong>Brand:</strong> {product.details?.brand || ''}</li>
                  <li><strong>Manufacturer:</strong> {product.details?.manufacturer || ''}</li>
                  <li><strong>Country of Origin:</strong> {product.details?.origin || ''}</li>
                  <li><strong>Generic Name:</strong> {product.details?.genericName || ''}</li>
                  <li><strong>Net Quantity:</strong> {product.details?.netQuantity || ''}</li>
                  <li><strong>Packer:</strong> {product.details?.packer || ''}</li>
                </ul>
              </div>

              {product.description && (
                <div className="description-section">
                  <h3>Description</h3>
                  <p>{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="loading-text">Loading product...</p>
      )}

      <div className="sticky-action-bar">
        <button
          className="add-to-cart"
          onClick={cartQty === 0 ? handleAddToCart : () => navigate('/cart')}
        >
          {cartQty === 0 ? 'Add to Cart' : 'Go to Cart'}
        </button>
        <button className="buy-now" onClick={handleBuyNow}>
          Buy Now
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
