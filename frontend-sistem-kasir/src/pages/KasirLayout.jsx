import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../api/userService";
import CabangSelector from "../components/CabangSelector";
import "../styles/layout.css";

const icons = {
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
    admin: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
        </svg>
    ),
    profil: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
        </svg>
    ),
    logout: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" />
        </svg>
    ),
};

function KasirLayout() {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <div>
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-badge">S</div>
                        <div className="sidebar-logo-text">
                            <h1>Sistem Kasir</h1>
                            <span>Halaman Kasir</span>
                        </div>
                    </div>

                    <nav>
                        <NavLink to="/" end>{icons.kasir}<span>Kasir</span></NavLink>
                        <NavLink to="/transaksi">{icons.transaksi}<span>Transaksi Saya</span></NavLink>
                        <NavLink to="/pembayaran">{icons.pembayaran}<span>Pembayaran Saya</span></NavLink>
                        <NavLink to="/profil">{icons.profil}<span>Profil</span></NavLink>
                    </nav>
                </div>

                <div className="sidebar-bottom">
                    {role === 'ADMIN' && (
                        <button onClick={() => navigate('/admin/dashboard')}>
                            {icons.admin}<span>Admin Panel</span>
                        </button>
                    )}
                    <button onClick={handleLogout}>{icons.logout}<span>Logout</span></button>
                </div>
            </aside>

            <main className="content kasir-content">
                <section className="page kasir-page">
                    <div className="kasir-page-fixed">
                        <CabangSelector />
                    </div>
                    <div className="kasir-page-body">
                        <Outlet />
                    </div>
                </section>
            </main>
        </div>
    );
}

export default KasirLayout;