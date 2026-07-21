import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // items: [{ produkId, kodeProduk, namaProduk, harga, jumlah }]
  const [items, setItems] = useState([]);
  const [kodeCabang, setKodeCabang] = useState(localStorage.getItem('kodeCabang') || '');

  const addItem = (produk) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.kodeProduk === produk.kodeProduk);
      if (existing) {
        return prev.map((i) =>
          i.kodeProduk === produk.kodeProduk ? { ...i, jumlah: i.jumlah + 1 } : i
        );
      }
      return [
        ...prev,
        { produkId: produk.id, kodeProduk: produk.kodeProduk, namaProduk: produk.namaProduk, harga: produk.harga, jumlah: 1 },
      ];
    });
  };

  const updateJumlah = (kodeProduk, jumlah) => {
    if (jumlah <= 0) {
      removeItem(kodeProduk);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.kodeProduk === kodeProduk ? { ...i, jumlah } : i))
    );
  };

  const removeItem = (kodeProduk) => {
    setItems((prev) => prev.filter((i) => i.kodeProduk !== kodeProduk));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + Number(i.harga) * i.jumlah, 0);

  // Payload siap kirim ke createTransaksi: { kodeCabang, produkList: [{ kodeProduk, jumlah }] }
  const toTransaksiPayload = () => ({
    kodeCabang,
    produkList: items.map((i) => ({ kodeProduk: i.kodeProduk, jumlah: i.jumlah })),
  });

  return (
    <CartContext.Provider
      value={{ items, addItem, updateJumlah, removeItem, clearCart, total, toTransaksiPayload, kodeCabang, setKodeCabang }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}