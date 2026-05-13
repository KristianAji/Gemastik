import { useState } from 'react'
import { useStore } from '../../store/useStore'

const PINS = [
  { id:'megamas', x:120, y:220, label:'Kawasan Megamas', desc:'2 anak berjualan tisu', time:'14 mnt', status:'baru',   color:'#E8401C', r:16, laporanId:'LP-2024-142' },
  { id:'pasar45', x:300, y:220, label:'Pasar 45',        desc:'1 anak mengamen',       time:'1 jam',  status:'proses', color:'#F5A623', r:14, laporanId:'LP-2024-141' },
  { id:'blvd',    x:300, y:310, label:'Jl. Boulevard',   desc:'3 anak dipulangkan',    time:'3 jam',  status:'selesai',color:'#2ECC71', r:10, laporanId:'LP-2024-139' },
  { id:'matos',   x:450, y:220, label:'Matos',           desc:'Figuran karakter',      time:'5 jam',  status:'proses', color:'#F5A623', r:12, laporanId:'LP-2024-140' },
  { id:'wenang',  x:560, y:280, label:'Kawasan Wenang',  desc:'2 anak mengemis',       time:'Kemarin',status:'selesai',color:'#2ECC71', r:8,  laporanId:'LP-2024-138' },
]

const STATUS_LABEL = { baru:'Baru', proses:'Diproses', selesai:'Selesai' }
const STATUS_COLOR = { baru:'#ff7a5a', proses:'var(--amber)', selesai:'var(--green)' }

