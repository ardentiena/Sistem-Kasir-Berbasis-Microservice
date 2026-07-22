import { useEffect, useMemo, useState } from 'react';
import { getAllPembayaran } from '../../api/pembayaranService';
import { getAllTransaksi } from '../../api/transaksiJualService';
import { useAdminCabang } from '../../context/AdminCabangContext';
import Card from '../../components/common/Card';
import PageTitle from '../../components/common/PageTitle';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}
function formatTanggal(value) {
  return value ? new Date(value).toLocaleString('id-ID') : '-';
}

const statusBadgeClass = {
  LUNAS: 'badge-success',
  PENDING: 'badge-warning',
  GAGAL: 'badge-danger',
};

function PembayaranListPage() {
  const { adminKodeCabang } = useAdminCabang();
  const [pembayaranList, setPembayaranList] = useState([]);
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getAllPembayaran(), getAllTransaksi()])
      .then(([resPembayaran, resTransaksi]) => {
        setPembayaranList(resPembayaran.data);
        setTransaksiList(resTransaksi.data);
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  const cabangByKodeTransaksi = useMemo(() => {
    const map = {};
    transaksiList.forEach((t) => { map[t.kodeTransaksi] = t.kodeCabang; });
    return map;
  }, [transaksiList]);

  const filteredPembayaran = adminKodeCabang
    ? pembayaranList.filter((p) => cabangByKodeTransaksi[p.kodeTransaksi] === adminKodeCabang)
    : pembayaranList;

  return (
    <div>
      <PageTitle title="Daftar Pembayaran" subtitle="Riwayat pembayaran dari setiap transaksi" />

      <Card>
        {loading && <p>Memuat pembayaran...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal Bayar</th>
                <th>Status</th>
                <th>Metode</th>
                <th>Grand Total</th>
                <th>Jumlah Bayar</th>
                <th>Kembalian</th>
              </tr>
            </thead>
            <tbody>
              {filteredPembayaran.length === 0 && (
                <tr><td colSpan={6} className="empty-cell">Belum ada pembayaran</td></tr>
              )}
              {filteredPembayaran.map((p) => (
                <tr key={p.idDetailPembayaran}>
                  <td>{formatTanggal(p.tanggalPembayaran)}</td>
                  <td>
                    <span className={`badge ${statusBadgeClass[p.status] || 'badge-neutral'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>{p.metodeBayar ?? '-'}</td>
                  <td>{formatRupiah(p.grandTotal)}</td>
                  <td>{p.jumlahBayar != null ? formatRupiah(p.jumlahBayar) : '-'}</td>
                  <td>{p.kembalian != null ? formatRupiah(p.kembalian) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

export default PembayaranListPage;