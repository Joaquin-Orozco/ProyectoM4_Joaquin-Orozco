import { useAuth } from '../context/AuthContext'

export function ProfilePage() {
  const { user } = useAuth()

  return (
    <section className="page-card">
      <h2>Perfil</h2>
      <div className="profile-card">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Nombre:</strong> {user?.displayName ?? 'Sin nombre'}</p>
        <p><strong>UID:</strong> {user?.uid}</p>
      </div>
    </section>
  )
}
