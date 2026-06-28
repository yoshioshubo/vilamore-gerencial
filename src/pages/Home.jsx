import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, TrendingUp, Landmark, BarChart2, LayoutDashboard, ArrowLeftRight, Lock } from 'lucide-react'
import Header from '../components/Header'

const BG = 'linear-gradient(160deg, #3D0000 0%, #6B1010 40%, #8B2020 100%)'

const MODULES = [
  { id: 'estoque',   label: 'CONTROLE DE ESTOQUE',    icon: Package,          active: true,  path: '/estoque', gradient: ['#C0392B','#E74C3C'], description: 'Ingestao · Auditoria · LOG' },
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
      <main style={{ paddingTop: '56px', maxWidth: '768px', margin: '0 auto', padding: '56px 1rem 2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
          <img
            src="/logo.jpg"
            alt="Confeitaria Vilamore"
            style={{ width: '160px', height: '160px', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
          />
          <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: '1rem' }}>
            Sistema de Gestao Integrada
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {MODULES.map(mod => (
            <ModuleButton key={mod.id} mod={mod} onClick={navigate} />
          ))}
        </div>
      </main>
    </div>
  )
}
