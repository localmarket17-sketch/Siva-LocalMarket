// src/components/ProductCard.jsx

import React from 'react';
import './ProductCard.css';


const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <img
        src={product.image || '/placeholder.png'}
        alt={product.title}
        className="product-image"
      />
      <h3 className="product-title">{product.title}</h3>
      <p className="product-brand">{product.brand}</p>
      <p className="product-price">₹{product.price}</p>
      <button
        onClick={() => onAddToCart(product)}
        className="add-to-cart-btn"
      >
        Add to Cart
      </button>
    </div>

  );
};

export default ProductCard;
