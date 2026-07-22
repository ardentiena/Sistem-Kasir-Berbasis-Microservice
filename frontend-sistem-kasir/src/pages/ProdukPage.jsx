import { useEffect, useState } from 'react';
import { getAllProduk, findProdukByName } from '../api/daftarProdukService';
import { useCart } from '../context/CartContext';
import '../styles/kasir.css';

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}

function ProdukPage() {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { addItem, items } = useCart();

  useEffect(() => {
    getAllProduk()
      .then((res) => setProdukList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);
      const request = searchTerm.trim() ? findProdukByName(searchTerm.trim()) : getAllProduk();
      request
        .then((res) => setProdukList(res.data))
        .catch((err) => setError(err.response?.data?.message || err.message))
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getSisaStok = (produk) => {
    const diKeranjang = items.find((i) => i.produkId === produk.id)?.jumlah || 0;
    return produk.stok - diKeranjang;
  };

  return (
    <div className="produk-page">
      <div className="produk-page-header">
        <h2>Daftar Produk</h2>

        <input
          type="text"
          className="produk-search"
          placeholder="Cari nama produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {error && <p className="error-message">Error: {error}</p>}
      </div>

      <div className="produk-page-scroll">
        {loading ? (
          <p>Memuat produk...</p>
        ) : produkList.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Produk tidak ditemukan.</p>
        ) : (
          <div className="produk-grid">
            {produkList.map((produk) => {
              const sisaStok = getSisaStok(produk);
              const habis = sisaStok <= 0;
              return (
                <div key={produk.id} className="produk-card">
                  <h4>{produk.namaProduk}</h4>
                  <p className="produk-kategori">{produk.kategori}</p>
                  <p className="produk-harga">{formatRupiah(produk.harga)}</p>
                  <p className={`produk-stok ${habis ? 'habis' : ''}`}>
                    Stok: {sisaStok < 0 ? 0 : sisaStok}
                  </p>
                  <button className="btn btn-primary" onClick={() => addItem(produk)} disabled={habis}>
                    {habis ? 'Stok Habis' : '+ Tambah ke Keranjang'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProdukPage;