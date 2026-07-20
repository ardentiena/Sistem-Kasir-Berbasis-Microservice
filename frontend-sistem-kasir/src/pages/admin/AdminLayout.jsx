import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../../api/userService';

const navItemStyle = ({ isActive }) => ({
  display: 'block',
  padding: '10px 16px',
  textDecoration: 'none',
  color: isActive ? '#fff' : '#aaa',
  background: isActive ? '#333' : 'transparent',
  borderRadius: 6,
});

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, borderRight: '1px solid #333', padding: 16 }}>
        <h3>Admin Panel</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 16 }}>
          <NavLink to="/admin/laporan" style={navItemStyle}>Laporan Penjualan</NavLink>
          <NavLink to="/admin/kasir" style={navItemStyle}>Kelola Kasir</NavLink>
          <NavLink to="/admin/produk" style={navItemStyle}>Kelola Produk</NavLink>
          <NavLink to="/admin/transaksi" style={navItemStyle}>Transaksi</NavLink>
          <NavLink to="/admin/pembayaran" style={navItemStyle}>Pembayaran</NavLink>
          <NavLink to="/admin/settings" style={navItemStyle}>Pengaturan</NavLink>
        </nav>
        <button onClick={() => navigate('/')} style={{ marginTop: 24, width: '100%' }}>
          Ke Halaman Kasir
        </button>
        <button onClick={handleLogout} style={{ marginTop: 8, width: '100%' }}>
          Logout
        </button>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;