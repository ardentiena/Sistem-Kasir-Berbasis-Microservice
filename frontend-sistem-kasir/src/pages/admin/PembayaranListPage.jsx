import { useEffect, useState } from 'react';
import { getAllPembayaran } from '../../api/pembayaranService';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}

function formatTanggal(value) {
  return value ? new Date(value).toLocaleString('id-ID') : '-';
}

function PembayaranListPage() {
  const [pembayaranList, setPembayaranList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllPembayaran()
      .then((res) => setPembayaranList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Memuat pembayaran...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Daftar Pembayaran</h2>
      <table style={{ width: '100%', marginTop: 16, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
            <th>Tanggal Bayar</th>
            <th>Status</th>
            <th>Metode</th>
            <th>Grand Total</th>
            <th>Jumlah Bayar</th>
            <th>Kembalian</th>
          </tr>
        </thead>
        <tbody>
          {pembayaranList.map((p) => (
            <tr key={p.idDetailPembayaran} style={{ borderBottom: '1px solid #222' }}>
              <td>{formatTanggal(p.tanggalPembayaran)}</td>
              <td>{p.status}</td>
              <td>{p.metodeBayar ?? '-'}</td>
              <td>{formatRupiah(p.grandTotal)}</td>
              <td>{p.jumlahBayar != null ? formatRupiah(p.jumlahBayar) : '-'}</td>
              <td>{p.kembalian != null ? formatRupiah(p.kembalian) : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PembayaranListPage;