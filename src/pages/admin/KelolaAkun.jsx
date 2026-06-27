import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Palette ───────────────────────────────────────────────────
const NAVY   = '#284B63'
const TEAL   = '#3C6E71'
const TEXT   = '#353535'
const MUTED  = '#6B7C8D'
const BORDER = '#D9D9D9'
const CARD   = '#FFFFFF'
const BG     = '#F4F7F9'
const GREEN  = '#1E7E4A'
const AMBER  = '#D4820A'
const RED    = '#C0392B'

// ── SVG Icons ─────────────────────────────────────────────────
const I = {
  users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  chevDown: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  sort: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  download: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  arrow: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  check: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
}

// ── Data dummy akun ────────────────────────────────────────────
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
  aktif:    { label:'Aktif',              color: GREEN, bg:'rgba(30,126,74,0.08)',  border:'rgba(30,126,74,0.2)' },
  perlu:    { label:'Butuh Verifikasi',   color: AMBER, bg:'rgba(212,130,10,0.08)',border:'rgba(212,130,10,0.2)' },
  nonaktif: { label:'Nonaktif',           color: RED,   bg:'rgba(192,57,43,0.08)', border:'rgba(192,57,43,0.2)' },
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

  // ── Filter & sort ──────────────────────────────────────────
  const filtered = accounts
    .filter(a => filterDinas === 'Semua' || a.dinas === filterDinas)
    .filter(a => {
      if (filterStatus === 'Semua')    return true
      if (filterStatus === 'Aktif')    return a.status === 'aktif'
      if (filterStatus === 'Butuh Verifikasi') return a.status === 'perlu'
      if (filterStatus === 'Nonaktif') return a.status === 'nonaktif'
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

  const perluCount = accounts.filter(a => a.status === 'perlu').length

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
          padding: 36px 36px 60px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* ── HERO CARD ── */
        .ka-hero {
          background: ${NAVY};
          border-radius: 16px;
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          position: relative;
          overflow: hidden;
        }
        .ka-hero::before {
          content: '';
          position: absolute; right: -60px; top: -60px;
          width: 260px; height: 260px; border-radius: 50%;
          background: radial-gradient(circle, rgba(60,110,113,0.3) 0%, transparent 65%);
          pointer-events: none;
        }
        .ka-hero-eyebrow {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: rgba(191,219,247,0.5);
          margin-bottom: 8px;
        }
        .ka-hero-title {
          font-size: clamp(20px, 2.5vw, 26px);
          font-weight: 800; color: #fff;
          line-height: 1.2; letter-spacing: -0.02em;
          margin: 0 0 8px;
        }
        .ka-hero-title span { color: #BFDBF7; }
        .ka-hero-sub {
          font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.65;
        }
        .ka-hero-sub strong { color: #fff; }
        .ka-hero-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 11px 22px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px; color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          cursor: pointer; flex-shrink: 0; white-space: nowrap;
          transition: background 0.18s;
          position: relative; z-index: 1;
        }
        .ka-hero-btn:hover { background: rgba(255,255,255,0.2); }

        /* ── FILTER BAR (glass) ── */
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
        .ka-select:focus { border-color: ${TEAL}; }
        .ka-select-icon {
          position: absolute; right: 9px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none; color: ${MUTED};
        }
        .ka-search-wrap {
          position: relative; flex: 1; min-width: 160px;
        }
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
        .ka-search:focus { border-color: ${TEAL}; }
        .ka-search::placeholder { color: #9BAAB5; }
        .ka-filter-label {
          font-size: 11px; color: ${MUTED}; font-weight: 600; white-space: nowrap;
        }

        /* ── ACCOUNTS LIST ── */
        .ka-list-card {
        background: ${CARD};
        border: 1px solid ${BORDER};
        border-radius: 14px;
        overflow: visible;
        }
        .ka-list-head {
          padding: 14px 20px;
          border-bottom: 1px solid ${BORDER};
          display: flex; align-items: center; justify-content: space-between;
        }
        .ka-list-title {
          font-size: 13px; font-weight: 700; color: ${NAVY};
          display: flex; align-items: center; gap: 8px;
        }
        .ka-export-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          border: 1px solid ${BORDER}; border-radius: 8px;
          background: transparent; color: ${MUTED};
          font-size: 12px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; transition: all 0.15s;
        }
        .ka-export-btn:hover { border-color: ${NAVY}; color: ${NAVY}; }

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
          background: linear-gradient(135deg, ${NAVY}, ${TEAL});
          color: #fff; font-size: 13px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; letter-spacing: 0.02em;
        }
        .ka-acc-info { flex: 1; min-width: 0; }
        .ka-acc-name {
          font-size: 13px; font-weight: 700; color: ${NAVY};
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
          background: rgba(40,75,99,0.08); color: ${NAVY};
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
        .ka-dropdown-item:hover {  background: rgba(191, 219, 247, 0.28); color: #284B63; }
        .ka-dropdown-item.danger { color: ${RED}; }
        .ka-dropdown-item.danger:hover { background: rgba(192,57,43,0.06); }
        .ka-dropdown-divider { height: 1px; background: ${BORDER}; margin: 4px 0; }

        /* ── EMPTY STATE ── */
        .ka-empty {
          padding: 60px 20px; text-align: center; color: ${MUTED};
        }
        .ka-empty-title { font-size: 14px; font-weight: 700; color: ${NAVY}; margin-bottom: 6px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .ka-root { padding: 20px 16px 60px; }
          .ka-hero { flex-direction: column; align-items: flex-start; }
          .ka-filter-bar { gap: 8px; }
        }
      `}</style>

      <div className="ka-root" onClick={() => setDropdownOpen(null)}>

        {/* ── HERO CARD ── */}
        <div className="ka-hero">
          <div style={{ position:'relative', zIndex:1 }}>
            <div className="ka-hero-eyebrow">Pengelolaan Akun</div>
            <h1 className="ka-hero-title">
              Kelola Akun <span>Dinsos &amp; Satpol PP</span>
            </h1>
            <div className="ka-hero-sub">
              {perluCount > 0
                ? <>Ada <strong>{perluCount} akun</strong> yang membutuhkan verifikasi dari Dinas Sosial & Satpol PP.</>
                : <>Semua akun aktif dan terverifikasi. Total <strong>{accounts.length} akun</strong> terdaftar.</>
              }
            </div>
          </div>
          {perluCount > 0 && (
            <button className="ka-hero-btn">
              Tinjau Sekarang {I.arrow}
            </button>
          )}
        </div>

        {/* ── FILTER BAR (glass) ── */}
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

        {/* ── DAFTAR AKUN ── */}
        <div className="ka-list-card">
          <div className="ka-list-head">
            <div className="ka-list-title">
              {I.users}
              Daftar Akun Petugas
              <span style={{
                fontSize:11, fontWeight:700, color:TEAL,
                background:'rgba(60,110,113,0.1)', padding:'2px 9px', borderRadius:99,
              }}>
                {filtered.length} akun
              </span>
            </div>
            <button className="ka-export-btn" onClick={handleExport}>
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
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            <span style={{ color:NAVY }}>Aktifkan Akun</span>
                          </div>
                        )}
                        {acc.status !== 'nonaktif' && (
                          <div className="ka-dropdown-item" onClick={() => handleStatusChange(acc.id, 'nonaktif')}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                            <span style={{ color:NAVY }}>Nonaktifkan Akun</span>
                          </div>
                        )}
                        <div className="ka-dropdown-divider" />
                        <div className="ka-dropdown-item danger" onClick={() => handleHapus(acc.id)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2.2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
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