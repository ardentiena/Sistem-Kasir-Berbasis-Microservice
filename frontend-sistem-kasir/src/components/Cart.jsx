import { useCart } from '../context/CartContext';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}

function Cart({ onCheckout, checkoutLoading }) {
  const { items, updateJumlah, removeItem, total } = useCart();

  return (
    <div className="cart-panel">
      <div className="cart-card">
        <h3>Keranjang</h3>

        {items.length === 0 ? (
          <p className="cart-empty">Keranjang masih kosong.</p>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.kodeProduk} className="cart-item">
                  <span className="cart-item-name">{item.namaProduk}</span>
                  <button className="cart-qty-btn" onClick={() => updateJumlah(item.kodeProduk, item.jumlah - 1)}>-</button>
                  <span>{item.jumlah}</span>
                  <button className="cart-qty-btn" onClick={() => updateJumlah(item.kodeProduk, item.jumlah + 1)}>+</button>
                  <span className="cart-item-price">{formatRupiah(item.harga * item.jumlah)}</span>
                  <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => removeItem(item.kodeProduk)}>Hapus</button>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <span>Total</span>
              <strong>{formatRupiah(total)}</strong>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={onCheckout} disabled={checkoutLoading}>
              {checkoutLoading ? 'Memproses...' : 'Checkout'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;