import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useProductStore } from './stores/productStore'

// Pages
import Landing        from './pages/Landing/index.jsx'
import Login          from './pages/Auth/Login.jsx'
import ContactUs      from './pages/ContactUs.jsx'
import Register       from './pages/Auth/Register.jsx'
import ForgotPassword from './pages/Auth/ForgotPassword.jsx'
import Marketplace    from './pages/Marketplace/Browse.jsx'
import ProductDetail  from './pages/Marketplace/ProductDetail.jsx'
import Cart           from './pages/Marketplace/Cart.jsx'
import Checkout       from './pages/Marketplace/Checkout.jsx'

// Customer Dashboard
import CustomerLayout   from './pages/Dashboard/Customer/CustomerLayout.jsx'
import CustomerHome     from './pages/Dashboard/Customer/Home.jsx'
import CustomerOrders   from './pages/Dashboard/Customer/Orders.jsx'
import OrderTracking    from './pages/Dashboard/Customer/OrderTracking.jsx'
import Wishlist         from './pages/Dashboard/Customer/Wishlist.jsx'
import CustomerReviews  from './pages/Dashboard/Customer/Reviews.jsx'
import CustomerProfile  from './pages/Dashboard/Customer/Profile.jsx'

// Farmer Dashboard
import FarmerLayout       from './pages/Dashboard/Farmer/FarmerLayout.jsx'
import FarmerHome         from './pages/Dashboard/Farmer/Home.jsx'
import FarmerProducts     from './pages/Dashboard/Farmer/Products.jsx'
import AddProduct         from './pages/Dashboard/Farmer/AddProduct.jsx'
import FarmerOrders       from './pages/Dashboard/Farmer/Orders.jsx'
import FarmerInventory    from './pages/Dashboard/Farmer/Inventory.jsx'
import FarmerAnalytics    from './pages/Dashboard/Farmer/Analytics.jsx'
import FarmerProfile      from './pages/Dashboard/Farmer/Profile.jsx'
import FarmerBulkRequests from './pages/Dashboard/Farmer/BulkRequests.jsx'

// Admin Dashboard
import AdminLayout       from './pages/Dashboard/Admin/AdminLayout.jsx'
import AdminHome         from './pages/Dashboard/Admin/Home.jsx'
import AdminUsers        from './pages/Dashboard/Admin/Users.jsx'
import AdminProducts     from './pages/Dashboard/Admin/Products.jsx'
import AdminOrders       from './pages/Dashboard/Admin/Orders.jsx'
import AdminReports      from './pages/Dashboard/Admin/Reports.jsx'
import AdminBulkRequests from './pages/Dashboard/Admin/BulkRequests.jsx'

// Delivery Dashboard
import DeliveryLayout   from './pages/Dashboard/Delivery/DeliveryLayout.jsx'
import DeliveryHome     from './pages/Dashboard/Delivery/Home.jsx'
import AvailableOrders  from './pages/Dashboard/Delivery/AvailableOrders.jsx'
import MapTracking      from './pages/Dashboard/Delivery/MapTracking.jsx'

export default function App() {
  const fetchProducts = useProductStore(state => state.fetchProducts)
  const fetchBulkOrders = useProductStore(state => state.fetchBulkOrders)

  useEffect(() => {
    fetchProducts()
    fetchBulkOrders()
  }, [fetchProducts, fetchBulkOrders])

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public */}
          <Route path="/"               element={<Landing />} />
          <Route path="/contact"        element={<ContactUs />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/register"       element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Marketplace */}
          <Route path="/marketplace"        element={<Marketplace />} />
          <Route path="/product/:id"        element={<ProductDetail />} />
          <Route path="/cart"               element={<Cart />} />
          <Route path="/checkout"           element={<Checkout />} />

          {/* Customer Dashboard */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index              element={<Navigate to="home" replace />} />
            <Route path="home"        element={<CustomerHome />} />
            <Route path="orders"      element={<CustomerOrders />} />
            <Route path="orders/:id"  element={<OrderTracking />} />
            <Route path="wishlist"    element={<Wishlist />} />
            <Route path="reviews"     element={<CustomerReviews />} />
            <Route path="profile"     element={<CustomerProfile />} />
          </Route>

          {/* Farmer Dashboard */}
          <Route path="/farmer" element={<FarmerLayout />}>
            <Route index                element={<Navigate to="home" replace />} />
            <Route path="home"          element={<FarmerHome />} />
            <Route path="products"      element={<FarmerProducts />} />
            <Route path="products/add"  element={<AddProduct />} />
            <Route path="orders"        element={<FarmerOrders />} />
            <Route path="inventory"     element={<FarmerInventory />} />
            <Route path="analytics"     element={<FarmerAnalytics />} />
            <Route path="profile"       element={<FarmerProfile />} />
            <Route path="bulk-requests" element={<FarmerBulkRequests />} />
          </Route>

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index              element={<Navigate to="home" replace />} />
            <Route path="home"        element={<AdminHome />} />
            <Route path="users"       element={<AdminUsers />} />
            <Route path="products"    element={<AdminProducts />} />
            <Route path="orders"      element={<AdminOrders />} />
            <Route path="reports"     element={<AdminReports />} />
            <Route path="bulk-requests" element={<AdminBulkRequests />} />
          </Route>

          {/* Delivery Dashboard */}
          <Route path="/delivery" element={<DeliveryLayout />}>
            <Route index              element={<Navigate to="home" replace />} />
            <Route path="home"        element={<DeliveryHome />} />
            <Route path="available"   element={<AvailableOrders />} />
            <Route path="map"         element={<MapTracking />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}
