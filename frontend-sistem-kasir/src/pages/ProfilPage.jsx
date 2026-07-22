import Card from '../components/common/Card';
import PageTitle from '../components/common/PageTitle';

function ProfilPage() {
  const email = localStorage.getItem('email') || '-';
  const role = localStorage.getItem('role') || '-';
  const kodeCabang = localStorage.getItem('kodeCabang') || '-';

  return (
    <div>
      <PageTitle title="Profil" subtitle="Informasi akun" />

      <Card style={{ maxWidth: 420 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div className="profile-avatar" style={{ width: 48, height: 48, fontSize: 18 }}>
            {email.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{email}</p>
            <span className="badge badge-info" style={{ marginTop: 4 }}>{role}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)' }}>Email</p>
            <p style={{ margin: '2px 0 0', fontSize: 14 }}>{email}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)' }}>Role</p>
            <p style={{ margin: '2px 0 0', fontSize: 14 }}>{role}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)' }}>Kode Cabang</p>
            <p style={{ margin: '2px 0 0', fontSize: 14 }}>{kodeCabang || 'Belum ditempatkan'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ProfilPage;