import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronDown, ChevronUp, ExternalLink, Loader2, Inbox } from 'lucide-react'
import Header from '../../components/Header'
import { useEntradas } from '../../contexts/EntradasContext'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function MonthPicker({ value, onChange }) {
  return (
    <input
      type="month"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-climax-dark-card border border-climax-dark-border text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-climax-gold"
    />
  )
}

function EntradaCard({ entrada }) {
  const [open, setOpen] = useState(false)
  const { dadosExtraidos: d, drive, dataProcessamento, remetente } = entrada

  const dataFmt = dataProcessamento
    ? format(parseISO(dataProcessamento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
    : '—'

  const tipo       = d?.tipoDocumento || 'nota_fiscal'
  const isContagem = tipo === 'contagem_estoque'
  const titulo     = isContagem
    ? (d?.setor || 'Contagem de Estoque')
    : (d?.fornecedor || 'Fornecedor não identificado')
  const itens      = d?.itens || []
  const total      = d?.valorTotal

  return (
    <div className="card p-0 overflow-hidden">
      {/* Cabeçalho do card */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white">{titulo}</p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isContagem ? 'bg-blue-900/60 text-blue-300' : 'bg-yellow-900/60 text-yellow-300'}`}>
                {isContagem ? 'Estoque' : 'NF'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{dataFmt} · {remetente}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {total != null && (
            <span className="text-sm font-bold text-climax-gold">
              R$ {Number(total).toFixed(2).replace('.', ',')}
            </span>
          )}
          <span className="text-xs text-gray-500">{itens.length} itens</span>
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {/* Itens expandidos */}
      {open && (
        <div className="border-t border-climax-dark-border">
          {/* Metadados */}
          <div className="flex gap-4 px-4 py-2 bg-black/20 text-xs text-gray-500">
            {!isContagem && d?.numeroDocumento && <span>NF: {d.numeroDocumento}</span>}
            {d?.dataDocumento   && <span>Data: {d.dataDocumento}</span>}
            {isContagem && d?.responsavel && <span>Resp: {d.responsavel}</span>}
            {drive?.webViewLink && (
              <a
                href={drive.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-climax-gold hover:underline"
              >
                <ExternalLink size={11} /> Ver imagem
              </a>
            )}
          </div>

          {/* Tabela de itens */}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-climax-dark-border">
                <th className="text-left px-4 py-2 font-medium">Descrição</th>
                <th className="text-center px-2 py-2 font-medium">UN</th>
                <th className="text-right px-2 py-2 font-medium">Qtd</th>
                {isContagem
                  ? <th className="text-left px-4 py-2 font-medium">Obs.</th>
                  : <>
                      <th className="text-right px-4 py-2 font-medium">Vl. Unit.</th>
                      <th className="text-right px-4 py-2 font-medium">Total</th>
                    </>
                }
              </tr>
            </thead>
            <tbody>
              {itens.map((item, i) => (
                <tr key={i} className="border-b border-climax-dark-border/50 hover:bg-white/5">
                  <td className="px-4 py-2 text-white">{item.descricao}</td>
                  <td className="px-2 py-2 text-center text-gray-400">{item.unidade || '—'}</td>
                  <td className="px-2 py-2 text-right text-gray-300">{item.quantidade}</td>
                  {isContagem
                    ? <td className="px-4 py-2 text-gray-500 text-xs">{item.observacao || ''}</td>
                    : <>
                        <td className="px-4 py-2 text-right text-gray-400">
                          {item.valorUnitario != null ? `R$ ${Number(item.valorUnitario).toFixed(2).replace('.', ',')}` : '—'}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-300">
                          {item.valorTotal != null ? `R$ ${Number(item.valorTotal).toFixed(2).replace('.', ',')}` : '—'}
                        </td>
                      </>
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function Entradas() {
  const navigate = useNavigate()
  const { entradas, loading, mes, setMes } = useEntradas()

  const totalGeral = entradas.reduce((acc, e) => acc + (e.dadosExtraidos?.valorTotal || 0), 0)

  return (
    <div className="min-h-screen bg-climax-dark">
      <Header />
      <main className="pt-14 max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-climax-gold mb-6 transition-colors"
        >
          <ChevronLeft size={16} /> Home
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Entradas</h2>
            <p className="text-xs text-gray-500 mt-1">Notas e compras recebidas via WhatsApp</p>
          </div>
          <div className="flex items-center gap-3">
            {totalGeral > 0 && (
              <span className="text-sm font-bold text-climax-gold">
                Total: R$ {totalGeral.toFixed(2).replace('.', ',')}
              </span>
            )}
            <MonthPicker value={mes} onChange={setMes} />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 size={28} className="animate-spin text-climax-gold" />
          </div>
        )}

        {!loading && entradas.length === 0 && (
          <div className="card flex flex-col items-center justify-center py-24 text-gray-600">
            <Inbox size={48} className="mb-4 opacity-30" />
            <p className="text-sm font-medium">Nenhuma entrada em {mes}.</p>
            <p className="text-xs mt-1">Envie uma foto de nota fiscal para o WhatsApp do sistema.</p>
          </div>
        )}

        {!loading && entradas.length > 0 && (
          <div className="flex flex-col gap-3">
            {entradas.map(e => <EntradaCard key={e.id} entrada={e} />)}
          </div>
        )}
      </main>
    </div>
  )
}
