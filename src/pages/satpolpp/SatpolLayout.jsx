import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { useState, useEffect } from 'react'

const NAVY = '#284B63'
const TEAL = '#3C6E71'
const BLUE = '#BFDBF7'

const Icons = {
  beranda: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  tugas: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  input: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  riwayat: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  shield: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
}

const NAV = [
  { to: '/satpolpp',          label: 'Beranda',         icon: Icons.beranda, exact: true, group: 'utama' },
  { to: '/satpolpp/tugas',    label: 'Penugasan Aktif', icon: Icons.tugas,   badgeKey: 'tugas', group: 'kerja' },
  { to: '/satpolpp/input',    label: 'Input Lapangan',  icon: Icons.input,   group: 'kerja' },
  { to: '/satpolpp/riwayat',  label: 'Riwayat',         icon: Icons.riwayat, group: 'kerja' },
]

const MOBILE_NAV = [
  { to: '/satpolpp',         icon: Icons.beranda, label: 'Beranda',  exact: true },
  { to: '/satpolpp/tugas',   icon: Icons.tugas,   label: 'Tugas',    badgeKey: 'tugas' },
  { to: '/satpolpp/input',   icon: Icons.input,   label: 'Input' },
  { to: '/satpolpp/riwayat', icon: Icons.riwayat, label: 'Riwayat' },
]

