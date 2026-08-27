import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { clearStoredUser, readStoredUser, saveStoredUser } from '../utils/storage'

type AuthUser = {
  uid: string
  email: string
  displayName?: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function isDemoUser(email: string) {
  return email.includes('@') && email.endsWith('.com')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const storedUser = readStoredUser()
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    async signIn(email, password) {
      if (!email || !password) {
        throw new Error('Email y contraseña son obligatorios')
      }

      if (!isDemoUser(email)) {
        throw new Error('Usa un email válido para entrar a la demo')
      }

      const nextUser = {
        uid: crypto.randomUUID(),
        email,
        displayName: email.split('@')[0],
      }

      setUser(nextUser)
      saveStoredUser(nextUser)
    },
    signOut() {
      setUser(null)
      clearStoredUser()
    },
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
