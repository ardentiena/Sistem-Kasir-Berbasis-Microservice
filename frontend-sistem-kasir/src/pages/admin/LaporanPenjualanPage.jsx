import { useEffect, useMemo, useState } from 'react';
import { getAllTransaksi } from '../../api/transaksiJualService';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}

function formatTanggalSingkat(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

function LaporanPenjualanPage() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllTransaksi()
      .then((res) => setTransaksiList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  // Semua agregasi dihitung dari data transaksi yang sudah di-fetch.
  // Hanya transaksi SELESAI yang dihitung sebagai penjualan aktual
  // (PENDING belum tentu jadi uang masuk).
  const analytics = useMemo(() => {
    const selesai = transaksiList.filter((t) => t.status === 'SELESAI');

    const totalPendapatan = selesai.reduce((sum, t) => sum + Number(t.grandTotal), 0);
    const totalTransaksiSelesai = selesai.length;
    const rataRataTransaksi = totalTransaksiSelesai > 0 ? totalPendapatan / totalTransaksiSelesai : 0;

    // Jumlah transaksi per status (PENDING, SELESAI, dll)
    const perStatus = {};
    transaksiList.forEach((t) => {
      perStatus[t.status] = (perStatus[t.status] || 0) + 1;
    });

    // Produk terlaris — agregat dari items di semua transaksi SELESAI
    const produkMap = {};
    selesai.forEach((t) => {
      (t.items || []).forEach((item) => {
        if (!produkMap[item.namaProduk]) {
          produkMap[item.namaProduk] = { jumlah: 0, total: 0 };
        }
        produkMap[item.namaProduk].jumlah += item.jumlah;
        produkMap[item.namaProduk].total += Number(item.subtotal);
      });
    });
    const produkTerlaris = Object.entries(produkMap)
      .map(([nama, data]) => ({ nama, ...data }))
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, 10);

    // Pendapatan per hari — untuk grafik batang sederhana
    const perHariMap = {};
    selesai.forEach((t) => {
      const tanggal = formatTanggalSingkat(t.createdAt);
      perHariMap[tanggal] = (perHariMap[tanggal] || 0) + Number(t.grandTotal);
    });
    const pendapatanPerHari = Object.entries(perHariMap).map(([tanggal, total]) => ({ tanggal, total }));
    const maxPendapatanHarian = Math.max(...pendapatanPerHari.map((d) => d.total), 1);

    return { totalPendapatan, totalTransaksiSelesai, rataRataTransaksi, perStatus, produkTerlaris, pendapatanPerHari, maxPendapatanHarian };
  }, [transaksiList]);

  if (loading) return <p>Memuat laporan...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Laporan Penjualan</h2>

      {/* Kartu ringkasan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16 }}>
        <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16 }}>
          <p style={{ color: '#888', margin: 0 }}>Total Pendapatan</p>
          <p style={{ fontSize: 24, fontWeight: 'bold', margin: '4px 0' }}>
            {formatRupiah(analytics.totalPendapatan)}
          </p>
        </div>
        <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16 }}>
          <p style={{ color: '#888', margin: 0 }}>Transaksi Selesai</p>
          <p style={{ fontSize: 24, fontWeight: 'bold', margin: '4px 0' }}>
            {analytics.totalTransaksiSelesai}
          </p>
        </div>
        <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16 }}>
          <p style={{ color: '#888', margin: 0 }}>Rata-rata / Transaksi</p>
          <p style={{ fontSize: 24, fontWeight: 'bold', margin: '4px 0' }}>
            {formatRupiah(analytics.rataRataTransaksi)}
          </p>
        </div>
      </div>

      {/* Breakdown status */}
      <div style={{ marginTop: 24 }}>
        <h4>Transaksi per Status</h4>
        <div style={{ display: 'flex', gap: 12 }}>
          {Object.entries(analytics.perStatus).map(([status, count]) => (
            <div key={status} style={{ border: '1px solid #333', borderRadius: 8, padding: '8px 16px' }}>
              {status}: <strong>{count}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Grafik batang pendapatan per hari (CSS murni, tanpa library) */}
      <div style={{ marginTop: 24 }}>
        <h4>Pendapatan per Hari</h4>
        {analytics.pendapatanPerHari.length === 0 ? (
          <p style={{ color: '#888' }}>Belum ada transaksi selesai.</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, borderBottom: '1px solid #333' }}>
            {analytics.pendapatanPerHari.map((d) => (
              <div key={d.tanggal} style={{ textAlign: 'center', flex: 1 }}>
                <div
                  title={formatRupiah(d.total)}
                  style={{
                    height: `${(d.total / analytics.maxPendapatanHarian) * 140}px`,
                    background: '#4f8cff',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
                <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{d.tanggal}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Produk terlaris */}
      <div style={{ marginTop: 24 }}>
        <h4>Produk Terlaris</h4>
        {analytics.produkTerlaris.length === 0 ? (
          <p style={{ color: '#888' }}>Belum ada data.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
                <th>Produk</th>
                <th>Terjual</th>
                <th>Total Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {analytics.produkTerlaris.map((p) => (
                <tr key={p.nama} style={{ borderBottom: '1px solid #222' }}>
                  <td>{p.nama}</td>
                  <td>{p.jumlah}</td>
                  <td>{formatRupiah(p.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LaporanPenjualanPage;