import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const NAV = [
  { to:'/public',          label:'Beranda',        exact:true },
  { to:'/public/laporan',  label:'Buat Laporan' },
  { to:'/public/riwayat',  label:'Riwayat' },
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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#E1E5F2' }}>

      {/* ── Navbar ── */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
        // Liquid glass saat scroll, transparan saat di atas
        background: scrolled
          ? 'rgba(255, 255, 255, 0.18)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(255, 255, 255, 0.25)'
          : '1px solid transparent',
        boxShadow: scrolled
          ? '0 2px 20px rgba(2, 43, 58, 0.08)'
          : 'none',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
      }}>
        <nav style={{ display:'flex', gap:4, alignItems:'center' }}>
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.exact}
              style={({ isActive }) => ({
                padding: '7px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                fontFamily: "'Inter', sans-serif",
                // Teks putih saat di atas foto, navy saat glass
                color: isActive
                  ? (scrolled ? '#022B3A' : '#FFFFFF')
                  : (scrolled ? 'rgba(2,43,58,0.65)' : 'rgba(255,255,255,0.8)'),
                background: isActive
                  ? (scrolled ? 'rgba(2,43,58,0.08)' : 'rgba(255,255,255,0.15)')
                  : 'transparent',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
              })}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* ── Konten halaman ── */}
      {/* padding-top 0 karena hero di Beranda sudah fullscreen dan navbar fixed di atasnya.
          Halaman lain (Peta, Tentang, dll) perlu padding-top agar tidak tertutup navbar. */}
      <main style={{ flex:1, paddingBottom: 80 }}>
        <Outlet />
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="mobile-nav">
        <div className="mobile-nav-items">
          {MOBILE_NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.exact}
              className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
            >
              <span className="icon">{n.icon}</span>
              <span>{n.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        /* Sembunyikan desktop nav di mobile */
        @media (max-width: 768px) {
          header nav { display: none !important; }
        }
      `}</style>
    </div>
  )
}