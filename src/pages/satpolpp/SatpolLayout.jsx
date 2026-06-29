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
  chevronLeft: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  chevronRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
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

const SIDEBAR_W   = 220
const COLLAPSED_W = 64

export default function SatpolLayout() {
  const navigate   = useNavigate()
  const user       = useStore(s => s.user)
  const logout     = useStore(s => s.logout)
  const penugasan  = useStore(s => s.penugasan ?? [])
  const setRole    = useStore(s => s.setRole)
  const [clock, setClock]         = useState('')
  const [collapsed, setCollapsed] = useState(false)

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

  const sideW = collapsed ? COLLAPSED_W : SIDEBAR_W

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
          padding: 0 20px 0 0;
          flex-shrink: 0;
          position: sticky; top: 0; z-index: 200;
        }
        .sp-logo-wrap {
          display: flex; align-items: center; gap: 10px;
          height: 56px; padding: 0 20px;
          border-right: 1px solid rgba(255,255,255,0.1);
          flex-shrink: 0; transition: width 0.25s ease; overflow: hidden;
        }
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
        .sp-toggle-btn {
          width: 32px; height: 32px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
        }
        .sp-toggle-btn:hover { background: rgba(255,255,255,0.16); color: #fff; }

        .sp-topbar-right {
          display: flex; align-items: center; gap: 16px; margin-left: auto;
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

        .sp-sidebar {
          background: ${NAVY};
          display: flex; flex-direction: column; flex-shrink: 0;
          overflow-y: auto; overflow-x: hidden;
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
          border-right: 1px solid rgba(255,255,255,0.08);
        }
        .sp-sidebar-inner {
          padding: 16px 10px;
          display: flex; flex-direction: column; gap: 2px;
          flex: 1; min-width: ${SIDEBAR_W}px;
        }
        .sp-section-label {
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.4px; color: rgba(191,219,247,0.35);
          padding: 10px 10px 5px; white-space: nowrap; overflow: hidden;
        }
        .sp-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 8px 4px; }

        .sp-nav-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 12px; border-radius: 10px;
          font-size: 13px; font-weight: 500;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: rgba(191,219,247,0.65); text-decoration: none;
          white-space: nowrap; overflow: hidden;
          transition: background 0.15s, color 0.15s; gap: 10px;
        }
        .sp-nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
        .sp-nav-item.active {
          background: rgba(191,219,247,0.12); color: #fff; font-weight: 700;
          border-left: 3px solid ${BLUE};
        }
        .sp-nav-item:not(.active) { border-left: 3px solid transparent; }
        .sp-nav-icon { flex-shrink: 0; display: flex; align-items: center; }
        .sp-nav-label { flex: 1; overflow: hidden; text-overflow: ellipsis; }
        .sp-nav-badge {
          font-size: 10px; font-weight: 700;
          background: #BFDBF7; color: ${NAVY};
          padding: 2px 7px; border-radius: 99px; flex-shrink: 0; line-height: 1.4;
        }

        .sp-sidebar-logout {
          margin: 8px; padding: 10px 12px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.45);
          font-size: 12px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; display: flex; align-items: center; gap: 10px;
          white-space: nowrap; overflow: hidden; transition: all 0.18s;
        }
        .sp-sidebar-logout:hover { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.75); }

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
          .sp-sidebar { display: none !important; }
          .sp-mobile-nav { display: block; }
          .sp-user-wrap, .sp-divider-v, .sp-clock { display: none !important; }
        }
      `}</style>

      {/* TOPBAR */}
      <header className="sp-topbar">
        <div className="sp-logo-wrap" style={{ width: sideW, minWidth: sideW }}>
          {!collapsed && (
            <div>
              <div className="sp-logo-text">Del<span>cion</span></div>
              <div className="sp-logo-sub">Satpol PP</div>
            </div>
          )}
          <button className="sp-toggle-btn" onClick={() => setCollapsed(v => !v)}>
            {collapsed ? Icons.chevronRight : Icons.chevronLeft}
          </button>
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
                <div className="sp-user-role">Satpol PP Manado</div>
              </div>
            </div>
          )}
          <button className="sp-logout-btn" onClick={handleLogout}>
            {Icons.logout} Keluar
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="sp-body">
        <aside className="sp-sidebar" style={{ width: sideW }}>
          <div className="sp-sidebar-inner">
            {!collapsed && <div className="sp-section-label">Utama</div>}
            {NAV.filter(n => n.group === 'utama').map(n => (
              <SideItem key={n.to} {...n} badge={getBadge(n)} collapsed={collapsed} />
            ))}
            <div className="sp-divider" />
            {!collapsed && <div className="sp-section-label">Pekerjaan</div>}
            {NAV.filter(n => n.group === 'kerja').map(n => (
              <SideItem key={n.to} {...n} badge={getBadge(n)} collapsed={collapsed} />
            ))}
            <div style={{ flex: 1 }} />
            <div className="sp-divider" />
            <button className="sp-sidebar-logout" onClick={handleLogout} title="Keluar">
              <span style={{ flexShrink: 0 }}>{Icons.logout}</span>
              {!collapsed && <span>Keluar dari Akun</span>}
            </button>
          </div>
        </aside>

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

function SideItem({ to, label, icon, badge, exact, collapsed }) {
  return (
    <NavLink to={to} end={exact}
      className={({ isActive }) => `sp-nav-item${isActive ? ' active' : ''}`}
      title={collapsed ? label : undefined}
    >
      <span className="sp-nav-icon">{icon}</span>
      {!collapsed && <span className="sp-nav-label">{label}</span>}
      {!collapsed && badge && <span className="sp-nav-badge">{badge}</span>}
    </NavLink>
  )
}