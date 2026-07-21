import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminCabangProvider } from './context/AdminCabangContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import CabangSelector from './components/CabangSelector';
import LoginPage from './pages/LoginPage';
import ProdukPage from './pages/ProdukPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminLayout from './pages/admin/AdminLayout';
import KasirPage from './pages/admin/KasirPage';
import ProdukAdminPage from './pages/admin/ProdukAdminPage';
import TransaksiListPage from './pages/admin/TransaksiListPage';
import PembayaranListPage from './pages/admin/PembayaranListPage';
import LaporanPenjualanPage from './pages/admin/LaporanPenjualanPage';
import SettingsPage from './pages/admin/SettingsPage';
import { logout } from './api/userService';
import DashboardPage from "./pages/admin/DashboardPage";

function KasirLandingPage() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <CartProvider>
      <div className="kasir-wrapper">
        <div className="kasir-topbar">
          <div className="window-dots">
            <span></span><span></span><span></span>
          </div>
          {role === 'ADMIN' && (
            <button
              className="btn"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
              onClick={() => navigate('/admin/laporan')}
            >
              Admin Panel
            </button>
          )}
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
        <CabangSelector />
        <div className="kasir-grid">
          <ProdukPage />
          <CheckoutPage />
        </div>
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <KasirLandingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminCabangProvider>
                <AdminLayout />
              </AdminCabangProvider>
            </AdminRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="kasir" element={<KasirPage />} />
          <Route path="produk" element={<ProdukAdminPage />} />
          <Route path="transaksi" element={<TransaksiListPage />} />
          <Route path="pembayaran" element={<PembayaranListPage />} />
          <Route path="laporan" element={<LaporanPenjualanPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;