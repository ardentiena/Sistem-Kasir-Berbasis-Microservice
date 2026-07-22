import { useEffect, useState } from 'react';
import { getAllCabang, createCabang, updateCabang, deleteCabang } from '../../api/cabangService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import PageTitle from '../../components/common/PageTitle';

const emptyForm = { kodeCabang: '', namaCabang: '', alamat: '' };

function formatTanggal(value) {
  return value ? new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';
}

function CabangPage() {
  const [cabangList, setCabangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingKode, setEditingKode] = useState(null); // null = mode tambah
  const [form, setForm] = useState(emptyForm);

  const loadCabang = () => {
    setLoading(true);
    getAllCabang()
      .then((res) => setCabangList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCabang();
  }, []);

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingKode(null);
    setShowForm(true);
  };

  const openEditForm = (cabang) => {
    setForm({
      kodeCabang: cabang.kodeCabang,
      namaCabang: cabang.namaCabang,
      alamat: cabang.alamat,
    });
    setEditingKode(cabang.kodeCabang);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingKode) {
        await updateCabang(editingKode, form);
      } else {
        await createCabang(form);
      }
      setShowForm(false);
      loadCabang();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeactivate = async (kodeCabang) => {
    if (!confirm('Nonaktifkan cabang ini? Cabang tidak akan muncul lagi sebagai pilihan aktif.')) return;
    setError(null);
    try {
      await deleteCabang(kodeCabang);
      loadCabang();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <PageTitle title="Kelola Cabang" subtitle="Kelola data cabang toko" />

      <Card>
        <div className="page-toolbar" style={{ justifyContent: 'flex-end' }}>
          <Button onClick={openCreateForm}>+ Tambah Cabang</Button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {showForm && (
          <form onSubmit={handleSubmit} className="form-panel">
            <h4>{editingKode ? 'Edit Cabang' : 'Tambah Cabang'}</h4>
            <div className="form-grid">
              <label>
                Kode Cabang
                <input
                  value={form.kodeCabang}
                  onChange={(e) => setForm({ ...form, kodeCabang: e.target.value })}
                  disabled={!!editingKode}
                  required
                />
              </label>
              <label>
                Nama Cabang
                <input
                  value={form.namaCabang}
                  onChange={(e) => setForm({ ...form, namaCabang: e.target.value })}
                  required
                />
              </label>
              <label>
                Alamat
                <input
                  value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  required
                />
              </label>
            </div>
            <div className="form-actions">
              <Button type="submit">{editingKode ? 'Simpan Perubahan' : 'Buat Cabang'}</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Batal
              </Button>
            </div>
          </form>
        )}

        {loading ? (
          <p>Memuat...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Cabang</th>
                <th>Alamat</th>
                <th>Status</th>
                <th>Dibuat</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cabangList.length === 0 && (
                <tr><td colSpan={6} className="empty-cell">Belum ada cabang</td></tr>
              )}
              {cabangList.map((c) => (
                <tr key={c.id}>
                  <td>{c.kodeCabang}</td>
                  <td>{c.namaCabang}</td>
                  <td>{c.alamat}</td>
                  <td>
                    {c.aktif
                      ? <span className="badge badge-success">Aktif</span>
                      : <span className="badge badge-neutral">Nonaktif</span>}
                  </td>
                  <td>{formatTanggal(c.createdAt)}</td>
                  <td>
                    <div className="row-actions">
                      <Button variant="secondary" onClick={() => openEditForm(c)}>Edit</Button>
                      {c.aktif && (
                        <Button variant="danger" onClick={() => handleDeactivate(c.kodeCabang)}>
                          Nonaktifkan
                        </Button>
                      )}
                    </div>
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

export default CabangPage;