import { useState } from 'react'
import { useStore } from '../../store/useStore'

const PINS = [
  { x:120, y:220, label:'Kawasan Megamas',   desc:'2 anak berjualan', time:'14 mnt', status:'baru',   color:'#E8401C' },
  { x:300, y:220, label:'Pasar 45',          desc:'1 anak mengamen',  time:'1 jam',  status:'proses', color:'#F5A623' },
  { x:300, y:310, label:'Jl. Boulevard',     desc:'Selesai ditangani',time:'3 jam',  status:'selesai',color:'#2ECC71' },
  { x:450, y:220, label:'Matos',             desc:'Figuran karakter', time:'5 jam',  status:'proses', color:'#F5A623' },
  { x:560, y:280, label:'Kawasan Wenang',    desc:'2 anak mengemis',  time:'Kemarin',status:'selesai',color:'#2ECC71' },
]

export default function PubPeta() {
  const [selected, setSelected] = useState(null)
  const navigate = () => {}

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, marginBottom:4 }}>🗺️ Peta Laporan</div>
        <div style={{ fontSize:13, color:'var(--text-muted)' }}>Sebaran laporan aktif di Kota Manado</div>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:400, position:'relative' }}>
        {/* SVG Map */}
        <div style={{ flex:1, background:'#0A1420', position:'relative', overflow:'hidden', minHeight:350 }}>
          <svg width="100%" height="100%" viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ display:'block' }}>
            <rect width="700" height="400" fill="#0A1420"/>
            <defs>
              <pattern id="pgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="700" height="400" fill="url(#pgrid)"/>
            <line x1="0" y1="230" x2="700" y2="230" stroke="rgba(255,255,255,0.12)" strokeWidth="3"/>
            <line x1="0" y1="310" x2="700" y2="310" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
            <line x1="180" y1="0" x2="180" y2="400" stroke="rgba(255,255,255,0.10)" strokeWidth="3"/>
            <line x1="380" y1="0" x2="380" y2="400" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>

            <text x="40"  y="210" fill="rgba(255,255,255,0.2)" fontSize="11" fontFamily="DM Sans">Megamas</text>
            <text x="240" y="210" fill="rgba(255,255,255,0.2)" fontSize="11" fontFamily="DM Sans">Pasar 45</text>
            <text x="395" y="210" fill="rgba(255,255,255,0.2)" fontSize="11" fontFamily="DM Sans">Matos</text>
            <text x="240" y="340" fill="rgba(255,255,255,0.2)" fontSize="11" fontFamily="DM Sans">Jl. Boulevard</text>

            {PINS.map((pin, i) => (
              <g key={i} onClick={() => setSelected(selected?.label===pin.label ? null : pin)} style={{ cursor:'pointer' }}>
                <circle cx={pin.x} cy={pin.y} r="20" fill={`${pin.color}10`}>
                  <animate attributeName="r" from="8" to="22" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx={pin.x} cy={pin.y} r="12" fill={`${pin.color}20`} stroke={pin.color} strokeWidth={selected?.label===pin.label?2:1.5}/>
                <circle cx={pin.x} cy={pin.y} r="5"  fill={pin.color}/>
              </g>
            ))}

            {selected && (
              <g>
                <rect x={Math.min(selected.x+16,530)} y={Math.max(selected.y-70,10)} width="170" height="60" rx="8" fill="#0F2744" stroke={selected.color} strokeWidth="1.5"/>
                <text x={Math.min(selected.x+26,540)} y={Math.max(selected.y-50,30)} fill={selected.color} fontSize="11" fontFamily="DM Sans" fontWeight="700">{selected.label}</text>
                <text x={Math.min(selected.x+26,540)} y={Math.max(selected.y-35,45)} fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="DM Sans">{selected.desc}</text>
                <text x={Math.min(selected.x+26,540)} y={Math.max(selected.y-20,60)} fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="DM Sans">🕐 {selected.time}</text>
              </g>
            )}

            {/* Legend */}
            {[{c:'#E8401C',l:'Baru'},{c:'#F5A623',l:'Diproses'},{c:'#2ECC71',l:'Selesai'}].map((x,i)=>(
              <g key={x.l} transform={`translate(${16+i*80},376)`}>
                <rect width="8" height="8" rx="2" fill={x.c}/>
                <text x="12" y="8" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="DM Sans">{x.l}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* List */}
        <div style={{ background:'var(--surface)', borderTop:'1px solid var(--border)', padding:16 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'var(--text-muted)', marginBottom:12 }}>LAPORAN TERKINI</div>
          <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:4 }}>
            {PINS.map((pin, i) => (
              <div key={i} onClick={() => setSelected(selected?.label===pin.label?null:pin)}
                style={{ background:'var(--surface2)', borderRadius:10, padding:'10px 14px', flexShrink:0,
                  border:`1px solid ${selected?.label===pin.label?pin.color:'var(--border)'}`,
                  cursor:'pointer', minWidth:160, transition:'all 0.15s' }}>
                <div style={{ fontSize:11, fontWeight:700, marginBottom:3 }}>📍 {pin.label}</div>
                <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:6 }}>{pin.desc}</div>
                <span style={{ fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:99,
                  background:pin.status==='baru'?'rgba(232,64,28,0.2)':pin.status==='proses'?'rgba(245,166,35,0.2)':'rgba(46,204,113,0.2)',
                  color:pin.color }}>
                  {pin.status==='baru'?'Baru':pin.status==='proses'?'Diproses':'Selesai'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}