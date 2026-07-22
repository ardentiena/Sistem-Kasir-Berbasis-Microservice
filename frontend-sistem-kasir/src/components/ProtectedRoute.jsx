import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const harusGantiPassword = localStorage.getItem('harusGantiPassword') === 'true';
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace />;
  if (harusGantiPassword && location.pathname !== '/ganti-password') {
    return <Navigate to="/ganti-password" replace />;
  }
  return children;
}

export default ProtectedRoute;