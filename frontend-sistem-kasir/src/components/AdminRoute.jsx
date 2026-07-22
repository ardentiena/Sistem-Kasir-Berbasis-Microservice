import { Navigate, useLocation } from 'react-router-dom';

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const harusGantiPassword = localStorage.getItem('harusGantiPassword') === 'true';
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (harusGantiPassword && location.pathname !== '/ganti-password') {
    return <Navigate to="/ganti-password" replace />;
  }

  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;