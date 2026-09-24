import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth'
import { auth, hasFirebaseConfig } from '../services/firebase'
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
  register: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function isDemoUser(email: string) {
  return email.includes('@') && email.endsWith('.com')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    if (hasFirebaseConfig) {
      return onAuthStateChanged(auth!, (firebaseUser) => {
        if (!firebaseUser) {
          setUser(null)
          return
        }

        const nextUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          displayName: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0],
        }
        setUser(nextUser)
        saveStoredUser(nextUser)
      })
    }

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

      if (hasFirebaseConfig) {
        await signInWithEmailAndPassword(auth!, email, password)
        return
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
    async register(email, password) {
      if (!email || password.length < 6) {
        throw new Error('Usa un email válido y una contraseña de al menos 6 caracteres')
      }

      if (hasFirebaseConfig) {
        await createUserWithEmailAndPassword(auth!, email, password)
        return
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
      if (hasFirebaseConfig) {
        void firebaseSignOut(auth!)
      }
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
