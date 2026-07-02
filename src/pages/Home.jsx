import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, TrendingUp, Landmark, BarChart2, LayoutDashboard, ArrowLeftRight, Lock, ShoppingCart } from 'lucide-react'
import Header from '../components/Header'

const BG = '#ffffff'

const MODULES = [
  { id: 'estoque',   label: 'CONTROLE DE ESTOQUE',    icon: Package,          active: true,  path: '/estoque',   gradient: ['#C0392B','#E74C3C'], description: 'Ingestao · Auditoria · LOG' },
  { id: 'entradas',  label: 'ENTRADAS / COMPRAS',     icon: ShoppingCart,     active: true,  path: '/entradas',  gradient: ['#1a5a3a','#27ae60'], description: 'Notas · WhatsApp · Histórico' },
  { id: 'vendas',    label: 'OTIMIZACAO DE VENDAS',    icon: TrendingUp,       active: false, gradient: ['#1a6b3a','#27ae60'] },
  { id: 'bancaria',  label: 'CONCILIACAO BANCARIA',    icon: Landmark,         active: false, gradient: ['#1a4a8a','#2980b9'] },
  { id: 'dre',       label: 'DRE GERENCIAL',           icon: BarChart2,        active: false, gradient: ['#5b2d8a','#8e44ad'] },
  { id: 'dashboard', label: 'DASHBOARD GERENCIAL',     icon: LayoutDashboard,  active: false, gradient: ['#b36200','#e67e22'] },
  { id: 'movimento', label: 'CONTROLE DE MOVIMENTO',   icon: ArrowLeftRight,   active: false, gradient: ['#8a1a3a','#c0392b'] },
]

function ModuleButton({ mod, onClick }) {
  const [pressed, setPressed] = useState(false)
  const Icon = mod.icon
  const grad = `linear-gradient(135deg, ${mod.gradient[0]}, ${mod.gradient[1]})`

  if (!mod.active) {
    return (
      <div style={{ position: 'relative', cursor: 'not-allowed', userSelect: 'none' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '8px', padding: '16px', borderRadius: '12px', height: '128px',
          background: grad, opacity: 0.6, border: '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '6px',
            display: 'flex',
          }}>
            <Lock size={22} color="#fff" />
          </div>
          <Icon size={22} color="#fff" />
          <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', color: '#fff', textAlign: 'center', lineHeight: 1.3, textTransform: 'uppercase' }}>
            {mod.label}
          </span>
          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>Em breve</span>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => { setPressed(true); setTimeout(() => { setPressed(false); onClick(mod.path) }, 250) }}
      style={{
        width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '8px', padding: '16px', borderRadius: '12px', height: '128px',
        background: grad, border: '1px solid rgba(255,200,150,0.3)',
        boxShadow: pressed ? '0 2px 8px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.4)',
        transform: pressed ? 'scale(0.96)' : 'scale(1)',
        transition: 'all 0.2s ease', cursor: 'pointer', position: 'relative', overflow: 'hidden',
      }}
    >
      <Icon size={26} color="#fff" />
      <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', color: '#fff', textAlign: 'center', lineHeight: 1.3, textTransform: 'uppercase' }}>
        {mod.label}
      </span>
      <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)' }}>{mod.description}</span>
    </button>
  )
}

export default function Home() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <Header />
      {/* Logo canto superior esquerdo */}
      <div style={{ position: 'fixed', top: '72px', left: '1.5rem' }}>
        <img
          src="/logo.jpg"
          alt="Confeitaria Vilamore"
          style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}
        />
      </div>

      <main style={{ height: 'calc(100vh - 56px)', marginTop: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Texto no topo, alinhado com a logo */}
        <p style={{ fontSize: '16.5px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#555555', margin: '28px 0 0' }}>
          Sistema de Gestao Integrada
        </p>
        {/* Botões centralizados no espaço restante */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', width: '100%', maxWidth: '768px', padding: '0 1rem' }}>
            {MODULES.map(mod => (
              <ModuleButton key={mod.id} mod={mod} onClick={navigate} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
