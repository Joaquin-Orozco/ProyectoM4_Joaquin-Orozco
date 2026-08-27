import { useAuth } from '../context/AuthContext'
import { readStoredTasks } from '../utils/storage'

export function DashboardPage() {
  const { user } = useAuth()
  const tasks = readStoredTasks()

  return (
    <section className="page-card">
      <h2>Dashboard</h2>
      <p>Bienvenido/a, {user?.displayName ?? user?.email}</p>
      <div className="stats-grid">
        <div className="stat-box">
          <span>Total</span>
          <strong>{tasks.length}</strong>
        </div>
        <div className="stat-box">
          <span>Pendientes</span>
          <strong>{tasks.filter((task: any) => task.status === 'pending').length}</strong>
        </div>
        <div className="stat-box">
          <span>Completas</span>
          <strong>{tasks.filter((task: any) => task.status === 'done').length}</strong>
        </div>
      </div>
    </section>
  )
}
