import { useEffect, useState } from 'react';
import { getAllUser, register, updateUser, deleteUser, assignUserToCabang } from '../../api/userService';
import { getCabangPilihan } from '../../api/cabangService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import PageTitle from '../../components/common/PageTitle';
import Modal from '../../components/common/Modal';

const emptyForm = { role: 'KASIR', namaDepan: '', namaBelakang: '', email: '', kodeCabang: '' };

function KasirPage() {
  const [users, setUsers] = useState([]);
  const [cabangList, setCabangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingIdPegawai, setEditingIdPegawai] = useState(null); // null = mode tambah
  const [originalKodeCabang, setOriginalKodeCabang] = useState('');
  const [form, setForm] = useState(emptyForm);

  const [newUserInfo, setNewUserInfo] = useState(null); // { namaDepan, namaBelakang, email, idPegawai }

  const loadUsers = () => {
    setLoading(true);
    getAllUser()
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
    getCabangPilihan()
      .then((res) => setCabangList(res.data))
      .catch(() => {}); // silent — dropdown cabang tetap bisa dilewati kalau gagal load
  }, []);

  const namaCabang = (kodeCabang) =>
    cabangList.find((c) => c.kodeCabang === kodeCabang)?.namaCabang || kodeCabang;

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingIdPegawai(null);
    setOriginalKodeCabang('');
    setShowForm(true);
  };

  const openEditForm = (user) => {
    setForm({
      role: user.role,
      namaDepan: user.namaDepan,
      namaBelakang: user.namaBelakang,
      email: user.email,
      kodeCabang: user.kodeCabang || '',
    });
    setEditingIdPegawai(user.idPegawai);
    setOriginalKodeCabang(user.kodeCabang || '');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingIdPegawai) {
        const { role, namaDepan, namaBelakang, email, kodeCabang } = form;
        await updateUser(editingIdPegawai, { role, namaDepan, namaBelakang, email });

        if (kodeCabang && kodeCabang !== originalKodeCabang) {
          try {
            await assignUserToCabang({ kodePegawai: editingIdPegawai, kodeCabang });
          } catch (assignErr) {
            setError(
              `Data kasir tersimpan, tapi gagal mengubah cabang: ${assignErr.response?.data?.message || assignErr.message}`
            );
          }
        }

        setShowForm(false);
        loadUsers();
      } else {
        const { kodeCabang, ...registerPayload } = form;
        const res = await register(registerPayload);
        const newUser = res.data;

        if (kodeCabang) {
          try {
            await assignUserToCabang({ kodePegawai: newUser.idPegawai, kodeCabang });
          } catch (assignErr) {
            setError(
              `Kasir dibuat, tapi gagal menempatkan ke cabang: ${assignErr.response?.data?.message || assignErr.message}`
            );
          }
        }

        setShowForm(false);
        setNewUserInfo(newUser);
        loadUsers();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (idPegawai) => {
    if (!confirm('Hapus kasir ini?')) return;
    setError(null);
    try {
      await deleteUser(idPegawai);
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
            <h4>{editingIdPegawai ? 'Edit Kasir' : 'Tambah Kasir'}</h4>
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
              <label>
                Role
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="KASIR">KASIR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </label>
              <label>
                Cabang
                <select
                  value={form.kodeCabang}
                  onChange={(e) => setForm({ ...form, kodeCabang: e.target.value })}
                >
                  <option value="">— Belum ditempatkan —</option>
                  {cabangList.map((c) => (
                    <option key={c.kodeCabang} value={c.kodeCabang}>{c.namaCabang}</option>
                  ))}
                </select>
              </label>
            </div>
            {!editingIdPegawai && (
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: -4, marginBottom: 14 }}>
                Password awal akan digenerate otomatis (ID Pegawai) — akan ditampilkan setelah akun dibuat.
              </p>
            )}
            <div className="form-actions">
              <Button type="submit">{editingIdPegawai ? 'Simpan Perubahan' : 'Buat Kasir'}</Button>
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
                <th>Cabang</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={6} className="empty-cell">Tidak ada kasir</td></tr>
              )}
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.namaDepan} {u.namaBelakang}</td>
                  <td>{u.email}</td>
                  <td><span className="badge badge-info">{u.role}</span></td>
                  <td>
                    {u.kodeCabang
                      ? namaCabang(u.kodeCabang)
                      : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td>
                    {(u.active ?? u.isActive)
                      ? <span className="badge badge-success">Aktif</span>
                      : <span className="badge badge-neutral">Nonaktif</span>}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Button variant="secondary" onClick={() => openEditForm(u)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(u.idPegawai)}>Hapus</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal
        open={!!newUserInfo}
        onClose={() => setNewUserInfo(null)}
        title="Kasir Berhasil Dibuat"
      >
        {newUserInfo && (
          <div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 0 }}>
              Sampaikan kredensial berikut ke kasir baru. Mereka akan diminta mengatur password baru saat login pertama.
            </p>

            <div className="form-panel" style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 10 }}>
                <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)' }}>Email</p>
                <p style={{ margin: '2px 0 0', fontWeight: 600 }}>{newUserInfo.email}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)' }}>Password Awal (ID Pegawai)</p>
                <p style={{ margin: '2px 0 0', fontWeight: 600, fontFamily: 'monospace', fontSize: 15 }}>
                  {newUserInfo.idPegawai}
                </p>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={() => setNewUserInfo(null)}>
              Tutup
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default KasirPage;