export default function SatpolLayout() {
  const navigate   = useNavigate()
  const user       = useStore(s => s.user)
  const logout     = useStore(s => s.logout)
  const penugasan  = useStore(s => s.penugasan ?? [])
  const setRole    = useStore(s => s.setRole)
  const [clock, setClock]       = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const tugasAktif = penugasan.filter(p => p.status === 'aktif').length

  useEffect(() => {
    setRole?.('satpolpp')
    const t = setInterval(() => setClock(new Date().toTimeString().slice(0, 8)), 1000)
    setClock(new Date().toTimeString().slice(0, 8))
    return () => clearInterval(t)
  }, [])

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  const getBadge = (item) => {
    if (item.badgeKey === 'tugas') return tugasAktif > 0 ? tugasAktif : null
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

        .sp-topbar {
          background: ${NAVY};
          height: 56px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px;
          flex-shrink: 0;
          position: sticky; top: 0; z-index: 200;
        }

        /* ── HAMBURGER ── */
        .sp-hamburger-btn {
          width: 36px; height: 36px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 5px;
          background: transparent;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
        }
        .sp-hamburger-line {
          width: 22px; height: 2px;
          background: #fff;
          transition: all 0.25s ease;
          border-radius: 2px;
        }
        .sp-hamburger-line.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .sp-hamburger-line.open:nth-child(2) { opacity: 0; }
        .sp-hamburger-line.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .sp-logo-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 800;
          color: #fff; white-space: nowrap;
          line-height: 1.2;
        }
        .sp-logo-text span { color: ${BLUE}; }
        .sp-logo-sub {
          font-size: 9px; font-weight: 600;
          color: rgba(191,219,247,0.45);
          letter-spacing: 0.06em; text-transform: uppercase;
          margin-top: 1px;
        }
        .sp-logo-group { display: flex; align-items: center; gap: 12px; }

        /* ── MENU OVERLAY ── */
        .sp-menu-overlay {
          position: fixed;
          inset: 0;
          top: 56px;
          background: rgba(2,43,58,0.35);
          z-index: 400;
        }
        .sp-menu-panel {
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
        .sp-menu-section-label {
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.4px; color: rgba(191,219,247,0.35);
          padding: 10px 12px 5px; white-space: nowrap;
        }
        .sp-menu-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 8px 4px; }
        .sp-menu-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 11px 12px; border-radius: 10px;
          font-size: 13.5px; font-weight: 500;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: rgba(191,219,247,0.7); text-decoration: none;
          gap: 10px;
          transition: background 0.15s, color 0.15s;
        }
        .sp-menu-link:hover { background: rgba(255,255,255,0.07); color: #fff; }
        .sp-menu-link.active {
          background: rgba(191,219,247,0.12); color: #fff; font-weight: 700;
          border-left: 3px solid ${BLUE};
          padding-left: 9px;
        }
        .sp-menu-link-icon { flex-shrink: 0; display: flex; align-items: center; }
        .sp-menu-link-label { flex: 1; }
        .sp-menu-badge {
          font-size: 10px; font-weight: 700;
          background: ${BLUE}; color: ${NAVY};
          padding: 2px 7px; border-radius: 99px; flex-shrink: 0; line-height: 1.4;
        }
        .sp-menu-user {
          display: flex; align-items: center; gap: 10px;
          padding: 12px; margin-bottom: 6px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 16px;
        }
        .sp-menu-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(191,219,247,0.2);
          border: 1.5px solid rgba(191,219,247,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: ${BLUE}; flex-shrink: 0;
        }
        .sp-menu-user-name { font-size: 13px; font-weight: 700; color: #fff; }
        .sp-menu-user-role { font-size: 10.5px; color: rgba(191,219,247,0.55); }
        .sp-menu-logout {
          margin-top: 10px; padding: 11px 12px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.7);
          font-size: 13px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; display: flex; align-items: center; gap: 10px;
          transition: all 0.18s;
        }
        .sp-menu-logout:hover { background: rgba(255,255,255,0.09); color: #fff; }

        /* ── TOPBAR RIGHT ── */
        .sp-topbar-right {
          display: flex; align-items: center; gap: 16px;
        }
        .sp-live-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 700; color: #6EE7B7;
          letter-spacing: 0.04em;
        }
        .sp-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6EE7B7; animation: sp-pulse 2s ease infinite;
        }
        @keyframes sp-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .sp-clock { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.55); }
        .sp-divider-v { width: 1px; height: 24px; background: rgba(255,255,255,0.12); }
        .sp-user-wrap { display: flex; align-items: center; gap: 10px; }
        .sp-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: rgba(191,219,247,0.2);
          border: 1.5px solid rgba(191,219,247,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: ${BLUE};
        }
        .sp-user-name { font-size: 12px; font-weight: 600; color: #fff; line-height: 1.2; }
        .sp-user-role { font-size: 10px; color: rgba(191,219,247,0.55); }
        .sp-logout-btn {
          padding: 6px 14px; border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.6);
          font-size: 12px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; display: flex; align-items: center; gap: 6px;
          transition: all 0.18s;
        }
        .sp-logout-btn:hover { background: rgba(255,255,255,0.12); color: #fff; border-color: rgba(255,255,255,0.25); }

        .sp-body { display: flex; flex: 1; min-height: 0; overflow: hidden; }

        .sp-main {
          flex: 1; min-width: 0; overflow-y: auto; overflow-x: hidden;
          background: #F4F7F9; display: flex; flex-direction: column;
          padding-bottom: 70px;
        }

        .sp-mobile-nav {
          display: none; position: fixed; bottom: 0; left: 0; right: 0;
          z-index: 300; background: rgba(40,75,99,0.95);
          backdrop-filter: blur(16px);
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .sp-mobile-nav-items { display: flex; padding: 6px 0 env(safe-area-inset-bottom, 6px); }
        .sp-mobile-nav-item {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 3px;
          padding: 6px 4px; color: rgba(191,219,247,0.5); text-decoration: none;
          font-size: 10px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: color 0.15s; position: relative;
        }
        .sp-mobile-nav-item.active { color: ${BLUE}; }
        .sp-mobile-nav-badge {
          position: absolute; top: 4px; right: calc(50% - 16px);
          background: ${BLUE}; color: ${NAVY};
          font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 99px;
        }

        @media (max-width: 768px) {
          .sp-mobile-nav { display: block; }
          .sp-user-wrap, .sp-divider-v, .sp-clock { display: none !important; }
        }
      `}</style>

      {/* TOPBAR */}
      <header className="sp-topbar">
        <div className="sp-logo-group">
          <button
            className="sp-hamburger-btn"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Buka menu"
          >
            <span className={`sp-hamburger-line${menuOpen ? ' open' : ''}`} />
            <span className={`sp-hamburger-line${menuOpen ? ' open' : ''}`} />
            <span className={`sp-hamburger-line${menuOpen ? ' open' : ''}`} />
          </button>
          <div>
            <div className="sp-logo-text">Del<span>cion</span></div>
            <div className="sp-logo-sub">UPTD PPA</div>
          </div>
        </div>

        <div className="sp-topbar-right">
          <div className="sp-live-badge"><span className="sp-live-dot" />SIAGA</div>
          <span className="sp-clock">{clock} WITA</span>
          <div className="sp-divider-v" />
          {user && (
            <div className="sp-user-wrap">
              <div className="sp-avatar">{user.avatar ?? '👮'}</div>
              <div>
                <div className="sp-user-name">{user.nama ?? 'Petugas'}</div>
                <div className="sp-user-role">UPTD PPA Manado</div>
              </div>
            </div>
          )}
          <button className="sp-logout-btn" onClick={handleLogout}>
            {Icons.logout} Keluar
          </button>
        </div>
      </header>

      {/* MENU OVERLAY (hamburger) */}
      {menuOpen && (
        <div className="sp-menu-overlay" onClick={() => setMenuOpen(false)}>
          <nav className="sp-menu-panel" onClick={e => e.stopPropagation()}>
            {user && (
              <div className="sp-menu-user">
                <div className="sp-menu-avatar">{user.avatar ?? '👮'}</div>
                <div>
                  <div className="sp-menu-user-name">{user.nama ?? 'Petugas'}</div>
                  <div className="sp-menu-user-role">UPTD PPA Manado</div>
                </div>
              </div>
            )}

            <div className="sp-menu-section-label">Utama</div>
            {NAV.filter(n => n.group === 'utama').map(n => (
              <MenuItem key={n.to} {...n} badge={getBadge(n)} onNavigate={() => setMenuOpen(false)} />
            ))}

            <div className="sp-menu-divider" />
            <div className="sp-menu-section-label">Pekerjaan</div>
            {NAV.filter(n => n.group === 'kerja').map(n => (
              <MenuItem key={n.to} {...n} badge={getBadge(n)} onNavigate={() => setMenuOpen(false)} />
            ))}

            <div style={{ flex: 1 }} />
            <button className="sp-menu-logout" onClick={handleLogout}>
              {Icons.logout} Keluar dari Akun
            </button>
          </nav>
        </div>
      )}

      {/* BODY */}
      <div className="sp-body">
        <main className="sp-main">
          <Outlet />
        </main>
      </div>

      {/* MOBILE NAV */}
      <nav className="sp-mobile-nav">
        <div className="sp-mobile-nav-items">
          {MOBILE_NAV.map(n => {
            const badge = n.badgeKey === 'tugas' ? (tugasAktif > 0 ? tugasAktif : null) : null
            return (
              <NavLink key={n.to} to={n.to} end={n.exact}
                className={({ isActive }) => `sp-mobile-nav-item${isActive ? ' active' : ''}`}>
                {badge && <span className="sp-mobile-nav-badge">{badge}</span>}
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
      className={({ isActive }) => `sp-menu-link${isActive ? ' active' : ''}`}
    >
      <span className="sp-menu-link-icon">{icon}</span>
      <span className="sp-menu-link-label">{label}</span>
      {badge && <span className="sp-menu-badge">{badge}</span>}
    </NavLink>
  )
}