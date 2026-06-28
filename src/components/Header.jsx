import { useAuth } from '../contexts/AuthContext'
import { LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      backdropFilter: 'blur(12px)',
      background: 'rgba(50, 5, 5, 0.92)',
      borderBottom: '1px solid rgba(255,150,100,0.15)',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 1rem',
        height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', color: '#E8B89A', textTransform: 'uppercase' }}>
          Vilamore Gerencial
        </span>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#aaa' }}>
              <User size={14} />
              <span>{user.displayName}</span>
              {user.role === 'proprietario' && (
                <span style={{
                  padding: '2px 6px', fontSize: '10px', fontWeight: 700,
                  borderRadius: '4px', background: '#C0392B', color: '#fff', letterSpacing: '0.1em',
                }}>
                  ADMIN
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '12px', color: '#666', background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              <LogOut size={14} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
