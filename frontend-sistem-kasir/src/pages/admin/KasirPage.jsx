import { useEffect, useState } from 'react';
import { getAllUser, register, updateUser, deleteUser } from '../../api/userService';

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
        // UserRequestDTO: { role, namaDepan, namaBelakang, email }
        const { role, namaDepan, namaBelakang, email } = form;
        await updateUser(editingId, { role, namaDepan, namaBelakang, email });
      } else {
        // RegisterUserDTO: { role, namaDepan, namaBelakang, email, password }
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Kelola Kasir</h2>
        <button onClick={openCreateForm}>+ Tambah Kasir</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #333', padding: 16, borderRadius: 8, marginTop: 12 }}>
          <h4>{editingId ? 'Edit Kasir' : 'Tambah Kasir'}</h4>
          <div style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
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
          <div style={{ marginTop: 12 }}>
            <button type="submit">{editingId ? 'Simpan Perubahan' : 'Buat Kasir'}</button>
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
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #222' }}>
                <td>{u.namaDepan} {u.namaBelakang}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? 'Aktif' : 'Nonaktif'}</td>
                <td>
                  <button onClick={() => openEditForm(u)}>Edit</button>
                  <button onClick={() => handleDelete(u.id)} style={{ marginLeft: 4 }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default KasirPage;