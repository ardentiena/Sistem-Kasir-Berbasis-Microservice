import { useCart } from '../context/CartContext';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}

function Cart({ onCheckout, checkoutLoading }) {
  const { items, updateJumlah, removeItem, total } = useCart();

  if (items.length === 0) return <p className="cart-empty">Keranjang masih kosong.</p>;

  return (
    <div className="cart-box">
      <h3>Keranjang</h3>
      {items.map((item) => (
        <div key={item.kodeProduk} className="cart-item">
          <span className="cart-item-name">{item.namaProduk}</span>
          <button className="cart-qty-btn" onClick={() => updateJumlah(item.kodeProduk, item.jumlah - 1)}>-</button>
          <span>{item.jumlah}</span>
          <button className="cart-qty-btn" onClick={() => updateJumlah(item.kodeProduk, item.jumlah + 1)}>+</button>
          <span>{formatRupiah(item.harga * item.jumlah)}</span>
          <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => removeItem(item.kodeProduk)}>Hapus</button>
        </div>
      ))}
      <div className="cart-total">
        <strong>Total: {formatRupiah(total)}</strong>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={onCheckout} disabled={checkoutLoading}>
        {checkoutLoading ? 'Memproses...' : 'Checkout'}
      </button>
    </div>
  );
}

export default Cart;