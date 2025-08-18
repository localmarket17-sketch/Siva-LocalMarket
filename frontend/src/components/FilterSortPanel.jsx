import React, { useState, useEffect } from "react";
import axios from "axios";
import './FilterSortPanel.css';

const ProductFilter = ({ onApplyFilters }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
    brand: [],
    price: 500,
    sort: "default",
  });
  const [openSection, setOpenSection] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    axios.get("/api/categories").then(res => setCategories(res.data));
    axios.get("/api/brands").then(res => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (filters.category) {
      axios
        .get(`/api/categories/${filters.category}/subcategories`)
        .then(res => setSubcategories(res.data))
        .catch(() => setSubcategories([]));
    } else setSubcategories([]);
  }, [filters.category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "brand") {
      let newBrands = [...filters.brand];
      if (checked) newBrands.push(value);
      else newBrands = newBrands.filter(b => b !== value);
      setFilters(prev => ({ ...prev, brand: newBrands }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleApply = () => {
    const appliedFilters = {};
    if (filters.category) appliedFilters.category = parseInt(filters.category);
    if (filters.subcategory) appliedFilters.subcategory = parseInt(filters.subcategory);
    if (filters.brand.length) appliedFilters.brand = filters.brand.map(b => parseInt(b));
    if (filters.price) appliedFilters.priceMax = parseFloat(filters.price);
    if (filters.sort) appliedFilters.sort = filters.sort === "default" ? "" : filters.sort;
    onApplyFilters(appliedFilters);
    setIsMobileFilterOpen(false); // close panel on mobile after apply
  };

  const toggleSection = (section) => {
    setOpenSection(prev => (prev === section ? "" : section));
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="mobile-filter-toggle"
        onClick={() => setIsMobileFilterOpen(true)}
      >
      ⇅ Filters
      </button>

      <aside className={`filter-container ${isMobileFilterOpen ? "open" : ""}`}>
        <div className="filter-header-mobile">
          <h3>Filters</h3>
          <button
            className="mobile-filter-close"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Category */}
        <div className={`filter-section ${openSection === "category" ? "open" : ""}`}>
          <h4 onClick={() => toggleSection("category")}>Category</h4>
          {openSection === "category" && (
            <div className="filter-options">
              {categories.map(c => (
                <label key={c.id}>
                  <input
                    type="radio"
                    name="category"
                    value={c.id}
                    checked={filters.category === c.id.toString()}
                    onChange={handleChange}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Subcategory */}
        <div className={`filter-section ${openSection === "subcategory" ? "open" : ""}`}>
          <h4 onClick={() => toggleSection("subcategory")}>Subcategory</h4>
          {openSection === "subcategory" && (
            <div className="filter-options">
              {subcategories.map(s => (
                <label key={s.id}>
                  <input
                    type="radio"
                    name="subcategory"
                    value={s.id}
                    checked={filters.subcategory === s.id.toString()}
                    onChange={handleChange}
                  />
                  {s.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Brand */}
        <div className={`filter-section ${openSection === "brand" ? "open" : ""}`}>
          <h4 onClick={() => toggleSection("brand")}>Brand</h4>
          {openSection === "brand" && (
            <div className="filter-options">
              {brands.map(b => (
                <label key={b.id}>
                  <input
                    type="checkbox"
                    name="brand"
                    value={b.id}
                    checked={filters.brand.includes(b.id.toString())}
                    onChange={handleChange}
                  />
                  {b.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="filter-section">
          <h4>Price: 0 - {filters.price}</h4>
          <div className="filter-options price-range">
            <input
              type="range"
              name="price"
              min="0"
              max={maxPrice}
              step="10"
              value={filters.price}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Sort */}
        <div className={`filter-section ${openSection === "sort" ? "open" : ""}`}>
          <h4 onClick={() => toggleSection("sort")}>Sort By</h4>
          {openSection === "sort" && (
            <div className="filter-options">
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="default"
                  checked={filters.sort === "default"}
                  onChange={handleChange}
                />
                Default
              </label>
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="price_asc"
                  checked={filters.sort === "price_asc"}
                  onChange={handleChange}
                />
                Price Low → High
              </label>
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="price_desc"
                  checked={filters.sort === "price_desc"}
                  onChange={handleChange}
                />
                Price High → Low
              </label>
            </div>
          )}
        </div>

        <div className="filter-actions">
          <button className="apply-btn" onClick={handleApply}>Apply</button>
        </div>
      </aside>
    </>
  );
};

export default ProductFilter;
