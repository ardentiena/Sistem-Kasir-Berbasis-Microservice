import { useEffect, useState } from 'react';
import { getAllTransaksi } from '../../api/transaksiJualService';
import { useAdminCabang } from '../../context/AdminCabangContext';
import Card from '../../components/common/Card';
import PageTitle from '../../components/common/PageTitle';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}
function formatTanggal(value) {
  return new Date(value).toLocaleString('id-ID');
}

const statusBadgeClass = {
  SELESAI: 'badge-success',
  PENDING: 'badge-warning',
  DIBATALKAN: 'badge-danger',
};

function TransaksiListPage() {
  const { adminKodeCabang } = useAdminCabang();
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllTransaksi()
      .then((res) => setTransaksiList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredTransaksi = adminKodeCabang
    ? transaksiList.filter((t) => t.kodeCabang === adminKodeCabang)
    : transaksiList;

  return (
    <div>
      <PageTitle title="Daftar Transaksi" subtitle="Riwayat seluruh transaksi penjualan" />

      <Card>
        {loading && <p>Memuat transaksi...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Kasir</th>
                <th>Cabang</th>
                <th>Status</th>
                <th>Jumlah Item</th>
                <th>Grand Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransaksi.length === 0 && (
                <tr><td colSpan={6} className="empty-cell">Belum ada transaksi</td></tr>
              )}
              {filteredTransaksi.map((t) => (
                <tr key={t.id}>
                  <td>{formatTanggal(t.createdAt)}</td>
                  <td>{t.kasirEmail}</td>
                  <td>{t.kodeCabang}</td>
                  <td>
                    <span className={`badge ${statusBadgeClass[t.status] || 'badge-neutral'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>{t.items?.length ?? 0}</td>
                  <td>{formatRupiah(t.grandTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

export default TransaksiListPage;