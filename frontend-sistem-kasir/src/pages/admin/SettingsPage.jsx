import { useState } from 'react';

const PERIODE_OPTIONS = [
  { value: 'harian', label: 'Harian' },
  { value: 'mingguan', label: 'Mingguan' },
  { value: 'bulanan', label: 'Bulanan' },
  { value: 'tahunan', label: 'Tahunan' },
];

function SettingsPage() {
  const [periode, setPeriode] = useState(
    localStorage.getItem('laporanPeriode') || 'harian'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('laporanPeriode', periode);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2>Pengaturan</h2>

      <div style={{ marginTop: 16, maxWidth: 320 }}>
        <label>
          Periode Rekap Laporan Penjualan (default)
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          >
            {PERIODE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
          Menentukan bagaimana grafik pendapatan di halaman Laporan Penjualan dikelompokkan secara default.
        </p>

        <button onClick={handleSave} style={{ marginTop: 12 }}>
          Simpan
        </button>
        {saved && <span style={{ marginLeft: 8, color: 'lightgreen' }}>Tersimpan</span>}
      </div>
    </div>
  );
}

export default SettingsPage;