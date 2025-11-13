import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import Tracking from './pages/Tracking';
import RoleRoute from './components/RoleRoute';
import AdminDashboard from './pages/admin/Dashboard';
import InventoryLayout from './pages/admin/Inventory';
import ProductsAdmin from './pages/admin/inventory/ProductsAdmin';
import CategoriesAdmin from './pages/admin/inventory/CategoriesAdmin';
import SuppliersAdmin from './pages/admin/inventory/SuppliersAdmin';
import OrdersAdmin from './pages/admin/OrdersAdmin';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen ">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tracking/:trackingNumber" element={<Tracking />} />
            <Route
              path="/admin"
              element={
                <RoleRoute roles={["ADMIN", "VENDOR"]}>
                  <AdminDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <RoleRoute roles={["ADMIN", "VENDOR"]}>
                  <OrdersAdmin />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/inventory/*"
              element={
                <RoleRoute roles={["ADMIN", "VENDOR"]}>
                  <InventoryLayout />
                </RoleRoute>
              }
            >
              <Route path="products" element={<ProductsAdmin />} />
              <Route path="categories" element={<CategoriesAdmin />} />
              <Route path="suppliers" element={<SuppliersAdmin />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/success/:orderId" element={<OrderSuccess />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
