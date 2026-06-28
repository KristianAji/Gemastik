import { useState } from 'react'
import { useStore } from '../../store/useStore'

const N      = '#022B3A'
const T      = '#3C6E71'
const TEXT   = '#1a2e3b'
const MUTED  = '#5A7080'
const BORDER = '#D6DCE4'
const CARD   = '#FFFFFF'
const BG     = '#E1E5F2'
const RED    = '#C0392B'
const AMBER  = '#D4820A'
const GREEN  = '#1E7E4A'

// ── Icons (gantikan emoji) ───────────────────────────────────────
const Icon = {
  doc:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  plus:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  download: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  ai:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  user:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
}

export default function AdminLaporan() {
  const laporan    = useStore(s => s.laporan)
  const openModal  = useStore(s => s.openModal)
  const showToast  = useStore(s => s.showToast)
  const [filter, setFilter] = useState('semua')
  const [search,  setSearch]  = useState('')
  const [page, setPage]       = useState(1)
  const PER_PAGE = 10

  const filtered = laporan.filter(l => {
    if (filter === 'baru'    && l.status !== 'baru')    return false
    if (filter === 'proses'  && l.status !== 'proses')  return false
    if (filter === 'selesai' && l.status !== 'selesai') return false
    if (filter === 'ai'      && !l.sumber.includes('AI')) return false
    if (filter === 'warga'   && l.sumber.includes('AI')) return false
    if (search && !l.lokasi.toLowerCase().includes(search.toLowerCase()) && !l.sumber.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const pages = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const counts = {
    semua:   laporan.length,
    baru:    laporan.filter(l => l.status === 'baru').length,
    proses:  laporan.filter(l => l.status === 'proses').length,
    selesai: laporan.filter(l => l.status === 'selesai').length,
  }

  // Jenis aktivitas: satu warna netral (teal) — bukan indikator urgensi
  const jenisStyle = { bg: 'rgba(60,110,113,0.1)', color: T }

  // Status: warna semantik alur kerja (tetap dibedakan, ini bukan "warna-warni acak")
  const statusStyle = {
    baru:    { bg: 'rgba(192,57,43,0.1)',  color: RED,   label: 'Baru'      },
    proses:  { bg: 'rgba(212,130,10,0.1)', color: AMBER, label: 'Diproses'  },
    selesai: { bg: 'rgba(30,126,74,0.1)',  color: GREEN, label: 'Selesai'   },
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        .lp-root * { box-sizing: border-box; }
        .lp-root {
          font-family: 'Inter', sans-serif;
          background: ${BG};
          color: ${TEXT};
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        /* Topbar (judul + aksi) — pola sama dgn halaman admin lain (icon kotak + judul) */
        .lp-topbar {
          padding: 20px 28px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          flex-shrink: 0;
        }
        .lp-title-wrap { display: flex; align-items: center; gap: 12px; }
        .lp-title-icon {
          width: 40px; height: 40px; border-radius: 11px;
          background: rgba(60,110,113,0.1);
          border: 1px solid rgba(60,110,113,0.25);
          display: flex; align-items: center; justify-content: center;
          color: ${T}; flex-shrink: 0;
        }
        .lp-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 18px; font-weight: 800; color: ${N};
        }
        .lp-subtitle { font-size: 12px; color: ${MUTED}; margin-top: 2px; }
        .lp-topbar-actions { display: flex; gap: 8px; }

        /* Buttons */
        .lp-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 18px; border-radius: 9px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; font-weight: 700;
          cursor: pointer; transition: all 0.15s; border: none;
        }
        .lp-btn-teal    { background: ${T}; color: #fff; }
        .lp-btn-teal:hover { background: #2f5759; }
        .lp-btn-ghost   { background: ${CARD}; color: ${MUTED}; border: 1px solid ${BORDER}; }
        .lp-btn-ghost:hover { border-color: ${T}; color: ${T}; }
        .lp-btn-primary { background: ${T}; color: #fff; padding: 6px 12px; font-size: 11px; }
        .lp-btn-primary:hover { background: #2f5759; }
        .lp-btn-green   { background: rgba(30,126,74,0.1); color: ${GREEN}; border: 1px solid rgba(30,126,74,0.3); padding: 6px 12px; font-size: 11px; }
        .lp-btn-green:hover { background: ${GREEN}; color: #fff; }
        .lp-btn-detail  { background: ${CARD}; color: ${MUTED}; border: 1px solid ${BORDER}; padding: 6px 12px; font-size: 11px; }
        .lp-btn-detail:hover { border-color: ${T}; color: ${T}; }

        /* Scroll area konten (di bawah topbar) */
        .lp-scroll { flex: 1; min-height: 0; overflow-y: auto; padding: 0 28px 60px; }

        /* Filters */
        .lp-filters { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
        .lp-filter-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 20px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.15s;
        }
        .lp-search-wrap { position: relative; margin-left: auto; }
        .lp-search-icon {
          position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
          color: ${MUTED}; pointer-events: none; display: flex;
        }
        .lp-search {
          padding: 8px 14px 8px 32px; border-radius: 9px;
          border: 1px solid ${BORDER}; background: ${CARD};
          color: ${TEXT}; font-size: 12px; outline: none; width: 220px;
          font-family: 'Inter', sans-serif;
        }
        .lp-search:focus { border-color: ${T}; }

        /* Table card */
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
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap;
        }
        .lp-td { padding: 13px 14px; border-bottom: 1px solid ${BORDER}; white-space: nowrap; }
        .lp-tr:last-child .lp-td { border-bottom: none; }
        .lp-tr { transition: background 0.12s; }
        .lp-tr:hover .lp-td { background: #F8FAFC; }

        /* Badges */
        .lp-tag, .lp-pill {
          display: inline-flex; align-items: center;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap;
        }
        .lp-source {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; color: ${MUTED};
        }

        /* Pagination */
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

        /* Empty */
        .lp-empty { padding: 50px 20px; text-align: center; color: ${MUTED}; font-size: 13px; }

        @media (max-width: 700px) {
          .lp-topbar, .lp-scroll { padding-left: 18px; padding-right: 18px; }
          .lp-search-wrap { margin-left: 0; width: 100%; }
          .lp-search { width: 100%; }
        }
      `}</style>

      {/* ── Topbar ── */}
      <div className="lp-topbar">
        <div className="lp-title-wrap">
          <span className="lp-title-icon">{Icon.doc}</span>
          <div>
            <div className="lp-title">Semua Laporan</div>
            <div className="lp-subtitle">Total {laporan.length} laporan tercatat</div>
          </div>
        </div>
        <div className="lp-topbar-actions">
          <button className="lp-btn lp-btn-teal" onClick={() => openModal('tambah-laporan')}>
            {Icon.plus} Tambah Manual
          </button>
          <button className="lp-btn lp-btn-ghost" onClick={handleExport}>
            {Icon.download} Export CSV
          </button>
        </div>
      </div>

      {/* ── Scroll body ── */}
      <div className="lp-scroll">

        {/* Filters */}
        <div className="lp-filters">
          {[
            { key: 'semua',   label: `Semua (${counts.semua})`     },
            { key: 'baru',    label: `Baru (${counts.baru})`       },
            { key: 'proses',  label: `Diproses (${counts.proses})` },
            { key: 'selesai', label: `Selesai (${counts.selesai})` },
            { key: 'ai',      label: 'AI Detection', icon: Icon.ai    },
            { key: 'warga',   label: 'Laporan Warga', icon: Icon.user },
          ].map(f => (
            <button
              key={f.key}
              className="lp-filter-btn"
              onClick={() => { setFilter(f.key); setPage(1) }}
              style={{
                background: filter === f.key ? T       : 'transparent',
                color:      filter === f.key ? '#fff'  : MUTED,
                border:     `1px solid ${filter === f.key ? T : BORDER}`,
              }}
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

        {/* Table */}
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
                    <td className="lp-td" style={{ fontFamily: 'monospace', color: MUTED, fontSize: 11 }}>
                      #{l.id}
                    </td>
                    <td className="lp-td">
                      <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {l.lokasi}
                      </div>
                      {l.subLokasi && (
                        <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{l.subLokasi}</div>
                      )}
                    </td>
                    <td className="lp-td">
                      <span className="lp-tag" style={{ background: jenisStyle.bg, color: jenisStyle.color }}>
                        {l.jenis}
                      </span>
                    </td>
                    <td className="lp-td" style={{ fontSize: 12, color: TEXT }}>{l.jumlah}</td>
                    <td className="lp-td">
                      <span className="lp-source">{isAI ? Icon.ai : Icon.user} {isAI ? 'AI' : l.sumber}</span>
                    </td>
                    <td className="lp-td" style={{ fontSize: 12, color: MUTED }}>{l.waktu}</td>
                    <td className="lp-td">
                      <span className="lp-pill" style={{ background: sStyle.bg, color: sStyle.color }}>
                        {sStyle.label}
                      </span>
                    </td>
                    <td className="lp-td">
                      <div style={{ display: 'flex', gap: 6 }}>
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

        {/* Pagination */}
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
    </div>
  )
}