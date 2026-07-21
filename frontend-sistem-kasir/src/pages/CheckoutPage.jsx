import { useState } from 'react';
import { createTransaksi } from '../api/transaksiJualService';
import { payTransaksi } from '../api/pembayaranService';
import { useCart } from '../context/CartContext';
import Cart from '../components/Cart';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}

function CheckoutPage() {
  const { toTransaksiPayload, clearCart, kodeCabang } = useCart();

  const [transaksi, setTransaksi] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
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

  const handleBayarClick = () => setShowPaymentForm(true);

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
      setShowPaymentForm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
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
    <div className="checkout-box">
      <h3>Transaksi {transaksi.kodeTransaksi}</h3>
      <p>Status: <strong>{transaksi.status}</strong></p>
      <ul className="checkout-item-list">
        {transaksi.items.map((item) => (
          <li key={item.id}>
            {item.namaProduk} x{item.jumlah} — {formatRupiah(item.subtotal)}
          </li>
        ))}
      </ul>
      <p><strong>Grand Total: {formatRupiah(transaksi.grandTotal)}</strong></p>

      {transaksi.status === 'PENDING' && !showPaymentForm && (
        <button className="btn btn-primary" onClick={handleBayarClick}>Bayar</button>
      )}

      {showPaymentForm && (
        <form onSubmit={handleSubmitPembayaran} className="payment-form">
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Metode Bayar: TUNAI</p>
          <input
            type="number"
            value={totalBayar}
            onChange={(e) => setTotalBayar(e.target.value)}
            placeholder="Total bayar"
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Memproses...' : 'Konfirmasi Bayar'}
          </button>
        </form>
      )}

      {transaksi.status === 'SELESAI' && (
        <div>
          <p className="payment-success">Pembayaran berhasil!</p>
          {kembalian != null && <p>Kembalian: {formatRupiah(kembalian)}</p>}
          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => { setTransaksi(null); setKembalian(null); }}>
            Transaksi Baru
          </button>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default CheckoutPage;