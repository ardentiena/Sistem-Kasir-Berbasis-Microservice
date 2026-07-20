import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../api/userService";
import "../../styles/layout.css";

function AdminLayout() {

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="admin-layout">

            <aside className="sidebar">

                <div className="sidebar-logo">

                    <h2>🛒</h2>

                    <h1>Sistem Kasir</h1>

                    <span>Management System</span>

                </div>

                <nav>
                    <NavLink to="/admin/dashboard">Dashboard</NavLink>
                    <NavLink to="/admin/produk">Produk</NavLink>
                    <NavLink to="/admin/kasir">Kasir</NavLink>
                    <NavLink to="/admin/transaksi">Transaksi</NavLink>
                    <NavLink to="/admin/pembayaran">Pembayaran</NavLink>
                    <NavLink to="/admin/laporan">Laporan</NavLink>
                    <NavLink to="/admin/settings">Pengaturan</NavLink>
                </nav>

                <div className="sidebar-bottom">

                    <button onClick={() => navigate("/")}>
                        🏪 Halaman Kasir
                    </button>

                    <button onClick={handleLogout}>
                        🚪 Logout
                    </button>

                </div>

            </aside>

            <main className="content">

                <header className="header">

                    <div>

                        <h2>Dashboard</h2>

                        <p>Selamat datang di Sistem Kasir</p>

                    </div>

                    <div className="profile">

                        <strong>Administrator</strong>

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