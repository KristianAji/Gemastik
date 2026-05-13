import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { useState, useEffect } from 'react'

export default function AdminBeranda() {
  const navigate   = useNavigate()
  const laporan    = useStore(s => s.laporan)
  const notifikasi = useStore(s => s.notifikasi)
  const openModal  = useStore(s => s.openModal)
  const showToast  = useStore(s => s.showToast)
  const [refreshing, setRefreshing] = useState(false)

  const unread   = notifikasi.filter(n => !n.read).length
  const totalBulanIni = laporan.length
  const selesai  = laporan.filter(l => l.status === 'selesai').length
  const tingkat  = totalBulanIni ? Math.round((selesai / totalBulanIni) * 100) : 0
  const baru     = laporan.filter(l => l.status === 'baru')

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => { setRefreshing(false); showToast('✓ Data berhasil diperbarui') }, 1200)
  }

  return (
    <div style={{ flex:1, overflowY:'auto', padding:24, display:'flex', flexDirection:'column', gap:20 }}>

      {/* Topbar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800 }}>🏠 Beranda</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Ringkasan sistem monitoring pekerja anak</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-ghost btn-sm" onClick={handleRefresh}>
            {refreshing ? '⏳ Memperbarui...' : '🔄 Perbarui'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/laporan')}>📋 Semua Laporan</button>
        </div>
      </div>

      {/* Welcome Banner */}
      <div style={{
        background:'linear-gradient(120deg,#0f2744 0%,#1a3a60 60%,#1c2e48 100%)',
        borderRadius:18, border:'1px solid rgba(232,64,28,0.2)',
        padding:'28px 32px', display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', right:-40, top:-40, width:200, height:200, borderRadius:'50%',
          background:'radial-gradient(circle,rgba(232,64,28,0.12) 0%,transparent 70%)' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:6 }}>Selamat datang kembali, Admin DP3A 👋</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, lineHeight:1.2, marginBottom:8 }}>
            Pantau &amp; lindungi<br/>anak Kota <span style={{ color:'var(--accent)' }}>Manado</span>
          </div>
          <div style={{ fontSize:13, color:'var(--text-muted)', maxWidth:420, lineHeight:1.6 }}>
            Terdapat <strong style={{ color:'#fff' }}>{baru.length} laporan baru</strong> dan{' '}
            <strong style={{ color:'#fff' }}>{unread} notifikasi</strong> yang membutuhkan perhatian hari ini.
          </div>
        </div>
        <div style={{ display:'flex', gap:10, position:'relative', zIndex:1, flexShrink:0 }}>
          <button className="btn btn-primary" onClick={() => navigate('/admin/notifikasi')}>🔔 Lihat Notifikasi</button>
          <button className="btn btn-ghost" onClick={() => navigate('/admin/cctv')}>📹 Buka CCTV</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {[
          { icon:'📋', num: totalBulanIni, color:'var(--accent)', label:'Total Laporan Bulan Ini', delta:'↑ 18% dari bulan lalu', fill:72,     href:'/admin/laporan' },
          { icon:'👤', num: 47,            color:'var(--amber)',  label:'Anak Terdaftar',           delta:'↑ 5 anak baru pekan ini', fill:47,   href:'/admin/statistik' },
          { icon:'✅', num: `${tingkat}%`, color:'var(--green)', label:'Tingkat Penanganan',        delta:'↑ 5% dari bulan lalu',    fill:tingkat, href:'/admin/statistik' },
          { icon:'📹', num: 4,             color:'var(--blue)',   label:'Kamera Aktif',             delta:'● Semua online',           fill:100,  href:'/admin/cctv' },
        ].map((s, i) => (
          <div key={i} onClick={() => navigate(s.href)}
            style={{ background:'var(--surface)', borderRadius:14, border:'1px solid var(--border)',
              padding:'18px 20px', cursor:'pointer', transition:'all 0.15s',
              animation:`countup 0.5s ease both`, animationDelay:`${i*0.05+0.05}s` }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ fontSize:22, marginBottom:10 }}>{s.icon}</div>
            <div style={{ fontSize:30, fontWeight:800, fontFamily:"'Syne',sans-serif", color:s.color, lineHeight:1, marginBottom:4 }}>{s.num}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)' }}>{s.label}</div>
            <div style={{ fontSize:10, color:'var(--green)', marginTop:8 }}>{s.delta}</div>
            <div style={{ height:3, borderRadius:2, marginTop:12, background:'var(--border)', overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:2, background:s.color, width:`${s.fill}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:16 }}>

        {/* Activity Feed */}
        <div className="section-card">
          <div className="section-head">
            <div className="section-title">🕐 Aktivitas Terbaru</div>
            <span className="section-link" onClick={() => navigate('/admin/notifikasi')}>Lihat semua →</span>
          </div>
          {[
            { dot:'var(--accent)', title:'AI Mendeteksi 2 Anak Berjualan — Megamas', desc:'CAM-01 mendeteksi 2 anak membawa barang dagangan. Confidence 94% & 87%.', time:'14 mnt', href:'/admin/notifikasi' },
            { dot:'var(--amber)',  title:'Laporan Warga Masuk — Pasar 45', desc:'M. Reza melaporkan anak usia 8–10 tahun mengamen di area parkir.', time:'1 jam', href:'/admin/notifikasi' },
            { dot:'var(--amber)',  title:'Laporan Warga — Figuran Karakter Matos', desc:'Anak memakai kostum kartun meminta sumbangan dari pengunjung Matos.', time:'5 jam', href:'/admin/notifikasi' },
            { dot:'var(--green)', title:'Penanganan Berhasil — Jl. Boulevard', desc:'3 anak berhasil dijemput dan dipulangkan ke keluarga oleh petugas Dinsos.', time:'3 jam', href:'/admin/statistik' },
            { dot:'var(--blue)',  title:'Laporan Mingguan Tersedia', desc:'Ringkasan minggu ke-18: 34 laporan masuk, 28 ditangani (82%).', time:'Kemarin', href:'/admin/laporan' },
          ].map((a, i) => (
            <div key={i} onClick={() => navigate(a.href)}
              style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)', display:'flex', gap:12,
                alignItems:'flex-start', cursor:'pointer', transition:'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:a.dot, flexShrink:0, marginTop:4 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:600, marginBottom:3 }}>{a.title}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)', lineHeight:1.5 }}>{a.desc}</div>
              </div>
              <div style={{ fontSize:10, color:'var(--text-dim)', flexShrink:0, paddingTop:2 }}>{a.time}</div>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

          {/* Quick Actions */}
          <div className="section-card">
            <div className="section-head"><div className="section-title">⚡ Akses Cepat</div></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, padding:16 }}>
              {[
                { icon:'📹', label:'CCTV Live',    href:'/admin/cctv' },
                { icon:'🗺️', label:'Peta Sebaran', href:'/admin/peta' },
                { icon:'🔔', label:'Notifikasi',   href:'/admin/notifikasi' },
                { icon:'📊', label:'Statistik',    href:'/admin/statistik' },
              ].map(q => (
                <div key={q.label} onClick={() => navigate(q.href)}
                  style={{ padding:'14px 12px', borderRadius:10, border:'1px solid var(--border)',
                    background:'var(--surface2)', cursor:'pointer', textAlign:'center', transition:'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.color='var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text)' }}>
                  <div style={{ fontSize:22, marginBottom:6 }}>{q.icon}</div>
                  <div style={{ fontSize:11, fontWeight:600 }}>{q.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending alerts */}
          <div className="section-card">
            <div className="section-head">
              <div className="section-title">🚨 Perlu Tindakan</div>
              <span className="section-link" onClick={() => navigate('/admin/notifikasi')}>Lihat semua →</span>
            </div>
            {baru.slice(0,3).map(l => (
              <div key={l.id}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 20px',
                  borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
                onClick={() => openModal('detail', l)}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, marginBottom:2 }}>Deteksi — {l.lokasi}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>Belum diverifikasi</div>
                </div>
                <span style={{ fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:99,
                  background:'rgba(232,64,28,0.15)', color:'#ff7a5a' }}>Baru</span>
              </div>
            ))}
            {baru.length === 0 && (
              <div style={{ padding:20, textAlign:'center', fontSize:12, color:'var(--text-dim)' }}>
                ✓ Tidak ada laporan menunggu
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>

        {/* Mini chart */}
        <div className="section-card">
          <div className="section-head">
            <div className="section-title">📈 Laporan 7 Hari Terakhir</div>
            <span className="section-link" onClick={() => navigate('/admin/statistik')}>Detail →</span>
          </div>
          <MiniChart />
        </div>

        {/* Top Locations */}
        <div className="section-card">
          <div className="section-head">
            <div className="section-title">📍 Lokasi Paling Rawan</div>
            <span className="section-link" onClick={() => navigate('/admin/peta')}>Peta →</span>
          </div>
          <div style={{ padding:'8px 0' }}>
            {[
              { label:'Kawasan Megamas',    num:'48', color:'var(--accent)' },
              { label:'Pasar 45',           num:'35', color:'var(--amber)' },
              { label:'Jl. Boulevard',      num:'27', color:'var(--blue)' },
              { label:'Manado Town Square', num:'19', color:'var(--blue)' },
            ].map(r => (
              <div key={r.label} style={{ padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontSize:12, fontWeight:700, color:r.color }}>{r.num} laporan</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="section-card">
          <div className="section-head"><div className="section-title">🖥️ Status Sistem</div></div>
          <div style={{ padding:'8px 0' }}>
            {[
              { label:'Pipeline AI (YOLOv8)',     status:'Online', color:'var(--green)' },
              { label:'Estimasi Usia (MiVolo)',   status:'Online', color:'var(--green)' },
              { label:'Klasifikasi (VideoMAE)',   status:'Online', color:'var(--green)' },
              { label:'CCTV Feed (4 kamera)',     status:'Live',   color:'var(--green)' },
            ].map(r => (
              <div key={r.label} style={{ padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>{r.label}</span>
                <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color:r.color }}>
                  <span className="live-dot" style={{ width:7, height:7 }} />{r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniChart() {
  const bars = [
    { h:40, c:'var(--accent)', label:'Sen', val:8 },
    { h:70, c:'var(--accent)', label:'Sel', val:14 },
    { h:55, c:'var(--amber)',  label:'Rab', val:11 },
    { h:100,c:'var(--accent)', label:'Kam', val:20 },
    { h:85, c:'var(--amber)',  label:'Jum', val:17 },
    { h:45, c:'var(--blue)',   label:'Sab', val:9 },
    { h:25, c:'var(--blue)',   label:'Min', val:5 },
  ]
  const [hovered, setHovered] = useState(null)
  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-end', gap:5, height:60, padding:'0 20px 0' }}>
        {bars.map((b, i) => (
          <div key={i} title={`${b.label}: ${b.val}`}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            style={{ flex:1, borderRadius:'3px 3px 0 0', background:b.c,
              height:`${b.h}%`, opacity: hovered === i ? 1 : 0.65,
              transition:'opacity 0.15s', cursor:'pointer', position:'relative' }}>
            {hovered === i && (
              <div style={{ position:'absolute', bottom:'105%', left:'50%', transform:'translateX(-50%)',
                background:'var(--surface3)', border:'1px solid var(--border)', borderRadius:6,
                padding:'3px 8px', fontSize:10, fontWeight:700, whiteSpace:'nowrap', color:'var(--text)' }}>
                {b.val}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 20px 14px', fontSize:9, color:'var(--text-dim)' }}>
        {bars.map(b => <span key={b.label}>{b.label}</span>)}
      </div>
    </div>
  )
}