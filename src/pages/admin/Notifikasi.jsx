import { useStore } from '../../store/useStore'

export default function AdminNotifikasi() {
  const notifikasi     = useStore(s => s.notifikasi)
  const laporan        = useStore(s => s.laporan)
  const markNotifRead  = useStore(s => s.markNotifRead)
  const markAllRead    = useStore(s => s.markAllNotifRead)
  const openModal      = useStore(s => s.openModal)

  const unread = notifikasi.filter(n => !n.read).length
  const today  = notifikasi.filter(n => !['Kemarin','2 hari lalu'].some(t => n.meta?.some(m => m.includes(t))) && !n.read || n.meta?.some(m => m.includes('mnt') || m.includes('jam')))
  const earlier= notifikasi.filter(n => n.meta?.some(m => m.includes('Kemarin') || m.includes('hari lalu')))

  const borderColor = { red:'var(--accent)', amber:'var(--amber)', green:'var(--green)', blue:'var(--blue)', '':'var(--border)' }

  const handleAction = (notif, action) => {
    markNotifRead(notif.id)
    const lap = notif.laporanId ? laporan.find(l => l.id === notif.laporanId) : null
    if (action === 'tugaskan' && lap)  openModal('tugaskan', lap)
    if (action === 'verifikasi' && lap) openModal('verifikasi', lap)
    if (action === 'cctv') openModal('lihat-cctv', { camLabel:'CAM-01 — Megamas', lokasi:'Kawasan Megamas', resolusi:'1080p', hasAlert:true })
    if (action === 'detail' && lap)    openModal('detail', lap)
  }

  const NotifItem = ({ n }) => (
    <div onClick={() => markNotifRead(n.id)}
      style={{ background:'var(--surface2)', borderRadius:12, padding:'16px 18px', marginBottom:8,
        display:'flex', gap:14, alignItems:'flex-start',
        borderLeft:`3px solid ${borderColor[n.warna] || 'var(--border)'}`,
        cursor:'pointer', transition:'background 0.15s', opacity: n.read ? 0.7 : 1 }}
      onMouseEnter={e => e.currentTarget.style.background='var(--surface3)'}
      onMouseLeave={e => e.currentTarget.style.background='var(--surface2)'}>
      <div style={{ fontSize:24, flexShrink:0, marginTop:2 }}>{n.icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>{n.judul}</div>
        <div style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.6, marginBottom:6 }}>{n.deskripsi}</div>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', fontSize:11, color:'var(--text-dim)', marginBottom:n.tipe!=='selesai'&&n.tipe!=='info'?10:0 }}>
          {n.meta?.map((m,i) => <span key={i}>{m}</span>)}
        </div>
        {n.tipe === 'alert' && !n.read && (
          <div style={{ display:'flex', gap:6 }}>
            <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); handleAction(n,'tugaskan') }}>Tugaskan Petugas</button>
            <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); handleAction(n,'cctv') }}>Lihat CCTV</button>
          </div>
        )}
        {n.tipe === 'laporan' && !n.read && (
          <div style={{ display:'flex', gap:6 }}>
            <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); handleAction(n,'verifikasi') }}>Verifikasi</button>
            <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); handleAction(n,'detail') }}>Detail</button>
          </div>
        )}
      </div>
      {!n.read && (
        <div style={{ width:8, height:8, borderRadius:'50%', background: borderColor[n.warna]||'var(--accent)', flexShrink:0, marginTop:6 }} />
      )}
    </div>
  )

  return (
    <div style={{ flex:1, overflowY:'auto' }}>
      {/* Topbar */}
      <div style={{ padding:'12px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, background:'var(--surface)' }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800 }}>🔔 Notifikasi</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>
            {unread > 0 ? `${unread} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
          </div>
        </div>
        {unread > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Tandai semua dibaca</button>
        )}
      </div>

      <div style={{ maxWidth:760, margin:'0 auto', padding:24 }}>
        {today.length > 0 && <>
          <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color:'var(--text-dim)', margin:'0 0 10px' }}>Hari ini</div>
          {today.map(n => <NotifItem key={n.id} n={n} />)}
        </>}

        {earlier.length > 0 && <>
          <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color:'var(--text-dim)', margin:'24px 0 10px' }}>Sebelumnya</div>
          {earlier.map(n => <NotifItem key={n.id} n={n} />)}
        </>}

        {notifikasi.length === 0 && (
          <div style={{ textAlign:'center', padding:60, color:'var(--text-dim)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔕</div>
            <div style={{ fontSize:14, fontWeight:600 }}>Tidak ada notifikasi</div>
          </div>
        )}
      </div>
    </div>
  )
}