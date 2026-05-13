import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'

const LOKASI_OPTIONS = [
  'Kawasan Megamas','Pasar 45','Jl. Boulevard','Manado Town Square',
  'Kawasan Wenang','Pasar Bersehati','Jl. Sam Ratulangi','Lainnya',
]

export default function PubBuatLaporan() {
  const tambahLaporan = useStore(s => s.tambahLaporan)
  const showToast     = useStore(s => s.showToast)
  const navigate      = useNavigate()

  const [step, setStep]     = useState(1) // 1=form, 2=sukses
  const [loading, setLoading] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [form, setForm]     = useState({
    lokasi:'', subLokasi:'', jenis:'Berjualan', jumlah:1,
    deskripsi:'', pelapor:'', anonymous:false, darurat:false,
  })

  const set = (k,v) => setForm(f => ({ ...f, [k]:v }))

  const getGPS = () => {
    setGpsLoading(true)
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        set('subLokasi', `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)} (GPS)`)
        setGpsLoading(false)
        showToast('✓ Lokasi GPS berhasil didapat')
      },
      () => {
        setGpsLoading(false)
        showToast('Tidak dapat mengakses GPS', 'var(--amber)')
      }
    )
  }

  const submit = () => {
    if (!form.lokasi) { showToast('Mohon pilih lokasi kejadian', 'var(--amber)'); return }
    setLoading(true)
    setTimeout(() => {
      tambahLaporan({ ...form, sumber: form.anonymous ? 'Anonim' : (form.pelapor || 'Warga') })
      setLoading(false)
      setStep(2)
    }, 1200)
  }

  if (step === 2) return (
    <div style={{ maxWidth:500, margin:'60px auto', padding:'0 20px', textAlign:'center' }}>
      <div style={{ fontSize:64, marginBottom:20 }}>✅</div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, marginBottom:12 }}>Laporan Terkirim!</div>
      <div style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.7, marginBottom:28 }}>
        Terima kasih telah melapor. Tim kami akan segera menindaklanjuti laporan Anda.
        Anda dapat memantau status laporan di menu Riwayat.
      </div>
      <div style={{ background:'var(--surface)', borderRadius:12, border:'1px solid var(--border)', padding:20, marginBottom:24, textAlign:'left' }}>
        <div style={{ fontSize:12, color:'var(--text-dim)', marginBottom:8 }}>Detail Laporan</div>
        {[
          ['Lokasi', form.lokasi],
          ['Jenis',  form.jenis],
          ['Jumlah Anak', `${form.jumlah} orang`],
          ['Status', 'Menunggu Proses'],
        ].map(([k,v]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:12 }}>
            <span style={{ color:'var(--text-muted)' }}>{k}</span>
            <span style={{ fontWeight:600 }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
        <button className="btn btn-ghost" onClick={() => { setStep(1); setForm({ lokasi:'', subLokasi:'', jenis:'Berjualan', jumlah:1, deskripsi:'', pelapor:'', anonymous:false, darurat:false }) }}>
          + Laporan Lain
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/public/riwayat')}>
          📋 Lihat Riwayat
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth:620, margin:'0 auto', padding:'32px 20px' }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, marginBottom:8 }}>📝 Buat Laporan</div>
        <div style={{ fontSize:13, color:'var(--text-muted)' }}>Isi formulir di bawah untuk melaporkan pekerja anak.</div>
      </div>

      {/* Darurat toggle */}
      <div onClick={() => set('darurat', !form.darurat)}
        style={{ background: form.darurat ? 'rgba(232,64,28,0.1)' : 'var(--surface)',
          border: `1px solid ${form.darurat ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius:12, padding:'14px 18px', cursor:'pointer', transition:'all 0.2s', marginBottom:20,
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color: form.darurat ? 'var(--accent)' : 'var(--text)' }}>
            🚨 Situasi Darurat / Mendesak
          </div>
          <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>Aktifkan jika anak dalam bahaya langsung</div>
        </div>
        <div style={{ width:40, height:22, borderRadius:11, background: form.darurat ? 'var(--accent)' : 'var(--surface3)',
          position:'relative', transition:'background 0.2s', flexShrink:0 }}>
          <div style={{ position:'absolute', width:18, height:18, borderRadius:'50%', background:'#fff',
            top:2, left: form.darurat ? 20 : 2, transition:'left 0.2s' }} />
        </div>
      </div>

      {/* Form */}
      <div style={{ background:'var(--surface)', borderRadius:16, border:'1px solid var(--border)', padding:24, display:'flex', flexDirection:'column', gap:0 }}>

        <div className="form-group">
          <label className="form-label">Lokasi Kejadian *</label>
          <select className="input" value={form.lokasi} onChange={e => set('lokasi', e.target.value)}>
            <option value="">— Pilih lokasi —</option>
            {LOKASI_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Alamat / Keterangan Lokasi</label>
          <div style={{ display:'flex', gap:8 }}>
            <input className="input" style={{ flex:1 }} placeholder="cth: Depan pintu masuk utama, dekat ATM..."
              value={form.subLokasi} onChange={e => set('subLokasi', e.target.value)} />
            <button className="btn btn-ghost btn-sm" onClick={getGPS} style={{ flexShrink:0 }}>
              {gpsLoading ? '⏳' : '📍 GPS'}
            </button>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div className="form-group">
            <label className="form-label">Jenis Aktivitas</label>
            <select className="input" value={form.jenis} onChange={e => set('jenis', e.target.value)}>
              <option>Berjualan</option>
              <option>Mengamen</option>
              <option>Mengemis</option>
              <option>Figuran / Kostum</option>
              <option>Lainnya</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Perkiraan Jumlah Anak</label>
            <input className="input" type="number" min={1} max={20} value={form.jumlah}
              onChange={e => set('jumlah', +e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Deskripsi Singkat</label>
          <textarea className="input" rows={3}
            placeholder="Ceritakan apa yang Anda lihat, ciri-ciri anak, situasi sekitar..."
            value={form.deskripsi} onChange={e => set('deskripsi', e.target.value)}
            style={{ resize:'vertical' }} />
        </div>

        <div style={{ height:1, background:'var(--border)', margin:'8px 0 16px' }} />

        <div className="form-group">
          <label className="form-label">Nama Pelapor (opsional)</label>
          <input className="input" placeholder="Nama Anda" disabled={form.anonymous}
            value={form.pelapor} onChange={e => set('pelapor', e.target.value)}
            style={{ opacity: form.anonymous ? 0.5 : 1 }} />
        </div>

        <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', fontSize:13, marginBottom:20 }}>
          <input type="checkbox" checked={form.anonymous} onChange={e => set('anonymous', e.target.checked)}
            style={{ accentColor:'var(--accent)', width:16, height:16 }} />
          Laporkan secara anonim (nama tidak ditampilkan)
        </label>

        <button className="btn btn-primary" onClick={submit}
          style={{ justifyContent:'center', padding:'12px 0', fontSize:14 }}>
          {loading ? '⏳ Mengirim...' : '📤 Kirim Laporan'}
        </button>

        <div style={{ fontSize:11, color:'var(--text-dim)', textAlign:'center', marginTop:12, lineHeight:1.6 }}>
          Data laporan Anda akan dijaga kerahasiaannya dan hanya digunakan untuk keperluan perlindungan anak.
        </div>
      </div>
    </div>
  )
}