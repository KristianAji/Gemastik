import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { useState, useEffect, useRef } from 'react'
import { KASUS_DATA, PETA_TITIK } from './dinsoConstants'

const NAVY  = '#284B63'
const TEAL  = '#3C6E71'
const TEXT  = '#353535'
const MUTED = '#6B7C8D'
const BORDER= '#D9D9D9'
const CARD  = '#FFFFFF'
const BG    = '#F4F7F9'
const RED   = '#C0392B'
const AMBER = '#D4820A'
const GREEN = '#1E7E4A'
const BLUE  = '#BFDBF7'

const I = {
  kasus:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  peta:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  chart:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  export:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  refresh: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  arrow:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  pin:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  warning: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  check:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  user:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  clock:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  ai:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
}

export default function DinsosBeranda() {
  const navigate    = useNavigate()
  const user        = useStore(s => s.user)
  const showToast   = useStore(s => s.showToast)
  const laporan     = useStore(s => s.laporan)

  const [clock, setClock]         = useState({ date: '', time: '' })
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock({
        date: now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      })
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const totalKasus   = KASUS_DATA.length
  const kasusProses  = KASUS_DATA.filter(k => k.status === 'proses').length
  const kasusSelesai = KASUS_DATA.filter(k => k.status === 'selesai').length
  const tingkat      = Math.round((kasusSelesai / totalKasus) * 100)
  const totalLaporan = laporan.length
  const laporanBaru  = laporan.filter(l => l.status === 'baru').length

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => { setRefreshing(false); showToast('Data berhasil diperbarui') }, 1200)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .db-root * { box-sizing: border-box; }
        .db-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: ${BG};
          color: ${TEXT};
          flex: 1;
          overflow-y: auto;
          padding: 36px 36px 60px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* ══ HERO ══ */
        .db-hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; }
        .db-hero-left { flex: 1; }
        .db-hero-eyebrow {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: ${TEAL}; margin-bottom: 10px;
        }
        .db-hero-title {
          font-size: clamp(22px, 2.5vw, 30px); font-weight: 800;
          color: ${NAVY}; line-height: 1.2; letter-spacing: -0.02em; margin: 0 0 6px;
        }
        .db-hero-sub {
          font-size: 13px; color: ${MUTED}; line-height: 1.7;
          max-width: 520px; margin: 0 0 20px;
        }
        .db-hero-actions { display: flex; gap: 10px; flex-wrap: wrap; }

        .db-btn-primary {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 20px; background: ${NAVY}; color: #fff;
          border: none; border-radius: 9px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700; cursor: pointer;
          transition: background 0.18s, transform 0.12s;
        }
        .db-btn-primary:hover { background: ${TEAL}; transform: translateY(-1px); }

        .db-btn-glass {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 20px;
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          color: ${NAVY}; border: 1px solid rgba(255,255,255,0.8); border-radius: 9px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer;
          box-shadow: 0 2px 12px rgba(40,75,99,0.08); transition: all 0.18s;
        }
        .db-btn-glass:hover { background: rgba(255,255,255,0.88); transform: translateY(-1px); }

        /* Clock */
        .db-clock-box {
          background: rgba(255,255,255,0.50);
          backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255,255,255,0.45);
          box-shadow: 0 8px 30px rgba(40,75,99,0.08);
          border-radius: 16px; padding: 22px 24px;
          width: 240px; flex-shrink: 0;
          display: flex; flex-direction: column; align-items: flex-end; gap: 6px;
        }
        .db-clock-wita { font-size: 10px; font-weight: 700; color: ${TEAL}; letter-spacing: 0.08em; }
        .db-clock-time { font-size: 46px; font-weight: 800; color: ${NAVY}; letter-spacing: -0.04em; }
        .db-clock-date { color: ${MUTED}; font-size: 12px; text-align: right; }

        /* ══ STATS ══ */
        .db-stats-section {
          background: ${CARD}; border: 1px solid ${BORDER};
          border-radius: 16px; overflow: hidden;
        }
        .db-stats-row { display: flex; }
        .db-stat-item {
          flex: 1; padding: 36px 28px 28px;
          border-right: 1px solid ${BORDER}; position: relative;
        }
        .db-stat-item:last-child { border-right: none; }
        .db-stat-num {
          font-size: clamp(48px, 5vw, 64px); font-weight: 800;
          line-height: 1; margin-bottom: 10px; letter-spacing: -0.03em;
        }
        .db-stat-label { font-size: 13px; font-weight: 500; color: ${MUTED}; line-height: 1.5; margin-bottom: 20px; }
        .db-stat-bar { height: 3px; border-radius: 2px; background: ${BORDER}; overflow: hidden; }
        .db-stat-bar-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }

        /* ══ CARD ══ */
        .db-card { background: ${CARD}; border: 1px solid ${BORDER}; border-radius: 14px; overflow: hidden; }
        .db-card-head {
          padding: 14px 20px; border-bottom: 1px solid ${BORDER};
          display: flex; align-items: center; justify-content: space-between;
        }
        .db-card-title { font-size: 13px; font-weight: 700; color: ${NAVY}; display: flex; align-items: center; gap: 8px; }
        .db-card-link {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; color: ${TEAL}; font-weight: 600;
          background: none; border: none; padding: 0; cursor: pointer; transition: color 0.15s;
        }
        .db-card-link:hover { color: ${NAVY}; }

        /* ══ MAIN GRID ══ */
        .db-main-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }

        /* ══ AKTIVITAS ══ */
        .db-activity {
          padding: 13px 20px; border-bottom: 1px solid ${BORDER};
          display: flex; gap: 12px; align-items: flex-start;
          cursor: pointer; transition: background 0.12s;
        }
        .db-activity:last-child { border-bottom: none; }
        .db-activity:hover { background: #F8FAFC; }
        .db-act-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
        .db-act-title { font-size: 12px; font-weight: 700; color: ${TEXT}; margin-bottom: 3px; }
        .db-act-desc  { font-size: 11px; color: ${MUTED}; line-height: 1.6; }
        .db-act-time  { font-size: 10px; color: #9BAAB5; flex-shrink: 0; padding-top: 2px; white-space: nowrap; }
        .db-act-tag {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 20px; margin-top: 5px;
        }

        /* ══ AKSES CEPAT ══ */
        .db-qa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 14px; }
        .db-qa-item {
          padding: 12px 10px; border-radius: 10px;
          border: 1px solid ${BORDER}; background: #F8FAFC;
          cursor: pointer; text-align: center; transition: all 0.18s;
        }
        .db-qa-item:hover { border-color: ${TEAL}; background: rgba(60,110,113,0.05); }
        .db-qa-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: rgba(40,75,99,0.08); border: 1px solid rgba(40,75,99,0.12);
          display: flex; align-items: center; justify-content: center;
          color: ${NAVY}; margin: 0 auto 8px;
        }
        .db-qa-label { font-size: 11px; font-weight: 600; color: ${TEXT}; }

        /* ══ KASUS AKTIF ══ */
        .db-kasus-item {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 20px; border-bottom: 1px solid ${BORDER};
          cursor: pointer; transition: background 0.12s;
        }
        .db-kasus-item:last-child { border-bottom: none; }
        .db-kasus-item:hover { background: #FEF9F9; }
        .db-kasus-dot { width: 6px; height: 6px; border-radius: 50%; background: ${AMBER}; flex-shrink: 0; }
        .db-kasus-name { flex: 1; font-size: 12px; font-weight: 700; color: ${TEXT}; }
        .db-kasus-sub  { font-size: 10px; color: ${MUTED}; }
        .db-pill {
          font-size: 10px; font-weight: 700; padding: 2px 9px; border-radius: 99px;
          display: inline-flex; align-items: center;
        }

        /* ══ BOTTOM GRID ══ */
        .db-bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        /* ══ BAR CHART ══ */
        .db-bar-wrap { display: flex; align-items: flex-end; gap: 6px; height: 72px; padding: 0 20px; }
        .db-bar-col { flex: 1; position: relative; border-radius: 4px 4px 0 0; cursor: pointer; transition: opacity 0.12s; }
        .db-bar-labels { display: flex; justify-content: space-between; padding: 5px 20px 14px; font-size: 9px; color: #9BAAB5; }

        /* ══ ROW ITEM ══ */
        .db-row-item {
          padding: 11px 20px; border-bottom: 1px solid ${BORDER};
          display: flex; align-items: center; justify-content: space-between; font-size: 12px;
        }
        .db-row-item:last-child { border-bottom: none; }
        .db-row-label { color: ${MUTED}; }
        .db-row-val   { font-weight: 700; color: ${NAVY}; }

        @keyframes db-spin { to { transform: rotate(360deg) } }

        @media (max-width: 1100px) {
          .db-main-grid   { grid-template-columns: 1fr; }
          .db-bottom-grid { grid-template-columns: 1fr; }
          .db-hero        { flex-direction: column; }
          .db-clock-box   { width: 100%; align-items: flex-start; }
          .db-root        { padding: 20px 20px 60px; }
        }
        @media (max-width: 700px) {
          .db-stats-row { flex-direction: column; }
          .db-stat-item { border-right: none; border-bottom: 1px solid ${BORDER}; }
          .db-stat-item:last-child { border-bottom: none; }
        }
      `}</style>

      <div className="db-root">

        {/* ══ HERO ══ */}
        <div className="db-hero">
          <div className="db-hero-left">
            <div className="db-hero-eyebrow">Selamat datang kembali, {user?.nama ?? 'Petugas Dinsos'}</div>
            <h1 className="db-hero-title">
              Dashboard Dinas Sosial:<br/>
              Penanganan &amp; Rehabilitasi<br/>
              Pekerja Anak Kota Manado
            </h1>
            <p className="db-hero-sub">
              Terdapat <strong>{kasusProses} kasus aktif</strong> yang sedang diproses dan{' '}
              <strong>{laporanBaru} laporan baru</strong> menunggu verifikasi hari ini.
            </p>
            <div className="db-hero-actions">
              <button className="db-btn-primary" onClick={() => navigate('/dinsos/kasus')}>
                {I.kasus} Kelola Kasus
                {kasusProses > 0 && (
                  <span style={{ background:'rgba(191,219,247,0.25)', color:'#fff', borderRadius:'99px', fontSize:10, fontWeight:800, padding:'1px 7px' }}>
                    {kasusProses}
                  </span>
                )}
              </button>
              <button className="db-btn-glass" onClick={handleRefresh}>
                <span style={{ display:'inline-flex', animation: refreshing ? 'db-spin 0.7s linear infinite' : 'none' }}>
                  {I.refresh}
                </span>
                {refreshing ? 'Memperbarui...' : 'Perbarui Data'}
              </button>
            </div>
          </div>

          {/* Clock */}
          <div className="db-clock-box">
            <div className="db-clock-wita">WITA</div>
            <div className="db-clock-time">{clock.time}</div>
            <div className="db-clock-date">{clock.date}</div>
          </div>
        </div>

        {/* ══ STATISTIK HORIZONTAL ══ */}
        <div className="db-stats-section">
          <div className="db-stats-row">
            {[
              { num: totalKasus,        label: 'Total Kasus Bulan Ini',  color: NAVY,  fill: 100,    barColor: NAVY  },
              { num: kasusProses,       label: 'Kasus Aktif (Proses)',   color: AMBER, fill: kasusProses / totalKasus * 100, barColor: AMBER },
              { num: kasusSelesai,      label: 'Kasus Selesai',          color: GREEN, fill: tingkat, barColor: GREEN },
              { num: `${tingkat}%`,     label: 'Tingkat Penanganan',     color: TEAL,  fill: tingkat, barColor: TEAL  },
            ].map((s, i) => (
              <div key={i} className="db-stat-item">
                <div className="db-stat-num" style={{ color: s.color }}>{s.num}</div>
                <div className="db-stat-label">{s.label}</div>
                <div className="db-stat-bar">
                  <div className="db-stat-bar-fill" style={{ width: `${s.fill}%`, background: s.barColor, opacity: 0.5 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ MAIN GRID ══ */}
        <div className="db-main-grid">

          {/* Aktivitas Terbaru */}
          <div className="db-card">
            <div className="db-card-head">
              <div className="db-card-title">Aktivitas Terbaru</div>
              <button className="db-card-link" onClick={() => navigate('/dinsos/kasus')}>
                Lihat semua {I.arrow}
              </button>
            </div>
            {[
              { dot: RED,   tag:'Laporan Baru', tagBg:`rgba(192,57,43,0.09)`,  tagColor: RED,   title:'Laporan Baru — Pasar 45',          desc:'Warga melaporkan anak usia 8–10 tahun mengamen di area parkir Pasar 45.',      time:'1 jam',   icon: I.warning },
              { dot: AMBER, tag:'Kasus Aktif',  tagBg:`rgba(212,130,10,0.09)`, tagColor: AMBER, title:'Pendampingan Psikolog — Anak B',    desc:'Jadwal pendampingan psikolog untuk Anak B (P, 8 th) dari Pasar 45 telah diatur.', time:'3 jam', icon: I.user    },
              { dot: AMBER, tag:'Kasus Aktif',  tagBg:`rgba(212,130,10,0.09)`, tagColor: AMBER, title:'Pencarian Orang Tua — Anak E',      desc:'Pencarian orang tua Anak E berlanjut via koordinasi RT/RW Megamas.',          time:'5 jam',   icon: I.user    },
              { dot: GREEN, tag:'Selesai',       tagBg:`rgba(30,126,74,0.09)`,  tagColor: GREEN, title:'Kasus Selesai — Anak D, Jl. Boulevard', desc:'Anak D berhasil dikembalikan ke keluarga. Keluarga terdaftar PKH.',         time:'Kemarin', icon: I.check   },
            ].map((a, i) => (
              <div key={i} className="db-activity" onClick={() => navigate('/dinsos/kasus')}>
                <div className="db-act-dot" style={{ background: a.dot }} />
                <div style={{ flex: 1 }}>
                  <div className="db-act-title">{a.title}</div>
                  <div className="db-act-desc">{a.desc}</div>
                  <span className="db-act-tag" style={{ background: a.tagBg, color: a.tagColor }}>
                    {a.icon} {a.tag}
                  </span>
                </div>
                <div className="db-act-time">{a.time}</div>
              </div>
            ))}
          </div>

          {/* Kolom kanan */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Akses Cepat */}
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">Akses Cepat</div>
              </div>
              <div className="db-qa-grid">
                {[
                  { icon: I.peta,   label: 'Peta Sebaran', href: '/dinsos/peta'      },
                  { icon: I.kasus,  label: 'Tindak Lanjut',href: '/dinsos/kasus'     },
                  { icon: I.chart,  label: 'Statistik',    href: '/dinsos/statistik' },
                  { icon: I.export, label: 'Export CSV',   href: '/dinsos/export'    },
                ].map(q => (
                  <div key={q.label} className="db-qa-item" onClick={() => navigate(q.href)}>
                    <div className="db-qa-icon">{q.icon}</div>
                    <div className="db-qa-label">{q.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kasus Aktif */}
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title" style={{ color: AMBER }}>
                  {I.clock} Kasus Perlu Tindakan
                </div>
                <button className="db-card-link" onClick={() => navigate('/dinsos/kasus')}>
                  Lihat semua {I.arrow}
                </button>
              </div>
              {KASUS_DATA.filter(k => k.status === 'proses').map(k => (
                <div key={k.id} className="db-kasus-item" onClick={() => navigate('/dinsos/kasus')}>
                  <div className="db-kasus-dot" />
                  <div style={{ flex: 1 }}>
                    <div className="db-kasus-name">{k.nama}</div>
                    <div className="db-kasus-sub">{k.lokasi} · {k.petugas}</div>
                  </div>
                  <span className="db-pill" style={{ background:'rgba(212,130,10,0.09)', color: AMBER }}>Proses</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ BOTTOM GRID ══ */}
        <div className="db-bottom-grid">

          {/* Mini Chart Kasus */}
          <div className="db-card">
            <div className="db-card-head">
              <div className="db-card-title">{I.chart} Kasus 7 Hari Terakhir</div>
              <button className="db-card-link" onClick={() => navigate('/dinsos/statistik')}>
                Detail {I.arrow}
              </button>
            </div>
            <MiniChart />
          </div>

          {/* Lokasi Rawan */}
          <div className="db-card">
            <div className="db-card-head">
              <div className="db-card-title">{I.pin} Lokasi Paling Rawan</div>
              <button className="db-card-link" onClick={() => navigate('/dinsos/peta')}>
                Peta {I.arrow}
              </button>
            </div>
            {[...PETA_TITIK].sort((a, b) => b.count - a.count).slice(0, 4).map(p => (
              <div key={p.label} className="db-row-item">
                <span className="db-row-label">{p.label}</span>
                <span className="db-row-val" style={{ color: TEAL }}>{p.count} laporan</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}

/* ── Mini Bar Chart ──────────────────────────────────────────── */
function MiniChart() {
  const bars = [
    { label:'Sen', val:3 }, { label:'Sel', val:5 }, { label:'Rab', val:4 },
    { label:'Kam', val:7 }, { label:'Jum', val:6 }, { label:'Sab', val:2 }, { label:'Min', val:1 },
  ]
  const max = Math.max(...bars.map(b => b.val))
  const [hov, setHov] = useState(null)

  return (
    <>
      <div className="db-bar-wrap">
        {bars.map((b, i) => (
          <div
            key={i}
            className="db-bar-col"
            style={{ height: `${(b.val / max) * 100}%`, background: TEAL, opacity: hov === i ? 1 : 0.45 }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
          >
            {hov === i && (
              <div style={{
                position:'absolute', bottom:'108%', left:'50%', transform:'translateX(-50%)',
                background: NAVY, color:'#fff', borderRadius:5, padding:'2px 7px',
                fontSize:10, fontWeight:700, whiteSpace:'nowrap',
                fontFamily:"'Plus Jakarta Sans',sans-serif",
              }}>{b.val} kasus</div>
            )}
          </div>
        ))}
      </div>
      <div className="db-bar-labels">{bars.map(b => <span key={b.label}>{b.label}</span>)}</div>
    </>
  )
}