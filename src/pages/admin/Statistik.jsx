import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'

const STATUS_MAP = {
  proses: { label:'Aktif Diproses',      color:'#ff7a5a',        bg:'rgba(232,64,28,0.15)' },
  perlu:  { label:'Perlu Tindak Lanjut', color:'var(--amber)',   bg:'rgba(245,166,35,0.15)' },
  pulang: { label:'Sudah Pulang',        color:'var(--green)',   bg:'rgba(46,204,113,0.15)' },
}

export default function AdminStatistik() {
  const laporan  = useStore(s => s.laporan)
  const anak     = useStore(s => s.anak)
  const openModal = useStore(s => s.openModal)
  const [period, setPeriod] = useState('bulan')
  const [filterAnak, setFilterAnak] = useState('semua')
  const [searchAnak, setSearchAnak] = useState('')
  const navigate = useNavigate()

  const selesai = laporan.filter(l => l.status === 'selesai').length
  const tingkat = laporan.length ? Math.round((selesai/laporan.length)*100) : 0

  const bars = [
    { label:'Sen', val:8,  color:'var(--blue)' },
    { label:'Sel', val:14, color:'var(--accent)' },
    { label:'Rab', val:11, color:'var(--amber)' },
    { label:'Kam', val:20, color:'var(--accent)' },
    { label:'Jum', val:17, color:'var(--amber)' },
    { label:'Sab', val:9,  color:'var(--blue)' },
    { label:'Min', val:5,  color:'var(--blue)' },
  ]
  const maxVal = Math.max(...bars.map(b=>b.val))

  const donut = [
    { label:'Berjualan', pct:45, color:'#E8401C' },
    { label:'Mengamen',  pct:28, color:'#F5A623' },
    { label:'Mengemis',  pct:17, color:'#3B8FE8' },
    { label:'Figuran',   pct:10, color:'#2ECC71' },
  ]

  const areas = [
    { nama:'Kawasan Megamas',    jumlah:48, pct:100, pctLabel:'87%', pctColor:'var(--green)' },
    { nama:'Pasar 45',           jumlah:35, pct:73,  pctLabel:'91%', pctColor:'var(--green)' },
    { nama:'Jl. Boulevard',      jumlah:27, pct:56,  pctLabel:'96%', pctColor:'var(--green)' },
    { nama:'Manado Town Square', jumlah:19, pct:40,  pctLabel:'79%', pctColor:'var(--amber)' },
    { nama:'Kawasan Wenang',     jumlah:13, pct:27,  pctLabel:'85%', pctColor:'var(--green)' },
  ]

  const [hovBar, setHovBar] = useState(null)

  const counts = {
    semua:  anak.length,
    proses: anak.filter(a=>a.status==='proses').length,
    pulang: anak.filter(a=>a.status==='pulang').length,
    perlu:  anak.filter(a=>a.status==='perlu').length,
  }

  const filteredAnak = anak.filter(a => {
    if (filterAnak !== 'semua' && a.status !== filterAnak) return false
    if (searchAnak && !a.nama.toLowerCase().includes(searchAnak.toLowerCase()) &&
        !a.lokasi.toLowerCase().includes(searchAnak.toLowerCase())) return false
    return true
  })

  // Build donut path
  const DONUT_R = 45, DONUT_CX = 60, DONUT_CY = 60
  let cumulative = 0
  const donutPaths = donut.map(d => {
    const startAngle = (cumulative / 100) * 2 * Math.PI - Math.PI/2
    cumulative += d.pct
    const endAngle = (cumulative / 100) * 2 * Math.PI - Math.PI/2
    const x1 = DONUT_CX + DONUT_R * Math.cos(startAngle)
    const y1 = DONUT_CY + DONUT_R * Math.sin(startAngle)
    const x2 = DONUT_CX + DONUT_R * Math.cos(endAngle)
    const y2 = DONUT_CY + DONUT_R * Math.sin(endAngle)
    const largeArc = d.pct > 50 ? 1 : 0
    return { ...d, d:`M ${DONUT_CX} ${DONUT_CY} L ${x1} ${y1} A ${DONUT_R} ${DONUT_R} 0 ${largeArc} 1 ${x2} ${y2} Z` }
  })

  return (
    <div style={{ flex:1, overflowY:'auto', padding:24 }}>
      {/* Topbar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800 }}>📊 Statistik</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Periode: Mei 2026</div>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {[
            { k:'bulan', l:'Bulan Ini' },
            { k:'3bulan',l:'3 Bulan' },
            { k:'tahun', l:'Tahun Ini' },
          ].map(p => (
            <button key={p.k} className={`btn btn-sm ${period===p.k?'btn-primary':'btn-ghost'}`}
              onClick={() => setPeriod(p.k)}>{p.l}</button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
        {[
          { num:laporan.length, color:'var(--accent)', label:'Total Laporan Masuk',     delta:'↑ 18% dari bulan lalu', up:true },
          { num:`${tingkat}%`,  color:'var(--green)',  label:'Tingkat Penanganan',       delta:'↑ 5% dari bulan lalu',  up:true },
          { num:47,             color:'var(--amber)',  label:'Anak Berhasil Dibantu',    delta:'↑ 12 anak lebih banyak',up:true },
          { num:'2.4j',         color:'var(--blue)',   label:'Rata-rata Waktu Respons',  delta:'↓ 30 mnt lebih cepat',  up:false },
        ].map((k,i) => (
          <div key={i} style={{ background:'var(--surface)', borderRadius:14, border:'1px solid var(--border)', padding:20, textAlign:'center' }}>
            <div style={{ fontSize:34, fontWeight:800, fontFamily:"'Syne',sans-serif", color:k.color }}>{k.num}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>{k.label}</div>
            <div style={{ fontSize:11, marginTop:8, color: k.up?'var(--green)':'var(--blue)' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, marginBottom:16 }}>

        {/* Bar chart */}
        <div style={{ background:'var(--surface)', borderRadius:14, border:'1px solid var(--border)', padding:20 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, marginBottom:16 }}>
            Laporan Masuk per Hari (7 hari terakhir)
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:130 }}>
            {bars.map((b, i) => (
              <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1, gap:4, height:'100%', justifyContent:'flex-end' }}>
                <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600 }}>{b.val}</div>
                <div
                  onMouseEnter={() => setHovBar(i)} onMouseLeave={() => setHovBar(null)}
                  style={{ width:'100%', borderRadius:'5px 5px 0 0', background:b.color,
                    height:`${(b.val/maxVal)*100}%`, opacity:hovBar===i?1:0.7,
                    cursor:'pointer', transition:'opacity 0.15s' }} />
                <div style={{ fontSize:9, color:'var(--text-dim)' }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut */}
        <div style={{ background:'var(--surface)', borderRadius:14, border:'1px solid var(--border)', padding:20 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, marginBottom:16 }}>Jenis Aktivitas</div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
            <svg viewBox="0 0 120 120" width="120" height="120">
              {donutPaths.map((p,i) => (
                <path key={i} d={p.d} fill={p.color} opacity="0.85">
                  <title>{p.label}: {p.pct}%</title>
                </path>
              ))}
              <circle cx="60" cy="60" r="28" fill="var(--surface)"/>
              <text x="60" y="65" textAnchor="middle" fill="var(--text)" fontSize="14" fontWeight="700" fontFamily="Syne">
                {laporan.length}
              </text>
            </svg>
            <div style={{ display:'flex', flexDirection:'column', gap:8, width:'100%' }}>
              {donut.map(d => (
                <div key={d.label} style={{ display:'flex', alignItems:'center', gap:8, fontSize:11, color:'var(--text-muted)' }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:d.color, flexShrink:0 }} />
                  <span style={{ flex:1 }}>{d.label}</span>
                  <span style={{ fontWeight:700, color:'var(--text)' }}>{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Area table */}
      <div style={{ background:'var(--surface)', borderRadius:14, border:'1px solid var(--border)', padding:20, marginBottom:16 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, marginBottom:16 }}>Sebaran per Lokasi</div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Lokasi','Jumlah Laporan','Proporsi','Tingkat Penanganan'].map(h => (
                <th key={h} style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'1px', color:'var(--text-dim)', padding:'6px 12px', textAlign:'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {areas.map(a => (
              <tr key={a.nama} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding:12, fontSize:12, fontWeight:600 }}>{a.nama}</td>
                <td style={{ padding:12, fontSize:12 }}>{a.jumlah}</td>
                <td style={{ padding:12, minWidth:120 }}>
                  <div style={{ height:6, borderRadius:3, background:'var(--border)', overflow:'hidden' }}>
                    <div style={{ height:'100%', borderRadius:3, background:'var(--accent)', width:`${a.pct}%`, transition:'width 0.5s ease' }} />
                  </div>
                </td>
                <td style={{ padding:12 }}>
                  <span className="tag" style={{ background:`${a.pctColor}22`, color:a.pctColor }}>{a.pctLabel}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}