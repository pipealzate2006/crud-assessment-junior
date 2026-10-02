import { UserMenu } from '../components/molecules'
import { TaskForm, TaskList } from '../components/organisms'
import { DashboardLayout } from '../components/templates'
import { useAuthStore } from '../store/useAuthStore'

function TasksPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <DashboardLayout
      title="Gestor de tareas"
      subtitle="React + Zustand + Sass + BEM"
      actions={<UserMenu user={user ?? ''} onLogout={() => logout()} />}
      aside={<TaskForm />}
    >
      <TaskList />
    </DashboardLayout>
  )
}

export default TasksPage
