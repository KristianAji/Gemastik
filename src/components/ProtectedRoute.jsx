import { Navigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useStore(s => ({
    isAuthenticated: s.isAuthenticated,
    user:            s.user,
  }))
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={
      user.role === 'admin'  ? '/admin'    :
      user.role === 'dinsos' ? '/dinsos'   :
      user.role === 'satpol' ? '/satpolpp' :
      '/public'
    } replace />
  }

  return children
}