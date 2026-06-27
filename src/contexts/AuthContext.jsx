import { createContext, useContext, useState } from 'react'

const USERS = {
  PEDROIGOR: { password: '1234', role: 'proprietario', displayName: 'Pedro Igor' },
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vilamore_session')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const login = (username, password) => {
    const record = USERS[username]
    if (!record || record.password !== password) {
      return { ok: false, error: 'Usuário ou senha inválidos.' }
    }
    const session = { username, role: record.role, displayName: record.displayName }
    localStorage.setItem('vilamore_session', JSON.stringify(session))
    setUser(session)
    return { ok: true }
  }

  const logout = () => {
    localStorage.removeItem('vilamore_session')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isOwner: user?.role === 'proprietario' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
