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
      background: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
    }}>
      {/* Logo canto superior esquerdo */}
      <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem' }}>
        <img
          src="/logo.jpg"
          alt="Confeitaria Vilamore"
          style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '12px' }}
        />
      </div>

      <div style={{ width: '100%', maxWidth: '380px', padding: '0 1.5rem' }}>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block', fontSize: '11px', letterSpacing: '0.15em',
              textTransform: 'uppercase', color: '#6b7280', marginBottom: '0.5rem',
            }}>
              Usuário
            </label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="PEDROIGOR"
              required autoFocus
              style={{
                width: '100%', background: '#f9fafb',
                border: '1px solid #d1d5db', borderRadius: '10px',
                padding: '10px 14px', fontSize: '14px', color: '#111',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block', fontSize: '11px', letterSpacing: '0.15em',
              textTransform: 'uppercase', color: '#6b7280', marginBottom: '0.5rem',
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
                  width: '100%', background: '#f9fafb',
                  border: '1px solid #d1d5db', borderRadius: '10px',
                  padding: '10px 40px 10px 14px', fontSize: '14px', color: '#111',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button
                type="button" onClick={() => setShowPw(v => !v)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#9ca3af', padding: 0, display: 'flex',
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              fontSize: '13px', color: '#b91c1c', background: '#fef2f2',
              border: '1px solid #fecaca', borderRadius: '8px',
              padding: '10px 12px', marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}

          <button
            type="button" disabled={loading} onClick={handleSubmit}
            style={{
              width: '100%',
              background: loading ? '#f87171' : 'linear-gradient(135deg, #C0392B, #E74C3C)',
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
                  fontSize: '12px', color: '#9ca3af',
                  textDecoration: 'underline', padding: 0,
                }}
              >
                Esqueci minha senha
              </button>
            ) : (
              <div style={{
                marginTop: '0.25rem', padding: '12px',
                background: '#fef9f0',
                border: '1px solid #fcd34d',
                borderRadius: '10px', fontSize: '12px',
                color: '#92400e', lineHeight: '1.6',
              }}>
                <p style={{ margin: '0 0 0.6rem' }}>
                  Um e-mail será enviado ao administrador solicitando sua nova senha.
                </p>
                <button
                  type="button"
                  onClick={handleRecovery}
                  style={{
                    background: '#C0392B', border: 'none',
                    borderRadius: '8px', padding: '6px 16px',
                    fontSize: '12px', color: '#fff',
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
                    fontSize: '12px', color: '#9ca3af',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#d1d5db', marginTop: '1.5rem' }}>
          &copy; {new Date().getFullYear()} Vilamore &mdash; Uso interno
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #9ca3af; }
        input:focus { border-color: #C0392B !important; }
      `}</style>
    </div>
  )
}
