import { useAuthStore } from '../store/useAuthStore'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'

function TasksPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Gestor de tareas</h1>
        <p className="app__subtitle">React + Zustand + Sass + BEM</p>
        <div className="app__user">
          <span>Hola, {user}</span>
          <button className="button button--ghost button--small" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="app__main">
        <TaskForm />
        <TaskList />
      </main>
    </div>
  )
}

export default TasksPage
