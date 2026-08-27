import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tasks', label: 'Tareas' },
  { to: '/profile', label: 'Perfil' },
]

export function Layout() {
  const { user, signOut } = useAuth()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h1>TaskFlow</h1>
          <p className="muted">Hola, {user?.displayName ?? user?.email}</p>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button className="logout-button" onClick={signOut}>
          Cerrar sesión
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
