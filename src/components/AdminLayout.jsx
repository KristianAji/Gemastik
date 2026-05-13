import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useState, useEffect } from 'react'

const NAV = [
  { to:'/admin',           label:'🏠 Beranda',         exact:true },
  { to:'/admin/cctv',      label:'📹 CCTV Live',       badge:'4' },
  { to:'/admin/peta',      label:'🗺️ Peta Sebaran' },
  { to:'/admin/notifikasi',label:'🔔 Notifikasi',      badgeKey:'notif' },
  { to:'/admin/laporan',   label:'📋 Semua Laporan' },
  { to:'/admin/statistik', label:'📊 Statistik' },
]

const MOBILE_NAV = [
  { to:'/admin',            icon:'🏠', label:'Beranda', exact:true },
  { to:'/admin/cctv',       icon:'📹', label:'CCTV' },
  { to:'/admin/notifikasi', icon:'🔔', label:'Notif',   badgeKey:'notif' },
  { to:'/admin/laporan',    icon:'📋', label:'Laporan' },
  { to:'/admin/peta',       icon:'🗺️', label:'Peta' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const notifikasi = useStore(s => s.notifikasi)
  const setRole = useStore(s => s.setRole)
  const [clock, setClock] = useState('')

  const unread = notifikasi.filter(n => !n.read).length

  useEffect(() => {
    setRole('admin')

    const t = setInterval(() => {
      setClock(new Date().toTimeString().slice(0,8))
    }, 1000)

    setClock(new Date().toTimeString().slice(0,8))

    return () => clearInterval(t)
  }, [])

  const getBadge = (item) => {
    if (item.badgeKey === 'notif') return unread > 0 ? unread : null
    return item.badge || null
  }

  return (
    <div style={{
      display:'flex',
      flexDirection:'column',
      minHeight:'100vh',
      width:'100%',
      overflowX:'hidden',
      background:'var(--bg)',

      fontFamily:'Inter, sans-serif'
    }}>

      {/* Topbar */}
      <header style={{
        background:'var(--surface)',
        borderBottom:'1px solid var(--border)',

        padding:'0 24px',
        height:62,

        display:'flex',
        alignItems:'center',
        justifyContent:'space-between',

        flexShrink:0,
        zIndex:100,

        backdropFilter:'blur(12px)'
      }}>

        <div style={{
          display:'flex',
          alignItems:'center',
          gap:20
        }}>

          {/* Logo */}
          <div style={{
            fontFamily:"'Poppins', sans-serif",
            fontSize:24,
            fontWeight:100,
            letterSpacing:'-0.04em',
            lineHeight:1,
            color:'var(--text)'
          }}>
            Del<span style={{ color:'var(--accent)' }}>cion</span>
          </div>

          {/* Role switch */}
          <div style={{
            display:'flex',
            gap:4,
            background:'var(--surface2)',
            borderRadius:12,
            padding:'4px',
            border:'1px solid var(--border)'
          }}>

            <button
              onClick={() => navigate('/admin')}
              style={{
                padding:'6px 15px',
                borderRadius:8,
                border:'none',

                background:'var(--accent)',
                color:'#fff',

                fontSize:12,
                fontWeight:600,
                fontFamily:'Inter, sans-serif',

                transition:'0.2s ease'
              }}>
              🛡️ Admin
            </button>

            <button
              onClick={() => navigate('/public')}
              style={{
                padding:'6px 15px',
                borderRadius:8,
                border:'none',

                background:'transparent',
                color:'var(--text-muted)',

                fontSize:12,
                fontWeight:600,
                fontFamily:'Inter, sans-serif',

                transition:'0.2s ease'
              }}>
              👥 Masyarakat
            </button>
          </div>
        </div>

        {/* Right section */}
        <div style={{
          display:'flex',
          alignItems:'center',
          gap:18
        }}>

          <div style={{
            display:'flex',
            alignItems:'center',
            gap:6,

            fontSize:12,
            color:'var(--green)',
            fontWeight:600,

            fontFamily:'Rubik, sans-serif'
          }}>
            <span className="live-dot" />
            LIVE
          </div>

          <span style={{
            fontSize:12,
            color:'var(--text-dim)',
            fontFamily:'Rubik, sans-serif',
            fontWeight:500
          }}>
            {clock} WITA
          </span>

          <span style={{
            fontSize:12,
            color:'var(--text-dim)',
            fontWeight:500,
            fontFamily:'Inter, sans-serif'
          }}>
            Kota Manado
          </span>
        </div>
      </header>

      {/* Layout body */}
      <div style={{
        display:'flex',
        flex:1,
        minHeight:0,
        width:'100%',
        overflow:'hidden'
      }}>

        {/* Sidebar */}
        <aside
          className="admin-sidebar"
          style={{
            width:'var(--sidebar-w)',
            minWidth:'var(--sidebar-w)',

            background:'linear-gradient(180deg, var(--surface) 0%, #102846 100%)',
            borderRight:'1px solid var(--border)',

            padding:'18px 10px',

            display:'flex',
            flexDirection:'column',
            gap:4,

            overflowY:'auto',
            flexShrink:0,
          }}
        >

          <SideLabel>Beranda</SideLabel>
          {NAV.slice(0,1).map(n => (
            <SideItem key={n.to} {...n} badge={getBadge(n)} />
          ))}

          <div style={{
            height:1,
            background:'var(--border)',
            margin:'8px 4px'
          }} />

          <SideLabel>Monitoring</SideLabel>
          {NAV.slice(1,4).map(n => (
            <SideItem key={n.to} {...n} badge={getBadge(n)} />
          ))}

          <div style={{
            height:1,
            background:'var(--border)',
            margin:'8px 4px'
          }} />

          <SideLabel>Laporan</SideLabel>
          {NAV.slice(4,5).map(n => (
            <SideItem key={n.to} {...n} badge={getBadge(n)} />
          ))}

          <div style={{
            height:1,
            background:'var(--border)',
            margin:'8px 4px'
          }} />

          <SideLabel>Analitik</SideLabel>
          {NAV.slice(5).map(n => (
            <SideItem key={n.to} {...n} badge={getBadge(n)} />
          ))}
        </aside>

        {/* Main */}
        <main style={{
          flex:1,
          minWidth:0,

          overflowY:'auto',
          overflowX:'hidden',

          display:'flex',
          flexDirection:'column',

          paddingBottom:'70px',

          background:'var(--bg)'
        }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        <div className="mobile-nav-items">

          {MOBILE_NAV.map(n => {
            const badge =
              n.badgeKey === 'notif'
                ? (unread > 0 ? unread : null)
                : null

            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.exact}
                className={({ isActive }) =>
                  `mobile-nav-item${isActive ? ' active' : ''}`
                }
              >
                {badge && (
                  <span className="mobile-nav-badge">
                    {badge}
                  </span>
                )}

                <span className="icon">{n.icon}</span>
                <span>{n.label}</span>
              </NavLink>
            )
          })}

        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

function SideLabel({ children }) {
  return (
    <div style={{
      fontSize:10,
      fontWeight:600,

      textTransform:'uppercase',
      letterSpacing:'1.2px',

      color:'var(--text-dim)',

      padding:'6px 10px',
      marginTop:8,

      fontFamily:'Rubik, sans-serif'
    }}>
      {children}
    </div>
  )
}

function SideItem({ to, label, badge, exact }) {
  return (
    <NavLink
      to={to}
      end={exact}
      style={({ isActive }) => ({
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between',

        padding:'11px 12px',
        borderRadius:12,

        fontSize:13,
        fontWeight:isActive ? 600 : 500,

        fontFamily:'Inter, sans-serif',
        lineHeight:1.4,

        color:isActive ? 'var(--text)' : 'var(--text-muted)',

        background:isActive
          ? 'var(--surface2)'
          : 'transparent',

        borderLeft:isActive
          ? '3px solid var(--accent)'
          : '3px solid transparent',

        boxShadow:isActive
          ? '0 4px 14px rgba(0,0,0,0.18)'
          : 'none',

        transition:'all 0.18s ease'
      })}
    >

      <span style={{
        display:'flex',
        alignItems:'center',
        gap:8
      }}>
        {label}
      </span>

      {badge && (
        <span style={{
          fontSize:10,
          fontWeight:700,

          background:label.includes('Notif')
            ? 'var(--accent)'
            : 'rgba(255,255,255,0.12)',

          color:'#fff',

          padding:'3px 8px',
          borderRadius:99,

          fontFamily:'Inter, sans-serif',

          minWidth:18,
          textAlign:'center'
        }}>
          {badge}
        </span>
      )}
    </NavLink>
  )
}