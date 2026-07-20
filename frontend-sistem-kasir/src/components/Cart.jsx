import { useCart } from '../context/CartContext';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}

function Cart({ onCheckout, checkoutLoading }) {
  const { items, updateJumlah, removeItem, total } = useCart();

  if (items.length === 0) return <p>Keranjang masih kosong.</p>;

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
      <h3>Keranjang</h3>
      {items.map((item) => (
        <div key={item.produkId} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ flex: 1 }}>{item.namaProduk}</span>
          <button onClick={() => updateJumlah(item.produkId, item.jumlah - 1)}>-</button>
          <span>{item.jumlah}</span>
          <button onClick={() => updateJumlah(item.produkId, item.jumlah + 1)}>+</button>
          <span>{formatRupiah(item.harga * item.jumlah)}</span>
          <button onClick={() => removeItem(item.produkId)}>Hapus</button>
        </div>
      ))}
      <hr />
      <p><strong>Total: {formatRupiah(total)}</strong></p>
      <button onClick={onCheckout} disabled={checkoutLoading}>
        {checkoutLoading ? 'Memproses...' : 'Checkout'}
      </button>
    </div>
  );
}

export default Cart;