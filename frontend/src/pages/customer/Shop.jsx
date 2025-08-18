import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate } from 'react-router-dom';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CategoryNavbar from '../../components/CategoryNavBar';
import './Shop.css';
import RImg from '../../assets/R.png'; // Test image
import Banner1 from "../../assets/smart-cart-sale.png";
import Banner2 from "../../assets/festive-cart-sale.png";
import Banner3 from "../../assets/back-to-school-sale.png";
import Banner4 from "../../assets/fresh-start-sale.png";
import Banner5 from "../../assets/weekend-saver-deals.png";
import Trend1 from "../../assets/grocery.png";
import Trend2 from "../../assets/snacks.jpg";
import Trend3 from "../../assets/daily.png";
import Trend4 from "../../assets/stationery.webp";
import Trend5 from "../../assets/work.webp";
import Trend6 from "../../assets/seasonal.webp";

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [descriptions, setDescriptions] = useState({});
  const [subcategories, setSubcategories] = useState({});
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();
  const banners = [
    { id: 1, img: Banner1, alt: "Smart Cart Sale" },
    { id: 2, img: Banner2, alt: "Festive Cart Sale" },
    { id: 3, img: Banner3, alt: "Back to School Sale" },
    { id: 4, img: Banner4, alt: "Fresh Start Sale" },
    { id: 5, img: Banner5, alt: "Weekend Saver Deals" },
  ];
  const trendingItems = [
    { id: 1, img: Trend1, alt: "Fresh Groceries" },
    { id: 2, img: Trend2, alt: "Snacks & Beverages" },
    { id: 3, img: Trend3, alt: "Daily Essentials" },
    { id: 4, img: Trend4, alt: "Back to School Stationery" },
    { id: 5, img: Trend5, alt: "Work From Home Picks" },
    { id: 6, img: Trend6, alt: "Seasonal Specials" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get('/api/categories');
        setCategories(catRes.data);

        const descs = {};
        const allSubcats = {};
        for (const cat of catRes.data) {
          const subRes = await axios.get(`/api/categories/${cat.id}/subcategories`);
          allSubcats[cat.name] = subRes.data;
          descs[cat.name] = `Explore top quality ${cat.name.toLowerCase()} for your daily needs.`;
        }
        setDescriptions(descs);
        setSubcategories(allSubcats);

        const brandRes = await axios.get('/api/brands');
        setBrands(brandRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const getCustomTitle = (name) => {
    const lower = name.toLowerCase();
    if (lower === 'books') return 'Discover Your Next Favorite Book';
    if (lower === 'stationery') return 'Top Study Essentials';
    return 'Top Picks';
  };

  const handleBrandSelect = (brandId) => {
    navigate(`/brand/${brandId}`);
  };
  const renderBannerCarousel = () => (
    <div className="banner-carousel container">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        loop={true}
        slidesPerView={3}
        spaceBetween={10}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="banner-card">
              <img
                src={banner.img}
                alt={banner.alt}
                className="w-full h-auto rounded-xl shadow-md"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
  const TrendingNow = () => (
    <div className="trending-now-section">
      <h3 className="trending-title container mb-4">Trending Now</h3>
      <div className="static-cards container flex space-x-4 overflow-x-auto scrollbar-hide">
        {trendingItems.map((item) => (
          <div
            className="static-card min-w-[160px] bg-white rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer flex-shrink-0"
            key={item.id}
          >
            <img
              src={item.img}
              alt={item.alt}
              className="w-full h-40 object-cover rounded-t-xl"
            />
            <div className="p-2 text-center font-medium text-sm">
              {item.alt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="shop-page">
      <Navbar />
      <CategoryNavbar />

      {/* Static Cards Section */}
      {TrendingNow()}

      {/* Banner Strip 1 */}
      {renderBannerCarousel()}

      {/* Top Brands */}
      <div className="brand-scroll container">
        <h3>Top Brands</h3>
        <div className="brand-row">
          {brands.map((brand) => (
            <div
              className="brand-card"
              key={brand.id}
              onClick={() => handleBrandSelect(brand.id)}
            >
              <img src={brand.image || RImg} alt={brand.name} />
              <p>{brand.name}</p>
            </div>
          ))}
        </div>
      </div>


      {/* Banner Strip 2 */}
      {renderBannerCarousel()}

      {/* Subcategories and Category Headers */}
      {categories.map((cat, index) => (
        <div className="subcategory-section container" key={cat.id}>
          <div className="category-heading">
            <h2>{cat.name} – {getCustomTitle(cat.name)}</h2>
            <Link to={`/category/${cat.id}`} className="view-all">View All →</Link>
          </div>

          <div className="subcategory-grid">
            {(subcategories[cat.name] || []).slice(0, 10).map((sub) => (
              <Link to={`/subcategory/${sub.id}`} className="subcategory-card" key={sub.id}>
                <img src={sub.image || RImg} alt={sub.name} onError={e => e.target.src = RImg} />
                <span>{sub.name}</span>
              </Link>
            ))}
          </div>

          {/* Insert banner strip after every 2 categories */}
          {(index + 1) % 2 === 0 && renderBannerCarousel()}
        </div>
      ))}

      <Footer />
    </div>
  );
};

export default Shop;
