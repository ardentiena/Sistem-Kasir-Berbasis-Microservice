import { useEffect, useState } from "react";
import "../../styles/dashboard.css";

import { getAllProduk } from "../../api/daftarProdukService";
import { getAllUser } from "../../api/userService";
import { getAllTransaksi } from "../../api/transaksiJualService";

import PageTitle from "../../components/common/PageTitle";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}
function formatTanggal(value) {
  return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}
function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear()
    && d.getMonth() === now.getMonth()
    && d.getDate() === now.getDate();
}

const statusBadgeClass = {
  SELESAI: "badge-success",
  PENDING: "badge-warning",
  DIBATALKAN: "badge-danger",
};

function DashboardPage() {
  const [produkList, setProdukList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getAllProduk(), getAllUser(), getAllTransaksi()])
      .then(([resProduk, resUser, resTransaksi]) => {
        setProdukList(resProduk.data);
        setUserList(resUser.data);
        setTransaksiList(resTransaksi.data);
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalKasir = userList.filter((u) => u.role === 'KASIR').length;

  const transaksiHariIni = transaksiList.filter((t) => isToday(t.createdAt));

  const pendapatanHariIni = transaksiHariIni
    .filter((t) => t.status === 'SELESAI')
    .reduce((sum, t) => sum + Number(t.grandTotal), 0);

  const transaksiTerbaru = [...transaksiList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <>
      <PageTitle
        title="Dashboard"
        subtitle="Ringkasan aktivitas Sistem Kasir"
      />

      {error && <p className="error-message">{error}</p>}

      <div className="dashboard-grid">
        <StatCard title="Total Produk" value={loading ? '-' : produkList.length} icon="📦" />
        <StatCard title="Total Kasir" value={loading ? '-' : totalKasir} icon="👤" color="#16A34A" />
        <StatCard title="Transaksi Hari Ini" value={loading ? '-' : transaksiHariIni.length} icon="🧾" color="#F59E0B" />
        <StatCard title="Pendapatan Hari Ini" value={loading ? '-' : formatRupiah(pendapatanHariIni)} icon="💰" color="#DC2626" />
      </div>

      <Card>
        <h2>Transaksi Terbaru</h2>

        {loading ? (
          <p>Memuat...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Tanggal</th>
                <th>Kasir</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transaksiTerbaru.length === 0 && (
                <tr><td colSpan={5} className="empty-cell">Belum ada transaksi</td></tr>
              )}
              {transaksiTerbaru.map((t) => (
                <tr key={t.id}>
                  <td>{t.kodeTransaksi}</td>
                  <td>{formatTanggal(t.createdAt)}</td>
                  <td>{t.kasirEmail}</td>
                  <td>{formatRupiah(t.grandTotal)}</td>
                  <td>
                    <span className={`badge ${statusBadgeClass[t.status] || 'badge-neutral'}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
}

export default DashboardPage;