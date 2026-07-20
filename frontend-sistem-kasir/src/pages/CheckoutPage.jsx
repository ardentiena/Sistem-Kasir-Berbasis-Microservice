import { useState } from 'react';
import { createTransaksi, getTransaksi } from '../api/transaksiJualService';
import { payTransaksi } from '../api/pembayaranService';
import { useCart } from '../context/CartContext';
import Cart from '../components/Cart';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}

function CheckoutPage() {
  const { toProdukList, clearCart } = useCart();

  const [transaksi, setTransaksi] = useState(null); // TransaksiResponseDTO lengkap
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [totalBayar, setTotalBayar] = useState('');
  const [kembalian, setKembalian] = useState(null); // dari ResponsePembayaranDTO
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = toProdukList(); // { produkList: [{ produkId, jumlah }] }
      const res = await createTransaksi(payload);
      setTransaksi(res.data); // sudah termasuk idDetailPembayaran, items, grandTotal, status PENDING
      setTotalBayar(res.data.grandTotal);
      clearCart(); // stok sudah dicek & "dipesan" di backend, keranjang lokal dikosongkan
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
      // ResponsePembayaranDTO: { idPembayaran, jumlahBayar, kembalian, status, callbackBerhasil, createdAt }
      const resPembayaran = await payTransaksi(transaksi.idDetailPembayaran, {
        metodeBayar: 'TUNAI',
        totalBayar: Number(totalBayar),
      });
      setKembalian(resPembayaran.data.kembalian);

      // Refetch transaksi supaya status yang ditampilkan benar-benar dari backend
      // (bukan diasumsikan SELESAI di frontend)
      const resTransaksi = await getTransaksi(transaksi.id);
      setTransaksi(resTransaksi.data);
      setShowPaymentForm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Belum ada transaksi berjalan -> tampilkan keranjang untuk checkout
  if (!transaksi) {
    return (
      <div>
        <Cart onCheckout={handleCheckout} checkoutLoading={loading} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  // Ada transaksi berjalan -> tampilkan detail + status
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
      <h3>Transaksi #{transaksi.id}</h3>
      <p>Status: <strong>{transaksi.status}</strong></p>
      <ul>
        {transaksi.items.map((item) => (
          <li key={item.id}>
            {item.namaProduk} x{item.jumlah} — {formatRupiah(item.subtotal)}
          </li>
        ))}
      </ul>
      <p><strong>Grand Total: {formatRupiah(transaksi.grandTotal)}</strong></p>

      {transaksi.status === 'PENDING' && !showPaymentForm && (
        <button onClick={handleBayarClick}>Bayar</button>
      )}

      {showPaymentForm && (
        <form onSubmit={handleSubmitPembayaran} style={{ marginTop: 12 }}>
          <p>Metode Bayar: TUNAI</p>
          <input
            type="number"
            value={totalBayar}
            onChange={(e) => setTotalBayar(e.target.value)}
            placeholder="Total bayar"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Konfirmasi Bayar'}
          </button>
        </form>
      )}

      {transaksi.status === 'SELESAI' && (
        <div>
          <p style={{ color: 'green' }}>Pembayaran berhasil!</p>
          {kembalian != null && <p>Kembalian: {formatRupiah(kembalian)}</p>}
          <button
            onClick={() => {
              setTransaksi(null);
              setKembalian(null);
            }}
          >
            Transaksi Baru
          </button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CheckoutPage;