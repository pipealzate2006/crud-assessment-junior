import { Navigate, Outlet } from 'react-router-dom'
import { getUser } from '../auth'

function PrivateRoute() {
  if (!getUser()) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default PrivateRoute
