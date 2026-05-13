import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import CameraCapture from '../../components/camera/CameraCapture'   // ← IMPORT BARU

const LOKASI_OPTIONS = [
  'Kawasan Megamas','Pasar 45','Jl. Boulevard','Manado Town Square',
  'Kawasan Wenang','Pasar Bersehati','Jl. Sam Ratulangi','Lainnya',
]

export default function PubBuatLaporan() {
  const tambahLaporan = useStore(s => s.tambahLaporan)
  const showToast     = useStore(s => s.showToast)
  const navigate      = useNavigate()

  const [step, setStep]       = useState(1)   // 1=form, 2=sukses
  const [loading, setLoading] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)

  /* ─── State BARU: kamera & foto ─── */
  const [showCamera, setShowCamera]     = useState(false)
  const [photos, setPhotos]             = useState([])   // array {raw, blurred, blurZones, id}
  const [previewPhoto, setPreviewPhoto] = useState(null) // foto yang sedang dilihat besar

  const [form, setForm] = useState({
    lokasi:'', subLokasi:'', jenis:'Berjualan', jumlah:1,
    deskripsi:'', pelapor:'', anonymous:false, darurat:false,
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  /* ─── GPS ─── */
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

  /* ─── Callback dari CameraCapture ─── */
  const handlePhotoTaken = (rawUrl, blurredUrl, blurZones) => {
    const newPhoto = {
      id: Date.now(),
      raw: rawUrl,
      blurred: blurredUrl,    // ini yang akan dikirim / disimpan
      blurZones,
      hasBlur: blurZones.length > 0,
    }
    setPhotos(prev => [...prev, newPhoto])
    setShowCamera(false)
    showToast(
      blurZones.length > 0
        ? `✓ Foto ditambahkan (${blurZones.length} area disensor)`
        : '✓ Foto ditambahkan (tanpa sensor)'
    )
  }

  const removePhoto = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  /* ─── Submit laporan ─── */
  const submit = () => {
    if (!form.lokasi) { showToast('Mohon pilih lokasi kejadian', 'var(--amber)'); return }
    setLoading(true)
    setTimeout(() => {
      tambahLaporan({
        ...form,
        sumber: form.anonymous ? 'Anonim' : (form.pelapor || 'Warga'),
        // Hanya kirim foto yang sudah diblur, bukan foto asli
        fotoBukti: photos.map(p => ({ url: p.blurred, hasBlur: p.hasBlur })),
      })
      setLoading(false)
      setStep(2)
    }, 1200)
  }

  /* ─── Reset form ─── */
  const resetForm = () => {
    setStep(1)
    setPhotos([])
    setForm({ lokasi:'', subLokasi:'', jenis:'Berjualan', jumlah:1, deskripsi:'', pelapor:'', anonymous:false, darurat:false })
  }

  /* ════════════════════════════════════
     STEP 2: SUKSES
  ════════════════════════════════════ */
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
          ['Foto Bukti', `${photos.length} foto`],
          ['Status', 'Menunggu Proses'],
        ].map(([k,v]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:12 }}>
            <span style={{ color:'var(--text-muted)' }}>{k}</span>
            <span style={{ fontWeight:600 }}>{v}</span>
          </div>
        ))}
        {/* Preview thumbnail foto */}
        {photos.length > 0 && (
          <div style={{ marginTop: 12, display:'flex', gap: 8, flexWrap:'wrap' }}>
            {photos.map(p => (
              <div key={p.id} style={{ position:'relative', width:60, height:60, borderRadius:8, overflow:'hidden', border:'1px solid var(--border)' }}>
                <img src={p.blurred} alt="bukti" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                {p.hasBlur && (
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(0,0,0,0.6)', fontSize:8, textAlign:'center', padding:'2px 0', color:'#fff' }}>
                    🛡 SENSOR
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
        <button className="btn btn-ghost" onClick={resetForm}>+ Laporan Lain</button>
        <button className="btn btn-primary" onClick={() => navigate('/public/riwayat')}>📋 Lihat Riwayat</button>
      </div>
    </div>
  )

  /* ════════════════════════════════════
     STEP 1: FORM LAPORAN
  ════════════════════════════════════ */
  return (
    <>
      {/* ─── Modal Kamera (render di atas segalanya) ─── */}
      {showCamera && (
        <CameraCapture
          onPhotoTaken={handlePhotoTaken}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* ─── Modal Preview Foto Besar ─── */}
      {previewPhoto && (
        <div
          style={{ position:'fixed', inset:0, zIndex:9998, background:'rgba(0,0,0,0.92)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
          onClick={() => setPreviewPhoto(null)}
        >
          <div style={{ position:'relative', maxWidth:700, width:'100%' }} onClick={e => e.stopPropagation()}>
            <img src={previewPhoto.blurred} alt="preview" style={{ width:'100%', borderRadius:16, display:'block' }} />
            {previewPhoto.hasBlur && (
              <div style={{ position:'absolute', top:12, left:12, background:'rgba(0,0,0,0.7)', borderRadius:20, padding:'6px 14px', fontSize:11, display:'flex', alignItems:'center', gap:6 }}>
                <span>🛡</span>
                <span style={{ color:'#4ade80', fontWeight:700 }}>Identitas disensor</span>
              </div>
            )}
            <button
              onClick={() => setPreviewPhoto(null)}
              style={{ position:'absolute', top:12, right:12, background:'rgba(0,0,0,0.7)', border:'none', color:'#fff', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:16 }}>
              ✕
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth:620, margin:'0 auto', padding:'32px 20px' }}>
        <div style={{ marginBottom:28 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, marginBottom:8 }}>📝 Buat Laporan</div>
          <div style={{ fontSize:13, color:'var(--text-muted)' }}>Isi formulir di bawah untuk melaporkan pekerja anak.</div>
        </div>

        {/* ─── Toggle Darurat ─── */}
        <div
          onClick={() => set('darurat', !form.darurat)}
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

        {/* ─── Form Utama ─── */}
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

          {/* ════════════════════════════════════
               SEKSI FOTO BUKTI — TAMBAHAN BARU
          ════════════════════════════════════ */}
          <div style={{ height:1, background:'var(--border)', margin:'8px 0 16px' }} />

          <div style={{ marginBottom: 16 }}>
            <label className="form-label" style={{ marginBottom: 8, display:'block' }}>
              📸 Foto Bukti <span style={{ color:'var(--text-dim)', fontWeight:400 }}>(opsional, maks. 3 foto)</span>
            </label>

            {/* Banner perlindungan identitas */}
            <div style={{
              background:'rgba(59,130,246,0.08)',
              border:'1px solid rgba(59,130,246,0.2)',
              borderRadius:10, padding:'10px 14px', marginBottom:12,
              display:'flex', gap:10, alignItems:'flex-start',
            }}>
              <span style={{ fontSize:18, flexShrink:0 }}>🛡️</span>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:'#60a5fa', marginBottom:2 }}>Perlindungan Identitas Anak</div>
                <div style={{ fontSize:11, color:'var(--text-muted)', lineHeight:1.6 }}>
                  Sesuai UU Perlindungan Anak, Anda <strong>wajib menyamarkan wajah</strong> anak sebelum mengirim foto.
                  Setelah memotret, tandai area wajah untuk diblur secara manual.
                </div>
              </div>
            </div>

            {/* Grid foto yang sudah diambil */}
            {photos.length > 0 && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginBottom:12 }}>
                {photos.map((photo, idx) => (
                  <div key={photo.id} style={{ position:'relative', aspectRatio:'4/3', borderRadius:10, overflow:'hidden', border:'1px solid var(--border)', cursor:'pointer' }}
                    onClick={() => setPreviewPhoto(photo)}>
                    <img src={photo.blurred} alt={`Foto ${idx+1}`}
                      style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />

                    {/* Badge status blur */}
                    <div style={{
                      position:'absolute', top:6, left:6,
                      background: photo.hasBlur ? 'rgba(74,222,128,0.9)' : 'rgba(245,158,11,0.9)',
                      borderRadius:20, padding:'2px 8px', fontSize:9, fontWeight:800,
                      color: photo.hasBlur ? '#052e16' : '#451a03',
                    }}>
                      {photo.hasBlur ? `🛡 DISENSOR` : '⚠ BELUM DISENSOR'}
                    </div>

                    {/* Tombol hapus */}
                    <button
                      onClick={e => { e.stopPropagation(); removePhoto(photo.id) }}
                      style={{ position:'absolute', top:6, right:6, width:24, height:24, borderRadius:'50%',
                        background:'rgba(0,0,0,0.7)', border:'none', color:'#fff', cursor:'pointer', fontSize:12,
                        display:'flex', alignItems:'center', justifyContent:'center' }}>
                      ✕
                    </button>

                    {/* Overlay nomor */}
                    <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(0,0,0,0.5)',
                      fontSize:10, textAlign:'center', padding:'3px 0', color:'rgba(255,255,255,0.7)' }}>
                      Foto {idx+1} · Klik untuk besar
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tombol ambil foto */}
            {photos.length < 3 ? (
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                style={{
                  width:'100%', padding:'14px 20px', borderRadius:12,
                  border:'2px dashed var(--border)',
                  background:'transparent', color:'var(--text-muted)',
                  cursor:'pointer', fontSize:13, fontWeight:600,
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  transition:'all 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.color='var(--accent)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)' }}
              >
                <span style={{ fontSize:20 }}>📷</span>
                <div style={{ textAlign:'left' }}>
                  <div>{photos.length === 0 ? 'Ambil Foto Bukti' : `Tambah Foto (${photos.length}/3)`}</div>
                  <div style={{ fontSize:11, fontWeight:400, marginTop:1 }}>Wajah anak akan disamarkan manual setelah foto diambil</div>
                </div>
              </button>
            ) : (
              <div style={{ textAlign:'center', fontSize:12, color:'var(--text-dim)', padding:'10px 0' }}>
                ✓ Sudah mencapai batas maksimum 3 foto
              </div>
            )}

            {/* Peringatan jika ada foto tanpa blur */}
            {photos.some(p => !p.hasBlur) && (
              <div style={{ marginTop:10, padding:'10px 14px', background:'rgba(245,158,11,0.1)',
                border:'1px solid rgba(245,158,11,0.3)', borderRadius:10, fontSize:11, color:'#f59e0b', lineHeight:1.6 }}>
                ⚠️ <strong>{photos.filter(p => !p.hasBlur).length} foto</strong> belum memiliki area yang disamarkan.
                Klik foto untuk membuka dan menambahkan blur pada wajah anak.
              </div>
            )}
          </div>
          {/* ═══ akhir seksi foto ═══ */}

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
    </>
  )
}