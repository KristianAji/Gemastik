import { useState } from 'react'
import { useStore } from '../../store/useStore'

/* ── Palette (identik AdminPeta) ─────────────────────────────── */
const N      = '#284B63'
const T      = '#3C6E71'
const TEXT   = '#353535'
const MUTED  = '#6B7C8D'
const BORDER = '#D9D9D9'
const CARD   = '#FFFFFF'
const BG     = '#F4F7F9'
const RED    = '#C0392B'
const AMBER  = '#D4820A'
const GREEN  = '#1E7E4A'

/* ── Icons ───────────────────────────────────────────────────── */
const Icon = {
  doc: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  plus: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  download: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  search: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  ai: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  user: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  warning: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  check: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  proses: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
}

export default function AdminLaporan() {
  const laporan   = useStore(s => s.laporan)
  const openModal = useStore(s => s.openModal)
  const showToast = useStore(s => s.showToast)

  const [filter, setFilter] = useState('semua')
  const [search, setSearch] = useState('')
  const [page,   setPage]   = useState(1)
  const PER_PAGE = 10

  const total   = laporan.length
  const baru    = laporan.filter(l => l.status === 'baru')
  const proses  = laporan.filter(l => l.status === 'proses').length
  const selesai = laporan.filter(l => l.status === 'selesai').length
  const tingkat = total ? Math.round((selesai / total) * 100) : 0

  const counts = { semua: total, baru: baru.length, proses, selesai }

  const filtered = laporan.filter(l => {
    if (filter === 'baru'    && l.status !== 'baru')    return false
    if (filter === 'proses'  && l.status !== 'proses')  return false
    if (filter === 'selesai' && l.status !== 'selesai') return false
    if (filter === 'ai'      && !l.sumber.includes('AI')) return false
    if (filter === 'warga'   && l.sumber.includes('AI')) return false
    if (search && !l.lokasi.toLowerCase().includes(search.toLowerCase()) &&
        !l.sumber.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const pages = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const jenisStyle = { bg: 'rgba(60,110,113,0.1)', color: T }
  const statusStyle = {
    baru:    { bg: 'rgba(192,57,43,0.1)',  color: RED,   label: 'Baru'     },
    proses:  { bg: 'rgba(212,130,10,0.1)', color: AMBER, label: 'Diproses' },
    selesai: { bg: 'rgba(30,126,74,0.1)',  color: GREEN, label: 'Selesai'  },
  }

  const handleExport = () => {
    const csv = [
      'ID,Lokasi,Jenis,Jumlah,Sumber,Waktu,Status',
      ...laporan.map(l => `${l.id},"${l.lokasi}",${l.jenis},${l.jumlah},"${l.sumber}","${l.waktu}",${l.status}`),
    ].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'laporan-delcion.csv'
    a.click()
    showToast?.('File CSV berhasil diunduh')
  }

  return (
    <div className="lp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .lp-root * { box-sizing: border-box; }
        .lp-root {
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

        /* ══ BANNER (identik Peta) ══ */
        .lp-banner {
          background: ${N};
          border-radius: 18px;
          padding: 28px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .lp-banner::before {
          content: '';
          position: absolute;
          right: -80px; top: -80px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(60,110,113,0.3) 0%, transparent 65%);
          pointer-events: none;
        }
        .lp-banner::after {
          content: '';
          position: absolute;
          left: 40%; bottom: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(191,219,247,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .lp-banner-eyebrow {
          font-size: 11px;
          color: rgba(191,219,247,0.5);
          margin-bottom: 8px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .lp-banner-title {
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .lp-banner-title span { color: #BFDBF7; }
        .lp-banner-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          line-height: 1.65;
          max-width: 440px;
        }
        .lp-banner-sub strong { color: #fff; font-weight: 700; }
        .lp-banner-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .lp-btn-teal {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 22px;
          background: ${T};
          color: #fff; border: none; border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .lp-btn-teal:hover { background: #2f5759; transform: translateY(-1px); }
        .lp-btn-ghost-dark {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 22px;
          background: rgba(255,255,255,0.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .lp-btn-ghost-dark:hover { background: rgba(255,255,255,0.14); }

        /* ══ KPI GLASS CARDS (identik Peta) ══ */
        .lp-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          flex-shrink: 0;
        }
        .lp-kpi-card {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 16px;
          padding: 22px;
          transition: box-shadow 0.2s, transform 0.15s, background 0.2s;
          position: relative;
          overflow: hidden;
        }
        .lp-kpi-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--accent-color, ${T});
          border-radius: 16px 16px 0 0;
        }
        .lp-kpi-card:hover {
          background: rgba(255,255,255,0.75);
          box-shadow: 0 8px 32px rgba(60,110,113,0.14);
          transform: translateY(-2px);
        }
        .lp-kpi-icon-wrap {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: var(--icon-bg, rgba(60,110,113,0.1));
          border: 1px solid var(--icon-border, rgba(60,110,113,0.2));
          display: flex; align-items: center; justify-content: center;
          color: var(--icon-color, ${T});
          margin-bottom: 16px;
        }
        .lp-kpi-num {
          font-size: 34px;
          font-weight: 800;
          color: var(--num-color, ${T});
          line-height: 1;
          margin-bottom: 5px;
          letter-spacing: -0.02em;
        }
        .lp-kpi-label {
          font-size: 12px;
          color: ${MUTED};
          font-weight: 500;
          margin-bottom: 12px;
        }
        .lp-kpi-delta {
          font-size: 11px;
          font-weight: 600;
          color: var(--delta-color, ${T});
        }
        .lp-kpi-bar {
          height: 3px;
          border-radius: 2px;
          background: rgba(60,110,113,0.12);
          margin-top: 14px;
          overflow: hidden;
        }
        .lp-kpi-bar-fill {
          height: 100%;
          border-radius: 2px;
          background: var(--bar-color, ${T});
          transition: width 1s ease;
        }

        /* ══ FILTER + SEARCH ══ */
        .lp-filter-row {
          display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
        }
        .lp-filter-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 999px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: all 0.15s;
          background: rgba(255,255,255,0.7);
          color: ${MUTED};
          border: 1.5px solid ${BORDER};
        }
        .lp-filter-pill:hover { background: rgba(60,110,113,0.08); border-color: ${T}; color: ${T}; }
        .lp-filter-pill.active { background: ${N}; color: #fff; border-color: ${N}; }
        .lp-search-wrap { position: relative; margin-left: auto; }
        .lp-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: ${MUTED}; pointer-events: none; display: flex; }
        .lp-search {
          padding: 8px 14px 8px 32px; border-radius: 9px;
          border: 1px solid ${BORDER}; background: ${CARD};
          color: ${TEXT}; font-size: 12px; outline: none; width: 220px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .lp-search:focus { border-color: ${T}; }

        /* ══ TABLE CARD ══ */
        .lp-table-card {
          background: ${CARD};
          border: 1px solid ${BORDER};
          border-radius: 14px;
          overflow-x: auto;
        }
        .lp-table { width: 100%; border-collapse: collapse; min-width: 760px; }
        .lp-th {
          text-align: left; font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.8px;
          color: ${MUTED}; padding: 12px 14px;
          border-bottom: 1px solid ${BORDER};
          background: #F8FAFC;
          white-space: nowrap;
        }
        .lp-td { padding: 13px 14px; border-bottom: 1px solid ${BORDER}; white-space: nowrap; }
        .lp-tr:last-child .lp-td { border-bottom: none; }
        .lp-tr:hover .lp-td { background: #F8FAFC; }

        .lp-tag, .lp-pill {
          display: inline-flex; align-items: center;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 700; white-space: nowrap;
        }
        .lp-source { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: ${MUTED}; }

        .lp-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px; font-weight: 700;
          cursor: pointer; border: none; transition: all 0.15s;
        }
        .lp-btn-primary  { background: ${T}; color: #fff; }
        .lp-btn-primary:hover { background: #2f5759; }
        .lp-btn-green    { background: rgba(30,126,74,0.1); color: ${GREEN}; border: 1px solid rgba(30,126,74,0.3); }
        .lp-btn-green:hover { background: ${GREEN}; color: #fff; }
        .lp-btn-detail   { background: ${CARD}; color: ${MUTED}; border: 1px solid ${BORDER}; }
        .lp-btn-detail:hover { border-color: ${T}; color: ${T}; }

        /* ══ PAGINATION ══ */
        .lp-pagination { display: flex; gap: 4px; justify-content: center; margin-top: 20px; }
        .lp-page-btn {
          width: 32px; height: 32px; border-radius: 8px;
          border: 1px solid ${BORDER}; background: ${CARD};
          color: ${MUTED}; font-size: 12px; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          transition: all 0.15s;
        }
        .lp-page-btn:hover { border-color: ${T}; color: ${T}; }
        .lp-page-btn.active { background: ${T}; border-color: ${T}; color: #fff; }

        .lp-empty { padding: 50px 20px; text-align: center; color: ${MUTED}; font-size: 13px; }

        @media (max-width: 1100px) {
          .lp-kpi-grid  { grid-template-columns: repeat(2, 1fr); }
          .lp-banner    { flex-direction: column; align-items: flex-start; }
          .lp-root      { padding: 20px 20px 60px; }
        }
        @media (max-width: 700px) {
          .lp-kpi-grid  { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* ══ BANNER ══ */}
      <div className="lp-banner">
        <div style={{ position:'relative', zIndex:1 }}>
          <div className="lp-banner-eyebrow">Manajemen Data</div>
          <div className="lp-banner-title">
            Semua Laporan<br/>
            <span>Pekerja Anak Kota Manado</span>
          </div>
          <div className="lp-banner-sub">
            Terdapat <strong>{baru.length} laporan baru</strong> yang belum ditugaskan
            {proses > 0 && <> dan <strong>{proses} sedang diproses</strong> petugas</>} hari ini.
          </div>
        </div>
        <div className="lp-banner-actions">
          <button className="lp-btn-teal" onClick={() => openModal('tambah-laporan')}>
            {Icon.plus} Tambah Manual
          </button>
          <button className="lp-btn-ghost-dark" onClick={handleExport}>
            {Icon.download} Export CSV
          </button>
        </div>
      </div>

      {/* ══ KPI GLASS CARDS ══ */}
      <div className="lp-kpi-grid">
        {[
          {
            icon: Icon.doc,
            num: total,
            label: 'Total Laporan Bulan Ini',
            delta: 'Seluruh laporan tercatat',
            fill: 100,
            accentColor: T,
            iconBg: 'rgba(60,110,113,0.1)', iconBorder: 'rgba(60,110,113,0.2)', iconColor: T,
            numColor: T, deltaColor: T, barColor: T,
          },
          {
            icon: Icon.warning,
            num: baru.length,
            label: 'Laporan Baru',
            delta: 'Menunggu tindakan segera',
            fill: total ? (baru.length / total) * 100 : 0,
            accentColor: RED,
            iconBg: 'rgba(192,57,43,0.1)', iconBorder: 'rgba(192,57,43,0.2)', iconColor: RED,
            numColor: RED, deltaColor: RED, barColor: RED,
          },
          {
            icon: Icon.proses,
            num: proses,
            label: 'Sedang Diproses',
            delta: 'Dalam penanganan petugas',
            fill: total ? (proses / total) * 100 : 0,
            accentColor: AMBER,
            iconBg: 'rgba(212,130,10,0.1)', iconBorder: 'rgba(212,130,10,0.2)', iconColor: AMBER,
            numColor: AMBER, deltaColor: AMBER, barColor: AMBER,
          },
          {
            icon: Icon.check,
            num: `${tingkat}%`,
            label: 'Tingkat Penanganan',
            delta: `${selesai} laporan berhasil diselesaikan`,
            fill: tingkat,
            accentColor: GREEN,
            iconBg: 'rgba(30,126,74,0.1)', iconBorder: 'rgba(30,126,74,0.2)', iconColor: GREEN,
            numColor: GREEN, deltaColor: GREEN, barColor: GREEN,
          },
        ].map((k, i) => (
          <div
            key={i}
            className="lp-kpi-card"
            style={{
              '--accent-color': k.accentColor,
              '--icon-bg':      k.iconBg,
              '--icon-border':  k.iconBorder,
              '--icon-color':   k.iconColor,
              '--num-color':    k.numColor,
              '--delta-color':  k.deltaColor,
              '--bar-color':    k.barColor,
            }}
          >
            <div className="lp-kpi-icon-wrap">{k.icon}</div>
            <div className="lp-kpi-num">{k.num}</div>
            <div className="lp-kpi-label">{k.label}</div>
            <div className="lp-kpi-delta">{k.delta}</div>
            <div className="lp-kpi-bar">
              <div className="lp-kpi-bar-fill" style={{ width: `${k.fill}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* ══ FILTER + SEARCH ══ */}
      <div className="lp-filter-row">
        {[
          { key: 'semua',   label: `Semua (${counts.semua})`     },
          { key: 'baru',    label: `Baru (${counts.baru})`       },
          { key: 'proses',  label: `Diproses (${counts.proses})` },
          { key: 'selesai', label: `Selesai (${counts.selesai})` },
          { key: 'ai',      label: 'AI Detection', icon: Icon.ai   },
          { key: 'warga',   label: 'Laporan Warga', icon: Icon.user },
        ].map(f => (
          <button
            key={f.key}
            className={`lp-filter-pill${filter === f.key ? ' active' : ''}`}
            onClick={() => { setFilter(f.key); setPage(1) }}
          >
            {f.icon}{f.label}
          </button>
        ))}
        <div className="lp-search-wrap">
          <span className="lp-search-icon">{Icon.search}</span>
          <input
            className="lp-search"
            placeholder="Cari lokasi, pelapor..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      {/* ══ TABLE ══ */}
      <div className="lp-table-card">
        <table className="lp-table">
          <thead>
            <tr>
              {['ID', 'Lokasi', 'Jenis', 'Jml Anak', 'Sumber', 'Waktu', 'Status', 'Aksi'].map(h => (
                <th key={h} className="lp-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map(l => {
              const sStyle = statusStyle[l.status] || { bg: '#eee', color: MUTED, label: l.status }
              const isAI   = l.sumber.includes('AI')
              return (
                <tr key={l.id} className="lp-tr">
                  <td className="lp-td" style={{ fontFamily:'monospace', color:MUTED, fontSize:11 }}>
                    #{l.id}
                  </td>
                  <td className="lp-td">
                    <div style={{ fontSize:12, fontWeight:700, color:TEXT }}>
                      {l.lokasi}
                    </div>
                    {l.subLokasi && (
                      <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>{l.subLokasi}</div>
                    )}
                  </td>
                  <td className="lp-td">
                    <span className="lp-tag" style={{ background:jenisStyle.bg, color:jenisStyle.color }}>
                      {l.jenis}
                    </span>
                  </td>
                  <td className="lp-td" style={{ fontSize:12, color:TEXT }}>{l.jumlah}</td>
                  <td className="lp-td">
                    <span className="lp-source">
                      {isAI ? Icon.ai : Icon.user} {isAI ? 'AI' : l.sumber}
                    </span>
                  </td>
                  <td className="lp-td" style={{ fontSize:12, color:MUTED }}>{l.waktu}</td>
                  <td className="lp-td">
                    <span className="lp-pill" style={{ background:sStyle.bg, color:sStyle.color }}>
                      {sStyle.label}
                    </span>
                  </td>
                  <td className="lp-td">
                    <div style={{ display:'flex', gap:6 }}>
                      {l.status === 'baru' && (
                        <button className="lp-btn lp-btn-primary" onClick={() => openModal('tugaskan', l)}>
                          Tugaskan
                        </button>
                      )}
                      {l.status === 'proses' && (
                        <button className="lp-btn lp-btn-green" onClick={() => openModal('selesai', l)}>
                          Selesaikan
                        </button>
                      )}
                      <button className="lp-btn lp-btn-detail" onClick={() => openModal('detail', l)}>
                        Detail
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {paged.length === 0 && (
              <tr>
                <td colSpan={8} className="lp-empty">Tidak ada laporan ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ══ PAGINATION ══ */}
      {pages > 1 && (
        <div className="lp-pagination">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`lp-page-btn${p === page ? ' active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}