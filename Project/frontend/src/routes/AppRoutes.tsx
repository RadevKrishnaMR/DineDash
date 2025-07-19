import  { lazy, Suspense } from 'react';
import { Routes, Route, } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AuthLayout from '../components/layout/AuthLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import RoleRedirect from '../components/auth/RoleRediredct';
import { Navbar } from '../components';
import Footer from '../components/Footer/Footer';
import OrdersPage from '../pages/dashboard/OrderPage';
import MenuPage from '../pages/dashboard/MenuPage';
import InvoiceDashboard from '../pages/dashboard/InvoicePage';

// Lazy load all dashboards
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Logout = lazy(() => import('../pages/auth/Logout'));

const AdminDashboard = lazy(() => import('../components/dashboard/AdminDashboard'));
const CashierDashboard = lazy(() => import('../components/dashboard/CashierDashboard'));
const WaiterDashboard = lazy(() => import('../components/dashboard/WaiterDashboard'));
const KitchenDashboard = lazy(() => import('../components/dashboard/KitchenDashboard'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
        </Route>

        {/* Protected Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested Role-Based Routes */}
          <Route
            path="admin"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="cashier"
            element={
              <ProtectedRoute requiredRole="Cashier">
                <CashierDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="waiter"
            element={
              <ProtectedRoute requiredRole="Waiter">
                <WaiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="kitchen"
            element={
              <ProtectedRoute requiredRole="Kitchen">
                <KitchenDashboard />
              </ProtectedRoute>
            }
          />
          {/* Optional default fallback route */}
          <Route index element={<RoleRedirect/>} />
        </Route>
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/footer" element={<Footer />} />
        {/* Fallback Route */}
        <Route path="/" element={<RoleRedirect />} />
        <Route path="*" element={<RoleRedirect />} />
        <Route path="/order" element={<OrdersPage/>} />
        <Route path="/menu" element={<MenuPage/>} />
        <Route path="/invoice/:id" element={<InvoiceDashboard/>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
