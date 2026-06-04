import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, ACCOUNTS } from '../store/useStore'

// ── Sub-komponen kecil ────────────────────────────────────

function FieldLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 7,
    }}>
      {children}
    </div>
  )
}

function FieldInput({ style, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      {...props}
      onFocus={e => { setFocused(true); props.onFocus?.(e) }}
      onBlur={e => { setFocused(false); props.onBlur?.(e) }}
      style={{
        width: '100%',
        background: 'rgba(255,255,255,0.06)',
        border: `1px solid ${focused ? 'rgba(232,64,28,0.55)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 10,
        padding: '12px 14px',
        color: '#e8eef8',
        fontSize: 14,
        fontFamily: 'inherit',
        outline: 'none',
        marginBottom: 16,
        transition: 'border-color 0.2s',
        ...style,
      }}
    />
  )
}

// ── Form Registrasi Masyarakat ────────────────────────────

function RegisterForm({ onBack, onSuccess }) {
  const [nama,  setNama]  = useState('')
  const [hp,    setHp]    = useState('')
  const [email, setEmail] = useState('')
  const [pass,  setPass]  = useState('')
  const [error, setError] = useState('')
  const [ok,    setOk]    = useState(false)

  const submit = () => {
    setError('')
    if (!nama || !hp || !email || !pass) return setError('Mohon lengkapi semua data.')
    if (pass.length < 8)                 return setError('Password minimal 8 karakter.')
    if (!/\S+@\S+\.\S+/.test(email))    return setError('Format email tidak valid.')

    // Di produksi: POST ke backend → simpan akun baru
    setOk(true)
    setTimeout(() => onSuccess(email), 1600)
  }

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, color: 'var(--text)' }}>
        Daftar Akun Masyarakat
      </div>

      {ok && (
        <div style={{
          background: 'rgba(46,204,113,0.1)', border: '1px solid rgba(46,204,113,0.25)',
          borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--green)',
          marginBottom: 14, textAlign: 'center',
        }}>
          ✓ Akun berhasil dibuat! Mengalihkan ke form login…
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(232,64,28,0.1)', border: '1px solid rgba(232,64,28,0.25)',
          borderRadius: 8, padding: '9px 12px', fontSize: 12, color: '#ff7a5a', marginBottom: 14,
        }}>
          {error}
        </div>
      )}

      <FieldLabel>Nama Lengkap</FieldLabel>
      <FieldInput value={nama}  onChange={e => setNama(e.target.value)}  placeholder="nama lengkap Anda" />

      <FieldLabel>No. HP / WhatsApp</FieldLabel>
      <FieldInput type="tel" value={hp} onChange={e => setHp(e.target.value)} placeholder="08xxxxxxxxxx" />

      <FieldLabel>Email</FieldLabel>
      <FieldInput type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@contoh.com" />

      <FieldLabel>Password</FieldLabel>
      <FieldInput
        type="password" value={pass} onChange={e => setPass(e.target.value)}
        placeholder="min. 8 karakter"
        onKeyDown={e => e.key === 'Enter' && submit()}
      />

      <button onClick={submit} style={{
        width: '100%', background: 'var(--accent)', color: '#fff', border: 'none',
        borderRadius: 11, padding: 13, fontSize: 14, fontWeight: 700,
        fontFamily: 'inherit', cursor: 'pointer',
      }}>
        Daftar Sekarang
      </button>

      <button onClick={onBack} style={{
        width: '100%', background: 'transparent', border: 'none',
        color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 10,
        cursor: 'pointer', fontFamily: 'inherit', padding: 6,
      }}>
        ← Kembali ke Login
      </button>
    </div>
  )
}

// ── Halaman Login Utama ───────────────────────────────────

export default function Login() {
  const navigate = useNavigate()
  const login    = useStore(s => s.login)

  const [email,    setEmail]    = useState('')
  const [pass,     setPass]     = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showReg,  setShowReg]  = useState(false)

  const handleLogin = () => {
    setError('')
    if (!email.trim()) return setError('Mohon masukkan email.')
    if (!pass)         return setError('Mohon masukkan password.')

    // Role ditentukan otomatis dari email — tidak perlu dipilih manual
    const akun = ACCOUNTS.find(
      a => a.email === email.trim().toLowerCase() && a.password === pass
    )

    if (!akun) {
      setError('Email atau password salah.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      login({
        id:      akun.id,
        email:   akun.email,
        nama:    akun.nama,
        jabatan: akun.jabatan,
        role:    akun.role,
        avatar:  akun.avatar,
      })
      navigate(akun.role === 'admin' ? '/admin' : '/public', { replace: true })
    }, 500)
  }

  const handleRegisterSuccess = (registeredEmail) => {
    setShowReg(false)
    setEmail(registeredEmail)
    setError('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#060f1c',
      padding: '32px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient blobs */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,64,28,0.06) 0%, transparent 70%)',
        top: -200, left: -120, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,143,232,0.05) 0%, transparent 70%)',
        bottom: -100, right: -80, pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{
        fontFamily: "'Poppins', sans-serif", fontSize: 34, fontWeight: 100,
        letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8,
        position: 'relative', zIndex: 1,
      }}>
        Del<span style={{ color: 'var(--accent)' }}>cion</span>
      </div>
      <div style={{
        fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em',
        textTransform: 'uppercase', marginBottom: 32, position: 'relative', zIndex: 1,
        textAlign: 'center',
      }}>
        PantauAnak Manado — Sistem Perlindungan Anak
      </div>

      {/* Card */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 20, padding: '28px 28px 24px',
        width: '100%', maxWidth: 400,
        position: 'relative', zIndex: 1,
      }}>
        {showReg ? (
          <RegisterForm
            onBack={() => setShowReg(false)}
            onSuccess={handleRegisterSuccess}
          />
        ) : (
          <>
            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(232,64,28,0.1)', border: '1px solid rgba(232,64,28,0.25)',
                borderRadius: 8, padding: '9px 12px', fontSize: 12,
                color: '#ff7a5a', marginBottom: 16,
              }}>
                ⚠ {error}
              </div>
            )}

            <FieldLabel>Email</FieldLabel>
            <FieldInput
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="masukkan email Anda"
              autoComplete="email"
            />

            <FieldLabel>Password</FieldLabel>
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <FieldInput
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="••••••••"
                style={{ marginBottom: 0, paddingRight: 44 }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
              <button
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.35)', fontSize: 14, padding: 4,
                }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Login button */}
            <button onClick={handleLogin} disabled={loading} style={{
              width: '100%', background: loading ? 'rgba(232,64,28,0.6)' : 'var(--accent)',
              color: '#fff', border: 'none', borderRadius: 11, padding: 13,
              fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                  Mengalihkan…
                </>
              ) : 'Masuk →'}
            </button>

            {/* Daftar */}
            <>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '20px 0' }} />
              <button onClick={() => setShowReg(true)} style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 11, padding: 12, fontSize: 13,
                fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                transition: 'background 0.2s',
              }}>
                Belum punya akun? Daftar Sekarang
              </button>
            </>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{
        fontSize: 11, color: 'rgba(255,255,255,0.2)',
        marginTop: 24, position: 'relative', zIndex: 1, textAlign: 'center',
      }}>
        © 2026 Delcion — Dinas Sosial Kota Manado
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}