export default function AdminPeta() {
  const openModal = useStore(s => s.openModal)
  const laporan   = useStore(s => s.laporan)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('semua')

  const filtered = PINS.filter(p => filter === 'semua' || p.status === filter)
  const active   = PINS.filter(p => p.status !== 'selesai')

  const handleTugaskan = (pin) => {
    const lap = laporan.find(l => l.id === pin.laporanId)
    if (lap) openModal('tugaskan', lap)
  }
  const handleDetail = (pin) => {
    const lap = laporan.find(l => l.id === pin.laporanId)
    if (lap) openModal('detail', lap)
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Topbar */}
      <div style={{ padding:'12px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800 }}>🗺️ Peta Sebaran Laporan</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Visualisasi lokasi laporan aktif di Kota Manado</div>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {['semua','baru','proses','selesai'].map(f => (
            <button key={f} className={`btn btn-sm ${filter===f?'btn-primary':'btn-ghost'}`}
              onClick={() => setFilter(f)} style={{ textTransform:'capitalize' }}>
              {f === 'semua' ? 'Semua' : f === 'baru' ? 'Baru' : f === 'proses' ? 'Diproses' : 'Selesai'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 300px', overflow:'hidden' }}>
        {/* Map */}
        <div style={{ background:'#0A1420', position:'relative', overflow:'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 700 480" xmlns="http://www.w3.org/2000/svg" style={{ display:'block' }}>
            <rect width="700" height="480" fill="#0A1420"/>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="700" height="480" fill="url(#grid)"/>

            {/* Roads */}
            <line x1="0"   y1="230" x2="700" y2="230" stroke="rgba(255,255,255,0.12)" strokeWidth="3"/>
            <line x1="0"   y1="310" x2="700" y2="310" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
            <line x1="180" y1="0"   x2="180" y2="480" stroke="rgba(255,255,255,0.10)" strokeWidth="3"/>
            <line x1="380" y1="0"   x2="380" y2="480" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
            <line x1="540" y1="0"   x2="540" y2="480" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"/>
            <line x1="100" y1="100" x2="600" y2="400" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>

            {/* Area labels */}
            <text x="40"  y="210" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="DM Sans">Megamas</text>
            <text x="240" y="210" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="DM Sans">Pasar 45</text>
            <text x="395" y="210" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="DM Sans">Matos</text>
            <text x="240" y="340" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="DM Sans">Jl. Boulevard</text>
            <text x="548" y="265" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="DM Sans">Wenang</text>

            {/* Pins */}
            {filtered.map(pin => (
              <PinSVG key={pin.id} pin={pin}
                isSelected={selected?.id === pin.id}
                onClick={() => setSelected(selected?.id === pin.id ? null : pin)} />
            ))}

            {/* Legend */}
            {[
              { color:'#E8401C', label:'Baru' },
              { color:'#F5A623', label:'Diproses' },
              { color:'#2ECC71', label:'Selesai' },
            ].map((l, i) => (
              <g key={l.label} transform={`translate(${20 + i*80}, 452)`}>
                <rect width="8" height="8" rx="2" fill={l.color}/>
                <text x="12" y="8" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="DM Sans">{l.label}</text>
              </g>
            ))}

            {/* Selected callout */}
            {selected && (() => {
              const p = selected
              const cx = Math.min(p.x + 20, 560)
              const cy = Math.max(p.y - 80, 10)
              return (
                <g>
                  <rect x={cx} y={cy} width="180" height="70" rx="8" fill="var(--surface)" stroke={p.color} strokeWidth="1.5"/>
                  <text x={cx+10} y={cy+18} fill={p.color} fontSize="11" fontFamily="DM Sans" fontWeight="700">{p.label}</text>
                  <text x={cx+10} y={cy+34} fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="DM Sans">{p.desc}</text>
                  <text x={cx+10} y={cy+48} fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="DM Sans">🕐 {p.time}</text>
                  <rect x={cx+10} y={cy+53} width="75" height="13" rx="4" fill={p.color} style={{ cursor:'pointer' }}/>
                  <text x={cx+47} y={cy+63} textAnchor="middle" fill="#fff" fontSize="9" fontFamily="DM Sans" fontWeight="700" style={{ cursor:'pointer' }}>Lihat Detail</text>
                </g>
              )
            })()}
          </svg>
        </div>

        {/* Side panel */}
        <div style={{ background:'var(--surface)', borderLeft:'1px solid var(--border)', overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, marginBottom:4 }}>
            Laporan Aktif ({active.length})
          </div>

          {PINS.map(pin => {
            const lap = laporan.find(l => l.id === pin.laporanId)
            return (
              <div key={pin.id}
                onClick={() => setSelected(selected?.id === pin.id ? null : pin)}
                style={{ background:'var(--surface2)', borderRadius:10, padding:12,
                  borderLeft:`3px solid ${pin.color}`, cursor:'pointer', transition:'all 0.15s',
                  border: selected?.id === pin.id ? `1px solid ${pin.color}` : '1px solid var(--border)',
                  borderLeftWidth:3, borderLeftColor:pin.color }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:12, fontWeight:700 }}>📍 {pin.label}</span>
                  <span style={{ fontSize:10, color:'var(--text-dim)' }}>{pin.time}</span>
                </div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:8 }}>{pin.desc}</div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom: pin.status==='baru'?8:0 }}>
                  <span className="tag" style={{ background:`${STATUS_COLOR[pin.status]}22`, color:STATUS_COLOR[pin.status] }}>
                    {STATUS_LABEL[pin.status]}
                  </span>
                </div>
                {pin.status === 'baru' && lap && (
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); handleTugaskan(pin) }}>Tugaskan</button>
                    <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); handleDetail(pin) }}>Detail</button>
                  </div>
                )}
                {pin.status === 'proses' && lap && (
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); handleDetail(pin) }}>Lihat Detail</button>
                  </div>
                )}
              </div>
            )
          })}

          {/* Filter section */}
          <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid var(--border)' }}>
            <div style={{ fontSize:11, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:8 }}>Filter Status</div>
            {[
              { status:'baru',    label:'Baru', color:'#ff7a5a' },
              { status:'proses',  label:'Diproses', color:'var(--amber)' },
              { status:'selesai', label:'Selesai', color:'var(--green)' },
            ].map(f => (
              <label key={f.status} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, cursor:'pointer', marginBottom:8 }}>
                <input type="checkbox" checked={filter==='semua'||filter===f.status}
                  onChange={() => setFilter(prev => prev===f.status ? 'semua' : f.status)}
                  style={{ accentColor:'var(--accent)' }} />
                <span style={{ color:f.color }}>●</span>
                {f.label} ({PINS.filter(p=>p.status===f.status).length})
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PinSVG({ pin, isSelected, onClick }) {
  return (
    <g onClick={onClick} style={{ cursor:'pointer' }}>
      <circle cx={pin.x} cy={pin.y} r={pin.r + 8} fill={`${pin.color}15`} stroke={pin.color} strokeWidth="1" opacity="0.5">
        <animate attributeName="r" from={pin.r} to={pin.r + 14} dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="0.7" to="0" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx={pin.x} cy={pin.y} r={pin.r} fill={`${pin.color}20`} stroke={pin.color} strokeWidth={isSelected?2:1.5}/>
      <circle cx={pin.x} cy={pin.y} r={pin.r*0.45} fill={pin.color}/>
      {isSelected && <circle cx={pin.x} cy={pin.y} r={pin.r+4} fill="none" stroke={pin.color} strokeWidth="2" strokeDasharray="4 3"/>}
    </g>
  )
}