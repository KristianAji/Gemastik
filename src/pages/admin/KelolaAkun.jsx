import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ── Palette (identik dengan AdminPeta / AdminNotifikasi / AdminStatistik) ── */
const N      = '#284B63'
const T      = '#3C6E71'
const TEXT   = '#353535'
const MUTED  = '#6B7C8D'
const BORDER = '#D9D9D9'
const CARD   = '#FFFFFF'
const BG     = '#F4F7F9'
const GREEN  = '#1E7E4A'
const AMBER  = '#D4820A'
const RED    = '#C0392B'

/* ── SVG Icons ──────────────────────────────────────────────── */
const I = {
  users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  chevDown: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  download: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  arrow: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  alert: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  slash: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
}

/* ── Data dummy akun ────────────────────────────────────────── */
const ACCOUNTS_DATA = [
  { id:1, nama:'Siti Rahayu, S.Sos',     dinas:'Dinas Sosial',  status:'aktif',    avatar:'SR', dibuat:'2024-01-15', jabatan:'Petugas Lapangan' },
  { id:2, nama:'Bripda Aldi Pratama',     dinas:'Satpol PP',     status:'aktif',    avatar:'AP', dibuat:'2024-02-03', jabatan:'Anggota Satpol PP' },
  { id:3, nama:'Dra. Mariana Wenas',      dinas:'Dinas Sosial',  status:'aktif',    avatar:'MW', dibuat:'2024-02-10', jabatan:'Koordinator Lapangan' },
  { id:4, nama:'Briptu Rezky Mantiri',    dinas:'Satpol PP',     status:'perlu',    avatar:'RM', dibuat:'2024-03-22', jabatan:'Anggota Satpol PP' },
  { id:5, nama:'Febriani Kotambunan',     dinas:'Dinas Sosial',  status:'perlu',    avatar:'FK', dibuat:'2024-04-01', jabatan:'Petugas Lapangan' },
  { id:6, nama:'Serda Yusuf Tamboto',     dinas:'Satpol PP',     status:'nonaktif', avatar:'YT', dibuat:'2023-11-05', jabatan:'Anggota Satpol PP' },
  { id:7, nama:'Grace Lumempouw, S.Sos',  dinas:'Dinas Sosial',  status:'aktif',    avatar:'GL', dibuat:'2024-05-18', jabatan:'Petugas Lapangan' },
]

const STATUS_META = {
  aktif:    { label:'Aktif',            color: GREEN, bg:'rgba(30,126,74,0.08)',  border:'rgba(30,126,74,0.2)' },
  perlu:    { label:'Butuh Verifikasi', color: AMBER, bg:'rgba(212,130,10,0.08)', border:'rgba(212,130,10,0.2)' },
  nonaktif: { label:'Nonaktif',         color: RED,   bg:'rgba(192,57,43,0.08)', border:'rgba(192,57,43,0.2)' },
}

