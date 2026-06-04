import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useEffect } from 'react'

const NAV = [
  { to:'/public',          label:'Beranda',      exact:true },
  { to:'/public/laporan',  label:'Buat Laporan' },
  { to:'/public/riwayat',  label:'Riwayat Saya' },
  { to:'/public/peta',     label:'Peta Laporan' },
  { to:'/public/tentang',  label:'Tentang' },
]

const MOBILE_NAV = [
  { to:'/public',         icon:'🏠', label:'Beranda', exact:true },
  { to:'/public/laporan', icon:'📝', label:'Laporkan' },
  { to:'/public/riwayat', icon:'📋', label:'Riwayat' },
  { to:'/public/peta',    icon:'🗺️', label:'Peta' },
  { to:'/public/tentang', icon:'ℹ️', label:'Tentang' },
]

export default function PublicLayout() {
  const navigate = useNavigate()
  const setRole  = useStore(s => s.setRole)
  const user     = useStore(s => s.user)
  const logout   = useStore(s => s.logout)

  useEffect(() => { setRole('public') }, [])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'var(--bg)' }}>
      {/* Header */}
      <header style={{
        background:'var(--surface)', borderBottom:'1px solid var(--border)',
        padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'sticky', top:0, zIndex:100,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>

          {/* Logo */}
          <div style={{
            fontFamily:"'Poppins', sans-serif",
            fontSize:22,
            fontWeight:100,
            letterSpacing:'-0.04em',
            lineHeight:1,
            color:'var(--text)'
          }}>
            Del<span style={{ color:'var(--accent)' }}>cion</span>
          </div>

          <nav style={{ display:'flex', gap:2 }} className="pub-desktop-nav">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.exact}
                style={({ isActive }) => ({
                  padding:'6px 14px', borderRadius:8,
                  fontSize:13,
                  fontWeight: isActive ? 600 : 500,
                  fontFamily:'Inter, sans-serif',
                  color: isActive ? 'var(--text)' : 'var(--text-muted)',
                  background: isActive ? 'var(--surface2)' : 'transparent',
                  transition:'all 0.18s ease',
                })}>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Kanan: Info user + Keluar */}
        <div style={{
          display:'flex',
          alignItems:'center',
          gap:12
        }}>

          {/* Info user yang login (desktop) */}
          {user && (
            <div style={{
              display:'flex',
              alignItems:'center',
              gap:8
            }} className="pub-desktop-nav">
              <div style={{
                width:30,
                height:30,
                borderRadius:'50%',
                background:'rgba(232,64,28,0.12)',
                border:'1px solid rgba(232,64,28,0.25)',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                fontSize:14
              }}>
                {user.avatar}
              </div>
              <div style={{
                fontSize:12,
                fontWeight:600,
                color:'var(--text-muted)'
              }}>
                {user.nama}
              </div>
            </div>
          )}

          {/* Tombol Keluar */}
          <button
            onClick={handleLogout}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(232,64,28,0.1)'
              e.currentTarget.style.color = '#ff7a5a'
              e.currentTarget.style.borderColor = 'rgba(232,64,28,0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
            style={{
              padding:'7px 14px',
              borderRadius:8,
              border:'1px solid rgba(255,255,255,0.1)',
              background:'rgba(255,255,255,0.04)',
              color:'rgba(255,255,255,0.4)',
              fontSize:12,
              fontWeight:600,
              fontFamily:'inherit',
              cursor:'pointer',
              transition:'all 0.2s'
            }}>
            Keluar
          </button>
        </div>
      </header>

      <main style={{ flex:1, paddingBottom:80 }}>
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        <div className="mobile-nav-items">
          {MOBILE_NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.exact}
              className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
              <span className="icon">{n.icon}</span>
              <span>{n.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) { .pub-desktop-nav { display: none !important; } }
      `}</style>
    </div>
  )
}