import { Navigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'

/**
 * ProtectedRoute
 *
 * Props:
 *   requiredRole  — 'admin' | 'public' | undefined (undefined = hanya cek auth)
 *   children      — komponen yang dilindungi
 *
 * Perilaku:
 *   • Belum login               → redirect ke /login (simpan tujuan asal)
 *   • Login tapi role salah     → redirect ke halaman sesuai role-nya
 *   • Login & role cocok        → render children
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useStore(s => ({
    isAuthenticated: s.isAuthenticated,
    user:            s.user,
  }))
  const location = useLocation()

  // Belum login → ke halaman login, simpan tujuan supaya bisa redirect balik
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Login tapi role tidak sesuai → arahkan ke halaman yang tepat
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/public'} replace />
  }

  return children
}