export default function KelolAkun() {
  const navigate = useNavigate()

  const [filterDinas,  setFilterDinas]  = useState('Semua')
  const [filterStatus, setFilterStatus] = useState('Semua')
  const [search,       setSearch]       = useState('')
  const [sortAbjad,    setSortAbjad]    = useState('az')
  const [sortWaktu,    setSortWaktu]    = useState('baru')
  const [accounts, setAccounts]         = useState(ACCOUNTS_DATA)
  const [dropdownOpen, setDropdownOpen] = useState(null) // id akun yang dropdown-nya terbuka

  /* ── KPI ── */
  const total        = accounts.length
  const aktifCount   = accounts.filter(a => a.status === 'aktif').length
  const perluCount   = accounts.filter(a => a.status === 'perlu').length
  const nonaktifCount= accounts.filter(a => a.status === 'nonaktif').length

  /* ── Filter & sort ── */
  const filtered = accounts
    .filter(a => filterDinas === 'Semua' || a.dinas === filterDinas)
    .filter(a => {
      if (filterStatus === 'Semua')            return true
      if (filterStatus === 'Aktif')            return a.status === 'aktif'
      if (filterStatus === 'Butuh Verifikasi') return a.status === 'perlu'
      if (filterStatus === 'Nonaktif')         return a.status === 'nonaktif'
      return true
    })
    .filter(a => a.nama.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const byName = sortAbjad === 'az'
        ? a.nama.localeCompare(b.nama)
        : b.nama.localeCompare(a.nama)
      if (byName !== 0) return byName
      const da = new Date(a.dibuat), db = new Date(b.dibuat)
      return sortWaktu === 'baru' ? db - da : da - db
    })

  const handleStatusChange = (id, newStatus) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
    setDropdownOpen(null)
  }

  const handleHapus = (id) => {
    if (window.confirm('Hapus akun ini? Tindakan tidak dapat dibatalkan.')) {
      setAccounts(prev => prev.filter(a => a.id !== id))
    }
    setDropdownOpen(null)
  }

  const handleExport = () => {
    const csv = ['Nama,Dinas,Jabatan,Status,Tanggal Dibuat',
      ...filtered.map(a => `"${a.nama}","${a.dinas}","${a.jabatan}",${STATUS_META[a.status].label},${a.dibuat}`)
    ].join('\n')
    const el = document.createElement('a')
    el.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' }))
    el.download = 'daftar-akun-delcion.csv'
    el.click()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .ka-root * { box-sizing: border-box; }

        .ka-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: ${BG};
          color: ${TEXT};
          flex: 1;
          overflow-y: auto;
          padding: 28px 32px 60px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* ══ BANNER ══ */
        .ka-banner {
          background: ${N};
          border-radius: 18px;
          padding: 28px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          position: relative;
          overflow: hidden;
        }
        .ka-banner::before {
          content: '';
          position: absolute;
          right: -80px; top: -80px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(60,110,113,0.3) 0%, transparent 65%);
          pointer-events: none;
        }
        .ka-banner::after {
          content: '';
          position: absolute;
          left: 40%; bottom: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(191,219,247,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .ka-banner-eyebrow {
          font-size: 11px;
          color: rgba(191,219,247,0.5);
          margin-bottom: 8px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .ka-banner-title {
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
        }
        .ka-banner-title span { color: #BFDBF7; }
        .ka-banner-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          line-height: 1.65;
          max-width: 460px;
        }
        .ka-banner-sub strong { color: #fff; font-weight: 700; }
        .ka-banner-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .ka-btn-teal {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 22px;
          background: ${T};
          color: #fff; border: none; border-radius: 10px;
          font-size: 13px; font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .ka-btn-teal:hover { background: #2f5759; transform: translateY(-1px); }

        /* ══ KPI GLASS CARDS ══ */
        .ka-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .ka-kpi-card {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 16px;
          padding: 22px;
          position: relative; overflow: hidden;
          transition: box-shadow 0.2s, transform 0.15s, background 0.2s;
        }
        .ka-kpi-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px; border-radius: 16px 16px 0 0;
          background: var(--accent-color, ${T});
        }
        .ka-kpi-card:hover {
          background: rgba(255,255,255,0.75);
          box-shadow: 0 8px 32px rgba(60,110,113,0.14);
          transform: translateY(-2px);
        }
        .ka-kpi-icon-wrap {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
          background: var(--icon-bg, rgba(60,110,113,0.1));
          border: 1px solid var(--icon-border, rgba(60,110,113,0.2));
          color: var(--icon-color, ${T});
        }
        .ka-kpi-num {
          font-size: 34px; font-weight: 800;
          line-height: 1; margin-bottom: 5px; letter-spacing: -0.02em;
          color: var(--num-color, ${T});
        }
        .ka-kpi-label { font-size: 12px; color: ${MUTED}; font-weight: 500; margin-bottom: 12px; }
        .ka-kpi-delta { font-size: 11px; font-weight: 600; color: var(--delta-color, ${T}); }
        .ka-kpi-bar { height: 3px; border-radius: 2px; background: rgba(60,110,113,0.12); margin-top: 14px; overflow: hidden; }
        .ka-kpi-bar-fill { height: 100%; border-radius: 2px; background: var(--bar-color, ${T}); transition: width 1s ease; }

        /* ══ FILTER BAR (glass) ══ */
        .ka-filter-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .ka-filter-bar {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.85);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          flex: 1;
          box-shadow: 0 2px 16px rgba(40,75,99,0.07);
        }
        .ka-select-wrap { position: relative; }
        .ka-select {
          appearance: none;
          padding: 8px 30px 8px 12px;
          border: 1px solid ${BORDER};
          border-radius: 8px;
          background: ${CARD};
          color: ${TEXT};
          font-size: 12px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; outline: none;
          transition: border-color 0.15s;
          min-width: 130px;
        }
        .ka-select:focus { border-color: ${T}; }
        .ka-select-icon {
          position: absolute; right: 9px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none; color: ${MUTED};
        }
        .ka-search-wrap { position: relative; flex: 1; min-width: 160px; }
        .ka-search-icon {
          position: absolute; left: 10px; top: 50%;
          transform: translateY(-50%); color: ${MUTED};
          pointer-events: none;
        }
        .ka-search {
          width: 100%; padding: 8px 12px 8px 32px;
          border: 1px solid ${BORDER}; border-radius: 8px;
          background: ${CARD}; color: ${TEXT};
          font-size: 12px; font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none; transition: border-color 0.15s;
        }
        .ka-search:focus { border-color: ${T}; }
        .ka-search::placeholder { color: #9BAAB5; }
        .ka-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: ${GREEN};
          display: inline-block;
          animation: ka-pulse 2s ease infinite;
        }
        @keyframes ka-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        /* ══ CARD BASE / LIST ══ */
        .ka-card { background: ${CARD}; border: 1px solid ${BORDER}; border-radius: 14px; overflow: visible; }
        .ka-card-head {
          padding: 16px 20px; border-bottom: 1px solid ${BORDER};
          display: flex; align-items: center; justify-content: space-between;
        }
        .ka-card-title {
          font-size: 13px; font-weight: 700; color: ${N};
          display: flex; align-items: center; gap: 8px;
        }
        .ka-btn-outline {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          border: 1.5px solid ${BORDER}; border-radius: 8px;
          background: transparent; color: ${N};
          font-size: 12px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; transition: all 0.15s;
        }
        .ka-btn-outline:hover { border-color: ${T}; color: ${T}; }

        /* ── ACCOUNT ROW ── */
        .ka-account-row {
          display: flex; align-items: center; gap: 16px;
          padding: 14px 20px;
          border-bottom: 1px solid ${BORDER};
          transition: background 0.12s;
          position: relative;
        }
        .ka-account-row:last-child { border-bottom: none; }
        .ka-account-row:hover { background: #F8FAFC; }

        .ka-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, ${N}, ${T});
          color: #fff; font-size: 13px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; letter-spacing: 0.02em;
        }
        .ka-acc-info { flex: 1; min-width: 0; }
        .ka-acc-name {
          font-size: 13px; font-weight: 700; color: ${N};
          margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ka-acc-meta {
          font-size: 11px; color: ${MUTED};
          display: flex; align-items: center; gap: 8px;
        }
        .ka-acc-dinas {
          display: inline-flex; align-items: center;
          font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 99px;
          background: rgba(40,75,99,0.08); color: ${N};
        }

        /* Status pill + dropdown */
        .ka-status-wrap { position: relative; flex-shrink: 0; }
        .ka-status-pill {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 700;
          padding: 4px 12px; border-radius: 99px;
          cursor: pointer; border: 1px solid transparent;
          transition: all 0.15s; white-space: nowrap;
          user-select: none;
        }
        .ka-status-pill:hover { filter: brightness(0.95); }
        .ka-status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: currentColor; flex-shrink: 0;
        }
        .ka-dropdown {
          position: absolute; top: calc(100% + 6px); right: 0;
          background: ${CARD}; border: 1px solid ${BORDER};
          border-radius: 10px; padding: 4px;
          box-shadow: 0 8px 24px rgba(40,75,99,0.14);
          z-index: 100; min-width: 180px;
        }
        .ka-dropdown-item {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; border-radius: 7px;
          font-size: 12px; font-weight: 600; color: ${TEXT};
          cursor: pointer; transition: background 0.12s;
        }
        .ka-dropdown-item:hover { background: rgba(191, 219, 247, 0.28); color: ${N}; }
        .ka-dropdown-item.danger { color: ${RED}; }
        .ka-dropdown-item.danger:hover { background: rgba(192,57,43,0.06); }
        .ka-dropdown-divider { height: 1px; background: ${BORDER}; margin: 4px 0; }

        /* ── EMPTY STATE ── */
        .ka-empty { padding: 60px 20px; text-align: center; color: ${MUTED}; }
        .ka-empty-title { font-size: 14px; font-weight: 700; color: ${N}; margin-bottom: 6px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .ka-kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .ka-root        { padding: 20px 16px 60px; }
          .ka-banner      { flex-direction: column; align-items: flex-start; }
          .ka-filter-bar  { gap: 8px; }
        }
        @media (max-width: 600px) {
          .ka-kpi-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ka-root" onClick={() => setDropdownOpen(null)}>

        {/* ══ BANNER ══ */}
        <div className="ka-banner">
          <div style={{ position:'relative', zIndex:1 }}>
            <div className="ka-banner-eyebrow">Pengelolaan Akun</div>
            <h1 className="ka-banner-title">
              Kelola Akun<br/>
              <span>Dinsos &amp; Satpol PP</span>
            </h1>
            <div className="ka-banner-sub">
              {perluCount > 0
                ? <>Ada <strong>{perluCount} akun</strong> yang membutuhkan verifikasi dari Dinas Sosial &amp; Satpol PP.</>
                : <>Semua akun aktif dan terverifikasi. Total <strong>{total} akun</strong> terdaftar.</>
              }
            </div>
          </div>
          <div className="ka-banner-actions">
            {perluCount > 0 && (
              <button className="ka-btn-teal" onClick={() => setFilterStatus('Butuh Verifikasi')}>
                {I.alert} Tinjau Sekarang
                <span style={{
                  background:'#fff', color:T,
                  borderRadius:'999px', fontSize:10, fontWeight:800,
                  padding:'1px 7px', marginLeft:2,
                }}>
                  {perluCount}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ══ KPI GLASS CARDS ══ */}
        <div className="ka-kpi-grid">
          {[
            {
              icon: I.users, num: total, label: 'Total Akun Terdaftar',
              delta: 'Dinas Sosial & Satpol PP', fill: 100,
              accentColor: T, iconBg:'rgba(60,110,113,0.1)', iconBorder:'rgba(60,110,113,0.2)',
              iconColor: T, numColor: T, deltaColor: T, barColor: T,
            },
            {
              icon: I.check, num: aktifCount, label: 'Akun Aktif',
              delta: `${total ? Math.round((aktifCount/total)*100) : 0}% dari total akun`,
              fill: total ? (aktifCount/total)*100 : 0,
              accentColor: GREEN, iconBg:'rgba(30,126,74,0.1)', iconBorder:'rgba(30,126,74,0.2)',
              iconColor: GREEN, numColor: GREEN, deltaColor: GREEN, barColor: GREEN,
            },
            {
              icon: I.alert, num: perluCount, label: 'Butuh Verifikasi',
              delta: 'Menunggu tindakan admin',
              fill: total ? (perluCount/total)*100 : 0,
              accentColor: AMBER, iconBg:'rgba(212,130,10,0.1)', iconBorder:'rgba(212,130,10,0.2)',
              iconColor: AMBER, numColor: AMBER, deltaColor: AMBER, barColor: AMBER,
            },
            {
              icon: I.slash, num: nonaktifCount, label: 'Akun Nonaktif',
              delta: 'Tidak dapat mengakses sistem',
              fill: total ? (nonaktifCount/total)*100 : 0,
              accentColor: RED, iconBg:'rgba(192,57,43,0.1)', iconBorder:'rgba(192,57,43,0.2)',
              iconColor: RED, numColor: RED, deltaColor: RED, barColor: RED,
            },
          ].map((k, i) => (
            <div key={i} className="ka-kpi-card" style={{
              '--accent-color': k.accentColor,
              '--icon-bg': k.iconBg,
              '--icon-border': k.iconBorder,
              '--icon-color': k.iconColor,
              '--num-color': k.numColor,
              '--delta-color': k.deltaColor,
              '--bar-color': k.barColor,
            }}>
              <div className="ka-kpi-icon-wrap">{k.icon}</div>
              <div className="ka-kpi-num">{k.num}</div>
              <div className="ka-kpi-label">{k.label}</div>
              <div className="ka-kpi-delta">{k.delta}</div>
              <div className="ka-kpi-bar">
                <div className="ka-kpi-bar-fill" style={{ width:`${k.fill}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* ══ FILTER BAR + LIVE ══ */}
        <div className="ka-filter-row">
          <div className="ka-filter-bar" onClick={e => e.stopPropagation()}>

            {/* Dinas */}
            <div className="ka-select-wrap">
              <select className="ka-select" value={filterDinas} onChange={e => setFilterDinas(e.target.value)}>
                <option>Semua</option>
                <option>Dinas Sosial</option>
                <option>Satpol PP</option>
              </select>
              <span className="ka-select-icon">{I.chevDown}</span>
            </div>

            {/* Status */}
            <div className="ka-select-wrap">
              <select className="ka-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option>Semua</option>
                <option>Aktif</option>
                <option>Butuh Verifikasi</option>
                <option>Nonaktif</option>
              </select>
              <span className="ka-select-icon">{I.chevDown}</span>
            </div>

            {/* Search */}
            <div className="ka-search-wrap">
              <span className="ka-search-icon">{I.search}</span>
              <input className="ka-search" placeholder="Cari nama petugas..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Sortir abjad */}
            <div className="ka-select-wrap">
              <select className="ka-select" value={sortAbjad} onChange={e => setSortAbjad(e.target.value)} style={{ minWidth:160 }}>
                <option value="az">Urutkan A ke Z</option>
                <option value="za">Urutkan Z ke A</option>
              </select>
              <span className="ka-select-icon">{I.chevDown}</span>
            </div>

            {/* Sortir waktu */}
            <div className="ka-select-wrap">
              <select className="ka-select" value={sortWaktu} onChange={e => setSortWaktu(e.target.value)} style={{ minWidth:180 }}>
                <option value="baru">Akun Baru Dibuat</option>
                <option value="lama">Akun Paling Lama</option>
              </select>
              <span className="ka-select-icon">{I.chevDown}</span>
            </div>

          </div>

          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color: GREEN, fontWeight:600, whiteSpace:'nowrap' }}>
            <span className="ka-live-dot" />
            Live Sync
          </div>
        </div>

        {/* ══ DAFTAR AKUN ══ */}
        <div className="ka-card">
          <div className="ka-card-head">
            <div className="ka-card-title">
              {I.users}
              Daftar Akun Petugas
              <span style={{
                fontSize:11, fontWeight:700, color:T,
                background:'rgba(60,110,113,0.1)', padding:'2px 9px', borderRadius:99,
              }}>
                {filtered.length} akun
              </span>
            </div>
            <button className="ka-btn-outline" onClick={handleExport}>
              {I.download} Export CSV
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="ka-empty">
              <div style={{ fontSize:32, marginBottom:12, color:BORDER }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <div className="ka-empty-title">Tidak ada akun ditemukan</div>
              <div style={{ fontSize:12 }}>Coba ubah filter atau kata kunci pencarian</div>
            </div>
          ) : (
            filtered.map(acc => {
              const sm = STATUS_META[acc.status]
              const isOpen = dropdownOpen === acc.id
              return (
                <div key={acc.id} className="ka-account-row">
                  {/* Avatar */}
                  <div className="ka-avatar">{acc.avatar}</div>

                  {/* Info */}
                  <div className="ka-acc-info">
                    <div className="ka-acc-name">{acc.nama}</div>
                    <div className="ka-acc-meta">
                      <span className="ka-acc-dinas">{acc.dinas}</span>
                      <span>{acc.jabatan}</span>
                      <span style={{ color:'#C4CDD5' }}>·</span>
                      <span>Sejak {new Date(acc.dibuat).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}</span>
                    </div>
                  </div>

                  {/* Status pill + dropdown */}
                  <div className="ka-status-wrap" onClick={e => e.stopPropagation()}>
                    <div
                      className="ka-status-pill"
                      style={{ background: sm.bg, color: sm.color, borderColor: sm.border }}
                      onClick={() => setDropdownOpen(isOpen ? null : acc.id)}
                    >
                      <span className="ka-status-dot" />
                      {sm.label}
                      {I.chevDown}
                    </div>
                    {isOpen && (
                      <div className="ka-dropdown">
                        {acc.status !== 'aktif' && (
                          <div className="ka-dropdown-item" onClick={() => handleStatusChange(acc.id, 'aktif')}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={N} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            <span style={{ color:N }}>Aktifkan Akun</span>
                          </div>
                        )}
                        {acc.status !== 'nonaktif' && (
                          <div className="ka-dropdown-item" onClick={() => handleStatusChange(acc.id, 'nonaktif')}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={N} strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                            <span style={{ color:N }}>Nonaktifkan Akun</span>
                          </div>
                        )}
                        <div className="ka-dropdown-divider" />
                        <div className="ka-dropdown-item danger" onClick={() => handleHapus(acc.id)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={N} strokeWidth="2.2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                          Hapus Akun
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

      </div>
    </>
  )
}