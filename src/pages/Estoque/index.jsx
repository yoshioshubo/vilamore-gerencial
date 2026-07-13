import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, CalendarDays, PlusCircle, Settings } from 'lucide-react'
import Header from '../../components/Header'
import EstoqueTable from './components/EstoqueTable'
import LogTab from './components/LogTab'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { CATALOGO_COZINHA, GRUPOS_CATALOGO } from '../../data/catalogoCozinha'
import { db } from '../../lib/firebase'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { matchCatalogItem } from '../../utils/matchCatalogItem'

const LAST_CONTAGEM_KEY = 'vilamore_last_contagem_id'
const TABS = ['Controle', 'LOG']

export default function Estoque() {
  const navigate = useNavigate()
  const { user, isOwner } = useAuth()
  const { estoqueData, saveEstoque, updateItem, deleteItem, aliases, currentDate, setCurrentDate, getAvailableDates, applyContagem } = useData()

  const [tab, setTab]             = useState('Controle')
  const [setupMode, setSetupMode] = useState(false)
  const [rawItems, setRawItems]   = useState(null)
  const [grupoFiltro, setGrupoFiltro] = useState('TODOS')

  // Auto-load kitchen catalog if no data for today
  useEffect(() => {
    if (!estoqueData && user) {
      saveEstoque(
        {
          items: CATALOGO_COZINHA.map(p => ({ ...p, estoqueInicial: 0, entradas: 0, saidas: 0 })),
          importedAt: new Date().toISOString(),
        },
        user.displayName
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // WhatsApp contagem listener
  useEffect(() => {
    if (!user || !db) return
    const now = new Date()
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const ref = collection(db, 'processamentos', 'vilamore', yearMonth)
    const q = query(ref, orderBy('criadoEm', 'desc'), limit(5))

    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      const ultimaContagem = docs.find(d => d.dadosExtraidos?.tipoDocumento === 'contagem_estoque')
      if (!ultimaContagem) return
      const lastApplied = localStorage.getItem(LAST_CONTAGEM_KEY)
      if (lastApplied === ultimaContagem.id) return
      const matches = []
      for (const item of ultimaContagem.dadosExtraidos.itens || []) {
        const found = matchCatalogItem(item.descricao, CATALOGO_COZINHA)
        if (found) matches.push({ itemId: found.id, quantidade: item.quantidade })
      }
      if (matches.length > 0) applyContagem(matches, 'WhatsApp Bot', `contagem ${ultimaContagem.id}`)
      localStorage.setItem(LAST_CONTAGEM_KEY, ultimaContagem.id)
    }, () => {})

    return () => unsub()
  }, [user, applyContagem])

  const handleNovoDia = () => {
    const today = new Date().toISOString().slice(0, 10)
    const prevItems = estoqueData?.items ?? []
    // Carry forward: estoque final do dia anterior vira estoque inicial do novo dia
    const newItems = prevItems.map(it => ({
      ...it,
      estoqueInicial: (it.estoqueInicial ?? 0) + (it.entradas ?? 0) - (it.saidas ?? 0),
      entradas: 0,
      saidas: 0,
    }))
    saveEstoque(
      { items: newItems, importedAt: new Date().toISOString() },
      user.displayName
    )
    setCurrentDate(today)
  }

  const handleDeleteItem = (itemId, displayName) => {
    if (setupMode) {
      setRawItems(prev => prev ? prev.filter(it => it.id !== itemId) : prev)
    } else {
      deleteItem(itemId, displayName, user.displayName)
    }
  }

  const iniciarControle = () => {
    if (!rawItems) return
    saveEstoque(
      { items: rawItems, importedAt: new Date().toISOString() },
      user.displayName
    )
    setRawItems(null)
    setSetupMode(false)
  }

  const handleEntrarSetup = () => {
    setRawItems(estoqueData?.items ?? [])
    setSetupMode(true)
  }

  const allItems = setupMode ? rawItems : estoqueData?.items
  const items = grupoFiltro === 'TODOS'
    ? allItems
    : allItems?.filter(it => it.grupo === grupoFiltro)
  const hasData = !!allItems?.length
  const availableDates = getAvailableDates()

  return (
    <div className="min-h-screen bg-climax-dark">
      <Header />

      <main className="pt-14 max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-climax-gold mb-6 transition-colors"
        >
          <ChevronLeft size={16} /> Home
        </button>

        {/* Título + controles de data */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Controle de Estoque</h2>
            <p className="text-xs text-gray-500 mt-1">
              {estoqueData?.importedAt
                ? `Atualizado: ${new Date(estoqueData.importedAt).toLocaleString('pt-BR')}`
                : 'Cozinha Vilamore'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Seletor de data */}
            {availableDates.length > 1 && (
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <CalendarDays size={15} />
                <select
                  value={currentDate}
                  onChange={e => setCurrentDate(e.target.value)}
                  className="bg-climax-dark-border text-white text-sm rounded-lg px-3 py-1.5 border border-climax-dark-border focus:outline-none focus:border-climax-gold"
                >
                  {availableDates.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Novo Dia */}
            {isOwner && hasData && !setupMode && (
              <button
                onClick={handleNovoDia}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-climax-gold text-climax-dark font-bold hover:bg-climax-gold-light transition-colors"
              >
                <PlusCircle size={16} /> Novo Dia
              </button>
            )}

            {/* Setup */}
            {isOwner && hasData && !setupMode && (
              <button
                onClick={handleEntrarSetup}
                className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                title="Configurar itens"
              >
                <Settings size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Filtro por grupo */}
        {hasData && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {['TODOS', ...GRUPOS_CATALOGO].map(g => (
              <button
                key={g}
                onClick={() => setGrupoFiltro(g)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  grupoFiltro === g
                    ? 'bg-climax-gold text-climax-dark'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {/* Setup mode banner */}
        {setupMode && (
          <div className="mb-6 p-4 rounded-xl bg-climax-gold/10 border border-climax-gold/30 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-climax-gold">Modo Configuração</p>
              <p className="text-xs text-gray-400 mt-0.5">Renomeie ou exclua itens. Use os ícones na coluna "Ações".</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setRawItems(null); setSetupMode(false) }}
                className="text-sm px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={iniciarControle}
                className="flex items-center gap-2 bg-climax-gold text-climax-dark font-bold text-sm px-5 py-2 rounded-lg hover:bg-climax-gold-light transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {!hasData && (
          <div className="card flex flex-col items-center justify-center py-24 text-gray-600">
            <p className="text-sm font-medium">Carregando catálogo...</p>
          </div>
        )}

        {/* Tabela */}
        {hasData && (
          <div className="card p-0 overflow-hidden">
            <div className="flex border-b border-climax-dark-border px-4 pt-2">
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`mr-6 pb-3 text-sm font-medium transition-colors ${tab === t ? 'tab-active' : 'tab-inactive'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="p-4">
              {tab === 'Controle' && (
                <EstoqueTable
                  items={items}
                  aliases={aliases}
                  setupMode={setupMode}
                  onDelete={handleDeleteItem}
                />
              )}
              {tab === 'LOG' && <LogTab />}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
