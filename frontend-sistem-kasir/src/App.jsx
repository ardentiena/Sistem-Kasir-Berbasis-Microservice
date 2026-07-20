import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
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

function KasirLandingPage() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <CartProvider>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
          {role === 'ADMIN' && (
            <button onClick={() => navigate('/admin/laporan')}>Admin Panel</button>
          )}
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
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
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="laporan" replace />} />
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