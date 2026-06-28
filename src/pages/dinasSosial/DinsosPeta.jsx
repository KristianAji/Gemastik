import { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import {
  N, T, TEXT, MUTED, BORDER, BG, RED, GREEN,
  PETA_TITIK, KASUS_DATA, Icon, SHARED_STYLES,
} from './dinsoConstants'

export default function DinsosPeta() {
  const showToast = useStore(s => s.showToast)
  const [clock, setClock]       = useState('')
  const [petaHover, setPetaHover] = useState(null)
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

        .peta-wrap {
          position: relative; width: 100%; aspect-ratio: 16/7;
          overflow: hidden;
        }
        .peta-pin {
          position: absolute; transform: translate(-50%, -100%);
          display: flex; flex-direction: column; align-items: center;
          cursor: pointer; transition: transform 0.15s;
        }
        .peta-pin:hover { transform: translate(-50%, -100%) scale(1.15); }
        .peta-pin-dot {
          border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 3px 10px rgba(0,0,0,0.25);
          transition: box-shadow 0.15s;
        }
        .peta-pin:hover .peta-pin-dot { box-shadow: 0 6px 18px rgba(0,0,0,0.35); }
        .peta-pin-num { transform: rotate(45deg); color: #fff; font-size: 9px; font-weight: 800; }
        .peta-tooltip {
          position: absolute; background: ${N}; color: #fff;
          border-radius: 9px; padding: 8px 12px; font-size: 11px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          white-space: nowrap; pointer-events: none; z-index: 10;
          transform: translate(-50%, -140%);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .peta-tooltip::after {
          content: ''; position: absolute; top: 100%; left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent; border-top-color: ${N};
        }
        .peta-legend {
          position: absolute; bottom: 12px; left: 14px;
          background: rgba(2,43,58,0.78); border-radius: 8px; padding: 8px 12px;
          display: flex; flex-direction: column; gap: 5px;
        }
        .peta-legend-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; color: rgba(255,255,255,0.75);
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500;
        }
        .peta-bar-track {
          width: 100px; height: 5px; border-radius: 3px;
          background: rgba(60,110,113,0.1); overflow: hidden;
        }
      `}</style>

      <div className="ds-root">

        {/* ── BANNER ── */}
        <div className="ds-banner">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="ds-banner-eyebrow">Portal Dinas Sosial — Kota Manado</div>
            <div className="ds-banner-title">
              Peta Sebaran<br/>
              <span>Laporan Terverifikasi</span>
            </div>
            <div className="ds-banner-sub">
              Visualisasi lokasi titik rawan pekerja anak di seluruh wilayah Kota Manado.
              Terdapat <strong>{PETA_TITIK.length} titik rawan</strong> aktif dengan total{' '}
              <strong>{PETA_TITIK.reduce((s, p) => s + p.count, 0)} laporan</strong> terverifikasi.
            </div>
            <div className="ds-banner-clock">{clock} WITA</div>
          </div>
          <div className="ds-banner-actions">
            <button className="ds-btn-teal">
              {Icon.peta} Unduh Peta PDF
            </button>
            <button className="ds-btn-ghost" onClick={() => {
              setRefreshing(true)
              setTimeout(() => { setRefreshing(false); showToast('Data peta diperbarui') }, 1200)
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
            { icon: Icon.total,   num: KASUS_DATA.length, label: 'Total Kasus Terverifikasi', delta: 'Naik 12% dari bulan lalu',            fill: 100    },
            { icon: Icon.kasus,   num: totalProses,        label: 'Kasus Aktif (Proses)',      delta: 'Sedang ditangani petugas',             fill: totalProses / KASUS_DATA.length * 100 },
            { icon: Icon.check,   num: totalSelesai,       label: 'Kasus Selesai',             delta: 'Berhasil dikembalikan ke keluarga',    fill: tingkat },
            { icon: Icon.peta,    num: PETA_TITIK.length,  label: 'Titik Rawan Terpantau',     delta: '1 lokasi dengan deteksi CCTV aktif',   fill: 100    },
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

        {/* ── PETA ── */}
        <div className="ds-card">
          <div className="ds-card-head">
            <div className="ds-card-title">
              {Icon.peta} Peta Sebaran Laporan Terverifikasi — Kota Manado
            </div>
            <span style={{ fontSize: 11, color: GREEN, display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              <span className="ds-live-dot" /> Data real-time
            </span>
          </div>
          <div className="peta-wrap">
            <MapCanvas />
            {PETA_TITIK.map((p, i) => (
              <div
                key={i}
                className="peta-pin"
                style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
                onMouseEnter={() => setPetaHover(i)}
                onMouseLeave={() => setPetaHover(null)}
              >
                {petaHover === i && (
                  <div className="peta-tooltip">
                    📍 {p.label} — {p.count} laporan
                  </div>
                )}
                <div
                  className="peta-pin-dot"
                  style={{
                    background: p.alert ? RED : T,
                    width:  28 + Math.min(p.count / 3, 20),
                    height: 28 + Math.min(p.count / 3, 20),
                  }}
                >
                  <span className="peta-pin-num">{p.count}</span>
                </div>
              </div>
            ))}
            <div className="peta-legend">
              <div className="peta-legend-item">
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: RED }} />
                Kamera CCTV aktif mendeteksi
              </div>
              <div className="peta-legend-item">
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: T }} />
                Laporan warga terverifikasi
              </div>
              <div className="peta-legend-item" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>
                Ukuran pin = jumlah laporan
              </div>
            </div>
          </div>
        </div>

        {/* ── TABEL LOKASI RAWAN ── */}
        <div className="ds-card">
          <div className="ds-card-head">
            <div className="ds-card-title">{Icon.warning} Lokasi dengan Laporan Terbanyak</div>
          </div>
          {[...PETA_TITIK].sort((a, b) => b.count - a.count).map(p => (
            <div key={p.label} className="ds-row-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: p.alert ? RED : T }}>{Icon.pin}</span>
                <span className="ds-row-label">{p.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="peta-bar-track">
                  <div style={{ width: `${(p.count / 48) * 100}%`, height: '100%', background: p.alert ? RED : T, borderRadius: 3 }} />
                </div>
                <span className="ds-row-val" style={{ color: p.alert ? RED : T, minWidth: 70, textAlign: 'right' }}>
                  {p.count} laporan
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}

function MapCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height

    ctx.fillStyle = '#b8d4e8'
    ctx.fillRect(0, 0, W, H)

    ctx.beginPath()
    ctx.moveTo(W * 0.1, H * 0.05); ctx.lineTo(W * 0.95, H * 0.1)
    ctx.lineTo(W * 0.98, H * 0.95); ctx.lineTo(W * 0.08, H * 0.92)
    ctx.closePath()
    ctx.fillStyle = '#d4e8c4'; ctx.fill()

    ctx.beginPath()
    ctx.moveTo(W * 0.4, H * 0.15); ctx.lineTo(W * 0.75, H * 0.08)
    ctx.lineTo(W * 0.82, H * 0.3); ctx.lineTo(W * 0.65, H * 0.4)
    ctx.lineTo(W * 0.45, H * 0.38); ctx.closePath()
    ctx.fillStyle = '#cce4b8'; ctx.fill()

    ctx.beginPath()
    ctx.arc(W * 0.55, H * 0.2, W * 0.09, 0, Math.PI * 2)
    ctx.fillStyle = '#9ec8e0'; ctx.fill()

    ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 2.5
    ;[
      [[W*0.1,H*0.45],[W*0.9,H*0.5]], [[W*0.5,H*0.1],[W*0.52,H*0.9]],
      [[W*0.2,H*0.25],[W*0.8,H*0.3]], [[W*0.35,H*0.15],[W*0.4,H*0.75]],
      [[W*0.15,H*0.6],[W*0.85,H*0.65]], [[W*0.65,H*0.15],[W*0.7,H*0.85]],
    ].forEach(([f, t]) => { ctx.beginPath(); ctx.moveTo(...f); ctx.lineTo(...t); ctx.stroke() })

    ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(255,255,255,0.35)'
    ;[
      [[W*0.3,H*0.3],[W*0.3,H*0.8]],
      [[W*0.8,H*0.4],[W*0.85,H*0.8]],
      [[W*0.1,H*0.7],[W*0.5,H*0.72]],
    ].forEach(([f, t]) => { ctx.beginPath(); ctx.moveTo(...f); ctx.lineTo(...t); ctx.stroke() })

    ctx.fillStyle = 'rgba(2,43,58,0.35)'
    ctx.font = 'italic 11px Inter, sans-serif'
    ctx.fillText('Teluk Manado', W * 0.34, H * 0.18)

    ctx.fillStyle = 'rgba(2,43,58,0.45)'
    ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif'
    ctx.fillText('Kota Manado', W * 0.42, H * 0.52)
  }, [])
  return <canvas ref={ref} width={900} height={400} style={{ width: '100%', height: '100%', display: 'block' }} />
}