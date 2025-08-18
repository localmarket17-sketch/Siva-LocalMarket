// src/components/CategoryStrip.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './CategoryNavBar.css';
import { Link } from 'react-router-dom';
import RImg from '../assets/R.png';

const CategoryStrip = () => {
  const [categories, setCategories] = useState([]);
  const stripRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const scrollLeft = () => {
    if (stripRef.current) {
      stripRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (stripRef.current) {
      stripRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  return (
    <div className="category-strip-container">
      <button className="scroll-btn left" onClick={scrollLeft}>{'<'}</button>

      <div className="category-strip" ref={stripRef}>
        {categories.map((cat) => (
          <Link to={`/category/${cat.id}`} className="category-pill" key={cat.id}>
            <img src={cat.image || RImg} alt={cat.name} onError={(e) => (e.target.src = RImg)} />
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>

      <button className="scroll-btn right" onClick={scrollRight}>{'>'}</button>
    </div>
  );
};

export default CategoryStrip;
