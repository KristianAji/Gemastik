import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { useState, useEffect } from 'react'

const NAVY = '#284B63'
const TEAL = '#3C6E71'
const BLUE = '#BFDBF7'

/* ── SVG Icons ───────────────────────────────────────────────── */
const Icons = {
  beranda: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  peta: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  ),
  kasus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  statistik: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
    </svg>
  ),
  laporan: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
}

/* ── Navigasi ─────────────────────────────────────────────────── */
const NAV = [
  { to: '/dinsos/beranda',    label: 'Beranda',       icon: Icons.beranda,   exact: true,  group: 'beranda'    },
  { to: '/dinsos/peta',       label: 'Peta Sebaran',  icon: Icons.peta,      exact: false, group: 'beranda'    },
  { to: '/dinsos/kasus',      label: 'Tindak Lanjut', icon: Icons.kasus,     badgeKey: 'kasus', group: 'penanganan' },
  { to: '/dinsos/statistik',  label: 'Statistik',     icon: Icons.statistik,               group: 'penanganan' },
  { to: '/dinsos/export',     label: 'Export CSV',    icon: Icons.laporan,                 group: 'penanganan' },
]

const MOBILE_NAV = [
  { to: '/dinsos/beranda',  icon: Icons.beranda,   label: 'Beranda'   },
  { to: '/dinsos/peta',     icon: Icons.peta,      label: 'Peta'      },
  { to: '/dinsos/kasus',    icon: Icons.kasus,     label: 'Kasus',    badgeKey: 'kasus' },
  { to: '/dinsos/statistik',icon: Icons.statistik, label: 'Statistik' },
  { to: '/dinsos/export',   icon: Icons.laporan,   label: 'Export'    },
]

