import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { getCabangPilihan } from '../api/cabangService';

function CabangSelector() {
  const { kodeCabang, setKodeCabang } = useCart();
  const [cabangList, setCabangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = localStorage.getItem('role');
  const kodeCabangUser = localStorage.getItem('kodeCabang');

  useEffect(() => {
    getCabangPilihan()
      .then((res) => {
        setCabangList(res.data);
        if (!kodeCabang && res.data.length > 0) {
          setKodeCabang(kodeCabangUser || res.data[0].kodeCabang);
        }
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Memuat cabang...</p>;
  if (error) return <p style={{ color: 'red' }}>Gagal memuat cabang: {error}</p>;

  // Kasir dengan cabang sudah ditetapkan -> tampil read-only, tidak bisa diubah
  if (role !== 'ADMIN' && kodeCabangUser) {
    const namaCabang = cabangList.find((c) => c.kodeCabang === kodeCabangUser)?.namaCabang || kodeCabangUser;
    return (
      <div style={{ marginBottom: 16 }}>
        <strong>Cabang:</strong> {namaCabang}
      </div>
    );
  }

  // Admin, atau kasir yang belum ditempatkan -> tetap bisa pilih manual
  return (
    <div style={{ marginBottom: 16 }}>
      {role !== 'ADMIN' && (
        <p style={{ color: 'orange', fontSize: 13 }}>
          Kamu belum ditempatkan di cabang manapun. Pilih manual atau hubungi admin.
        </p>
      )}
      <label>
        Cabang:{' '}
        <select value={kodeCabang} onChange={(e) => setKodeCabang(e.target.value)}>
          {cabangList.map((c) => (
            <option key={c.kodeCabang} value={c.kodeCabang}>{c.namaCabang}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default CabangSelector;