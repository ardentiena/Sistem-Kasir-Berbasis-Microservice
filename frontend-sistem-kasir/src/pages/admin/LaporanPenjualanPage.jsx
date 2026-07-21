import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTransaksi } from '../../api/transaksiJualService';
import { useAdminCabang } from '../../context/AdminCabangContext';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}

const PERIODE_LABEL = {
  harian: 'Harian',
  mingguan: 'Mingguan',
  bulanan: 'Bulanan',
  tahunan: 'Tahunan',
};

function getPeriodeInfo(dateObj, periode) {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();

  if (periode === 'mingguan') {
    const d = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return {
      key: `${d.getUTCFullYear()}-W${weekNo}`,
      label: `Mgg ${weekNo}`,
      sortValue: d.getUTCFullYear() * 100 + weekNo,
    };
  }

  if (periode === 'bulanan') {
    return {
      key: `${year}-${String(month + 1).padStart(2, '0')}`,
      label: dateObj.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
      sortValue: year * 100 + month,
    };
  }

  if (periode === 'tahunan') {
    return { key: `${year}`, label: `${year}`, sortValue: year };
  }

  return {
    key: dateObj.toISOString().slice(0, 10),
    label: dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
    sortValue: dateObj.getTime(),
  };
}

function LaporanPenjualanPage() {
  const { adminKodeCabang } = useAdminCabang();
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periode, setPeriode] = useState(localStorage.getItem('laporanPeriode') || 'harian');

  useEffect(() => {
    getAllTransaksi()
      .then((res) => setTransaksiList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  const analytics = useMemo(() => {
    const scoped = adminKodeCabang
      ? transaksiList.filter((t) => t.kodeCabang === adminKodeCabang)
      : transaksiList;

    const selesai = scoped.filter((t) => t.status === 'SELESAI');

    const totalPendapatan = selesai.reduce((sum, t) => sum + Number(t.grandTotal), 0);
    const totalTransaksiSelesai = selesai.length;
    const rataRataTransaksi = totalTransaksiSelesai > 0 ? totalPendapatan / totalTransaksiSelesai : 0;

    const perStatus = {};
    scoped.forEach((t) => {
      perStatus[t.status] = (perStatus[t.status] || 0) + 1;
    });

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

    const rekapMap = {};
    selesai.forEach((t) => {
      const info = getPeriodeInfo(new Date(t.createdAt), periode);
      if (!rekapMap[info.key]) {
        rekapMap[info.key] = { label: info.label, sortValue: info.sortValue, total: 0 };
      }
      rekapMap[info.key].total += Number(t.grandTotal);
    });
    const rekapPeriode = Object.values(rekapMap).sort((a, b) => a.sortValue - b.sortValue);
    const maxRekap = Math.max(...rekapPeriode.map((d) => d.total), 1);

    return { totalPendapatan, totalTransaksiSelesai, rataRataTransaksi, perStatus, produkTerlaris, rekapPeriode, maxRekap };
  }, [transaksiList, periode, adminKodeCabang]);

  if (loading) return <p>Memuat laporan...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  const chartWidth = 600;
  const chartHeight = 160;
  const padding = 24;
  const points = analytics.rekapPeriode.map((d, i) => {
    const x = analytics.rekapPeriode.length > 1
      ? padding + (i / (analytics.rekapPeriode.length - 1)) * (chartWidth - padding * 2)
      : chartWidth / 2;
    const y = chartHeight - padding - (d.total / analytics.maxRekap) * (chartHeight - padding * 2);
    return { x, y, ...d };
  });
  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2>Laporan Penjualan</h2>
        <span style={{ fontSize: 13, color: '#888' }}>
          Rekap: {PERIODE_LABEL[periode]} — ubah di <Link to="/admin/settings">Pengaturan</Link>
        </span>
      </div>

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

      <div style={{ marginTop: 24 }}>
        <h4>Pendapatan — Rekap {PERIODE_LABEL[periode]}</h4>
        {points.length === 0 ? (
          <p style={{ color: '#888' }}>Belum ada transaksi selesai.</p>
        ) : (
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 24}`} style={{ width: '100%', maxWidth: 700 }}>
            <polyline points={polylinePoints} fill="none" stroke="#4f8cff" strokeWidth="2" />
            {points.map((p) => (
              <g key={p.label + p.sortValue}>
                <circle cx={p.x} cy={p.y} r="3.5" fill="#4f8cff">
                  <title>{`${p.label}: ${formatRupiah(p.total)}`}</title>
                </circle>
                <text x={p.x} y={chartHeight + 16} fontSize="10" fill="#888" textAnchor="middle">
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>

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