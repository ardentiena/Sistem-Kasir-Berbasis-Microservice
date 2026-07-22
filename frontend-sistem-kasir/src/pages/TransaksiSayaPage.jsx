import { useEffect, useState } from 'react';
import { getAllTransaksi } from '../api/transaksiJualService';
import { payTransaksi } from '../api/pembayaranService';
import Card from '../components/common/Card';
import PageTitle from '../components/common/PageTitle';
import Modal from '../components/common/Modal';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}
function formatTanggal(value) {
  return new Date(value).toLocaleString('id-ID');
}

const statusBadgeClass = {
  SELESAI: 'badge-success',
  PENDING: 'badge-warning',
  DIBATALKAN: 'badge-danger',
};

function TransaksiSayaPage() {
  const email = localStorage.getItem('email');
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [totalBayar, setTotalBayar] = useState('');
  const [kembalian, setKembalian] = useState(null);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState(null);

  const loadTransaksi = () => {
    setLoading(true);
    getAllTransaksi()
      .then((res) => setTransaksiList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTransaksi();
  }, []);

  const myTransaksi = transaksiList.filter((t) => t.kasirEmail === email);

  const openPaymentModal = (t) => {
    setSelected(t);
    setTotalBayar(t.grandTotal);
    setKembalian(null);
    setPayError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
    if (kembalian != null) loadTransaksi(); // refresh list kalau tadi sempat bayar
  };

  const handleSubmitPembayaran = async (e) => {
    e.preventDefault();
    setPayLoading(true);
    setPayError(null);
    try {
      const res = await payTransaksi(selected.kodeTransaksi, {
        metodeBayar: 'TUNAI',
        totalBayar: Number(totalBayar),
      });
      setKembalian(res.data.kembalian);
      setSelected({ ...selected, status: 'SELESAI' });
    } catch (err) {
      setPayError(err.response?.data?.message || err.message);
    } finally {
      setPayLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <PageTitle title="Transaksi Saya" subtitle="Riwayat transaksi yang kamu proses" />

      <Card>
        {loading && <p>Memuat transaksi...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Jumlah Item</th>
                <th>Grand Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myTransaksi.length === 0 && (
                <tr><td colSpan={5} className="empty-cell">Belum ada transaksi</td></tr>
              )}
              {myTransaksi.map((t) => (
                <tr key={t.id}>
                  <td>{formatTanggal(t.createdAt)}</td>
                  <td>
                    <span className={`badge ${statusBadgeClass[t.status] || 'badge-neutral'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>{t.items?.length ?? 0}</td>
                  <td>{formatRupiah(t.grandTotal)}</td>
                  <td>
                    {t.status === 'PENDING' && (
                      <button className="btn btn-primary" onClick={() => openPaymentModal(t)}>
                        Bayar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal
        open={showModal}
        onClose={closeModal}
        title={selected?.status === 'SELESAI' ? 'Struk Pembayaran' : 'Pembayaran'}
      >
        {selected && selected.status === 'PENDING' && (
          <form onSubmit={handleSubmitPembayaran}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 0 }}>
              Transaksi {selected.kodeTransaksi}
            </p>

            <div className="cart-items" style={{ marginBottom: 12 }}>
              {selected.items.map((item) => (
                <div key={item.id} className="cart-item">
                  <span className="cart-item-name">{item.namaProduk} x{item.jumlah}</span>
                  <span className="cart-item-price">{formatRupiah(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="cart-total" style={{ marginBottom: 14 }}>
              <span>Grand Total</span>
              <strong>{formatRupiah(selected.grandTotal)}</strong>
            </div>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              Metode Bayar: TUNAI
              <input
                type="number"
                value={totalBayar}
                onChange={(e) => setTotalBayar(e.target.value)}
                placeholder="Nominal diterima"
                required
              />
            </label>

            {payError && <p className="error-message" style={{ marginTop: 12 }}>{payError}</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 14 }} disabled={payLoading}>
              {payLoading ? 'Memproses...' : 'Konfirmasi Bayar'}
            </button>
          </form>
        )}

        {selected && selected.status === 'SELESAI' && (
          <div>
            <div className="receipt-print">
              <div className="receipt-header">
                <h4>Sistem Kasir</h4>
                <p>{selected.kodeTransaksi}</p>
                <p>{new Date().toLocaleString('id-ID')}</p>
              </div>

              <div className="receipt-items">
                {selected.items.map((item) => (
                  <div key={item.id} className="receipt-item">
                    <span>{item.namaProduk} x{item.jumlah}</span>
                    <span>{formatRupiah(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="receipt-total">
                <div><span>Grand Total</span><strong>{formatRupiah(selected.grandTotal)}</strong></div>
                <div><span>Jumlah Bayar</span><span>{formatRupiah(totalBayar)}</span></div>
                <div><span>Kembalian</span><span>{kembalian != null ? formatRupiah(kembalian) : '-'}</span></div>
              </div>

              <p className="receipt-footer">Terima kasih!</p>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={handlePrint}>
              Cetak Receipt
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }} onClick={closeModal}>
              Tutup
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TransaksiSayaPage;