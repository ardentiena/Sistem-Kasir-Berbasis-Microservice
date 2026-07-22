import { useState } from 'react';
import { createTransaksi } from '../api/transaksiJualService';
import { payTransaksi } from '../api/pembayaranService';
import { useCart } from '../context/CartContext';
import Cart from '../components/Cart';
import Modal from '../components/common/Modal';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}

function CheckoutPage() {
  const { toTransaksiPayload, clearCart, kodeCabang } = useCart();

  const [transaksi, setTransaksi] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [totalBayar, setTotalBayar] = useState('');
  const [kembalian, setKembalian] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    if (!kodeCabang) {
      setError('Pilih cabang terlebih dahulu.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await createTransaksi(toTransaksiPayload());
      setTransaksi(res.data);
      setTotalBayar(res.data.grandTotal);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const openPaymentModal = () => {
    setError(null);
    setShowModal(true);
  };

  const handleSubmitPembayaran = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resPembayaran = await payTransaksi(transaksi.kodeTransaksi, {
        metodeBayar: 'TUNAI',
        totalBayar: Number(totalBayar),
      });
      setKembalian(resPembayaran.data.kembalian);
      setTransaksi({ ...transaksi, status: 'SELESAI' });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransaksiBaru = () => {
    setTransaksi(null);
    setKembalian(null);
    setShowModal(false);
    setTotalBayar('');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!transaksi) {
    return (
      <div>
        <Cart onCheckout={handleCheckout} checkoutLoading={loading} />
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }

  return (
    <div className="cart-panel">
      <div className="cart-card">
        <h3>Transaksi {transaksi.kodeTransaksi}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Status:{' '}
          <span className={`badge ${transaksi.status === 'SELESAI' ? 'badge-success' : 'badge-warning'}`}>
            {transaksi.status}
          </span>
        </p>

        <div className="cart-items">
          {transaksi.items.map((item) => (
            <div key={item.id} className="cart-item">
              <span className="cart-item-name">{item.namaProduk} x{item.jumlah}</span>
              <span className="cart-item-price">{formatRupiah(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <div className="cart-total">
          <span>Grand Total</span>
          <strong>{formatRupiah(transaksi.grandTotal)}</strong>
        </div>

        {transaksi.status === 'PENDING' && (
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={openPaymentModal}>
            Bayar
          </button>
        )}

        {transaksi.status === 'SELESAI' && (
          <>
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: 12 }} onClick={() => setShowModal(true)}>
              Lihat Struk
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }} onClick={handleTransaksiBaru}>
              Transaksi Baru
            </button>
          </>
        )}

        {error && <p className="error-message" style={{ marginTop: 12 }}>{error}</p>}
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={transaksi.status === 'SELESAI' ? 'Struk Pembayaran' : 'Pembayaran'}
      >
        {transaksi.status === 'PENDING' ? (
          <form onSubmit={handleSubmitPembayaran}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 0 }}>
              Transaksi {transaksi.kodeTransaksi}
            </p>

            <div className="cart-items" style={{ marginBottom: 12 }}>
              {transaksi.items.map((item) => (
                <div key={item.id} className="cart-item">
                  <span className="cart-item-name">{item.namaProduk} x{item.jumlah}</span>
                  <span className="cart-item-price">{formatRupiah(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="cart-total" style={{ marginBottom: 14 }}>
              <span>Grand Total</span>
              <strong>{formatRupiah(transaksi.grandTotal)}</strong>
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

            {error && <p className="error-message" style={{ marginTop: 12 }}>{error}</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 14 }} disabled={loading}>
              {loading ? 'Memproses...' : 'Konfirmasi Bayar'}
            </button>
          </form>
        ) : (
          <div>
            <div className="receipt-print">
              <div className="receipt-header">
                <h4>Sistem Kasir</h4>
                <p>{transaksi.kodeTransaksi}</p>
                <p>{new Date().toLocaleString('id-ID')}</p>
              </div>

              <div className="receipt-items">
                {transaksi.items.map((item) => (
                  <div key={item.id} className="receipt-item">
                    <span>{item.namaProduk} x{item.jumlah}</span>
                    <span>{formatRupiah(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="receipt-total">
                <div><span>Grand Total</span><strong>{formatRupiah(transaksi.grandTotal)}</strong></div>
                <div><span>Jumlah Bayar</span><span>{formatRupiah(totalBayar)}</span></div>
                <div><span>Kembalian</span><span>{kembalian != null ? formatRupiah(kembalian) : '-'}</span></div>
              </div>

              <p className="receipt-footer">Terima kasih!</p>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={handlePrint}>
              Cetak Receipt
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }} onClick={handleTransaksiBaru}>
              Transaksi Baru
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CheckoutPage;