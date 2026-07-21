import { useEffect, useState } from 'react';
import {
    getAllProduk,
    createProduk,
    updateProduk,
    deleteProduk
} from '../../api/daftarProdukService';

import "../../styles/pages.css";

import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import PageTitle from "../../components/common/PageTitle";
import DataTable from "../../components/common/DataTable";

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}

const emptyForm = { namaProduk: '', kategori: '', harga: '', stok: '' };

function ProdukAdminPage() {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  

  const loadProduk = () => {
    setLoading(true);
    getAllProduk()
      .then((res) => setProdukList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProduk();
  }, []);

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (produk) => {
    setForm({
      namaProduk: produk.namaProduk,
      kategori: produk.kategori,
      harga: produk.harga,
      stok: produk.stok,
    });
    setEditingId(produk.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = {
      namaProduk: form.namaProduk,
      kategori: form.kategori,
      harga: Number(form.harga),
      stok: Number(form.stok),
    };
    try {
      if (editingId) {
        await updateProduk(editingId, payload);
      } else {
        await createProduk(payload);
      }
      setShowForm(false);
      loadProduk();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const filteredProduk = produkList.filter((produk) =>
    produk.namaProduk
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!confirm('Hapus produk ini?')) return;
    setError(null);
    try {
      await deleteProduk(id);
      loadProduk();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <PageTitle
    title="Kelola Produk"
    subtitle="Kelola seluruh data produk"
/>

<Card>

<div className="page-toolbar">

    <input
        className="search-input"
        placeholder="Cari produk..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
    />

    <Button onClick={openCreateForm}>

        + Tambah Produk

    </Button>

</div>

      {error && (<p className="error-message">{error}</p>)}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #333', padding: 16, borderRadius: 8, marginTop: 12 }}>
          <h4>{editingId ? 'Edit Produk' : 'Tambah Produk'}</h4>
          <div style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
            <label>
              Nama Produk
              <input
                value={form.namaProduk}
                onChange={(e) => setForm({ ...form, namaProduk: e.target.value })}
                required
              />
            </label>
            <label>
              Kategori
              <input
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                required
              />
            </label>
            <label>
              Harga
              <input
                type="number"
                value={form.harga}
                onChange={(e) => setForm({ ...form, harga: e.target.value })}
                required
              />
            </label>
            <label>
              Stok
              <input
                type="number"
                value={form.stok}
                onChange={(e) => setForm({ ...form, stok: e.target.value })}
                required
              />
            </label>
          </div>
          <div style={{ marginTop: 12 }}>
            <button type="submit">{editingId ? 'Simpan Perubahan' : 'Buat Produk'}</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ marginLeft: 8 }}>
              Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Memuat...</p>
      ) : (
        <table style={{ width: '100%', marginTop: 16, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredProduk.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                <td>{p.namaProduk}</td>
                <td>{p.kategori}</td>
                <td>{formatRupiah(p.harga)}</td>
                <td>{p.stok}</td>
                <td>
                  <button variant="success" onClick={() => openEditForm(p)}>Edit</button>
                  <Button variant="danger" onClick={() => handleDelete(p.id)}>Hapus</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </Card>
    </div>
  );
}

export default ProdukAdminPage;