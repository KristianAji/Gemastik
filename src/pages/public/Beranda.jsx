import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'

export default function PubBeranda() {
  const navigate = useNavigate()
  const laporan  = useStore(s => s.laporan)
  const baru     = laporan.filter(l => l.status === 'baru').length
  const selesai  = laporan.filter(l => l.status === 'selesai').length

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'32px 20px' }}>

      {/* Hero */}
      <div style={{ textAlign:'center', marginBottom:48 }}>
        <div style={{ display:'inline-block', background:'rgba(232,64,28,0.1)', border:'1px solid rgba(232,64,28,0.25)',
          borderRadius:99, padding:'5px 16px', fontSize:12, color:'var(--accent)', fontWeight:600, marginBottom:16 }}>
          🛡️ Sistem Perlindungan Anak Kota Manado
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:36, fontWeight:800, lineHeight:1.2, marginBottom:16 }}>
          Bersama Kita Lindungi<br/><span style={{ color:'var(--accent)' }}>Anak-Anak Manado</span>
        </h1>
        <p style={{ fontSize:15, color:'var(--text-muted)', lineHeight:1.7, maxWidth:500, margin:'0 auto 28px' }}>
          Laporkan jika Anda melihat anak bekerja di jalanan. Laporan Anda membantu kami melindungi mereka.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/public/laporan')}>
            📝 Buat Laporan Sekarang
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/public/peta')}>
            🗺️ Lihat Peta Laporan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:40 }}>
        {[
          { num: laporan.length, label:'Total Laporan', color:'var(--accent)', icon:'📋' },
          { num: selesai,         label:'Berhasil Ditangani', color:'var(--green)', icon:'✅' },
          { num: baru,            label:'Menunggu Tindak Lanjut', color:'var(--amber)', icon:'⏳' },
        ].map((s,i) => (
          <div key={i} style={{ background:'var(--surface)', borderRadius:14, border:'1px solid var(--border)', padding:20, textAlign:'center' }}>
            <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:28, fontWeight:800, fontFamily:"'Syne',sans-serif", color:s.color }}>{s.num}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* How to report */}
      <div style={{ background:'var(--surface)', borderRadius:16, border:'1px solid var(--border)', padding:28, marginBottom:28 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, marginBottom:20 }}>Cara Membuat Laporan</div>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {[
            { step:'01', title:'Temukan & Amati', desc:'Perhatikan anak yang bekerja di jalanan, berjualan, mengamen, atau mengemis.' },
            { step:'02', title:'Buat Laporan', desc:'Klik tombol "Buat Laporan" dan isi informasi lokasi serta deskripsi singkat.' },
            { step:'03', title:'Kirim & Tunggu', desc:'Tim kami akan memproses laporan dan mengirimkan petugas ke lokasi.' },
            { step:'04', title:'Pantau Status', desc:'Cek status laporan Anda di menu Riwayat untuk update penanganan.' },
          ].map(s => (
            <div key={s.step} style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--accent-soft)', border:'1px solid rgba(232,64,28,0.3)',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:800, color:'var(--accent)' }}>{s.step}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, marginBottom:3 }}>{s.title}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" style={{ marginTop:24, width:'100%', justifyContent:'center' }}
          onClick={() => navigate('/public/laporan')}>
          📝 Mulai Laporan Sekarang
        </button>
      </div>

      {/* Laporan Terbaru */}
      <div style={{ background:'var(--surface)', borderRadius:16, border:'1px solid var(--border)', padding:24 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, marginBottom:16 }}>Laporan Terbaru di Area Anda</div>
        {laporan.slice(0,4).map(l => (
          <div key={l.id} style={{ display:'flex', gap:12, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', flexShrink:0, marginTop:4,
              background: l.status==='baru'?'var(--accent)':l.status==='proses'?'var(--amber)':'var(--green)' }} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:600 }}>{l.lokasi} — {l.jenis}</div>
              <div style={{ fontSize:11, color:'var(--text-muted)' }}>{l.waktu}</div>
            </div>
            <span className={`status-pill ${l.status==='baru'?'s-baru':l.status==='proses'?'s-proses':'s-selesai'}`}>
              {l.status==='baru'?'Baru':l.status==='proses'?'Diproses':'Selesai'}
            </span>
          </div>
        ))}
        <button className="btn btn-ghost" style={{ marginTop:16, width:'100%', justifyContent:'center', fontSize:12 }}
          onClick={() => navigate('/public/riwayat')}>Lihat Semua →</button>
      </div>
    </div>
  )
}