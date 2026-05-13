import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'

export default function PubRiwayat() {
  const laporan  = useStore(s => s.laporan)
  const navigate = useNavigate()

  // Show last 5 as "user's" reports (in real app would filter by user ID)
  const myReports = laporan.slice(0, 5)

  const statusInfo = {
    baru:    { label:'Menunggu Proses', color:'#ff7a5a', bg:'rgba(232,64,28,0.15)', icon:'⏳' },
    proses:  { label:'Sedang Diproses', color:'var(--amber)', bg:'rgba(245,166,35,0.15)', icon:'🔄' },
    selesai: { label:'Selesai Ditangani', color:'var(--green)', bg:'rgba(46,204,113,0.15)', icon:'✅' },
  }

  return (
    <div style={{ maxWidth:640, margin:'0 auto', padding:'32px 20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800 }}>📋 Riwayat Laporan</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>Laporan yang pernah Anda buat</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/public/laporan')}>
          + Buat Laporan
        </button>
      </div>

      {myReports.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, color:'var(--text-dim)' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>📭</div>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>Belum ada laporan</div>
          <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:24 }}>Anda belum pernah membuat laporan.</div>
          <button className="btn btn-primary" onClick={() => navigate('/public/laporan')}>📝 Buat Laporan Pertama</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {myReports.map(l => {
            const st = statusInfo[l.status] || statusInfo.baru
            return (
              <div key={l.id} style={{ background:'var(--surface)', borderRadius:14, border:'1px solid var(--border)', padding:20, transition:'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                  <div>
                    <div style={{ fontFamily:'monospace', fontSize:10, color:'var(--text-dim)', marginBottom:4 }}>#{l.id}</div>
                    <div style={{ fontSize:14, fontWeight:700 }}>{l.lokasi}</div>
                    {l.subLokasi && <div style={{ fontSize:11, color:'var(--text-muted)' }}>{l.subLokasi}</div>}
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:99,
                    background:st.bg, color:st.color, flexShrink:0, marginLeft:12 }}>
                    {st.icon} {st.label}
                  </span>
                </div>

                <div style={{ display:'flex', gap:16, fontSize:11, color:'var(--text-muted)', marginBottom:l.status!=='baru'?12:0 }}>
                  <span>🏷️ {l.jenis}</span>
                  <span>👶 {l.jumlah} anak</span>
                  <span>🕐 {l.waktu}</span>
                </div>

                {/* Progress */}
                {l.status !== 'baru' && (
                  <div style={{ marginTop:12 }}>
                    <div style={{ display:'flex', gap:0 }}>
                      {['Laporan Masuk','Verifikasi','Penugasan','Penanganan','Selesai'].map((s, i) => {
                        const active = (l.status==='proses' && i <= 2) || (l.status==='selesai' && i <= 4)
                        return (
                          <div key={s} style={{ flex:1, textAlign:'center' }}>
                            <div style={{ display:'flex', alignItems:'center' }}>
                              {i > 0 && <div style={{ flex:1, height:2, background: active?'var(--green)':'var(--border)', transition:'background 0.3s' }} />}
                              <div style={{ width:14, height:14, borderRadius:'50%', flexShrink:0,
                                background: active?'var(--green)':'var(--border)', border:`2px solid ${active?'var(--green)':'var(--border)'}` }} />
                              {i < 4 && <div style={{ flex:1, height:2, background: active&&i<2?'var(--green)':'var(--border)' }} />}
                            </div>
                            <div style={{ fontSize:8, color:active?'var(--green)':'var(--text-dim)', marginTop:4, lineHeight:1.3 }}>{s}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}