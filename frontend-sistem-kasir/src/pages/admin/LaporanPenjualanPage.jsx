import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTransaksi } from '../../api/transaksiJualService';
import { useAdminCabang } from '../../context/AdminCabangContext';
import Card from '../../components/common/Card';
import PageTitle from '../../components/common/PageTitle';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}

const PERIODE_LABEL = {
  harian: 'Harian',
  mingguan: 'Mingguan',
  bulanan: 'Bulanan',
  tahunan: 'Tahunan',
};

const statusBadgeClass = {
  SELESAI: 'badge-success',
  PENDING: 'badge-warning',
  DIBATALKAN: 'badge-danger',
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

    const today = new Date();
    const isSameDay = (d) =>
      d.getFullYear() === today.getFullYear()
      && d.getMonth() === today.getMonth()
      && d.getDate() === today.getDate();

    const perJam = Array.from({ length: 24 }, (_, jam) => ({ jam, jumlahTransaksi: 0, total: 0 }));
    selesai
      .filter((t) => isSameDay(new Date(t.createdAt)))
      .forEach((t) => {
        const jam = new Date(t.createdAt).getHours();
        perJam[jam].jumlahTransaksi += 1;
        perJam[jam].total += Number(t.grandTotal);
      });
    const maxPerJam = Math.max(...perJam.map((j) => j.jumlahTransaksi), 1);

    return {
      totalPendapatan, totalTransaksiSelesai, rataRataTransaksi,
      perStatus, produkTerlaris, rekapPeriode, maxRekap,
      perJam, maxPerJam,
    };
  }, [transaksiList, periode, adminKodeCabang]);

  if (loading) return <p>Memuat laporan...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  const chartWidth = 600;
  const chartHeight = 160;
  const paddingLeft = 64;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 24;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const yAxisTicks = (maxValue, count = 4) =>
    Array.from({ length: count + 1 }, (_, i) => Math.round((maxValue / count) * i));

  function niceNumber(value, roundUp) {
    if (value === 0) return 0;
    const exponent = Math.floor(Math.log10(value));
    const fraction = value / Math.pow(10, exponent);
    let niceFraction;
    if (roundUp) {
      if (fraction <= 1) niceFraction = 1;
      else if (fraction <= 2) niceFraction = 2;
      else if (fraction <= 5) niceFraction = 5;
      else niceFraction = 10;
    } else {
      if (fraction < 1.5) niceFraction = 1;
      else if (fraction < 3) niceFraction = 2;
      else if (fraction < 7) niceFraction = 5;
      else niceFraction = 10;
    }
    return niceFraction * Math.pow(10, exponent);
  }

  function niceAxisTicks(maxValue, tickCountTarget = 4) {
    if (maxValue <= 0) return { ticks: [0], niceMax: 1 };
    const niceMax = niceNumber(maxValue, true);
    const niceStep = niceNumber(niceMax / tickCountTarget, false);
    const ticks = [];
    for (let t = 0; t <= niceMax + niceStep * 0.001; t += niceStep) {
      ticks.push(Math.round(t));
    }
    return { ticks, niceMax };
  }

  const { ticks: rekapYTicks, niceMax: rekapNiceMax } = niceAxisTicks(analytics.maxRekap);

  const points = analytics.rekapPeriode.map((d, i) => {
    const x = analytics.rekapPeriode.length > 1
      ? paddingLeft + (i / (analytics.rekapPeriode.length - 1)) * plotWidth
      : paddingLeft + plotWidth / 2;
    const y = paddingTop + plotHeight - (d.total / rekapNiceMax) * plotHeight;
    return { x, y, ...d };
  });
  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  const barChartWidth = 600;
  const barChartHeight = 180;
  const barPaddingLeft = 40;
  const barPaddingRight = 16;
  const barPaddingTop = 12;
  const barPaddingBottom = 24;
  const barGap = 3;
  const barPlotWidth = barChartWidth - barPaddingLeft - barPaddingRight;
  const barPlotHeight = barChartHeight - barPaddingTop - barPaddingBottom;
  const barWidth = barPlotWidth / 24 - barGap;
  const perJamYTicks = yAxisTicks(analytics.maxPerJam, Math.min(4, analytics.maxPerJam || 1));

  const handlePrint = () => window.print();

  return (
    <div>
      <div className="page-title">
        <div>
          <h1>Laporan Penjualan</h1>
          <p>
            Rekap: {PERIODE_LABEL[periode]} — ubah di <Link to="/admin/settings">Pengaturan</Link>
          </p>
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>Cetak Laporan</button>
      </div>

      <div className="report-print">
        <div className="report-print-header">
          <h2>Laporan Penjualan</h2>
          <p>Rekap {PERIODE_LABEL[periode]} — dicetak {new Date().toLocaleString('id-ID')}</p>
        </div>

        <div className="report-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          <div className="card">
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 12.5 }}>Total Pendapatan</p>
            <p style={{ fontSize: 24, fontWeight: 600, margin: '6px 0 0' }}>
              {formatRupiah(analytics.totalPendapatan)}
            </p>
          </div>
          <div className="card">
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 12.5 }}>Transaksi Selesai</p>
            <p style={{ fontSize: 24, fontWeight: 600, margin: '6px 0 0' }}>
              {analytics.totalTransaksiSelesai}
            </p>
          </div>
          <div className="card">
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 12.5 }}>Rata-rata / Transaksi</p>
            <p style={{ fontSize: 24, fontWeight: 600, margin: '6px 0 0' }}>
              {formatRupiah(analytics.rataRataTransaksi)}
            </p>
          </div>
        </div>

        <Card className="report-section">
          <h4 style={{ marginTop: 0 }}>Transaksi per Status</h4>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {Object.entries(analytics.perStatus).map(([status, count]) => (
              <span key={status} className={`badge ${statusBadgeClass[status] || 'badge-neutral'}`}>
                {status}: {count}
              </span>
            ))}
          </div>
        </Card>

        <Card className="report-section">
          <h4 style={{ marginTop: 0 }}>Pendapatan — Rekap {PERIODE_LABEL[periode]}</h4>
          {points.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Belum ada transaksi selesai.</p>
          ) : (
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 24}`} style={{ width: '100%', maxWidth: 700 }}>
              {rekapYTicks.map((tick) => {
                const y = paddingTop + plotHeight - (tick / rekapNiceMax) * plotHeight;
                return (
                  <g key={tick}>
                    <line
                      x1={paddingLeft} x2={chartWidth - paddingRight} y1={y} y2={y}
                      style={{ stroke: 'var(--border)' }} strokeWidth="1"
                    />
                    <text
                      x={paddingLeft - 8} y={y}
                      fontSize="10" textAnchor="end" dominantBaseline="middle"
                      style={{ fill: 'var(--text-secondary)' }}
                    >
                      {formatRupiah(tick)}
                    </text>
                  </g>
                );
              })}

              <polyline points={polylinePoints} fill="none" style={{ stroke: 'var(--accent)' }} strokeWidth="2" />
              {points.map((p) => (
                <g key={p.label + p.sortValue}>
                  <circle cx={p.x} cy={p.y} r="3.5" style={{ fill: 'var(--accent)' }}>
                    <title>{`${p.label}: ${formatRupiah(p.total)}`}</title>
                  </circle>
                  <text
                    x={p.x}
                    y={chartHeight + 16}
                    fontSize="10"
                    style={{ fill: 'var(--text-secondary)' }}
                    textAnchor="middle"
                  >
                    {p.label}
                  </text>
                </g>
              ))}
            </svg>
          )}
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, marginBottom: 0 }}>
            Sumbu Y: total pendapatan per {PERIODE_LABEL[periode].toLowerCase()}.
          </p>
        </Card>

        <Card className="report-section">
          <h4 style={{ marginTop: 0 }}>Penjualan per Jam</h4>
          {analytics.totalTransaksiSelesai === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Belum ada transaksi selesai.</p>
          ) : (
            <svg viewBox={`0 0 ${barChartWidth} ${barChartHeight}`} style={{ width: '100%', maxWidth: 700 }}>
              {perJamYTicks.map((tick) => {
                const y = barPaddingTop + barPlotHeight - (tick / analytics.maxPerJam) * barPlotHeight;
                return (
                  <g key={tick}>
                    <line
                      x1={barPaddingLeft} x2={barChartWidth - barPaddingRight} y1={y} y2={y}
                      style={{ stroke: 'var(--border)' }} strokeWidth="1"
                    />
                    <text
                      x={barPaddingLeft - 8} y={y}
                      fontSize="10" textAnchor="end" dominantBaseline="middle"
                      style={{ fill: 'var(--text-secondary)' }}
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {analytics.perJam.map((j, i) => {
                const barHeight = (j.jumlahTransaksi / analytics.maxPerJam) * barPlotHeight;
                const x = barPaddingLeft + i * (barWidth + barGap);
                const y = barPaddingTop + barPlotHeight - barHeight;
                return (
                  <g key={j.jam}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="2"
                      style={{ fill: j.jumlahTransaksi > 0 ? 'var(--accent)' : 'var(--border)' }}
                    >
                      <title>{`Jam ${String(j.jam).padStart(2, '0')}:00 — ${j.jumlahTransaksi} transaksi, ${formatRupiah(j.total)}`}</title>
                    </rect>
                    {i % 3 === 0 && (
                      <text
                        x={x + barWidth / 2}
                        y={barChartHeight - 8}
                        fontSize="9"
                        textAnchor="middle"
                        style={{ fill: 'var(--text-secondary)' }}
                      >
                        {j.jam}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, marginBottom: 0 }}>
            Sumbu Y: jumlah transaksi selesai per jam (0–23) — hari ini, {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}.
          </p>
        </Card>

        <Card className="report-section">
          <h4 style={{ marginTop: 0 }}>Produk Terlaris</h4>
          {analytics.produkTerlaris.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Belum ada data.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Terjual</th>
                  <th>Total Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {analytics.produkTerlaris.map((p) => (
                  <tr key={p.nama}>
                    <td>{p.nama}</td>
                    <td>{p.jumlah}</td>
                    <td>{formatRupiah(p.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}

export default LaporanPenjualanPage;