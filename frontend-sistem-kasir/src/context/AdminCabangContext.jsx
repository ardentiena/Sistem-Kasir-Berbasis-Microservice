import { createContext, useContext, useState } from 'react';

const AdminCabangContext = createContext(null);

export function AdminCabangProvider({ children }) {
  // '' = "Semua Cabang" (data general/gabungan)
  const [adminKodeCabang, setAdminKodeCabang] = useState('');

  return (
    <AdminCabangContext.Provider value={{ adminKodeCabang, setAdminKodeCabang }}>
      {children}
    </AdminCabangContext.Provider>
  );
}

export function useAdminCabang() {
  const ctx = useContext(AdminCabangContext);
  if (!ctx) throw new Error('useAdminCabang must be used within AdminCabangProvider');
  return ctx;
}