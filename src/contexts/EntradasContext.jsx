import { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'

const EntradasContext = createContext(null)

// Mês no formato "YYYY-MM"
function currentYearMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function EntradasProvider({ children }) {
  const [entradas, setEntradas] = useState([])
  const [loading, setLoading]   = useState(true)
  const [mes, setMes]           = useState(currentYearMonth)

  useEffect(() => {
    if (!db) { setLoading(false); return }
    setLoading(true)
    const ref = collection(db, 'processamentos', 'vilamore', mes)
    const q   = query(ref, orderBy('criadoEm', 'desc'))

    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setEntradas(docs)
      setLoading(false)
    }, () => setLoading(false))

    return () => unsub()
  }, [mes])

  return (
    <EntradasContext.Provider value={{ entradas, loading, mes, setMes }}>
      {children}
    </EntradasContext.Provider>
  )
}

export const useEntradas = () => useContext(EntradasContext)
