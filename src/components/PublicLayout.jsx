import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

// ── Lucide icons untuk mobile nav ────────────────────────
function IconHome({ active }) {
  const c = active ? '#1F7A8C' : '#8CA0B8'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}
function IconEdit({ active }) {
  const c = active ? '#1F7A8C' : '#8CA0B8'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}
function IconList({ active }) {
  const c = active ? '#1F7A8C' : '#8CA0B8'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  )
}
function IconMap({ active }) {
  const c = active ? '#1F7A8C' : '#8CA0B8'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  )
}
function IconInfo({ active }) {
  const c = active ? '#1F7A8C' : '#8CA0B8'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  )
}

const NAV = [
  { to: '/public',         label: 'Beranda',      exact: true },
  { to: '/public/laporan', label: 'Buat Laporan' },
  { to: '/public/riwayat', label: 'Riwayat' },
  { to: '/public/peta',    label: 'Peta Laporan' },
  { to: '/public/tentang', label: 'Tentang' },
]

const MOBILE_NAV = [
  { to: '/public',         label: 'Beranda',   exact: true, Icon: IconHome },
  { to: '/public/laporan', label: 'Laporkan',              Icon: IconEdit },
  { to: '/public/riwayat', label: 'Riwayat',               Icon: IconList },
  { to: '/public/peta',    label: 'Peta',                  Icon: IconMap  },
  { to: '/public/tentang', label: 'Tentang',               Icon: IconInfo },
]

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isBeranda = location.pathname === '/public' || location.pathname === '/public/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Reset scroll ke atas setiap pindah halaman
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        /* ── Reset paksa untuk halaman public ── */
        .public-shell,
        .public-shell * {
          box-sizing: border-box;
        }

        .public-shell {
          /* Override globals.css yang set background gelap */
          background: #E1E5F2 !important;
          color: #022B3A !important;
          font-family: 'Inter', sans-serif !important;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ── Navbar ── */
        .pub-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 500;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 32px;
          transition:
            background 0.35s ease,
            border-color 0.35s ease,
            box-shadow 0.35s ease,
            backdrop-filter 0.35s ease;
        }

        .pub-header.transparent {
          background: transparent;
          border-bottom: 1px solid transparent;
          box-shadow: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }

        .pub-header.glass {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(2, 43, 58, 0.08);
          box-shadow: 0 2px 24px rgba(2, 43, 58, 0.07);
        }

        /* ── Nav links ── */
        .pub-nav {
          display: flex;
          gap: 2px;
          align-items: center;
        }

        .pub-nav-link {
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        /* Saat transparan (di atas foto hero) */
        .pub-header.transparent .pub-nav-link {
          color: rgba(255, 255, 255, 0.80);
          background: transparent;
        }
        .pub-header.transparent .pub-nav-link:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.12);
        }
        .pub-header.transparent .pub-nav-link.active {
          color: #FFFFFF;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.18);
        }

        /* Saat glass (sudah scroll) */
        .pub-header.glass .pub-nav-link {
          color: rgba(2, 43, 58, 0.60);
          background: transparent;
        }
        .pub-header.glass .pub-nav-link:hover {
          color: #022B3A;
          background: rgba(2, 43, 58, 0.06);
        }
        .pub-header.glass .pub-nav-link.active {
          color: #022B3A;
          font-weight: 700;
          background: rgba(2, 43, 58, 0.08);
        }

        /* ── Konten utama ── */
        .pub-main {
          flex: 1;
          /* Beranda: tidak perlu padding-top karena hero fullscreen
             Halaman lain: perlu padding-top agar tidak tertutup navbar fixed */
        }

        .pub-main.with-padding {
          padding-top: 56px;
        }

        /* ── Mobile bottom nav ── */
        .pub-mobile-nav {
          display: none;
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 499;
          height: auto;
          padding-bottom: env(safe-area-inset-bottom, 0px);
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border-top: 1px solid rgba(2, 43, 58, 0.08);
          box-shadow: 0 -4px 20px rgba(2, 43, 58, 0.06);
        }

        .pub-mobile-nav-items {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 60px;
          padding: 0 8px;
        }

        .pub-mobile-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 6px 12px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          color: #8CA0B8;
          transition: color 0.15s, background 0.15s;
          flex: 1;
        }

        .pub-mobile-nav-item:hover {
          background: rgba(31, 122, 140, 0.06);
        }

        .pub-mobile-nav-item.active {
          color: #1F7A8C;
        }

        @media (max-width: 768px) {
          .pub-nav { display: none; }
          .pub-mobile-nav { display: block; }
          .pub-main {
            padding-bottom: calc(60px + env(safe-area-inset-bottom, 0px));
          }
        }
      `}</style>

      <div className="public-shell">

        {/* ── Navbar ── */}
        <header className={`pub-header ${scrolled ? 'glass' : 'transparent'}`}>
          <nav className="pub-nav">
            {NAV.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.exact}
                className={({ isActive }) =>
                  `pub-nav-link${isActive ? ' active' : ''}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </header>

        {/* ── Konten halaman ── */}
        <main className={`pub-main${isBeranda ? '' : ' with-padding'}`}>
          <Outlet />
        </main>

        {/* ── Mobile bottom nav ── */}
        <nav className="pub-mobile-nav">
          <div className="pub-mobile-nav-items">
            {MOBILE_NAV.map(({ to, label, exact, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `pub-mobile-nav-item${isActive ? ' active' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon active={isActive} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

      </div>
    </>
  )
}