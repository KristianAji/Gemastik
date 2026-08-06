import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useState, useEffect } from 'react'

// ── SVG Icons (mengganti semua emoji) ─────────────────────────
const Icons = {
  beranda: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  cctv: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  peta: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  ),
  notif: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  laporan: (
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
  akun: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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

const NAV = [
  { to:'/admin',              label:'Beranda',       icon: Icons.beranda,    exact:true,  group:'beranda' },
  { to:'/admin/cctv',         label:'CCTV Live',     icon: Icons.cctv,       badge:'4',   group:'monitoring' },
  { to:'/admin/peta',         label:'Peta Sebaran',  icon: Icons.peta,                    group:'monitoring' },
  { to:'/admin/notifikasi',   label:'Notifikasi',    icon: Icons.notif,      badgeKey:'notif', group:'monitoring' },
  { to:'/admin/laporan',      label:'Semua Laporan', icon: Icons.laporan,                 group:'laporan' },
  { to:'/admin/statistik',    label:'Statistik',     icon: Icons.statistik,               group:'analitik' },
  { to:'/admin/kelola-akun',  label:'Kelola Akun',   icon: Icons.akun,                    group:'sistem' },
]

const MOBILE_NAV = [
  { to:'/admin',            icon: Icons.beranda,  label:'Beranda',  exact:true },
  { to:'/admin/cctv',       icon: Icons.cctv,     label:'CCTV' },
  { to:'/admin/notifikasi', icon: Icons.notif,    label:'Notif',    badgeKey:'notif' },
  { to:'/admin/laporan',    icon: Icons.laporan,  label:'Laporan' },
  { to:'/admin/peta',       icon: Icons.peta,     label:'Peta' },
]

export default function AdminLayout() {
  const navigate   = useNavigate()
  const notifikasi = useStore(s => s.notifikasi)
  const setRole    = useStore(s => s.setRole)
  const user       = useStore(s => s.user)
  const logout     = useStore(s => s.logout)
  const [clock, setClock]       = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const unread = notifikasi.filter(n => !n.read).length

  useEffect(() => {
    setRole('admin')
    const t = setInterval(() => setClock(new Date().toTimeString().slice(0,8)), 1000)
    setClock(new Date().toTimeString().slice(0,8))
    return () => clearInterval(t)
  }, [])

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  const getBadge = (item) => {
    if (item.badgeKey === 'notif') return unread > 0 ? unread : null
    return item.badge || null
  }

  return (
    <div style={{
      display:'flex', flexDirection:'column', minHeight:'100vh',
      width:'100%', overflowX:'hidden',
      background:'#F4F7F9', fontFamily:"'Plus Jakarta Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        .al-topbar {
          background: #284B63;
          height: 56px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px;
          flex-shrink: 0;
          position: sticky; top: 0; z-index: 200;
        }

        /* ── HAMBURGER ── */
        .al-hamburger-btn {
          width: 36px; height: 36px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 5px;
          background: transparent;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
        }
        .al-hamburger-line {
          width: 22px; height: 2px;
          background: #fff;
          transition: all 0.25s ease;
          border-radius: 2px;
        }
        .al-hamburger-line.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .al-hamburger-line.open:nth-child(2) { opacity: 0; }
        .al-hamburger-line.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .al-logo-group { display: flex; align-items: center; gap: 12px; }
        .al-logo-img { width: 26px; height: 26px; object-fit: contain; flex-shrink: 0; }
        .al-logo-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 800;
          color: #fff; white-space: nowrap;
          line-height: 1.2;
        }
        .al-logo-text span { color: #BFDBF7; }
        .al-logo-sub {
          font-size: 9px; font-weight: 600;
          color: rgba(191,219,247,0.45);
          letter-spacing: 0.06em; text-transform: uppercase;
          margin-top: 1px;
        }

        /* ── MENU OVERLAY ── */
        .al-menu-overlay {
          position: fixed;
          inset: 0;
          top: 56px;
          background: rgba(2,43,58,0.35);
          z-index: 400;
        }
        .al-menu-panel {
          background: #284B63;
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
        .al-menu-section-label {
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.4px; color: rgba(191,219,247,0.35);
          padding: 10px 12px 5px; white-space: nowrap;
        }
        .al-menu-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 8px 4px; }
        .al-menu-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 11px 12px; border-radius: 10px;
          font-size: 13.5px; font-weight: 500;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: rgba(191,219,247,0.7); text-decoration: none;
          gap: 10px;
          transition: background 0.15s, color 0.15s;
        }
        .al-menu-link:hover { background: rgba(255,255,255,0.07); color: #fff; }
        .al-menu-link.active {
          background: rgba(191,219,247,0.12); color: #fff; font-weight: 700;
          border-left: 3px solid #BFDBF7;
          padding-left: 9px;
        }
        .al-menu-link-icon { flex-shrink: 0; display: flex; align-items: center; }
        .al-menu-link-label { flex: 1; }
        .al-menu-badge {
          font-size: 10px; font-weight: 700;
          background: #BFDBF7; color: #284B63;
          padding: 2px 7px; border-radius: 99px; flex-shrink: 0; line-height: 1.4;
        }
        .al-menu-user {
          display: flex; align-items: center; gap: 10px;
          padding: 12px; margin-bottom: 6px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 16px;
        }
        .al-menu-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(191,219,247,0.2);
          border: 1.5px solid rgba(191,219,247,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: #BFDBF7; flex-shrink: 0;
        }
        .al-menu-user-name { font-size: 13px; font-weight: 700; color: #fff; }
        .al-menu-user-role { font-size: 10.5px; color: rgba(191,219,247,0.55); }
        .al-menu-logout {
          margin-top: 10px; padding: 11px 12px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.7);
          font-size: 13px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; display: flex; align-items: center; gap: 10px;
          transition: all 0.18s;
        }
        .al-menu-logout:hover { background: rgba(255,255,255,0.09); color: #fff; }

        /* ── TOPBAR RIGHT ── */
        .al-topbar-right { display: flex; align-items: center; gap: 16px; }
        .al-clock { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.55); }
        .al-divider-v { width: 1px; height: 24px; background: rgba(255,255,255,0.12); }
        .al-user-wrap { display: flex; align-items: center; gap: 10px; }
        .al-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: rgba(191,219,247,0.2);
          border: 1.5px solid rgba(191,219,247,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: #BFDBF7;
        }
        .al-user-name { font-size: 12px; font-weight: 600; color: #fff; line-height: 1.2; }
        .al-user-role { font-size: 10px; color: rgba(191,219,247,0.55); }
        .al-logout-btn {
          padding: 6px 14px; border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.6);
          font-size: 12px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; display: flex; align-items: center; gap: 6px;
          transition: all 0.18s;
        }
        .al-logout-btn:hover { background: rgba(255,255,255,0.12); color: #fff; border-color: rgba(255,255,255,0.25); }

        .al-body { display: flex; flex: 1; min-height: 0; overflow: hidden; }

        .al-main {
          flex: 1; min-width: 0; overflow-y: auto; overflow-x: hidden;
          background: #F4F7F9; display: flex; flex-direction: column;
          padding-bottom: 70px;
        }

        .mobile-nav {
          display: none; position: fixed; bottom: 0; left: 0; right: 0;
          z-index: 300; background: rgba(40,75,99,0.95);
          backdrop-filter: blur(16px);
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .mobile-nav-items { display: flex; padding: 6px 0 env(safe-area-inset-bottom, 6px); }
        .mobile-nav-item {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 3px;
          padding: 6px 4px; color: rgba(191,219,247,0.5); text-decoration: none;
          font-size: 10px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: color 0.15s; position: relative;
        }
        .mobile-nav-item.active { color: #BFDBF7; }
        .mobile-nav-badge {
          position: absolute; top: 4px; right: calc(50% - 16px);
          background: #BFDBF7; color: #284B63;
          font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 99px;
        }

        @media (max-width: 768px) {
          .mobile-nav { display: block; }
          .al-user-wrap, .al-divider-v, .al-clock { display: none !important; }
        }
      `}</style>

      {/* ── TOPBAR ── */}
      <header className="al-topbar">
        <div className="al-logo-group">
          <button
            className="al-hamburger-btn"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Buka menu"
          >
            <span className={`al-hamburger-line${menuOpen ? ' open' : ''}`} />
            <span className={`al-hamburger-line${menuOpen ? ' open' : ''}`} />
            <span className={`al-hamburger-line${menuOpen ? ' open' : ''}`} />
          </button>
          <img src={`${import.meta.env.BASE_URL}logowhite.png`} alt="Logo Delcion" className="al-logo-img" />
          <div>
            <div className="al-logo-text">Del<span>cion</span></div>
            <div className="al-logo-sub">DP3A</div>
          </div>
        </div>

        <div className="al-topbar-right">
          <span className="al-clock">{clock} WITA</span>
          <div className="al-divider-v" />
          {user && (
            <div className="al-user-wrap">
              <div className="al-avatar">{user.avatar}</div>
              <div>
                <div className="al-user-name">{user.nama}</div>
                <div className="al-user-role">{user.jabatan}</div>
              </div>
            </div>
          )}
          <button className="al-logout-btn" onClick={handleLogout}>
            {Icons.logout} Keluar
          </button>
        </div>
      </header>

      {/* ── MENU OVERLAY (hamburger) ── */}
      {menuOpen && (
        <div className="al-menu-overlay" onClick={() => setMenuOpen(false)}>
          <nav className="al-menu-panel" onClick={e => e.stopPropagation()}>
            {user && (
              <div className="al-menu-user">
                <div className="al-menu-avatar">{user.avatar}</div>
                <div>
                  <div className="al-menu-user-name">{user.nama}</div>
                  <div className="al-menu-user-role">{user.jabatan}</div>
                </div>
              </div>
            )}

            <div className="al-menu-section-label">Beranda</div>
            {NAV.filter(n => n.group === 'beranda').map(n => (
              <MenuItem key={n.to} {...n} badge={getBadge(n)} onNavigate={() => setMenuOpen(false)} />
            ))}

            <div className="al-menu-divider" />
            <div className="al-menu-section-label">Monitoring</div>
            {NAV.filter(n => n.group === 'monitoring').map(n => (
              <MenuItem key={n.to} {...n} badge={getBadge(n)} onNavigate={() => setMenuOpen(false)} />
            ))}

            <div className="al-menu-divider" />
            <div className="al-menu-section-label">Laporan</div>
            {NAV.filter(n => n.group === 'laporan').map(n => (
              <MenuItem key={n.to} {...n} badge={getBadge(n)} onNavigate={() => setMenuOpen(false)} />
            ))}

            <div className="al-menu-divider" />
            <div className="al-menu-section-label">Analitik</div>
            {NAV.filter(n => n.group === 'analitik').map(n => (
              <MenuItem key={n.to} {...n} badge={getBadge(n)} onNavigate={() => setMenuOpen(false)} />
            ))}

            <div className="al-menu-divider" />
            <div className="al-menu-section-label">Sistem</div>
            {NAV.filter(n => n.group === 'sistem').map(n => (
              <MenuItem key={n.to} {...n} badge={getBadge(n)} onNavigate={() => setMenuOpen(false)} />
            ))}

            <div style={{ flex: 1 }} />
            <button className="al-menu-logout" onClick={handleLogout}>
              {Icons.logout} Keluar dari Akun
            </button>
          </nav>
        </div>
      )}

      {/* ── BODY ── */}
      <div className="al-body">
        <main className="al-main">
          <Outlet />
        </main>
      </div>

      {/* ── MOBILE NAV ── */}
      <nav className="mobile-nav">
        <div className="mobile-nav-items">
          {MOBILE_NAV.map(n => {
            const badge = n.badgeKey === 'notif' ? (unread > 0 ? unread : null) : null
            return (
              <NavLink key={n.to} to={n.to} end={n.exact}
                className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
                {badge && <span className="mobile-nav-badge">{badge}</span>}
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

function MenuItem({ to, label, icon, badge, exact, onNavigate }) {
  return (
    <NavLink to={to} end={exact}
      onClick={onNavigate}
      className={({ isActive }) => `al-menu-link${isActive ? ' active' : ''}`}
    >
      <span className="al-menu-link-icon">{icon}</span>
      <span className="al-menu-link-label">{label}</span>
      {badge && <span className="al-menu-badge">{badge}</span>}
    </NavLink>
  )
}