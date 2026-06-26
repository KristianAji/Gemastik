import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'

// ── Colour tokens (sama dengan AdminBeranda) ──────────────────
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
const BLUE   = '#2563EB'

export default function AdminStatistik() {
  const laporan = useStore(s => s.laporan)
  const navigate = useNavigate()
  const [period, setPeriod]   = useState('bulan')
  const [hovBar, setHovBar]   = useState(null)

  const selesai = laporan.filter(l => l.status === 'selesai').length
  const tingkat = laporan.length ? Math.round((selesai / laporan.length) * 100) : 0

  // ── Data ──────────────────────────────────────────────────────
  const bars = [
    { label:'Sen', val:8,  color:T    },
    { label:'Sel', val:14, color:RED  },
    { label:'Rab', val:11, color:AMBER},
    { label:'Kam', val:20, color:RED  },
    { label:'Jum', val:17, color:AMBER},
    { label:'Sab', val:9,  color:T    },
    { label:'Min', val:5,  color:T    },
  ]
  const maxVal = Math.max(...bars.map(b => b.val))

  const donut = [
    { label:'Berjualan', pct:45, color:RED   },
    { label:'Mengamen',  pct:28, color:AMBER  },
    { label:'Mengemis',  pct:17, color:BLUE   },
    { label:'Figuran',   pct:10, color:GREEN  },
  ]

  const areas = [
    { nama:'Kawasan Megamas',    jumlah:48, pct:100, tingkat:'87%', pill:'green' },
    { nama:'Pasar 45',           jumlah:35, pct:73,  tingkat:'91%', pill:'green' },
    { nama:'Jl. Boulevard',      jumlah:27, pct:56,  tingkat:'96%', pill:'green' },
    { nama:'Manado Town Square', jumlah:19, pct:40,  tingkat:'79%', pill:'amber' },
    { nama:'Kawasan Wenang',     jumlah:13, pct:27,  tingkat:'85%', pill:'green' },
  ]

  // ── Build donut SVG paths ──────────────────────────────────────
  const DONUT_R = 45, DONUT_CX = 60, DONUT_CY = 60
  let cumulative = 0
  const donutPaths = donut.map(d => {
    const startAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2
    cumulative += d.pct
    const endAngle   = (cumulative / 100) * 2 * Math.PI - Math.PI / 2
    const x1 = DONUT_CX + DONUT_R * Math.cos(startAngle)
    const y1 = DONUT_CY + DONUT_R * Math.sin(startAngle)
    const x2 = DONUT_CX + DONUT_R * Math.cos(endAngle)
    const y2 = DONUT_CY + DONUT_R * Math.sin(endAngle)
    return { ...d, d:`M ${DONUT_CX} ${DONUT_CY} L ${x1} ${y1} A ${DONUT_R} ${DONUT_R} 0 ${d.pct > 50 ? 1 : 0} 1 ${x2} ${y2} Z` }
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .as-root * { box-sizing: border-box; }

        .as-root {
          font-family: 'Inter', sans-serif;
          background: ${BG};
          color: ${TEXT};
          flex: 1;
          overflow-y: auto;
          padding: 28px 32px 60px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* ── TOPBAR ── */
        .as-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .as-topbar-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: ${N};
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .as-topbar-sub {
          font-size: 12px;
          color: ${MUTED};
          margin-top: 3px;
          font-weight: 500;
        }
        .as-period-group { display: flex; gap: 6px; }
        .as-btn-period {
          padding: 9px 18px;
          border-radius: 9px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; font-weight: 700;
          cursor: pointer; border: 1.5px solid transparent;
          transition: all 0.18s;
        }
        .as-btn-period.active {
          background: ${N}; color: #fff; border-color: ${N};
        }
        .as-btn-period.inactive {
          background: transparent; color: ${N}; border-color: ${BORDER};
        }
        .as-btn-period.inactive:hover { background: ${N}; color: #fff; }

        /* ── KPI GLASS CARDS ── */
        .as-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .as-kpi-card {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 16px;
          padding: 22px;
          position: relative; overflow: hidden;
          transition: box-shadow 0.2s, transform 0.15s, background 0.2s;
        }
        .as-kpi-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px; border-radius: 16px 16px 0 0;
        }
        .as-kpi-card.c-teal::before  { background: ${T};     }
        .as-kpi-card.c-green::before { background: ${GREEN}; }
        .as-kpi-card.c-amber::before { background: ${AMBER}; }
        .as-kpi-card.c-blue::before  { background: ${BLUE};  }
        .as-kpi-card:hover {
          background: rgba(255,255,255,0.75);
          box-shadow: 0 8px 32px rgba(60,110,113,0.14);
          transform: translateY(-2px);
        }
        .as-kpi-icon-wrap {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .as-kpi-icon-wrap.c-teal  { background:rgba(60,110,113,0.1);  border:1px solid rgba(60,110,113,0.2);  color:${T};     }
        .as-kpi-icon-wrap.c-green { background:rgba(30,126,74,0.1);   border:1px solid rgba(30,126,74,0.2);   color:${GREEN}; }
        .as-kpi-icon-wrap.c-amber { background:rgba(212,130,10,0.1);  border:1px solid rgba(212,130,10,0.2);  color:${AMBER}; }
        .as-kpi-icon-wrap.c-blue  { background:rgba(37,99,235,0.1);   border:1px solid rgba(37,99,235,0.2);   color:${BLUE};  }
        .as-kpi-num {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 34px; font-weight: 800;
          line-height: 1; margin-bottom: 5px; letter-spacing: -0.02em;
        }
        .as-kpi-num.c-teal  { color: ${T};     }
        .as-kpi-num.c-green { color: ${GREEN}; }
        .as-kpi-num.c-amber { color: ${AMBER}; }
        .as-kpi-num.c-blue  { color: ${BLUE};  }
        .as-kpi-label { font-size: 12px; color: ${MUTED}; font-weight: 500; margin-bottom: 12px; }
        .as-kpi-delta { font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
        .as-kpi-delta.up   { color: ${GREEN}; }
        .as-kpi-delta.down { color: ${BLUE};  }
        .as-kpi-bar { height: 3px; border-radius: 2px; background: rgba(60,110,113,0.12); margin-top: 14px; overflow: hidden; }
        .as-kpi-bar-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }

        /* ── CARD BASE ── */
        .as-card { background: ${CARD}; border: 1px solid ${BORDER}; border-radius: 14px; overflow: hidden; }
        .as-card-head {
          padding: 16px 20px; border-bottom: 1px solid ${BORDER};
          display: flex; align-items: center; justify-content: space-between;
        }
        .as-card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700; color: ${N};
          display: flex; align-items: center; gap: 8px;
        }

        /* ── CHARTS ROW ── */
        .as-charts-row { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }

        /* Bar chart */
        .as-bar-wrap { display: flex; align-items: flex-end; gap: 8px; height: 130px; }
        .as-bar-col { display: flex; flex-direction: column; align-items: center; flex: 1; gap: 4px; height: 100%; justify-content: flex-end; }
        .as-bar-val { font-size: 10px; color: ${MUTED}; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; }
        .as-bar-rect { width: 100%; border-radius: 5px 5px 0 0; cursor: pointer; transition: opacity 0.15s; }
        .as-bar-day { font-size: 9px; color: #9BAAB5; }

        /* Donut */
        .as-donut-wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 0 20px 20px; }
        .as-donut-legend { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .as-donut-item { display: flex; align-items: center; gap: 8px; font-size: 11px; color: ${MUTED}; }
        .as-donut-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
        .as-donut-pct { font-weight: 700; color: ${TEXT}; margin-left: auto; font-family: 'Plus Jakarta Sans', sans-serif; }

        /* Area table */
        .as-table { width: 100%; border-collapse: collapse; }
        .as-table th {
          font-size: 10px; text-transform: uppercase; letter-spacing: 1px;
          color: #9BAAB5; padding: 8px 20px; text-align: left;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;
          border-bottom: 1px solid ${BORDER};
        }
        .as-table td { padding: 13px 20px; font-size: 12px; border-bottom: 1px solid ${BORDER}; }
        .as-table tr:last-child td { border-bottom: none; }
        .as-table tbody tr:hover td { background: #F8FAFC; }
        .as-loc-name { font-weight: 600; color: ${N}; font-family: 'Plus Jakarta Sans', sans-serif; }
        .as-progress { height: 6px; border-radius: 3px; background: rgba(60,110,113,0.1); overflow: hidden; min-width: 100px; }
        .as-progress-fill { height: 100%; border-radius: 3px; background: ${T}; transition: width 0.5s ease; }
        .as-pill {
          font-size: 10px; font-weight: 700;
          padding: 3px 10px; border-radius: 999px;
          display: inline-flex; align-items: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .as-pill.green { background: rgba(30,126,74,0.1);  color: ${GREEN}; }
        .as-pill.amber { background: rgba(212,130,10,0.1); color: ${AMBER}; }

        @media (max-width: 1100px) {
          .as-kpi-grid  { grid-template-columns: repeat(2, 1fr); }
          .as-charts-row{ grid-template-columns: 1fr; }
          .as-root      { padding: 20px 20px 60px; }
        }
        @media (max-width: 600px) {
          .as-kpi-grid  { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="as-root">

        {/* ── TOPBAR ── */}
        <div className="as-topbar">
          <div>
            <div className="as-topbar-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              Statistik
            </div>
            <div className="as-topbar-sub">Periode: Mei 2026</div>
          </div>
          <div className="as-period-group">
            {[
              { k:'bulan',  l:'Bulan Ini' },
              { k:'3bulan', l:'3 Bulan'   },
              { k:'tahun',  l:'Tahun Ini' },
            ].map(p => (
              <button
                key={p.k}
                className={`as-btn-period ${period === p.k ? 'active' : 'inactive'}`}
                onClick={() => setPeriod(p.k)}
              >
                {p.l}
              </button>
            ))}
          </div>
        </div>

        {/* ── KPI GLASS CARDS ── */}
        <div className="as-kpi-grid">
          {[
            {
              c:'teal', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
              num: laporan.length, label:'Total Laporan Masuk',
              delta:'↑ 18% dari bulan lalu', deltaDir:'up', fill:72, barColor:T,
            },
            {
              c:'green', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
              num:`${tingkat}%`, label:'Tingkat Penanganan',
              delta:'↑ 5% dari bulan lalu', deltaDir:'up', fill:tingkat, barColor:GREEN,
            },
            {
              c:'amber', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
              num:47, label:'Anak Berhasil Dibantu',
              delta:'↑ 12 anak lebih banyak', deltaDir:'up', fill:55, barColor:AMBER,
            },
            {
              c:'blue', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
              num:'2.4j', label:'Rata-rata Waktu Respons',
              delta:'↓ 30 mnt lebih cepat', deltaDir:'down', fill:40, barColor:BLUE,
            },
          ].map((k, i) => (
            <div key={i} className={`as-kpi-card c-${k.c}`}>
              <div className={`as-kpi-icon-wrap c-${k.c}`}>{k.icon}</div>
              <div className={`as-kpi-num c-${k.c}`}>{k.num}</div>
              <div className="as-kpi-label">{k.label}</div>
              <div className={`as-kpi-delta ${k.deltaDir}`}>{k.delta}</div>
              <div className="as-kpi-bar">
                <div className="as-kpi-bar-fill" style={{ width:`${k.fill}%`, background:k.barColor }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── CHARTS ROW ── */}
        <div className="as-charts-row">

          {/* Bar Chart */}
          <div className="as-card">
            <div className="as-card-head">
              <div className="as-card-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                Laporan Masuk per Hari (7 hari terakhir)
              </div>
            </div>
            <div style={{ padding:'20px 20px 0' }}>
              <div className="as-bar-wrap">
                {bars.map((b, i) => (
                  <div key={i} className="as-bar-col">
                    <div className="as-bar-val">{b.val}</div>
                    <div
                      className="as-bar-rect"
                      style={{ height:`${(b.val/maxVal)*100}%`, background:b.color, opacity: hovBar===i ? 1 : 0.6 }}
                      onMouseEnter={() => setHovBar(i)}
                      onMouseLeave={() => setHovBar(null)}
                    />
                    <div className="as-bar-day">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-around', padding:'5px 20px 14px', fontSize:9, color:'#9BAAB5' }}>
              {bars.map(b => <span key={b.label}>{b.label}</span>)}
            </div>
          </div>

          {/* Donut */}
          <div className="as-card">
            <div className="as-card-head">
              <div className="as-card-title">Jenis Aktivitas</div>
            </div>
            <div className="as-donut-wrap">
              <svg viewBox="0 0 120 120" width="120" height="120">
                {donutPaths.map((p, i) => (
                  <path key={i} d={p.d} fill={p.color} opacity="0.85">
                    <title>{p.label}: {p.pct}%</title>
                  </path>
                ))}
                <circle cx="60" cy="60" r="28" fill={CARD} />
                <text x="60" y="65" textAnchor="middle" fill={N} fontSize="14" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">
                  {laporan.length}
                </text>
              </svg>
              <div className="as-donut-legend">
                {donut.map(d => (
                  <div key={d.label} className="as-donut-item">
                    <div className="as-donut-dot" style={{ background:d.color }} />
                    <span style={{ flex:1 }}>{d.label}</span>
                    <span className="as-donut-pct">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── AREA TABLE ── */}
        <div className="as-card">
          <div className="as-card-head">
            <div className="as-card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Sebaran per Lokasi
            </div>
          </div>
          <table className="as-table">
            <thead>
              <tr>
                {['Lokasi','Jumlah Laporan','Proporsi','Tingkat Penanganan'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {areas.map(a => (
                <tr key={a.nama}>
                  <td><span className="as-loc-name">{a.nama}</span></td>
                  <td style={{ fontWeight:600, fontFamily:"'Plus Jakarta Sans',sans-serif", color:N }}>{a.jumlah}</td>
                  <td>
                    <div className="as-progress">
                      <div className="as-progress-fill" style={{ width:`${a.pct}%` }} />
                    </div>
                  </td>
                  <td><span className={`as-pill ${a.pill}`}>{a.tingkat}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  )
}