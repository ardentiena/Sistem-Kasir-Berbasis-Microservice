import { useEffect, useState } from 'react';
import { getAllUser, register, updateUser, deleteUser } from '../../api/userService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import PageTitle from '../../components/common/PageTitle';

const emptyForm = { role: 'KASIR', namaDepan: '', namaBelakang: '', email: '', password: '' };

function KasirPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = mode tambah, ada isi = mode edit
  const [form, setForm] = useState(emptyForm);

  const loadUsers = () => {
    setLoading(true);
    getAllUser()
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (user) => {
    setForm({
      role: user.role,
      namaDepan: user.namaDepan,
      namaBelakang: user.namaBelakang,
      email: user.email,
      password: '', // tidak dipakai saat edit (UserRequestDTO tidak punya field password)
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        const { role, namaDepan, namaBelakang, email } = form;
        await updateUser(editingId, { role, namaDepan, namaBelakang, email });
      } else {
        await register(form);
      }
      setShowForm(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus kasir ini?')) return;
    setError(null);
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <PageTitle title="Kelola Kasir" subtitle="Kelola data akun kasir dan admin" />

      <Card>
        <div className="page-toolbar" style={{ justifyContent: 'flex-end' }}>
          <Button onClick={openCreateForm}>+ Tambah Kasir</Button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {showForm && (
          <form onSubmit={handleSubmit} className="form-panel">
            <h4>{editingId ? 'Edit Kasir' : 'Tambah Kasir'}</h4>
            <div className="form-grid">
              <label>
                Nama Depan
                <input
                  value={form.namaDepan}
                  onChange={(e) => setForm({ ...form, namaDepan: e.target.value })}
                  required
                />
              </label>
              <label>
                Nama Belakang
                <input
                  value={form.namaBelakang}
                  onChange={(e) => setForm({ ...form, namaBelakang: e.target.value })}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </label>
              {!editingId && (
                <label>
                  Password
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </label>
              )}
              <label>
                Role
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="KASIR">KASIR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </label>
            </div>
            <div className="form-actions">
              <Button type="submit">{editingId ? 'Simpan Perubahan' : 'Buat Kasir'}</Button>
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
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={5} className="empty-cell">Tidak ada kasir</td></tr>
              )}
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.namaDepan} {u.namaBelakang}</td>
                  <td>{u.email}</td>
                  <td><span className="badge badge-info">{u.role}</span></td>
                  <td>
                    {u.isActive
                      ? <span className="badge badge-success">Aktif</span>
                      : <span className="badge badge-neutral">Nonaktif</span>}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Button variant="secondary" onClick={() => openEditForm(u)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(u.id)}>Hapus</Button>
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

export default KasirPage;