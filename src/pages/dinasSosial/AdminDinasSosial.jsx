import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { useState, useEffect } from 'react'
import { N, T, MUTED, BORDER, BG, RED, GREEN, KASUS_DATA, Icon } from './dinsoConstants'

import DinsosPeta       from './DinsosPeta'
import DinsosStatistik  from './DinsosStatistik'
import DinsosExport     from './DinsosExport'
import DinsosKasus      from './DinsosKasus'

// ── Tab definitons ────────────────────────────────────────────
const TABS = [
  { key: 'peta',      label: 'Peta Sebaran',      icon: Icon.peta,   path: '/dinas-sosial/peta'      },
  { key: 'statistik', label: 'Statistik & Grafik', icon: Icon.chart,  path: '/dinas-sosial/statistik' },
  { key: 'export',    label: 'Export CSV',          icon: Icon.export, path: '/dinas-sosial/export'    },
  { key: 'kasus',     label: 'Tindak Lanjut Kasus',icon: Icon.kasus,  path: '/dinas-sosial/kasus'     },
]

export default function AdminDinasSosial() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const showToast = useStore(s => s.showToast)

  // Tentukan tab aktif berdasarkan URL
  const activeTab = TABS.find(t => location.pathname.startsWith(t.path))?.key ?? 'peta'

  // Statistik ringkasan untuk notif badge
  const totalProses = KASUS_DATA.filter(k => k.status === 'proses').length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .dinsos-shell * { box-sizing: border-box; }
        .dinsos-shell {
          display: flex; flex-direction: column;
          height: 100%; overflow: hidden;
          background: ${BG};
          font-family: 'Inter', sans-serif;
        }

        /* ── Tab Nav Bar ── */
        .dinsos-navbar {
          background: ${N};
          padding: 0 28px;
          display: flex;
          align-items: center;
          gap: 2px;
          flex-shrink: 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .dinsos-navbar-brand {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 800; color: #fff;
          padding: 16px 0; margin-right: 24px; white-space: nowrap;
          display: flex; align-items: center; gap: 8px;
          letter-spacing: -0.01em;
        }
        .dinsos-navbar-brand span { color: #BFDBF7; }
        .dinsos-tab {
          display: flex; align-items: center; gap: 7px;
          padding: 16px 18px; font-size: 12px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: rgba(255,255,255,0.5); cursor: pointer;
          border: none; background: transparent;
          border-bottom: 2.5px solid transparent;
          transition: color 0.15s, border-color 0.15s;
          white-space: nowrap; position: relative;
        }
        .dinsos-tab svg { stroke: rgba(255,255,255,0.4); transition: stroke 0.15s; }
        .dinsos-tab:hover { color: rgba(255,255,255,0.85); }
        .dinsos-tab:hover svg { stroke: rgba(255,255,255,0.85); }
        .dinsos-tab.active {
          color: #fff;
          border-bottom-color: #3C6E71;
        }
        .dinsos-tab.active svg { stroke: #7CBFC1; }
        .dinsos-tab-badge {
          background: ${RED}; color: #fff;
          font-size: 9px; font-weight: 800;
          padding: 1px 6px; border-radius: 999px;
          font-family: 'Inter', sans-serif;
        }
        .dinsos-content {
          flex: 1; overflow-y: auto;
        }

        @media (max-width: 900px) {
          .dinsos-navbar      { padding: 0 12px; gap: 0; overflow-x: auto; }
          .dinsos-navbar-brand { display: none; }
          .dinsos-tab         { padding: 14px 12px; font-size: 11px; }
        }
      `}</style>

      <div className="dinsos-shell">

        {/* ── Top Navigation Bar ── */}
        <nav className="dinsos-navbar">
          <div className="dinsos-navbar-brand">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7CBFC1" strokeWidth="2.2" strokeLinecap="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Dinas Sosial <span>Kota Manado</span>
          </div>

          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`dinsos-tab${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => navigate(tab.path)}
            >
              {tab.icon}
              {tab.label}
              {tab.key === 'kasus' && totalProses > 0 && (
                <span className="dinsos-tab-badge">{totalProses}</span>
              )}
            </button>
          ))}
        </nav>

        {/* ── Content Area ── */}
        <div className="dinsos-content">
          <Routes>
            <Route index element={<Navigate to="peta" replace />} />
            <Route path="peta"      element={<DinsosPeta />}      />
            <Route path="statistik" element={<DinsosStatistik />}  />
            <Route path="export"    element={<DinsosExport />}     />
            <Route path="kasus"     element={<DinsosKasus />}      />
          </Routes>
        </div>

      </div>
    </>
  )
}