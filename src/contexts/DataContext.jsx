import { createContext, useContext, useState, useCallback } from 'react'
import { format } from 'date-fns'
import { db } from '../lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const DataContext = createContext(null)

const LOG_KEY     = 'vilamore_log'
const ALIASES_KEY = 'vilamore_aliases'

function storageKey(date) { return `vilamore_estoque_${date}` }
function todayStr()       { return format(new Date(), 'yyyy-MM-dd') }

function loadLocal(key) {
  try { return JSON.parse(localStorage.getItem(key)) ?? null } catch { return null }
}
function saveLocal(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

async function saveFirebase(date, data) {
  if (!db) return
  try { await setDoc(doc(db, 'estoque_vilamore', date), data) }
  catch (err) { console.error('Firebase save error:', err.message) }
}

async function loadFirebase(date) {
  if (!db) return null
  try {
    const snap = await getDoc(doc(db, 'estoque_vilamore', date))
    return snap.exists() ? snap.data() : null
  } catch { return null }
}

export function DataProvider({ children }) {
  const [currentDate, setCurrentDateState] = useState(todayStr)
  const [estoqueData, setEstoqueData]       = useState(() => loadLocal(storageKey(todayStr())))
  const [auditLog, setAuditLog]             = useState(() => loadLocal(LOG_KEY) ?? [])
  const [aliases, setAliases]               = useState(() => loadLocal(ALIASES_KEY) ?? {})

  const appendLog = useCallback((entry) => {
    setAuditLog(prev => {
      const next = [{ id: Date.now(), timestamp: format(new Date(), 'dd/MM/yyyy HH:mm:ss'), ...entry }, ...prev]
      saveLocal(LOG_KEY, next)
      return next
    })
  }, [])

  const setCurrentDate = useCallback(async (date) => {
    setCurrentDateState(date)
    let data = loadLocal(storageKey(date))
    if (!data) data = await loadFirebase(date)
    setEstoqueData(data)
  }, [])

  const saveEstoque = useCallback((data, user) => {
    const withDate = { ...data, data: data.data || currentDate }
    saveLocal(storageKey(withDate.data), withDate)
    setEstoqueData(withDate)
    saveFirebase(withDate.data, withDate)
    appendLog({ action: 'SALVAR_ESTOQUE', user, details: `${withDate.items?.length ?? 0} itens · ${withDate.data}` })
  }, [currentDate, appendLog])

  const updateItem = useCallback((itemId, field, value, user) => {
    setEstoqueData(prev => {
      if (!prev) return prev
      const next = {
        ...prev,
        items: prev.items.map(it => it.id === itemId ? { ...it, [field]: value } : it),
      }
      saveLocal(storageKey(next.data || currentDate), next)
      saveFirebase(next.data || currentDate, next)
      appendLog({ action: 'EDITAR_ITEM', user, details: `${field} → "${value}" (${itemId})` })
      return next
    })
  }, [currentDate, appendLog])

  const deleteItem = useCallback((itemId, itemName, user) => {
    setEstoqueData(prev => {
      if (!prev) return prev
      const next = { ...prev, items: prev.items.filter(it => it.id !== itemId) }
      saveLocal(storageKey(next.data || currentDate), next)
      appendLog({ action: 'EXCLUIR_ITEM', user, details: `"${itemName}" removido` })
      return next
    })
  }, [currentDate, appendLog])

  const renameItem = useCallback((itemId, newAlias, user) => {
    setAliases(prev => {
      const next = { ...prev, [itemId]: newAlias }
      saveLocal(ALIASES_KEY, next)
      return next
    })
    appendLog({ action: 'RENOMEAR_ITEM', user, details: `${itemId} → "${newAlias}"` })
  }, [appendLog])

  const clearEstoque = useCallback(() => {
    localStorage.removeItem(storageKey(currentDate))
    setEstoqueData(null)
  }, [currentDate])

  const applyContagem = useCallback((matches, user, sourceLabel) => {
    setEstoqueData(prev => {
      if (!prev) return prev
      const byId = new Map(matches.map(m => [m.itemId, m.quantidade]))
      const next = {
        ...prev,
        items: prev.items.map(it =>
          byId.has(it.id) ? { ...it, estoqueInicial: byId.get(it.id) } : it
        ),
      }
      saveLocal(storageKey(next.data || currentDate), next)
      saveFirebase(next.data || currentDate, next)
      appendLog({ action: 'CONTAGEM_ESTOQUE', user, details: `${matches.length} itens via ${sourceLabel}` })
      return next
    })
  }, [currentDate, appendLog])

  const getAvailableDates = useCallback(() => {
    const dates = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('vilamore_estoque_')) dates.push(key.replace('vilamore_estoque_', ''))
    }
    return dates.sort().reverse()
  }, [])

  return (
    <DataContext.Provider value={{
      estoqueData, saveEstoque, updateItem, deleteItem, renameItem, clearEstoque,
      applyContagem, aliases, auditLog, currentDate, setCurrentDate, getAvailableDates,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
