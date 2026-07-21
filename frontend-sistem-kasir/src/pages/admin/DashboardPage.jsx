import "../../styles/dashboard.css";

import PageTitle from "../../components/common/PageTitle";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";

const statusBadge = {
    Selesai: "badge-success",
    Pending: "badge-warning",
    Dibatalkan: "badge-danger",
};

function DashboardPage() {
    return (
        <>
            <PageTitle
                title="Dashboard"
                subtitle="Ringkasan aktivitas Sistem Kasir"
            />

            <div className="dashboard-grid">
                <StatCard title="Total Produk" value="250" icon="📦" />
                <StatCard title="Total Kasir" value="8" icon="👤" color="#16A34A" />
                <StatCard title="Transaksi Hari Ini" value="132" icon="🧾" color="#F59E0B" />
                <StatCard title="Pendapatan" value="Rp12.500.000" icon="💰" color="#DC2626" />
            </div>

            <Card>
                <h2>Transaksi Terbaru</h2>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Tanggal</th>
                            <th>Kasir</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>TRX001</td>
                            <td>21 Juli 2026</td>
                            <td>Andi</td>
                            <td>Rp230.000</td>
                            <td><span className={`badge ${statusBadge['Selesai']}`}>Selesai</span></td>
                        </tr>
                        <tr>
                            <td>TRX002</td>
                            <td>21 Juli 2026</td>
                            <td>Budi</td>
                            <td>Rp120.000</td>
                            <td><span className={`badge ${statusBadge['Selesai']}`}>Selesai</span></td>
                        </tr>
                        <tr>
                            <td>TRX003</td>
                            <td>21 Juli 2026</td>
                            <td>Rina</td>
                            <td>Rp450.000</td>
                            <td><span className={`badge ${statusBadge['Pending']}`}>Pending</span></td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </>
    );
}

export default DashboardPage;