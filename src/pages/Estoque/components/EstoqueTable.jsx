import { useState } from 'react'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { useData } from '../../../contexts/DataContext'

export default function EstoqueTable({ items, aliases, setupMode, onDelete }) {
  const { user, isOwner } = useAuth()
  const { updateItem, renameItem } = useData()
  const [editAlias, setEditAlias] = useState(null)
  const [editCell, setEditCell]   = useState(null)

  const startRename = (item) => setEditAlias({ id: item.id, value: aliases[item.id] ?? item.name })
  const confirmRename = () => {
    if (editAlias) renameItem(editAlias.id, editAlias.value, user.displayName)
    setEditAlias(null)
  }

  const startEdit = (item, field) => setEditCell({ id: item.id, field, value: item[field] ?? 0 })
  const confirmEdit = () => {
    if (editCell) updateItem(editCell.id, editCell.field, Number(editCell.value), user.displayName)
    setEditCell(null)
  }

  const editableFields = ['estoqueInicial', 'entradas', 'saidas']

  const colSpan = setupMode && isOwner ? 7 : 6

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-climax-dark-border text-xs text-gray-500 uppercase tracking-wider">
            <th className="text-left py-3 px-3 min-w-[200px]">Item</th>
            <th className="text-center py-3 px-3 w-16">UN</th>
            <th className="text-right py-3 px-3 w-28">Est. Inicial</th>
            <th className="text-right py-3 px-3 w-28">Entradas</th>
            <th className="text-right py-3 px-3 w-28">Saídas</th>
            <th className="text-right py-3 px-3 w-28">Est. Final</th>
            {setupMode && isOwner && <th className="text-center py-3 px-3 w-20">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {items.reduce((acc, item, idx) => {
            const prev = items[idx - 1]
            if (item.grupo && item.grupo !== prev?.grupo) {
              acc.push(
                <tr key={`grupo_${item.grupo}`}>
                  <td colSpan={colSpan} className="pt-4 pb-1 px-3">
                    <span className="text-[10px] font-bold tracking-widest text-climax-gold uppercase">{item.grupo}</span>
                  </td>
                </tr>
              )
            }

            const estoqueInicial = item.estoqueInicial ?? 0
            const entradas       = item.entradas ?? 0
            const saidas         = item.saidas ?? 0
            const estoqueFinal   = estoqueInicial + entradas - saidas
            const displayName    = aliases[item.id] ?? item.name

            acc.push(
              <tr key={item.id} className="border-b border-climax-dark-border/40 hover:bg-white/[0.02] group">
                {/* Nome */}
                <td className="py-2.5 px-3">
                  {editAlias?.id === item.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        autoFocus
                        value={editAlias.value}
                        onChange={e => setEditAlias(a => ({ ...a, value: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter') confirmRename(); if (e.key === 'Escape') setEditAlias(null) }}
                        className="bg-climax-dark border border-climax-gold rounded px-2 py-0.5 text-xs text-white w-40 focus:outline-none"
                      />
                      <button onClick={confirmRename} className="text-green-400 hover:text-green-300"><Check size={14} /></button>
                      <button onClick={() => setEditAlias(null)} className="text-gray-500 hover:text-gray-300"><X size={14} /></button>
                    </div>
                  ) : (
                    <span className="text-white font-medium">{displayName}</span>
                  )}
                </td>

                {/* Unidade */}
                <td className="py-2.5 px-3 text-center text-xs text-gray-500">{item.unidade ?? '—'}</td>

                {/* Est. Inicial, Entradas, Saídas — editáveis pelo owner */}
                {editableFields.map(field => {
                  const val = field === 'estoqueInicial' ? estoqueInicial
                            : field === 'entradas'       ? entradas
                            : saidas
                  return (
                    <td key={field} className="py-2.5 px-3 text-right">
                      {editCell?.id === item.id && editCell.field === field ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            autoFocus type="number"
                            value={editCell.value}
                            onChange={e => setEditCell(c => ({ ...c, value: e.target.value }))}
                            onKeyDown={e => { if (e.key === 'Enter') confirmEdit(); if (e.key === 'Escape') setEditCell(null) }}
                            className="bg-climax-dark border border-climax-gold rounded px-2 py-0.5 text-xs w-20 text-right focus:outline-none"
                          />
                          <button onClick={confirmEdit} className="text-green-400"><Check size={12} /></button>
                          <button onClick={() => setEditCell(null)} className="text-gray-500"><X size={12} /></button>
                        </div>
                      ) : (
                        <span
                          className={`text-gray-300 ${isOwner ? 'cursor-pointer hover:text-climax-gold' : ''}`}
                          onClick={() => isOwner && startEdit(item, field)}
                        >
                          {val}
                        </span>
                      )}
                    </td>
                  )
                })}

                {/* Est. Final — calculado */}
                <td className="py-2.5 px-3 text-right">
                  <span className={`font-semibold ${estoqueFinal < 0 ? 'text-red-400' : 'text-climax-gold'}`}>
                    {estoqueFinal}
                  </span>
                </td>

                {/* Setup actions */}
                {setupMode && isOwner && (
                  <td className="py-2.5 px-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => startRename(item)}
                        className="p-1 rounded text-gray-500 hover:text-climax-gold hover:bg-climax-gold/10 transition-colors"
                        title="Renomear"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id, displayName)}
                        className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            )
            return acc
          }, [])}
        </tbody>
      </table>
    </div>
  )
}