export default function DinsosLayout() {
  const navigate   = useNavigate()
  const notifikasi = useStore(s => s.notifikasi)
  const penugasan  = useStore(s => s.penugasan ?? [])
  const setRole    = useStore(s => s.setRole)
  const user       = useStore(s => s.user)
  const logout     = useStore(s => s.logout)

  const [clock, setClock]     = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const unread     = notifikasi.filter(n => !n.read).length
  const kasusAktif = penugasan.filter(p => p.status === 'aktif').length

  useEffect(() => {
    setRole?.('dinsos')
    const t = setInterval(() => setClock(new Date().toTimeString().slice(0, 8)), 1000)
    setClock(new Date().toTimeString().slice(0, 8))
    return () => clearInterval(t)
  }, [])

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  const getBadge = (item) => {
    if (item.badgeKey === 'notif') return unread > 0 ? unread : null
    if (item.badgeKey === 'kasus') return kasusAktif > 0 ? kasusAktif : null
    return item.badge || null
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      width: '100%', overflowX: 'hidden',
      background: '#F4F7F9', fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        .dn-topbar {
          background: ${NAVY};
          height: 56px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px;
          flex-shrink: 0;
          position: sticky; top: 0; z-index: 200;
        }

        /* ── HAMBURGER ── */
        .dn-hamburger-btn {
          width: 36px; height: 36px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 5px;
          background: transparent;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
        }
        .dn-hamburger-line {
          width: 22px; height: 2px;
          background: #fff;
          transition: all 0.25s ease;
          border-radius: 2px;
        }
        .dn-hamburger-line.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .dn-hamburger-line.open:nth-child(2) { opacity: 0; }
        .dn-hamburger-line.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .dn-logo-group { display: flex; align-items: center; gap: 12px; }
        .dn-logo-img { width: 26px; height: 26px; object-fit: contain; flex-shrink: 0; }
        .dn-logo-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 800;
          letter-spacing: -0.03em; color: #fff;
          white-space: nowrap; line-height: 1.2;
        }
        .dn-logo-text span { color: ${BLUE}; }
        .dn-logo-sub {
          font-size: 9px; font-weight: 600;
          color: rgba(191,219,247,0.45);
          letter-spacing: 0.06em; text-transform: uppercase;
          margin-top: 1px;
        }

        /* ── MENU OVERLAY ── */
        .dn-menu-overlay {
          position: fixed;
          inset: 0;
          top: 56px;
          background: rgba(2,43,58,0.35);
          z-index: 400;
        }
        .dn-menu-panel {
          background: ${NAVY};
          width: 270px;
          max-width: 82vw;
          height: 100%;
          padding: 16px 12px;
          box-shadow: 4px 0 24px rgba(2,43,58,0.25);
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }
        .dn-menu-section-label {
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.4px; color: rgba(191,219,247,0.35);
          padding: 10px 12px 5px; white-space: nowrap;
        }
        .dn-menu-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 8px 4px; }
        .dn-menu-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 11px 12px; border-radius: 10px;
          font-size: 13.5px; font-weight: 500;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: rgba(191,219,247,0.7); text-decoration: none;
          gap: 10px;
          transition: background 0.15s, color 0.15s;
        }
        .dn-menu-link:hover { background: rgba(255,255,255,0.07); color: #fff; }
        .dn-menu-link.active {
          background: rgba(191,219,247,0.12); color: #fff; font-weight: 700;
          border-left: 3px solid ${BLUE};
          padding-left: 9px;
        }
        .dn-menu-link-icon { flex-shrink: 0; display: flex; align-items: center; }
        .dn-menu-link-label { flex: 1; }
        .dn-menu-badge {
          font-size: 10px; font-weight: 700;
          background: ${BLUE}; color: ${NAVY};
          padding: 2px 7px; border-radius: 99px; flex-shrink: 0; line-height: 1.4;
        }
        .dn-menu-user {
          display: flex; align-items: center; gap: 10px;
          padding: 12px; margin-bottom: 6px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 16px;
        }
        .dn-menu-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(191,219,247,0.2);
          border: 1.5px solid rgba(191,219,247,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: ${BLUE}; flex-shrink: 0;
        }
        .dn-menu-user-name { font-size: 13px; font-weight: 700; color: #fff; }
        .dn-menu-user-role { font-size: 10.5px; color: rgba(191,219,247,0.55); }
        .dn-menu-logout {
          margin-top: 10px; padding: 11px 12px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.7);
          font-size: 13px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; display: flex; align-items: center; gap: 10px;
          transition: all 0.18s;
        }
        .dn-menu-logout:hover { background: rgba(255,255,255,0.09); color: #fff; }

        /* ── TOPBAR RIGHT ── */
        .dn-topbar-right { display: flex; align-items: center; gap: 16px; }
        .dn-clock { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.55); font-variant-numeric: tabular-nums; }
        .dn-divider-v { width: 1px; height: 24px; background: rgba(255,255,255,0.12); flex-shrink: 0; }
        .dn-user-wrap { display: flex; align-items: center; gap: 10px; }
        .dn-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: rgba(191,219,247,0.2);
          border: 1.5px solid rgba(191,219,247,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: ${BLUE};
        }
        .dn-user-name  { font-size: 12px; font-weight: 600; color: #fff; line-height: 1.2; }
        .dn-user-role  { font-size: 10px; color: rgba(191,219,247,0.55); }
        .dn-logout-btn {
          padding: 6px 14px; border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.6);
          font-size: 12px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; display: flex; align-items: center; gap: 6px;
          transition: all 0.18s;
        }
        .dn-logout-btn:hover { background: rgba(255,255,255,0.12); color: #fff; border-color: rgba(255,255,255,0.25); }

        .dn-body { display: flex; flex: 1; min-height: 0; overflow: hidden; }

        .dn-main {
          flex: 1; min-width: 0; overflow-y: auto; overflow-x: hidden;
          background: #F4F7F9; display: flex; flex-direction: column;
          padding-bottom: 70px;
        }

        /* ── MOBILE NAV ── */
        .dn-mobile-nav {
          display: none; position: fixed; bottom: 0; left: 0; right: 0;
          z-index: 300; background: rgba(40,75,99,0.95);
          backdrop-filter: blur(16px);
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .dn-mobile-nav-items { display: flex; padding: 6px 0 env(safe-area-inset-bottom, 6px); }
        .dn-mobile-nav-item {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 3px;
          padding: 6px 4px; color: rgba(191,219,247,0.5);
          text-decoration: none; font-size: 10px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: color 0.15s; position: relative;
        }
        .dn-mobile-nav-item.active { color: ${BLUE}; }
        .dn-mobile-nav-badge {
          position: absolute; top: 4px; right: calc(50% - 16px);
          background: ${BLUE}; color: ${NAVY};
          font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 99px;
        }

        @media (max-width: 768px) {
          .dn-mobile-nav { display: block; }
          .dn-user-wrap, .dn-divider-v, .dn-clock { display: none !important; }
        }
      `}</style>

      {/* ── TOPBAR ── */}
      <header className="dn-topbar">
        <div className="dn-logo-group">
          <button
            className="dn-hamburger-btn"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Buka menu"
          >
            <span className={`dn-hamburger-line${menuOpen ? ' open' : ''}`} />
            <span className={`dn-hamburger-line${menuOpen ? ' open' : ''}`} />
            <span className={`dn-hamburger-line${menuOpen ? ' open' : ''}`} />
          </button>
          <img src={`${import.meta.env.BASE_URL}logowhite.png`} alt="Logo Delcion" className="dn-logo-img" />
          <div>
            <div className="dn-logo-text">Del<span>cion</span></div>
            <div className="dn-logo-sub">Dinsos</div>
          </div>
        </div>

        <div className="dn-topbar-right">
          <span className="dn-clock">{clock} WITA</span>
          <div className="dn-divider-v" />
          {user && (
            <div className="dn-user-wrap">
              <div className="dn-avatar">{user.avatar ?? '👤'}</div>
              <div>
                <div className="dn-user-name">{user.nama ?? 'Petugas Dinsos'}</div>
                <div className="dn-user-role">{user.jabatan ?? 'Dinas Sosial Manado'}</div>
              </div>
            </div>
          )}
          <button className="dn-logout-btn" onClick={handleLogout}>
            {Icons.logout} Keluar
          </button>
        </div>
      </header>

      {/* ── MENU OVERLAY (hamburger) ── */}
      {menuOpen && (
        <div className="dn-menu-overlay" onClick={() => setMenuOpen(false)}>
          <nav className="dn-menu-panel" onClick={e => e.stopPropagation()}>
            {user && (
              <div className="dn-menu-user">
                <div className="dn-menu-avatar">{user.avatar ?? '👤'}</div>
                <div>
                  <div className="dn-menu-user-name">{user.nama ?? 'Petugas Dinsos'}</div>
                  <div className="dn-menu-user-role">{user.jabatan ?? 'Dinas Sosial Manado'}</div>
                </div>
              </div>
            )}

            <div className="dn-menu-section-label">Menu Utama</div>
            {NAV.map(n => (
              <MenuItem key={n.to} {...n} badge={getBadge(n)} onNavigate={() => setMenuOpen(false)} />
            ))}

            <div style={{ flex: 1 }} />
            <button className="dn-menu-logout" onClick={handleLogout}>
              {Icons.logout} Keluar dari Akun
            </button>
          </nav>
        </div>
      )}

      {/* ── BODY ── */}
      <div className="dn-body">
        <main className="dn-main">
          <Outlet />
        </main>
      </div>

      {/* ── MOBILE NAV ── */}
      <nav className="dn-mobile-nav">
        <div className="dn-mobile-nav-items">
          {MOBILE_NAV.map(n => {
            const badge = n.badgeKey === 'notif'  ? (unread     > 0 ? unread     : null)
                        : n.badgeKey === 'kasus'  ? (kasusAktif > 0 ? kasusAktif : null)
                        : null
            return (
              <NavLink key={n.to} to={n.to} end={n.exact}
                className={({ isActive }) => `dn-mobile-nav-item${isActive ? ' active' : ''}`}>
                {badge && <span className="dn-mobile-nav-badge">{badge}</span>}
                <span>{n.icon}</span>
                <span>{n.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

/* ── MenuItem ─────────────────────────────────────────────────── */
function MenuItem({ to, label, icon, badge, exact, onNavigate }) {
  return (
    <NavLink to={to} end={exact}
      onClick={onNavigate}
      className={({ isActive }) => `dn-menu-link${isActive ? ' active' : ''}`}
    >
      <span className="dn-menu-link-icon">{icon}</span>
      <span className="dn-menu-link-label">{label}</span>
      {badge && <span className="dn-menu-badge">{badge}</span>}
    </NavLink>
  )
}