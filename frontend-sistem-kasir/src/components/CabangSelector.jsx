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
  if (error) return <p className="error-message">Gagal memuat cabang: {error}</p>;

  if (role !== 'ADMIN' && kodeCabangUser) {
    const namaCabang = cabangList.find((c) => c.kodeCabang === kodeCabangUser)?.namaCabang || kodeCabangUser;
    return (
      <div className="cabang-box">
        <strong>Cabang:</strong> {namaCabang}
      </div>
    );
  }

  return (
    <div className="cabang-box">
      {role !== 'ADMIN' && (
        <p className="cabang-warning">
          Kamu belum ditempatkan di cabang manapun. Pilih manual atau hubungi admin.
        </p>
      )}
      <label>
        Cabang:
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