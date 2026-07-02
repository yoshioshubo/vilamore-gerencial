import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'

const RECOVERY_EMAIL = 'ygshubo@gmail.com'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]         = useState({ username: '', password: '' })
  const [error, setError]       = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [showRecovery, setShowRecovery] = useState(false)

  const handleRecovery = () => {
    const subject = encodeURIComponent('Recuperação de Senha — Vilamore Gerencial')
    const body = encodeURIComponent(
      `Olá,\n\nEsqueci minha senha de acesso ao sistema Vilamore Gerencial.\n\nUsuário: ${form.username || '(informar)'}\n\nPor favor, enviar nova senha.\n\nObrigado.`
    )
    window.location.href = `mailto:${RECOVERY_EMAIL}?subject=${subject}&body=${body}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const result = login(form.username.trim(), form.password)
    setLoading(false)
    if (!result.ok) { setError(result.error); return }
    navigate('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(160deg, #3D0000 0%, #6B1010 40%, #8B2020 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '0 1.5rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/logo.jpg"
            alt="Confeitaria Vilamore"
            style={{ width: '160px', height: '160px', objectFit: 'contain', borderRadius: '16px' }}
          />
        </div>

        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,200,150,0.4), transparent)',
          marginBottom: '2rem',
        }} />

        <div style={{
          background: 'rgba(60, 10, 10, 0.85)',
          border: '1px solid rgba(255,180,120,0.2)',
          borderRadius: '16px',
          padding: '2rem',
        }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block', fontSize: '11px', letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'rgba(255,200,150,0.7)', marginBottom: '0.5rem',
            }}>
              Usuario
            </label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="PEDROIGOR"
              required autoFocus
              style={{
                width: '100%', background: 'rgba(20,0,0,0.6)',
                border: '1px solid rgba(255,180,120,0.25)', borderRadius: '10px',
                padding: '10px 14px', fontSize: '14px', color: '#fff',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block', fontSize: '11px', letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'rgba(255,200,150,0.7)', marginBottom: '0.5rem',
            }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', background: 'rgba(20,0,0,0.6)',
                  border: '1px solid rgba(255,180,120,0.25)', borderRadius: '10px',
                  padding: '10px 40px 10px 14px', fontSize: '14px', color: '#fff',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button
                type="button" onClick={() => setShowPw(v => !v)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,200,150,0.5)', padding: 0, display: 'flex',
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              fontSize: '13px', color: '#fca5a5', background: 'rgba(180,0,0,0.3)',
              border: '1px solid rgba(220,50,50,0.4)', borderRadius: '8px',
              padding: '10px 12px', marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}

          <button
            type="button" disabled={loading} onClick={handleSubmit}
            style={{
              width: '100%',
              background: loading ? 'rgba(180,100,50,0.5)' : 'linear-gradient(135deg, #C0392B, #E74C3C)',
              border: 'none', borderRadius: '10px', padding: '12px',
              fontSize: '14px', fontWeight: '600', color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', letterSpacing: '0.05em',
            }}
          >
            {loading
              ? <span style={{
                  width: '16px', height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff',
                  borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block',
                }} />
              : <LogIn size={16} />
            }
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {/* Esqueci minha senha */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            {!showRecovery ? (
              <button
                type="button"
                onClick={() => setShowRecovery(true)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '12px', color: 'rgba(255,200,150,0.55)',
                  textDecoration: 'underline', padding: 0,
                }}
              >
                Esqueci minha senha
              </button>
            ) : (
              <div style={{
                marginTop: '0.25rem', padding: '12px',
                background: 'rgba(255,180,120,0.08)',
                border: '1px solid rgba(255,180,120,0.2)',
                borderRadius: '10px', fontSize: '12px',
                color: 'rgba(255,200,150,0.8)', lineHeight: '1.6',
              }}>
                <p style={{ margin: '0 0 0.6rem' }}>
                  Um e-mail será enviado para o administrador solicitando sua nova senha.
                </p>
                <button
                  type="button"
                  onClick={handleRecovery}
                  style={{
                    background: 'rgba(255,180,120,0.15)',
                    border: '1px solid rgba(255,180,120,0.35)',
                    borderRadius: '8px', padding: '6px 16px',
                    fontSize: '12px', color: 'rgba(255,220,160,0.9)',
                    cursor: 'pointer', marginRight: '8px',
                  }}
                >
                  Enviar solicitação
                </button>
                <button
                  type="button"
                  onClick={() => setShowRecovery(false)}
                  style={{
                    background: 'none', border: 'none',
                    fontSize: '12px', color: 'rgba(255,200,150,0.4)',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,200,150,0.3)', marginTop: '1.5rem' }}>
          &copy; {new Date().getFullYear()} Vilamore &mdash; Uso interno
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:focus { border-color: rgba(255,180,120,0.6) !important; }
      `}</style>
    </div>
  )
}
