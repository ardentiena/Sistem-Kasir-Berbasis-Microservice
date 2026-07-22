import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminCabangProvider } from './context/AdminCabangContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import LoginPage from './pages/LoginPage';
import KasirLayout from './pages/KasirLayout';
import KasirPOSPage from './pages/KasirPOSPage';
import TransaksiSayaPage from './pages/TransaksiSayaPage';
import PembayaranSayaPage from './pages/PembayaranSayaPage';
import AdminLayout from './pages/admin/AdminLayout';
import KasirPage from './pages/admin/KasirPage';
import ProdukAdminPage from './pages/admin/ProdukAdminPage';
import TransaksiListPage from './pages/admin/TransaksiListPage';
import PembayaranListPage from './pages/admin/PembayaranListPage';
import LaporanPenjualanPage from './pages/admin/LaporanPenjualanPage';
import SettingsPage from './pages/admin/SettingsPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProfilPage from './pages/ProfilPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CartProvider>
                <KasirLayout />
              </CartProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<KasirPOSPage />} />
          <Route path="transaksi" element={<TransaksiSayaPage />} />
          <Route path="pembayaran" element={<PembayaranSayaPage />} />
          <Route path="profil" element={<ProfilPage />} />
        </Route>

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