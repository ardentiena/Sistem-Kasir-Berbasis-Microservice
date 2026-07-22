import { useEffect, useState } from 'react';
import { getCabangPilihan } from '../../api/cabangService';
import { useAdminCabang } from '../../context/AdminCabangContext';

function AdminCabangSelector() {
  const { adminKodeCabang, setAdminKodeCabang } = useAdminCabang();
  const [cabangList, setCabangList] = useState([]);

  useEffect(() => {
    getCabangPilihan().then((res) => setCabangList(res.data)).catch(() => {});
  }, []);

  return (
    <select
      value={adminKodeCabang}
      onChange={(e) => setAdminKodeCabang(e.target.value)}
      style={{ padding: '6px 10px', borderRadius: 6 }}
    >
      <option value="">🌐 Semua Cabang</option>
      {cabangList.map((c) => (
        <option key={c.kodeCabang} value={c.kodeCabang}>{c.namaCabang}</option>
      ))}
    </select>
  );
}

export default AdminCabangSelector;