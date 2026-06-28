import { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import {
  N, T, MUTED, BORDER, BG, RED, AMBER, GREEN,
  PETA_TITIK, KASUS_DATA, Icon, SHARED_STYLES,
} from './dinsoConstants'

export default function DinsosStatistik() {
  const showToast = useStore(s => s.showToast)
  const [clock, setClock]       = useState('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const totalSelesai = KASUS_DATA.filter(k => k.status === 'selesai').length
  const totalProses  = KASUS_DATA.filter(k => k.status === 'proses').length
  const tingkat      = Math.round((totalSelesai / KASUS_DATA.length) * 100)

  return (
    <>
      <style>{`
        ${SHARED_STYLES}

        .stat-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .stat-donut-wrap { display: flex; align-items: center; gap: 24px; padding: 20px; }
        .stat-donut-legend { display: flex; flex-direction: column; gap: 10px; }
        .stat-donut-item { display: flex; align-items: center; gap: 8px; font-size: 12px; }
        .stat-donut-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

        .stat-chart-bars {
          display: flex; align-items: flex-end; gap: 4px;
          height: 120px; padding: 8px 20px 0;
        }
        .stat-chart-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .stat-chart-bar { width: 100%; border-radius: 3px 3px 0 0; cursor: pointer; transition: opacity 0.15s; position: relative; }
        .stat-chart-val { font-size: 10px; font-weight: 700; color: ${MUTED}; font-family: 'Plus Jakarta Sans', sans-serif; }
        .stat-chart-labels {
          display: flex; justify-content: space-around;
          padding: 5px 20px 14px; font-size: 9px; color: #9BAAB5;
        }

        @media (max-width: 900px) { .stat-2col { grid-template-columns: 1fr; } }
      `}</style>

      <div className="ds-root">

        {/* ── BANNER ── */}
        <div className="ds-banner">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="ds-banner-eyebrow">Portal Dinas Sosial — Kota Manado</div>
            <div className="ds-banner-title">
              Statistik &amp;<br/>
              <span>Grafik Laporan</span>
            </div>
            <div className="ds-banner-sub">
              Ringkasan data laporan selama 14 hari terakhir.
              Tingkat penanganan saat ini <strong>{tingkat}%</strong> dari{' '}
              <strong>{KASUS_DATA.length} total kasus</strong> terverifikasi.
            </div>
            <div className="ds-banner-clock">{clock} WITA</div>
          </div>
          <div className="ds-banner-actions">
            <button className="ds-btn-teal">{Icon.chart} Cetak Laporan</button>
            <button className="ds-btn-ghost" onClick={() => {
              setRefreshing(true)
              setTimeout(() => { setRefreshing(false); showToast('Statistik diperbarui') }, 1200)
            }}>
              <span style={{ display: 'inline-flex', animation: refreshing ? 'ds-spin 0.7s linear infinite' : 'none' }}>
                {Icon.refresh}
              </span>
              {refreshing ? 'Memperbarui...' : 'Perbarui Data'}
            </button>
          </div>
        </div>

        {/* ── KPI ── */}
        <div className="ds-kpi-grid">
          {[
            { icon: Icon.total, num: KASUS_DATA.length, label: 'Total Kasus Terverifikasi', delta: 'Naik 12% dari bulan lalu',           fill: 100    },
            { icon: Icon.kasus, num: totalProses,        label: 'Kasus Aktif (Proses)',      delta: 'Sedang ditangani petugas',            fill: totalProses / KASUS_DATA.length * 100 },
            { icon: Icon.check, num: totalSelesai,       label: 'Kasus Selesai',             delta: 'Berhasil dikembalikan ke keluarga',   fill: tingkat },
            { icon: Icon.chart, num: `${tingkat}%`,      label: 'Tingkat Penanganan',        delta: 'Target: 85% — On track',             fill: tingkat },
          ].map((k, i) => (
            <div key={i} className="ds-kpi-card">
              <div className="ds-kpi-icon-wrap">{k.icon}</div>
              <div className="ds-kpi-num">{k.num}</div>
              <div className="ds-kpi-label">{k.label}</div>
              <div className="ds-kpi-delta">{k.delta}</div>
              <div className="ds-kpi-bar">
                <div className="ds-kpi-bar-fill" style={{ width: `${k.fill}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── CHART 14 HARI (full width) ── */}
        <div className="ds-card">
          <div className="ds-card-head">
            <div className="ds-card-title">{Icon.chart} Laporan Masuk per Hari — 14 Hari Terakhir</div>
          </div>
          <MiniChart14 />
        </div>

        {/* ── GRID 2 COL ── */}
        <div className="stat-2col">

          {/* Donut distribusi status */}
          <div className="ds-card">
            <div className="ds-card-head">
              <div className="ds-card-title">Distribusi Status Kasus</div>
            </div>
            <div className="stat-donut-wrap">
              <DonutChart selesai={totalSelesai} proses={totalProses} total={KASUS_DATA.length} />
              <div className="stat-donut-legend">
                {[
                  { label: 'Selesai', val: totalSelesai, color: GREEN },
                  { label: 'Proses',  val: totalProses,  color: AMBER },
                  { label: 'Total',   val: KASUS_DATA.length, color: T },
                ].map(d => (
                  <div key={d.label} className="stat-donut-item">
                    <div className="stat-donut-dot" style={{ background: d.color }} />
                    <span style={{ color: MUTED, minWidth: 54 }}>{d.label}</span>
                    <span style={{ fontWeight: 700, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                      {d.val} kasus
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar per lokasi */}
          <div className="ds-card">
            <div className="ds-card-head">
              <div className="ds-card-title">Laporan per Lokasi</div>
            </div>
            <div className="stat-chart-bars" style={{ height: 140, padding: '10px 20px 0' }}>
              {[...PETA_TITIK].sort((a, b) => b.count - a.count).map((p, i) => (
                <div key={p.label} className="stat-chart-bar-wrap">
                  <span className="stat-chart-val">{p.count}</span>
                  <div
                    className="stat-chart-bar"
                    style={{
                      height: `${(p.count / 48) * 100}%`,
                      background: p.alert ? RED : T,
                      opacity: 0.6 + i * 0.06,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="stat-chart-labels" style={{ justifyContent: 'space-around', fontSize: 9 }}>
              {[...PETA_TITIK].sort((a, b) => b.count - a.count).map(p => (
                <span key={p.label} style={{ textAlign: 'center', maxWidth: 52, lineHeight: 1.3 }}>
                  {p.label.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* ── RINGKASAN BULANAN ── */}
        <div className="ds-card">
          <div className="ds-card-head">
            <div className="ds-card-title">Ringkasan Bulanan — Mei 2025</div>
          </div>
          {[
            { label: 'Total laporan terverifikasi bulan ini', val: '152 laporan' },
            { label: 'Rata-rata waktu penanganan per kasus',  val: '2,4 hari'   },
            { label: 'Laporan dari AI CCTV',                  val: '68 (44,7%)' },
            { label: 'Laporan dari warga',                    val: '84 (55,3%)' },
            { label: 'Anak dikembalikan ke keluarga',         val: '128 anak'   },
            { label: 'Keluarga terdaftar PKH baru',           val: '41 KK'      },
          ].map(r => (
            <div key={r.label} className="ds-row-item">
              <span className="ds-row-label">{r.label}</span>
              <span className="ds-row-val" style={{ color: T }}>{r.val}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}

/* ── Bar Chart 14 hari ─────────────────────────────────────── */
function MiniChart14() {
  const bars = [
    { label: '2 Mei',  lap: 6,  selesai: 5  },
    { label: '3 Mei',  lap: 9,  selesai: 7  },
    { label: '4 Mei',  lap: 5,  selesai: 5  },
    { label: '5 Mei',  lap: 11, selesai: 8  },
    { label: '6 Mei',  lap: 8,  selesai: 6  },
    { label: '7 Mei',  lap: 14, selesai: 11 },
    { label: '8 Mei',  lap: 10, selesai: 9  },
    { label: '9 Mei',  lap: 16, selesai: 12 },
    { label: '10 Mei', lap: 13, selesai: 10 },
    { label: '11 Mei', lap: 9,  selesai: 7  },
    { label: '12 Mei', lap: 18, selesai: 14 },
    { label: '13 Mei', lap: 12, selesai: 9  },
    { label: '14 Mei', lap: 7,  selesai: 5  },
    { label: '15 Mei', lap: 20, selesai: 15 },
  ]
  const maxVal = Math.max(...bars.map(b => b.lap))
  const [hov, setHov] = useState(null)

  return (
    <>
      <div style={{ display: 'flex', gap: 16, padding: '14px 20px 0', fontSize: 11, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: T, display: 'inline-block' }} />
          Laporan Masuk
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: GREEN, display: 'inline-block' }} />
          Berhasil Ditangani
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120, padding: '8px 20px 0' }}>
        {bars.map((b, i) => (
          <div
            key={i}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: '100%', justifyContent: 'flex-end' }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
          >
            {hov === i && (
              <div style={{
                position: 'absolute', bottom: '108%', left: '50%', transform: 'translateX(-50%)',
                background: N, color: '#fff', borderRadius: 6, padding: '4px 9px',
                fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', zIndex: 10,
                fontFamily: "'Plus Jakarta Sans',sans-serif",
              }}>
                {b.label}: {b.lap} masuk, {b.selesai} ditangani
              </div>
            )}
            <div style={{ width: '100%', height: `${(b.lap / maxVal) * 100}%`, background: T, opacity: hov === i ? 1 : 0.6, borderRadius: '3px 3px 0 0', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${(b.selesai / b.lap) * 100}%`, background: GREEN, borderRadius: '3px 3px 0 0' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 20px 14px', fontSize: 9, color: '#9BAAB5' }}>
        {bars.map((b, i) => (
          <span key={i} style={{ flex: 1, textAlign: 'center' }}>
            {i % 2 === 0 ? b.label.split(' ')[0] : ''}
          </span>
        ))}
      </div>
    </>
  )
}

/* ── Donut Chart SVG ─────────────────────────────────────────── */
function DonutChart({ selesai, proses, total }) {
  const r = 52, cx = 72, cy = 72
  const circ     = 2 * Math.PI * r
  const pSelesai = selesai / total
  const pProses  = proses  / total
  const dSelesai = circ * pSelesai
  const dProses  = circ * pProses

  return (
    <svg width={144} height={144} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={BORDER} strokeWidth={14} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={GREEN} strokeWidth={14}
        strokeDasharray={`${dSelesai} ${circ - dSelesai}`}
        strokeDashoffset={circ * 0.25} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={AMBER} strokeWidth={14}
        strokeDasharray={`${dProses} ${circ - dProses}`}
        strokeDashoffset={circ * 0.25 - dSelesai} strokeLinecap="round" />
      <text x={cx} y={cy - 8} textAnchor="middle" fill={T}
        fontFamily="'Plus Jakarta Sans',sans-serif" fontWeight="800" fontSize={22}>
        {Math.round(pSelesai * 100)}%
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={MUTED}
        fontFamily="'Inter',sans-serif" fontWeight="500" fontSize={10}>
        Selesai
      </text>
    </svg>
  )
}