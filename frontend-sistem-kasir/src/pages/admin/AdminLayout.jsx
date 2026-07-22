import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../api/userService";
import AdminCabangSelector from '../../components/admin/AdminCabangSelector';
import "../../styles/layout.css";

const icons = {
    dashboard: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
    ),
    produk: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" />
        </svg>
    ),
    kasir: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1.5" /><circle cx="18" cy="21" r="1.5" />
            <path d="M2.5 3h2.5l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 7H6" />
        </svg>
    ),
    transaksi: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h9l3 3v15H6z" /><path d="M9 9h6M9 13h6M9 17h4" />
        </svg>
    ),
    pembayaran: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /><path d="M6 15h4" />
        </svg>
    ),
    laporan: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20V10M12 20V4M20 20v-7" />
        </svg>
    ),
    settings: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    ),
    logout: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" />
        </svg>
    ),
    store: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l1.5-5h15L21 9" /><path d="M3 9h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z" /><path d="M9 20v-6h6v6" />
        </svg>
    ),
    search: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
        </svg>
    ),
    bell: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
    ),
    cabang: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-6h6v6" /><path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
        </svg>
    ),
};

function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <div>
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-badge">S</div>
                        <div className="sidebar-logo-text">
                            <h1>Sistem Kasir</h1>
                            <span>Management System</span>
                        </div>
                    </div>

                    <nav>
                        <NavLink to="/admin/dashboard">{icons.dashboard}<span>Dashboard</span></NavLink>
                        <NavLink to="/admin/produk">{icons.produk}<span>Produk</span></NavLink>
                        <NavLink to="/admin/cabang">{icons.cabang}<span>Cabang</span></NavLink>
                        <NavLink to="/admin/kasir">{icons.kasir}<span>Kasir</span></NavLink>
                        <NavLink to="/admin/transaksi">{icons.transaksi}<span>Transaksi</span></NavLink>
                        <NavLink to="/admin/pembayaran">{icons.pembayaran}<span>Pembayaran</span></NavLink>
                        <NavLink to="/admin/laporan">{icons.laporan}<span>Laporan</span></NavLink>
                        <NavLink to="/admin/settings">{icons.settings}<span>Pengaturan</span></NavLink>
                    </nav>
                </div>

                <div className="sidebar-bottom">
                    <button onClick={() => navigate("/")}>{icons.store}<span>Halaman Kasir</span></button>
                    <button onClick={handleLogout}>{icons.logout}<span>Logout</span></button>
                </div>
            </aside>

            <main className="content">
                <header className="header">
                    <div className="topbar-search">
                        {icons.search}
                        <input placeholder="Cari sesuatu..." />
                    </div>

                    <div className="topbar-actions">
                        <AdminCabangSelector />
                        <button className="topbar-icon-btn" type="button" aria-label="Notifikasi">
                            {icons.bell}
                        </button>
                        <div className="profile">
                            <span className="profile-avatar">A</span>
                            <strong>Administrator</strong>
                        </div>
                    </div>
                </header>

                <section className="page">
                    <Outlet />
                </section>
            </main>
        </div>
    );
}

export default AdminLayout;