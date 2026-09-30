import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

function PublicRoute() {
  const user = useAuthStore((state) => state.user)

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PublicRoute
