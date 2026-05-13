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
]

export default function PublicLayout() {
  const navigate = useNavigate()
  const setRole  = useStore(s => s.setRole)
  useEffect(() => { setRole('public') }, [])

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'var(--bg)' }}>
      {/* Header */}
      <header style={{
        background:'var(--surface)', borderBottom:'1px solid var(--border)',
        padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'sticky', top:0, zIndex:100,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>

          {/* Logo — sama persis dengan AdminLayout */}
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

        {/* Role switch — sama dengan AdminLayout */}
        <div style={{
          display:'flex', gap:4,
          background:'var(--surface2)',
          borderRadius:12, padding:'4px',
          border:'1px solid var(--border)'
        }}>
          <button
            onClick={() => navigate('/public')}
            style={{
              padding:'6px 15px', borderRadius:8, border:'none',
              background:'var(--accent)', color:'#fff',
              fontSize:12, fontWeight:600, fontFamily:'Inter, sans-serif',
              transition:'0.2s ease'
            }}>
            👥 Masyarakat
          </button>
          <button
            onClick={() => navigate('/admin')}
            style={{
              padding:'6px 15px', borderRadius:8, border:'none',
              background:'transparent', color:'var(--text-muted)',
              fontSize:12, fontWeight:600, fontFamily:'Inter, sans-serif',
              transition:'0.2s ease'
            }}>
            🛡️ Admin
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