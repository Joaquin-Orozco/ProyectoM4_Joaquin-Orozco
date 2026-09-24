import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn, register } = useAuth()
  const [email, setEmail] = useState('demo@ejemplo.com')
  const [password, setPassword] = useState('123456')
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')

    try {
      if (isRegistering) {
        await register(email, password)
      } else {
        await signIn(email, password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit">{isRegistering ? 'Registrarme' : 'Entrar'}</button>
        <button type="button" className="secondary-button" onClick={() => setIsRegistering((current) => !current)}>
          {isRegistering ? 'Ya tengo una cuenta' : 'Crear una cuenta'}
        </button>
      </form>
    </div>
  )
}
