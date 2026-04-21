import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import { useAuth } from './store/auth';

function RequireAuth({ children }: { children: JSX.Element }) {
  const user = useAuth((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const user = useAuth((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const refresh = useAuth((s) => s.refresh);
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireAuth>
              <Orders />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
