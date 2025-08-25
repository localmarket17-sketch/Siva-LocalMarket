import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from '../contexts/CartContext';
import { WishlistProvider } from '../contexts/WishlistContext';
import { SearchProvider } from '../contexts/SearchContext';

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageVendors from '../pages/admin/ManageVendors';
import ManageDeliveryBoys from '../pages/admin/ManageDeliveryBoys';
import ManageOrders from '../pages/admin/ManageOrders';
import ManageProducts from '../pages/admin/ManageProducts';
import AdminInventory from '../pages/admin/Inventory';
import SalesReportAdmin from '../pages/admin/SalesReport';
import AdminNotifications from '../pages/admin/Notifications';
import AdminProfile from '../pages/admin/Profile';
import ManageCatalog from '../pages/admin/ManageCatalog';

// Vendor pages
import VendorDashboard from '../pages/vendor/Dashboard';
import AddProduct from '../pages/vendor/AddProduct';
import VendorOrders from '../pages/vendor/Orders';
import SalesReport from '../pages/vendor/SalesReport';
import Notifications from '../pages/vendor/Notifications';
import Profile from '../pages/vendor/Profile';

// Delivery pages
import DeliveryDashboard from '../pages/delivery/Dashboard';
import AssignedDeliveries from '../pages/delivery/AssignedDeliveries';
import SalesReports from '../pages/delivery/SalesReports';
import Notification from '../pages/delivery/Notifications';
import Profiles from '../pages/delivery/Profile';

// Customer pages
import Shop from '../pages/customer/Shop';
import CategoryPage from '../pages/customer/CategoryPage';
import CategoriesPage from '../pages/customer/CategoriesPage';
import BrandPage from '../pages/customer/BrandPage';
import ProductDetails from '../pages/customer/ProductDetails';
import Cart from '../pages/customer/Cart';
import NotificationBell from '../components/NotificationBell';
import Checkout from '../pages/customer/Checkout';
import OrderHistory from '../pages/customer/MyOrders';
import Wishlist from '../pages/customer/Wishlist';
import Support from '../pages/customer/Support';
import SubcategoryPage from '../pages/customer/SubcategoryPage';
import WishlistPage from '../pages/customer/Wishlist';
import CProfile from '../pages/customer/Profile';
import MyAccount from '../pages/customer/MyAccount';

// Common pages
import Login from '../pages/Login';
import Register from '../pages/Register';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/manage-users" element={<ManageUsers />} />
      <Route path="/admin/manage-vendors" element={<ManageVendors />} />
      <Route path="/admin/manage-delivery-boys" element={<ManageDeliveryBoys />} />
      <Route path="/admin/manage-products" element={<ManageProducts />} />
      <Route path="/admin/manage-orders" element={<ManageOrders />} />
      <Route path="/admin/inventory" element={<AdminInventory />} />
      <Route path="/admin/sales-report" element={<SalesReportAdmin />} />
      <Route path="/admin/notifications" element={<AdminNotifications />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/admin/catalog" element={<ManageCatalog />} />

      {/* Vendor Routes */}
      <Route path="/vendor/dashboard" element={<VendorDashboard />} />
      <Route path="/vendor/add-product" element={<AddProduct />} />
      <Route path="/vendor/orders" element={<VendorOrders />} />
      <Route path="/vendor/sales-report" element={<SalesReport />} />
      <Route path="/vendor/notifications" element={<Notifications />} />
      <Route path="/vendor/profile" element={<Profile />} />

      {/* Delivery Routes */}
      <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
      <Route path="/delivery/assigned" element={<AssignedDeliveries />} />
      <Route path="/delivery/reports" element={<SalesReports />} />
      <Route path="/delivery/notifications" element={<Notification />} />
      <Route path="/delivery/profile" element={<Profiles />} />


      {/* Customer Routes with CartProvider and SearchProvider */}

      <Route
        path="/"
        element={
          <SearchProvider>
            <CartProvider>
              <Shop />
            </CartProvider>
          </SearchProvider>
        }
      />
      <Route
        path="/category/:categoryId"
        element={
          <SearchProvider>
            <CartProvider>
              <WishlistProvider>
                <CategoryPage />
              </WishlistProvider>
            </CartProvider>
          </SearchProvider>
        }
      />
      <Route
        path="/categories"
        element={
          <SearchProvider>
            <CartProvider>
              <CategoriesPage />
            </CartProvider>
          </SearchProvider>
        }
      />
      <Route
        path="/brand/:brandId"
        element={
          <SearchProvider>
            <CartProvider>
              <WishlistProvider>
                <BrandPage />
              </WishlistProvider>
            </CartProvider>
          </SearchProvider>
        }
      />
      <Route
        path="/subcategory/:subcategoryId"
        element={
          <SearchProvider>
            <CartProvider>
              <WishlistProvider>
                <SubcategoryPage />
              </WishlistProvider>
            </CartProvider>
          </SearchProvider>
        }
      />
      <Route
        path="/profile"
        element={
          <SearchProvider>
            <CartProvider>
              <CProfile />
            </CartProvider>
          </SearchProvider>
        }
      />
      <Route
        path="/product/:productId"
        element={
          <SearchProvider>
            <CartProvider>
              <WishlistProvider>
                <ProductDetails />
              </WishlistProvider>
            </CartProvider>
          </SearchProvider>
        }
      />
      <Route
        path="/cart"
        element={
          <SearchProvider>
            <CartProvider>
              <Cart />
            </CartProvider>
          </SearchProvider>
        }
      />
      <Route
        path="/notifications"
        element={
          <SearchProvider>
            <CartProvider>
              <NotificationBell />
            </CartProvider>
          </SearchProvider>
        }
      />
      <Route
        path="/checkout"
        element={
          <SearchProvider>
            <CartProvider>
              <Checkout />
            </CartProvider>
          </SearchProvider>
        }
      />
      <Route
        path="/myorders"
        element={
          <SearchProvider>
            <CartProvider>
              <OrderHistory />
            </CartProvider>
          </SearchProvider>
        }
      />
      <Route
        path="/wishlist"
        element={
          <SearchProvider>
            <CartProvider>
              <Wishlist />
            </CartProvider>
          </SearchProvider>
        }
      />
      <Route
        path="/support"
        element={
          <SearchProvider>
            <CartProvider>
              <Support />
            </CartProvider>
          </SearchProvider>
        }
      />
      <Route
        path="/wishlist"
        element={
          <SearchProvider>
            <CartProvider>
              <WishlistPage />
            </CartProvider>
          </SearchProvider>
        }
      />
      <Route
        path="/account"
        element={
          <SearchProvider>
            <CartProvider>
              <MyAccount />
            </CartProvider>
          </SearchProvider>
        }
      />


      {/* Common Routes */}
      <Route path="/login" element={
        <SearchProvider>
          <CartProvider>
            <Login />
          </CartProvider>
        </SearchProvider>
      } />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
