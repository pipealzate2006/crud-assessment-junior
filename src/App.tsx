import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PrivateRoute from './guards/PrivateRoute'
import PublicRoute from './guards/PublicRoute'
import LoginPage from './pages/LoginPage'
import TasksPage from './pages/TasksPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<TasksPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
