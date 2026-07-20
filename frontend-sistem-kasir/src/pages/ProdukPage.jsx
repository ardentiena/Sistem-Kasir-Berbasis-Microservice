import { useEffect, useState } from 'react';
import { getAllProduk, findProdukByName } from '../api/daftarProdukService';
import { useCart } from '../context/CartContext';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}

function ProdukPage() {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { addItem, items } = useCart();

  // Load semua produk sekali di awal
  useEffect(() => {
    getAllProduk()
      .then((res) => setProdukList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  // Debounce: tunggu 400ms setelah user berhenti mengetik sebelum request ke backend,
  // supaya tidak nge-hit API di setiap ketukan huruf
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);

      const request = searchTerm.trim()
        ? findProdukByName(searchTerm.trim())
        : getAllProduk();

      request
        .then((res) => setProdukList(res.data))
        .catch((err) => setError(err.response?.data?.message || err.message))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sisa stok yang bisa ditambah = stok backend dikurangi jumlah yang sudah ada di keranjang
  // (mencegah user menambah lebih dari stok yang tersedia; stok final tetap divalidasi backend)
  const getSisaStok = (produk) => {
    const diKeranjang = items.find((i) => i.produkId === produk.id)?.jumlah || 0;
    return produk.stok - diKeranjang;
  };

  return (
    <div>
      <h2>Daftar Produk</h2>

      <input
        type="text"
        placeholder="Cari nama produk..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 12 }}
      />

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {loading ? (
        <p>Memuat produk...</p>
      ) : produkList.length === 0 ? (
        <p style={{ color: '#888' }}>Produk tidak ditemukan.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {produkList.map((produk) => {
            const sisaStok = getSisaStok(produk);
            const habis = sisaStok <= 0;
            return (
              <div key={produk.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
                <h4>{produk.namaProduk}</h4>
                <p style={{ fontSize: 12, color: '#888' }}>{produk.kategori}</p>
                <p>{formatRupiah(produk.harga)}</p>
                <p style={{ fontSize: 12, color: habis ? 'red' : '#666' }}>
                  Stok: {sisaStok < 0 ? 0 : sisaStok}
                </p>
                <button onClick={() => addItem(produk)} disabled={habis}>
                  {habis ? 'Stok Habis' : '+ Tambah ke Keranjang'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProdukPage;