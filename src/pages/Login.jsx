import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, ACCOUNTS } from '../store/useStore'

// ── Palette ──────────────────────────────────────────────
// #F4F7F9  background utama
// #FFFFFF  surface / card
// #284B63  navy primary
// #3C6E71  teal accent
// #353535  text utama
// #6B7C8D  text muted
// #D9D9D9  border
// ─────────────────────────────────────────────────────────

// ── Ikon SVG (pengganti emoji) ────────────────────────────
function IconEye({ size = 18, color = '#6B7C8D' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function IconEyeOff({ size = 18, color = '#6B7C8D' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

// ── Animated background blobs ─────────────────────────────
function AnimatedBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', background:
'linear-gradient(180deg, #284B63 0%, #315874 18%, #4F7691 40%, #82A3BD 65%, #D8E5EF 88%, #FFFFFF 100%)' }}>
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(40px, -30px) scale(1.05); }
          66%       { transform: translate(-20px, 20px) scale(0.97); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(-50px, 30px) scale(1.08); }
          66%       { transform: translate(30px, -20px) scale(0.95); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(20px, 40px) scale(1.04); }
        }
      `}</style>

      {/* Blob 1 — navy biru di kiri atas */}
      <div style={{
        position: 'absolute',
        width: 700, height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,.20) 0%, transparent 72%)',
        top: -200, left: -150,
        animation: 'float1 12s ease-in-out infinite',
      }} />

      {/* Blob 2 — teal di kanan bawah */}
      <div style={{
        position: 'absolute',
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(191,219,247,.28) 0%, transparent 72%)',
        bottom: -180, right: -100,
        animation: 'float2 15s ease-in-out infinite',
      }} />

      {/* Blob 3 — aksen biru muda di tengah kanan */}
      <div style={{
        position: 'absolute',
        width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,.24) 0%, transparent 70%)',
        top: '40%', right: '10%',
        animation: 'float3 10s ease-in-out infinite',
      }} />

      {/* Blob 4 — kecil di kiri bawah */}
      <div style={{
        position: 'absolute',
        width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(191,219,247,.20) 0%, transparent 70%)',
        bottom: '15%', left: '5%',
        animation: 'float1 18s ease-in-out infinite reverse',
      }} />
    </div>
  )
}

// ── GlowBox: wrapper dengan efek hover glow + timbul ──────
function GlowBox({
  children,
  style,
  animated = false,
  accentColor = '#3C6E71'
}) {

  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => animated && setHovered(true)}
      onMouseLeave={() => animated && setHovered(false)}
      style={{
        background:'rgba(255,255,255,.48)',        
        backdropFilter: 'blur(35px) saturate(180%)',
        WebkitBackdropFilter: 'blur(35px) saturate(180%)',

        border: animated
          ? `1px solid ${
              hovered
                ? accentColor + '55'
                : 'rgba(217,217,217,0.6)'
            }`
          : '1px solid rgba(255,255,255,.55)',

        borderRadius: 16,

        boxShadow: animated
          ? hovered
            ? `0 8px 32px rgba(40,75,99,.13),
               0 0 0 1px ${accentColor}33`
            : '0 2px 16px rgba(40,75,99,.07)'
          : '0 2px 16px rgba(40,75,99,.07)',

        transform:
          animated && hovered
            ? 'translateY(-2px)'
            : 'translateY(0)',

        transition:
          animated
            ? 'all .25s cubic-bezier(.22,1,.36,1)'
            : 'none',

        ...style,
      }}
    >
      {children}
    </div>
  )
}
// ── Input field ───────────────────────────────────────────
function FieldInput({
  label,
  style,
  rightElement,
  ...props
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <div style={{
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: '#6B7C8D', marginBottom: 7,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          {label}
        </div>
      )}
      <div style={{ position: 'relative' }}>
  <input
    {...props}
    onFocus={e => {
      setFocused(true)
      props.onFocus?.(e)
    }}
    onBlur={e => {
      setFocused(false)
      props.onBlur?.(e)
    }}
    style={{
      width: '100%',
      background: focused
        ? 'rgba(255,255,255,.75)'
        : 'rgba(255,255,255,.22)',

      border: `1.5px solid ${
        focused
          ? '#BFDBF7'
          : 'rgba(255,255,255,.25)'
      }`,

      borderRadius: 10,

      padding: rightElement
        ? '11px 44px 11px 14px'
        : '11px 14px',

      color: '#284B63',

      fontSize: 14,

      fontFamily: "'Plus Jakarta Sans', sans-serif",

      outline: 'none',

      transition: 'all .2s ease',

      boxShadow: focused
        ? '0 0 0 3px rgba(191,219,247,.30)'
        : 'none',

      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',

      boxSizing: 'border-box',

      ...style,
    }}
  />

  {rightElement && (
    <div
      style={{
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: 'translateY(-50%)'
      }}
    >
      {rightElement}
    </div>
  )}
</div>
    </div>
  )
}

// ── Form Registrasi ───────────────────────────────────────
function RegisterForm({ onBack, onSuccess }) {
  const registerAkun = useStore(s => s.registerAkun)
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

    const sudahAda = ACCOUNTS.find(a => a.email === email.trim().toLowerCase())
    if (sudahAda) return setError('Email sudah terdaftar.')

    registerAkun({ nama, email, password: pass })
    setOk(true)
    setTimeout(() => onSuccess(email), 1600)
  }

  return (
    <div>
      <div style={{
        fontSize: 15, fontWeight: 700, marginBottom: 20,
        color: '#284B63', fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        Daftar Akun
      </div>

      {ok && (
        <div style={{
          background: 'rgba(60,110,113,0.08)', border: '1px solid rgba(60,110,113,0.25)',
          borderRadius: 8, padding: '10px 14px', fontSize: 12,
          color: '#3C6E71', marginBottom: 14, textAlign: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          Akun berhasil dibuat! Mengalihkan ke login…
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(40,75,99,0.06)', border: '1px solid rgba(40,75,99,0.2)',
          borderRadius: 8, padding: '9px 12px', fontSize: 12,
          color: '#284B63', marginBottom: 14,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          {error}
        </div>
      )}

      <FieldInput label="Nama Lengkap"      value={nama}  onChange={e => setNama(e.target.value)}  placeholder="Nama lengkap Anda" />
      <FieldInput label="No. HP / WhatsApp" type="tel"    value={hp}    onChange={e => setHp(e.target.value)}    placeholder="08xxxxxxxxxx" />
      <FieldInput label="Email"             type="email"  value={email} onChange={e => setEmail(e.target.value)} placeholder="email@contoh.com" />
      <FieldInput label="Password"          type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="min. 8 karakter" />

      <GlowButton onClick={submit} style={{ marginBottom: 8 }}>Daftar Sekarang</GlowButton>

      <button
        onClick={onBack}
        style={{
          width: '100%', border: 'none', background: 'transparent',
          cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 13, fontWeight: 600, color: 'rgba(40,75,99,0.7)',
          padding: '8px 0', marginTop: 4, transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#284B63'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(40,75,99,0.7)'}
      >
        ← Kembali ke Login
      </button>
    </div>
  )
}

// ── Tombol utama dengan glow ──────────────────────────────
function GlowButton({ children, onClick, disabled, style }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        background: disabled
        ? 'rgba(255,255,255,.20)'
        : hovered
        ? 'rgba(255,255,255,.35)'
        : 'rgba(255,255,255,.25)',
        color: '#284B63',
        border:'1px solid rgba(255,255,255,.45)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderRadius: 11,
        padding: '13px 0',
        fontSize: 14,
        fontWeight: 700,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        cursor: disabled ? 'not-allowed' : 'pointer',
        transform: hovered && !disabled ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow:hovered
        ?`
        0 10px 30px rgba(0,0,0,.12),
        inset 0 1px 0 rgba(255,255,255,.35)
        `
        :`
        0 4px 14px rgba(0,0,0,.08),
        inset 0 1px 0 rgba(255,255,255,.25)
        `
      }}
    >
      {children}
    </button>
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
navigate(
  akun.role === 'admin'  ? '/admin' :
  akun.role === 'dinsos' ? '/dinsos' :
  akun.role === 'satpol' ? '/satpolpp' :
  '/public',
  { replace: true }
)
    }, 500)
  }

  const handleRegisterSuccess = (registeredEmail) => {
    setShowReg(false)
    setEmail(registeredEmail)
    setError('')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input::placeholder {color: rgba(40,75,99,.55); }
      `}</style>

      <AnimatedBackground />

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        position: 'relative',
        zIndex: 1,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>

        {/* Logo & tagline */}
