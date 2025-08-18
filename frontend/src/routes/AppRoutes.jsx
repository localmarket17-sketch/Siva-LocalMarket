import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from '../contexts/CartContext';
import { WishlistProvider } from '../contexts/WishlistContext';

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

      {/* Customer Routes with CartProvider */}
      <Route
        path="/"
        element={
          <CartProvider>
            <Shop />
          </CartProvider>
        }
      />
      <Route
        path="/category/:categoryId"
        element={
          <CartProvider>
            <WishlistProvider>
              <CategoryPage />
            </WishlistProvider>
          </CartProvider>
        }
      />
      <Route
        path="/categories"
        element={
          <CartProvider>
            <CategoriesPage />
          </CartProvider>
        }
      />
      <Route
        path="/brand/:brandId"
        element={
          <CartProvider>
            <WishlistProvider>
              <BrandPage />
            </WishlistProvider>
          </CartProvider>
        }
      />
      <Route
        path="/subcategory/:subcategoryId"
        element={
          <CartProvider>
            <WishlistProvider>
              <SubcategoryPage />
            </WishlistProvider>
          </CartProvider>
        }
      />
      <Route
        path="/profile"
        element={
          <CartProvider>
            <CProfile />
          </CartProvider>
        }
      />
      <Route
        path="/product/:productId"
        element={
          <CartProvider>
            <WishlistProvider>
              <ProductDetails />
            </WishlistProvider>
          </CartProvider>
        }
      />
      <Route
        path="/cart"
        element={
          <CartProvider>
            <Cart />
          </CartProvider>
        }
      />
      <Route
        path="/notifications"
        element={
          <CartProvider>
            <NotificationBell />
          </CartProvider>
        }
      />
      <Route
        path="/checkout"
        element={
          <CartProvider>
            <Checkout />
          </CartProvider>
        }
      />
      <Route
        path="/myorders"
        element={
          <CartProvider>
            <OrderHistory />
          </CartProvider>
        }
      />
      <Route
        path="/wishlist"
        element={
          <CartProvider>
            <Wishlist />
          </CartProvider>
        }
      />
      <Route
        path="/support"
        element={
          <CartProvider>
            <Support />
          </CartProvider>
        }
      />
      <Route
        path="/wishlist"
        element={
          <CartProvider>
            <WishlistPage />
          </CartProvider>
        }
      />
      <Route
        path="/account"
        element={
          <CartProvider>
            <MyAccount />
          </CartProvider>
        }
      />

      {/* Common Routes */}
      <Route path="/login" element={
        <CartProvider>
          <Login />
        </CartProvider>
      } />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
