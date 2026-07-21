import { useEffect, useState } from 'react';
import { getAllTransaksi } from '../../api/transaksiJualService';
import { useAdminCabang } from '../../context/AdminCabangContext';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}
function formatTanggal(value) {
  return new Date(value).toLocaleString('id-ID');
}

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

  if (loading) return <p>Memuat transaksi...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  const filteredTransaksi = adminKodeCabang
    ? transaksiList.filter((t) => t.kodeCabang === adminKodeCabang)
    : transaksiList;

  return (
    <div>
      <h2>Daftar Transaksi</h2>
      <table style={{ width: '100%', marginTop: 16, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
            <th>Tanggal</th>
            <th>Kasir</th>
            <th>Cabang</th>
            <th>Status</th>
            <th>Jumlah Item</th>
            <th>Grand Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransaksi.map((t) => (
            <tr key={t.id} style={{ borderBottom: '1px solid #222' }}>
              <td>{formatTanggal(t.createdAt)}</td>
              <td>{t.kasirEmail}</td>
              <td>{t.kodeCabang}</td>
              <td>{t.status}</td>
              <td>{t.items?.length ?? 0}</td>
              <td>{formatRupiah(t.grandTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransaksiListPage;