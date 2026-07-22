import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gantiPassword } from '../api/userService';
import '../styles/kasir.css';

function GantiPasswordPage() {
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (passwordBaru !== konfirmasi) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }
    setLoading(true);
    try {
      await gantiPassword(passwordBaru);
      localStorage.setItem('harusGantiPassword', 'false');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-badge">S</span>
          <div>
            <h1>Atur Password Baru</h1>
            <span>Ini login pertamamu — atur password sebelum lanjut</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Password Baru
            <input
              type="password"
              value={passwordBaru}
              onChange={(e) => setPasswordBaru(e.target.value)}
              required
              minLength={6}
            />
          </label>
          <label>
            Konfirmasi Password
            <input
              type="password"
              value={konfirmasi}
              onChange={(e) => setKonfirmasi(e.target.value)}
              required
            />
          </label>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default GantiPasswordPage;