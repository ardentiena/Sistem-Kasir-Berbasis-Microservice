import { useState } from 'react';
import Card from '../../components/common/Card';
import PageTitle from '../../components/common/PageTitle';
import Button from '../../components/common/Button';

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
      <PageTitle title="Pengaturan" subtitle="Preferensi umum aplikasi" />

      <Card style={{ maxWidth: 360 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          Periode Rekap Laporan Penjualan (default)
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
          >
            {PERIODE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
          Menentukan bagaimana grafik pendapatan di halaman Laporan Penjualan dikelompokkan secara default.
        </p>

        <div className="form-actions">
          <Button onClick={handleSave}>Simpan</Button>
          {saved && <span className="badge badge-success">Tersimpan</span>}
        </div>
      </Card>
    </div>
  );
}

export default SettingsPage;