<div style={{ textAlign: 'center', marginBottom: 28 }}>
  <div
  style={{
    fontSize: 38,
    fontWeight: 800,
    letterSpacing: '-0.03em',
    lineHeight: 1,
    marginBottom: 8,

    textShadow:
      '0 2px 12px rgba(0,0,0,.35), 0 0 18px rgba(191,219,247,.25)'
  }}
>
    <span style={{ color: '#FFFFFF' }}>Del</span>
    <span style={{ color: '#BFDBF7' }}>cion</span>
  </div>

  <div
    style={{
      fontSize: 12,
      color: 'rgba(255,255,255,.92)',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      fontWeight: 500,
    }}
  >
    Sistem Pemantauan Pekerja di Bawah Umur
  </div>
</div> 
        {/* Card utama */}
        <GlowBox style={{ width: '100%', maxWidth: 400, padding: '28px 28px 24px' }}>
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
                  background: 'rgba(40,75,99,0.06)',
                  border: '1px solid rgba(40,75,99,0.18)',
                  borderRadius: 8, padding: '9px 12px',
                  fontSize: 12, color: '#284B63', marginBottom: 16,
                }}>
                  {error}
                </div>
              )}

              <FieldInput
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                autoComplete="email"
              />

              <FieldInput
    label="Password"
    type={showPass ? "text" : "password"}
    value={pass}
    onChange={e => setPass(e.target.value)}
    placeholder="Masukkan password Anda"
    onKeyDown={e => e.key === "Enter" && handleLogin()}
    autoComplete="current-password"

    rightElement={
        <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                opacity: .65,
                transition: '.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = .65}
        >
            {showPass
                ? <IconEyeOff size={17} color="#6B7C8D" />
                : <IconEye size={17} color="#6B7C8D" />
            }
        </button>
    }
/>

              <GlowButton onClick={handleLogin} disabled={loading}>
                {loading ? 'Mengalihkan…' : 'Masuk'}
              </GlowButton>

              <div style={{ height: 1, background: '#D9D9D9', margin: '20px 0' }} />

              {/* Tombol daftar */}
              <GlowBox
                animated={true}
                accentColor="#284B63"
                style={{ padding: 0 }}
              >
                
                <button
                  onClick={() => setShowReg(true)}
                  style={{
                    width: '100%',
                    background:'rgba(255,255,255,.12)',
                    border:'1px solid rgba(255,255,255,.25)',
                    borderRadius: 16,
                    padding: '12px 0',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#284B63',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    cursor: 'pointer',
                  }}
                >
                  Daftar Akun untuk Satpol PP dan Dinas Sosial
                </button>
              </GlowBox>
            </>
          )}
        </GlowBox>

      </div>
    </>
  )
}