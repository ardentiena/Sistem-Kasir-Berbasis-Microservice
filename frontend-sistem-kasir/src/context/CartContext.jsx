import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // items: [{ produkId, namaProduk, harga, jumlah }]
  const [items, setItems] = useState([]);

  const addItem = (produk) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.produkId === produk.id);
      if (existing) {
        return prev.map((i) =>
          i.produkId === produk.id ? { ...i, jumlah: i.jumlah + 1 } : i
        );
      }
      return [
        ...prev,
        { produkId: produk.id, namaProduk: produk.namaProduk, harga: produk.harga, jumlah: 1 },
      ];
    });
  };

  const updateJumlah = (produkId, jumlah) => {
    if (jumlah <= 0) {
      removeItem(produkId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.produkId === produkId ? { ...i, jumlah } : i))
    );
  };

  const removeItem = (produkId) => {
    setItems((prev) => prev.filter((i) => i.produkId !== produkId));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + Number(i.harga) * i.jumlah, 0);

  // Payload siap kirim ke createTransaksi: { produkList: [{ produkId, jumlah }] }
  const toProdukList = () => ({
    produkList: items.map((i) => ({ produkId: i.produkId, jumlah: i.jumlah })),
  });

  return (
    <CartContext.Provider
      value={{ items, addItem, updateJumlah, removeItem, clearCart, total, toProdukList }}
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