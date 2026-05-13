import { useEffect, useRef, useState } from 'react'
import { useStore } from '../../store/useStore'

const CAMS = [
  { id:1, label:'📍 Kawasan Megamas — CAM 01', resolusi:'1080p', fps:25, alert:true,
    detections:[{ x:0.28, y:0.25, w:80, h:130, conf:94, color:'#E8401C' },{ x:0.52, y:0.30, w:70, h:110, conf:87, color:'#F5A623' }] },
  { id:2, label:'📍 Pasar 45 — CAM 02', resolusi:'720p',  fps:20, alert:false, detections:[] },
  { id:3, label:'📍 Matos Entrance — CAM 03', resolusi:'1080p', fps:30, alert:false, detections:[] },
  { id:4, label:'📍 Jl. Boulevard — CAM 04', resolusi:'720p',  fps:15, alert:false, detections:[] },
]

export default function AdminCCTV() {
  const openModal = useStore(s => s.openModal)
  const showToast = useStore(s => s.showToast)
  const [layout, setLayout] = useState('2x2')
  const [focus, setFocus]   = useState(null)
  const [recording, setRecording] = useState(false)
  const [clock, setClock] = useState('')

  useEffect(() => {
    const t = setInterval(() => setClock(new Date().toTimeString().slice(0,8)), 1000)
    setClock(new Date().toTimeString().slice(0,8))
    return () => clearInterval(t)
  }, [])

  const handleRecord = () => {
    setRecording(r => !r)
    showToast(recording ? '⏹ Rekaman dihentikan' : '⏺ Rekaman dimulai', recording ? 'var(--text-dim)' : 'var(--accent)')
  }

  const displayCams = focus !== null ? [CAMS[focus]] : CAMS

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* Topbar */}
      <div style={{ padding:'12px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800 }}>📹 Monitoring CCTV — 4 Kamera Aktif</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Terakhir diperbarui: <span style={{ fontFamily:'monospace' }}>{clock}</span> WITA</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {['2x2','1x4'].map(l => (
            <button key={l} className={`btn btn-sm ${layout===l ? 'btn-primary':'btn-ghost'}`}
              onClick={() => { setLayout(l); setFocus(null) }}>{l}</button>
          ))}
          {focus !== null && <button className="btn btn-sm btn-ghost" onClick={() => setFocus(null)}>← Semua</button>}
          <button className="btn btn-sm" onClick={handleRecord}
            style={{ background: recording ? 'rgba(232,64,28,0.2)':'rgba(255,255,255,0.07)',
              color: recording ? 'var(--accent)':'var(--text-muted)', border:`1px solid ${recording?'var(--accent)':'var(--border)'}` }}>
            {recording ? '⏹ Stop Rekam' : '⏺ Rekam'}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        flex:1, overflow:'hidden', display:'grid', padding:12, gap:10,
        gridTemplateColumns: focus !== null ? '1fr' : layout === '1x4' ? '1fr' : 'repeat(2,1fr)',
        gridTemplateRows:    focus !== null ? '1fr' : layout === '1x4' ? 'repeat(4,1fr)' : 'repeat(2,1fr)',
      }}>
        {displayCams.map((cam, i) => (
          <FeedCard key={cam.id} cam={cam} clock={clock}
            onFocus={() => setFocus(focus === i ? null : i)}
            isFocused={focus !== null}
            onOpenModal={() => openModal('lihat-cctv', {
              camLabel: cam.label, lokasi: cam.label.split('📍')[1]?.split('—')[0]?.trim(),
              resolusi: cam.resolusi, hasAlert: cam.alert
            })} />
        ))}
      </div>

      {/* Stats */}
      <div style={{ padding:'12px 20px', borderTop:'1px solid var(--border)', display:'flex', gap:32, flexShrink:0 }}>
        {[
          { num:5, color:'var(--accent)', label:'Terdeteksi Hari Ini' },
          { num:12,color:'var(--amber)', label:'Laporan Masuk' },
          { num:9, color:'var(--green)', label:'Berhasil Ditangani' },
          { num:4, color:'var(--blue)',  label:'Kamera Aktif' },
        ].map(s => (
          <div key={s.label} style={{ textAlign:'center' }}>
            <div style={{ fontSize:24, fontWeight:800, fontFamily:"'Syne',sans-serif", color:s.color }}>{s.num}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeedCard({ cam, clock, onFocus, isFocused, onOpenModal }) {
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

      // Background scene
      ctx.fillStyle = '#060f1c'
      ctx.fillRect(0, 0, W, H)

      // Ground
      ctx.fillStyle = '#0a1828'
      ctx.fillRect(0, H*0.7, W, H*0.3)

      // Buildings
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
        // windows
        for (let wy=0; wy<4; wy++) for (let wx=0; wx<3; wx++) {
          const lit = Math.sin(timeRef.current*0.3 + cam.id + wy*2+wx) > 0.2
          ctx.fillStyle = lit ? 'rgba(255,220,100,0.15)' : 'rgba(0,0,0,0.3)'
          ctx.fillRect(b.x*W + 6 + wx*((b.w*W-12)/3), b.y*H+12 + wy*((b.h*H-20)/4), (b.w*W-12)/3-4, (b.h*H-20)/4-4)
        }
      })

      // Road
      ctx.fillStyle = '#0f1e2e'
      ctx.fillRect(0, H*0.68, W, H*0.06)
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.setLineDash([20,15])
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, H*0.71); ctx.lineTo(W, H*0.71); ctx.stroke()
      ctx.setLineDash([])

      // Moving people
      for (let p=0; p<4+cam.id; p++) {
        const speed = 0.03 + p*0.01
        const px = ((timeRef.current * speed * (p%2===0 ? 1:-1) + p*0.25) % 1 + 1) % 1
        const py = 0.62 + (p%3)*0.04
        const h  = H*0.12
        ctx.fillStyle = `rgba(20,40,70,0.9)`
        // body
        ctx.beginPath()
        ctx.ellipse(px*W, py*H + h*0.4, h*0.12, h*0.45, 0, 0, Math.PI*2)
        ctx.fill()
        // head
        ctx.beginPath()
        ctx.arc(px*W, py*H - h*0.05, h*0.14, 0, Math.PI*2)
        ctx.fill()
      }

      // Detection boxes
      if (cam.detections.length > 0) {
        cam.detections.forEach(d => {
          const pulse = 0.7 + Math.sin(timeRef.current*2)*0.3
          ctx.strokeStyle = d.color
          ctx.lineWidth = 1.5
          ctx.globalAlpha = pulse
          ctx.strokeRect(d.x*W, d.y*H, d.w, d.h)
          ctx.globalAlpha = 1

          // Label
          ctx.fillStyle = d.color
          ctx.fillRect(d.x*W, d.y*H - 16, d.w, 16)
          ctx.fillStyle = d.color === '#F5A623' ? '#000' : '#fff'
          ctx.font = 'bold 9px DM Sans'
          ctx.fillText(`Anak — ${d.conf}%`, d.x*W + 4, d.y*H - 4)
        })
      }

      // Scanlines
      for (let y=0; y<H; y+=3) {
        ctx.fillStyle = 'rgba(0,0,0,0.08)'
        ctx.fillRect(0, y, W, 1)
      }

      // Noise
      if (Math.floor(timeRef.current*10) % 3 === 0) {
        for (let n=0; n<8; n++) {
          ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.03})`
          ctx.fillRect(Math.random()*W, Math.random()*H, Math.random()*60+10, 1)
        }
      }

      // Timestamp
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.font = '9px monospace'
      ctx.fillText(new Date().toLocaleString('id-ID'), 8, H-6)
      ctx.fillText(`CAM 0${cam.id}`, W-48, H-6)

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [cam])

  return (
    <div style={{
      position:'relative', borderRadius:12, overflow:'hidden',
      border: cam.alert ? '1px solid var(--accent)' : '1px solid var(--border)',
      background:'#050e1a', boxShadow: cam.alert ? '0 0 20px rgba(232,64,28,0.2)' : 'none',
    }}>
      <canvas ref={canvasRef} width={640} height={360}
        style={{ width:'100%', height:'100%', display:'block', objectFit:'cover' }} />

      {/* Overlay */}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'space-between', padding:12, background:'linear-gradient(to bottom,rgba(0,0,0,0.5) 0%,transparent 30%,transparent 60%,rgba(0,0,0,0.7) 100%)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:11, fontWeight:600, background:'rgba(0,0,0,0.6)', padding:'3px 10px', borderRadius:99 }}>{cam.label}</span>
          <span style={{ fontSize:10, fontWeight:700, display:'flex', alignItems:'center', gap:4, background:'rgba(0,0,0,0.6)', padding:'3px 10px', borderRadius:99, color:'var(--green)' }}>
            <span className="live-dot" style={{ width:6, height:6 }} /> LIVE
          </span>
        </div>

        {cam.alert && (
          <div style={{ background:'rgba(232,64,28,0.85)', borderRadius:6, padding:'5px 12px', fontSize:11, fontWeight:700, textAlign:'center', animation:'fadeIn 0.5s ease' }}>
            ⚠ Terdeteksi: 2 anak berjualan — 14 mnt lalu
          </div>
        )}

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:10, color:'rgba(255,255,255,0.5)' }}>{cam.resolusi} • {cam.fps} FPS</span>
          <div style={{ display:'flex', gap:6 }}>
            <button className="btn btn-sm" onClick={onFocus}
              style={{ background:'rgba(0,0,0,0.6)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', padding:'3px 10px', fontSize:10 }}>
              {isFocused ? '⊡ Semua' : '⊞ Fokus'}
            </button>
            <button className="btn btn-sm" onClick={onOpenModal}
              style={{ background:'rgba(0,0,0,0.6)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', padding:'3px 10px', fontSize:10 }}>
              ⤢ Perluas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}