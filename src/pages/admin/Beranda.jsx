import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { useState, useEffect, useRef } from 'react'

// ─── Token Warna ────────────────────────────────────────────────────────────
// #284B63 — navy primary
// #3C6E71 — teal accent
// #353535 — teks utama
// #D9D9D9 — border
// #FFFFFF — surface card
// #F4F7F9 — background halaman
// ────────────────────────────────────────────────────────────────────────────

const N     = '#284B63'
const T     = '#3C6E71'
const TEXT  = '#353535'
const MUTED = '#6B7C8D'
const BORDER= '#D9D9D9'
const CARD  = '#FFFFFF'
const BG    = '#F4F7F9'
const RED   = '#C0392B'
const AMBER = '#D4820A'
const GREEN = '#1E7E4A'

export default function AdminBeranda() {
  const navigate    = useNavigate()
  const laporan     = useStore(s => s.laporan)
  const notifikasi  = useStore(s => s.notifikasi)
  const openModal   = useStore(s => s.openModal)
  const showToast   = useStore(s => s.showToast)
  const [clock, setClock]         = useState('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleString('id-ID', {
      weekday:'long', day:'numeric', month:'long', year:'numeric',
      hour:'2-digit', minute:'2-digit', second:'2-digit'
    }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const unread  = notifikasi.filter(n => !n.read).length
  const total   = laporan.length
  const selesai = laporan.filter(l => l.status === 'selesai').length
  const proses  = laporan.filter(l => l.status === 'proses').length
  const baru    = laporan.filter(l => l.status === 'baru')
  const tingkat = total ? Math.round((selesai / total) * 100) : 0

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => { setRefreshing(false); showToast('Data berhasil diperbarui') }, 1200)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .ab-root {
          font-family: 'Plus Jakarta', sans-serif;
          background: ${BG};
          color: ${TEXT};
          flex: 1;
          overflow-y: auto;
          padding: 28px 32px 60px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          box-sizing: border-box;
        }

        .ab-banner {
          background: linear-gradient(120deg, ${N} 0%, #1e3d56 60%, ${T} 100%);
          border-radius: 18px;
          padding: 28px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          position: relative;
          overflow: hidden;
        }
        .ab-banner::after {
          content: '';
          position: absolute;
          right: -60px; top: -60px;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(60,110,113,0.4) 0%, transparent 70%);
          pointer-events: none;
        }
        .ab-banner-eyebrow { font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 6px; font-weight: 500; }
        .ab-banner-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26px; font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 8px; }
        .ab-banner-title span { color: #BFDBF7; }
        .ab-banner-sub { font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.6; max-width: 420px; }
        .ab-banner-sub strong { color: #fff; }
        .ab-banner-clock { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 10px; font-family: monospace; }
        .ab-banner-actions { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; position: relative; z-index: 1; }

        .ab-btn-primary { padding: 11px 22px; background: ${T}; color: #fff; border: none; border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: background 0.2s, transform 0.15s; white-space: nowrap; }
        .ab-btn-primary:hover { background: #2f5759; transform: translateY(-1px); }
        .ab-btn-ghost-banner { padding: 10px 22px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.25); border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
        .ab-btn-ghost-banner:hover { background: rgba(255,255,255,0.18); }

        .ab-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .ab-kpi-card { background: ${CARD}; border: 1px solid ${BORDER}; border-radius: 14px; padding: 20px 22px; cursor: pointer; transition: box-shadow 0.2s, transform 0.15s; border-top: 3px solid transparent; }
        .ab-kpi-card:hover { box-shadow: 0 6px 20px rgba(40,75,99,0.1); transform: translateY(-2px); }
        .ab-kpi-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; font-size: 18px; }
        .ab-kpi-num { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 32px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
        .ab-kpi-label { font-size: 12px; color: ${MUTED}; margin-bottom: 10px; }
        .ab-kpi-delta { font-size: 11px; font-weight: 600; }
        .ab-kpi-bar { height: 3px; border-radius: 2px; background: ${BORDER}; margin-top: 12px; overflow: hidden; }
        .ab-kpi-bar-fill { height: 100%; border-radius: 2px; transition: width 0.8s ease; }

        .ab-card { background: ${CARD}; border: 1px solid ${BORDER}; border-radius: 14px; overflow: hidden; }
        .ab-card-head { padding: 16px 20px; border-bottom: 1px solid ${BORDER}; display: flex; align-items: center; justify-content: space-between; }
        .ab-card-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700; color: ${N}; }
        .ab-card-link { font-size: 12px; color: ${T}; cursor: pointer; font-weight: 600; background: none; border: none; padding: 0; transition: color 0.15s; }
        .ab-card-link:hover { color: ${N}; }

        .ab-cctv-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: ${BORDER}; }
        .ab-cctv-feed { background: #0A1420; position: relative; aspect-ratio: 16/9; overflow: hidden; cursor: pointer; }
        .ab-cctv-feed canvas { width: 100%; height: 100%; display: block; }
        .ab-cctv-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 10px; background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.6) 100%); }
        .ab-cctv-label { font-size: 10px; font-weight: 600; background: rgba(0,0,0,0.6); color: #fff; padding: 3px 8px; border-radius: 99px; width: fit-content; }
        .ab-cctv-live { font-size: 9px; font-weight: 700; color: #4ade80; display: flex; align-items: center; gap: 4px; background: rgba(0,0,0,0.6); padding: 3px 8px; border-radius: 99px; width: fit-content; }
        .ab-cctv-alert { font-size: 10px; font-weight: 700; background: rgba(192,57,43,0.9); color: #fff; padding: 4px 10px; border-radius: 6px; text-align: center; }
        .ab-cctv-footer { display: flex; align-items: center; justify-content: space-between; }
        .ab-cctv-res { font-size: 9px; color: rgba(255,255,255,0.45); }
        .ab-cctv-btn { font-size: 9px; font-weight: 700; color: #fff; background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 3px 8px; cursor: pointer; }
        .ab-cctv-more { padding: 14px 20px; text-align: center; border-top: 1px solid ${BORDER}; }
        .ab-btn-outline { padding: 9px 24px; background: transparent; color: ${N}; border: 1.5px solid ${N}; border-radius: 9px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .ab-btn-outline:hover { background: ${N}; color: #fff; }

        .ab-activity-item { padding: 14px 20px; border-bottom: 1px solid ${BORDER}; display: flex; gap: 12px; align-items: flex-start; cursor: pointer; transition: background 0.15s; }
        .ab-activity-item:last-child { border-bottom: none; }
        .ab-activity-item:hover { background: #F8FAFC; }
        .ab-activity-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
        .ab-activity-title { font-size: 12px; font-weight: 600; color: ${TEXT}; margin-bottom: 3px; }
        .ab-activity-desc { font-size: 11px; color: ${MUTED}; line-height: 1.5; }
        .ab-activity-time { font-size: 10px; color: #9BAAB5; flex-shrink: 0; padding-top: 2px; white-space: nowrap; }

        .ab-row-item { padding: 12px 20px; border-bottom: 1px solid ${BORDER}; display: flex; align-items: center; justify-content: space-between; font-size: 12px; }
        .ab-row-item:last-child { border-bottom: none; }
        .ab-row-label { color: ${MUTED}; }
        .ab-row-val { font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; }

        .ab-pill { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 4px; }

        .ab-qa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 14px; }
        .ab-qa-item { padding: 14px 10px; border-radius: 10px; border: 1.5px solid ${BORDER}; background: #F8FAFC; cursor: pointer; text-align: center; transition: all 0.2s; }
        .ab-qa-item:hover { border-color: ${T}; background: rgba(60,110,113,0.06); }
        .ab-qa-icon { font-size: 22px; margin-bottom: 6px; }
        .ab-qa-label { font-size: 11px; font-weight: 600; color: ${TEXT}; }

        .ab-chart-wrap { display: flex; align-items: flex-end; gap: 5px; height: 70px; padding: 0 20px; }
        .ab-chart-bar { flex: 1; border-radius: 4px 4px 0 0; cursor: pointer; transition: opacity 0.15s; position: relative; }
        .ab-chart-labels { display: flex; justify-content: space-between; padding: 5px 20px 14px; font-size: 9px; color: #9BAAB5; }

        .ab-live-dot { width: 7px; height: 7px; border-radius: 50%; background: ${GREEN}; display: inline-block; animation: ab-pulse 2s ease infinite; }
        @keyframes ab-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        .ab-alert-item { display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-bottom: 1px solid ${BORDER}; cursor: pointer; transition: background 0.15s; }
        .ab-alert-item:last-child { border-bottom: none; }
        .ab-alert-item:hover { background: #FEF9F9; }

        .ab-main-grid { display: grid; grid-template-columns: 1fr 300px; gap: 16px; }
        .ab-bottom-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

        @media (max-width: 1024px) {
          .ab-kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .ab-main-grid { grid-template-columns: 1fr; }
          .ab-bottom-grid { grid-template-columns: 1fr; }
          .ab-banner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="ab-root">

        {/* ══ WELCOME BANNER ══ */}
        <div className="ab-banner">
          <div style={{ position:'relative', zIndex:1 }}>
            <div className="ab-banner-eyebrow">Selamat datang kembali 👋</div>
            <div className="ab-banner-title">
              Admin <span>DP3A</span> Kota Manado
            </div>
            <div className="ab-banner-sub">
              Terdapat <strong>{baru.length} laporan baru</strong> dan{' '}
              <strong>{unread} notifikasi</strong> yang membutuhkan perhatian Anda hari ini.
            </div>
            <div className="ab-banner-clock">{clock} WITA</div>
          </div>
          <div className="ab-banner-actions">
            <button className="ab-btn-primary" onClick={() => navigate('/admin/notifikasi')}>
              Lihat Notifikasi ({unread})
            </button>
            <button className="ab-btn-ghost-banner" onClick={handleRefresh}>
              {refreshing ? 'Memperbarui...' : 'Perbarui Data'}
            </button>
          </div>
        </div>

        {/* ══ KPI CARDS ══ */}
        <div className="ab-kpi-grid">
          {[
            { icon:'📋', num: total,         color: N,     iconBg:`rgba(40,75,99,0.1)`,   label:'Total Laporan',      delta:'↑ 18% dari bulan lalu',  deltaColor: GREEN, fill: 72,                           href:'/admin/laporan'    },
            { icon:'🆕', num: baru.length,   color: RED,   iconBg:`rgba(192,57,43,0.1)`,  label:'Laporan Baru',       delta:'Perlu ditindaklanjuti',   deltaColor: RED,   fill: (baru.length/(total||1))*100, href:'/admin/laporan'    },
            { icon:'⚙️', num: proses,        color: AMBER, iconBg:`rgba(212,130,10,0.1)`, label:'Sedang Diproses',    delta:'Dalam penanganan',        deltaColor: AMBER, fill: (proses/(total||1))*100,      href:'/admin/laporan'    },
            { icon:'✅', num: `${tingkat}%`, color: GREEN, iconBg:`rgba(30,126,74,0.1)`,  label:'Tingkat Penanganan', delta:'↑ 5% dari bulan lalu',    deltaColor: GREEN, fill: tingkat,                      href:'/admin/statistik'  },
          ].map((k, i) => (
            <div key={i} className="ab-kpi-card" style={{ borderTopColor: k.color }}
              onClick={() => navigate(k.href)}>
              <div className="ab-kpi-icon" style={{ background: k.iconBg }}>{k.icon}</div>
              <div className="ab-kpi-num" style={{ color: k.color }}>{k.num}</div>
              <div className="ab-kpi-label">{k.label}</div>
              <div className="ab-kpi-delta" style={{ color: k.deltaColor }}>{k.delta}</div>
              <div className="ab-kpi-bar">
                <div className="ab-kpi-bar-fill" style={{ width:`${k.fill}%`, background: k.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* ══ CCTV PREVIEW ══ */}
        <div className="ab-card">
          <div className="ab-card-head">
            <div className="ab-card-title">Monitoring CCTV — 4 Kamera Aktif</div>
            <button className="ab-card-link" onClick={() => navigate('/admin/cctv')}>
              Lihat Semua CCTV →
            </button>
          </div>
          <div className="ab-cctv-grid">
            {[
              { id:1, label:'Kawasan Megamas — CAM 01', res:'1080p', fps:25, alert:true,  detections:[{ x:0.28, y:0.25, w:80, h:130, conf:94, color:'#E8401C' }] },
              { id:2, label:'Pasar 45 — CAM 02',        res:'720p',  fps:20, alert:false, detections:[] },
              { id:3, label:'Matos Entrance — CAM 03',  res:'1080p', fps:30, alert:false, detections:[] },
              { id:4, label:'Jl. Boulevard — CAM 04',   res:'720p',  fps:15, alert:false, detections:[] },
            ].map(cam => (
              <MiniCCTV key={cam.id} cam={cam} onClick={() => navigate('/admin/cctv')} />
            ))}
          </div>
          <div className="ab-cctv-more">
            <button className="ab-btn-outline" onClick={() => navigate('/admin/cctv')}>
              Buka Monitoring CCTV Penuh
            </button>
          </div>
        </div>

        {/* ══ MAIN GRID ══ */}
        <div className="ab-main-grid">

          <div className="ab-card">
            <div className="ab-card-head">
              <div className="ab-card-title">Aktivitas Terbaru</div>
              <button className="ab-card-link" onClick={() => navigate('/admin/notifikasi')}>Lihat semua →</button>
            </div>
            {[
              { dot: RED,   title:'AI Mendeteksi 2 Anak — Megamas',        desc:'CAM-01 mendeteksi 2 anak membawa dagangan. Confidence 94% & 87%.', time:'14 mnt', href:'/admin/notifikasi' },
              { dot: AMBER, title:'Laporan Warga Masuk — Pasar 45',         desc:'M. Reza melaporkan anak usia 8–10 tahun mengamen di area parkir.',  time:'1 jam',  href:'/admin/laporan'    },
              { dot: AMBER, title:'Laporan Warga — Figuran Karakter Matos', desc:'Anak memakai kostum kartun meminta sumbangan dari pengunjung.',     time:'5 jam',  href:'/admin/laporan'    },
              { dot: GREEN, title:'Penanganan Berhasil — Jl. Boulevard',    desc:'3 anak berhasil dijemput dan dipulangkan ke keluarga oleh petugas.',time:'3 jam',  href:'/admin/statistik'  },
              { dot: T,     title:'Laporan Mingguan Tersedia',              desc:'Ringkasan minggu ke-18: 34 laporan masuk, 28 ditangani (82%).',     time:'Kemarin',href:'/admin/statistik'  },
            ].map((a, i) => (
              <div key={i} className="ab-activity-item" onClick={() => navigate(a.href)}>
                <div className="ab-activity-dot" style={{ background: a.dot }} />
                <div style={{ flex:1 }}>
                  <div className="ab-activity-title">{a.title}</div>
                  <div className="ab-activity-desc">{a.desc}</div>
                </div>
                <div className="ab-activity-time">{a.time}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

            <div className="ab-card">
              <div className="ab-card-head"><div className="ab-card-title">Akses Cepat</div></div>
              <div className="ab-qa-grid">
                {[
                  { icon:'📹', label:'CCTV Live',    href:'/admin/cctv'        },
                  { icon:'🗺️', label:'Peta Sebaran', href:'/admin/peta'        },
                  { icon:'🔔', label:'Notifikasi',   href:'/admin/notifikasi'  },
                  { icon:'📊', label:'Statistik',    href:'/admin/statistik'   },
                ].map(q => (
                  <div key={q.label} className="ab-qa-item" onClick={() => navigate(q.href)}>
                    <div className="ab-qa-icon">{q.icon}</div>
                    <div className="ab-qa-label">{q.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ab-card">
              <div className="ab-card-head">
                <div className="ab-card-title" style={{ color: RED }}>Perlu Tindakan</div>
                <button className="ab-card-link" onClick={() => navigate('/admin/laporan')}>Lihat semua →</button>
              </div>
              {baru.slice(0, 3).map(l => (
                <div key={l.id} className="ab-alert-item" onClick={() => openModal('detail', l)}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background: RED, flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color: TEXT, marginBottom:2 }}>{l.lokasi}</div>
                    <div style={{ fontSize:11, color: MUTED }}>Belum diverifikasi</div>
                  </div>
                  <span className="ab-pill" style={{ background:'rgba(192,57,43,0.1)', color: RED }}>Baru</span>
                </div>
              ))}
              {baru.length === 0 && (
                <div style={{ padding:20, textAlign:'center', fontSize:12, color: MUTED }}>Tidak ada laporan menunggu</div>
              )}
            </div>

          </div>
        </div>

        {/* ══ BOTTOM GRID ══ */}
        <div className="ab-bottom-grid">

          <div className="ab-card">
            <div className="ab-card-head">
              <div className="ab-card-title">Laporan 7 Hari Terakhir</div>
              <button className="ab-card-link" onClick={() => navigate('/admin/statistik')}>Detail →</button>
            </div>
            <MiniChart />
          </div>

          <div className="ab-card">
            <div className="ab-card-head">
              <div className="ab-card-title">Lokasi Paling Rawan</div>
              <button className="ab-card-link" onClick={() => navigate('/admin/peta')}>Peta →</button>
            </div>
            {[
              { label:'Kawasan Megamas',    num:'48', color: RED   },
              { label:'Pasar 45',           num:'35', color: AMBER },
              { label:'Jl. Boulevard',      num:'27', color: T     },
              { label:'Manado Town Square', num:'19', color: T     },
            ].map(r => (
              <div key={r.label} className="ab-row-item">
                <span className="ab-row-label">{r.label}</span>
                <span className="ab-row-val" style={{ color: r.color }}>{r.num} laporan</span>
              </div>
            ))}
          </div>

          <div className="ab-card">
            <div className="ab-card-head"><div className="ab-card-title">Status Sistem</div></div>
            {[
              { label:'Pipeline AI (YOLOv8)',   status:'Online' },
              { label:'Estimasi Usia (MiVolo)', status:'Online' },
              { label:'Klasifikasi (VideoMAE)', status:'Online' },
              { label:'CCTV Feed (4 kamera)',   status:'Live'   },
            ].map(r => (
              <div key={r.label} className="ab-row-item">
                <span className="ab-row-label">{r.label}</span>
                <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, color: GREEN }}>
                  <span className="ab-live-dot" /> {r.status}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}

function MiniCCTV({ cam, onClick }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const timeRef   = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const draw = (ts) => {
      const W = canvas.width, H = canvas.height
      timeRef.current = ts * 0.001
      ctx.fillStyle = '#060f1c'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#0a1828'
      ctx.fillRect(0, H*0.7, W, H*0.3)
      const buildings = [
        { x:0, y:0.2, w:0.14, h:0.5, c:'#0d1f38' },
        { x:0.16, y:0.28, w:0.12, h:0.42, c:'#0c1c32' },
        { x:0.3,  y:0.16, w:0.18, h:0.54, c:'#0e2040' },
        { x:0.55, y:0.24, w:0.15, h:0.46, c:'#0d1f38' },
        { x:0.72, y:0.18, w:0.28, h:0.52, c:'#0c1c32' },
      ]
      buildings.forEach(b => {
        ctx.fillStyle = b.c
        ctx.fillRect(b.x*W, b.y*H, b.w*W, b.h*H)
        for (let wy=0; wy<3; wy++) for (let wx=0; wx<2; wx++) {
          const lit = Math.sin(timeRef.current*0.3 + cam.id + wy*2+wx) > 0.2
          ctx.fillStyle = lit ? 'rgba(255,220,100,0.15)' : 'rgba(0,0,0,0.3)'
          ctx.fillRect(b.x*W+5+wx*((b.w*W-10)/2), b.y*H+10+wy*((b.h*H-16)/3), (b.w*W-10)/2-3, (b.h*H-16)/3-3)
        }
      })
      ctx.fillStyle = '#0f1e2e'
      ctx.fillRect(0, H*0.68, W, H*0.06)
      for (let p=0; p<3+cam.id; p++) {
        const speed = 0.03 + p*0.01
        const px = ((timeRef.current*speed*(p%2===0?1:-1)+p*0.25)%1+1)%1
        const py = 0.63+(p%3)*0.03
        const h  = H*0.1
        ctx.fillStyle = 'rgba(20,40,70,0.9)'
        ctx.beginPath(); ctx.ellipse(px*W, py*H+h*0.4, h*0.1, h*0.4, 0, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(px*W, py*H-h*0.05, h*0.12, 0, Math.PI*2); ctx.fill()
      }
      if (cam.detections.length > 0) {
        cam.detections.forEach(d => {
          const pulse = 0.7+Math.sin(timeRef.current*2)*0.3
          ctx.strokeStyle = d.color; ctx.lineWidth = 1.5; ctx.globalAlpha = pulse
          ctx.strokeRect(d.x*W, d.y*H, d.w, d.h); ctx.globalAlpha = 1
          ctx.fillStyle = d.color; ctx.fillRect(d.x*W, d.y*H-14, d.w, 14)
          ctx.fillStyle = '#fff'; ctx.font = 'bold 8px sans-serif'
          ctx.fillText(`Anak ${d.conf}%`, d.x*W+3, d.y*H-3)
        })
      }
      for (let y=0; y<H; y+=3) { ctx.fillStyle='rgba(0,0,0,0.07)'; ctx.fillRect(0,y,W,1) }
      ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.font='8px monospace'
      ctx.fillText(new Date().toLocaleTimeString('id-ID'), 6, H-5)
      animRef.current = requestAnimationFrame(draw)
    }
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [cam])

  return (
    <div className="ab-cctv-feed" onClick={onClick}
      style={{ border: cam.alert ? '2px solid #C0392B' : 'none' }}>
      <canvas ref={canvasRef} width={400} height={225} />
      <div className="ab-cctv-overlay">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span className="ab-cctv-label">📍 {cam.label}</span>
          <span className="ab-cctv-live">
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', display:'inline-block' }} /> LIVE
          </span>
        </div>
        {cam.alert && <div className="ab-cctv-alert">⚠ Terdeteksi: anak berjualan</div>}
        <div className="ab-cctv-footer">
          <span className="ab-cctv-res">{cam.res} • {cam.fps} FPS</span>
          <button className="ab-cctv-btn">Fokus</button>
        </div>
      </div>
    </div>
  )
}

function MiniChart() {
  const bars = [
    { label:'Sen', val:8,  color:'#284B63' },
    { label:'Sel', val:14, color:'#C0392B' },
    { label:'Rab', val:11, color:'#D4820A' },
    { label:'Kam', val:20, color:'#C0392B' },
    { label:'Jum', val:17, color:'#D4820A' },
    { label:'Sab', val:9,  color:'#3C6E71' },
    { label:'Min', val:5,  color:'#3C6E71' },
  ]
  const max = Math.max(...bars.map(b => b.val))
  const [hov, setHov] = useState(null)
  return (
    <>
      <div className="ab-chart-wrap">
        {bars.map((b, i) => (
          <div key={i} className="ab-chart-bar"
            style={{ height:`${(b.val/max)*100}%`, background: b.color, opacity: hov===i?1:0.65 }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
            {hov===i && (
              <div style={{ position:'absolute', bottom:'105%', left:'50%', transform:'translateX(-50%)',
                background:'#284B63', color:'#fff', borderRadius:5, padding:'2px 7px',
                fontSize:10, fontWeight:700, whiteSpace:'nowrap' }}>{b.val}</div>
            )}
          </div>
        ))}
      </div>
      <div className="ab-chart-labels">{bars.map(b => <span key={b.label}>{b.label}</span>)}</div>
    </>
  )
}