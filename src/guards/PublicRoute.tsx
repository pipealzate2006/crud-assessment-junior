import { Navigate, Outlet } from 'react-router-dom'
import { getUser } from '../auth'

function PublicRoute() {
  if (getUser()) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PublicRoute
