import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import CameraCapture from '../../components/camera/CameraCapture'
import FooterPublic from '../../components/FooterPublic'

const LOKASI_OPTIONS = [
  'Kawasan Megamas','Pasar 45','Jl. Boulevard','Manado Town Square',
  'Kawasan Wenang','Pasar Bersehati','Jl. Sam Ratulangi','Lainnya',
]

/* ── Animasi centang SVG via canvas (JS murni) ── */
function CheckmarkCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx    = canvas.getContext('2d')
    const size   = canvas.width

    // Lingkaran latar
    const cx = size / 2, cy = size / 2, r = size * 0.38

    let progress  = 0    // 0..1 untuk lingkaran
    let checkProg = 0    // 0..1 untuk centang
    let phase     = 'circle'  // 'circle' | 'check' | 'done'
    let raf

    const easeOut = t => 1 - Math.pow(1 - t, 3)

    const draw = () => {
      ctx.clearRect(0, 0, size, size)

      // Lingkaran background navy
      ctx.beginPath()
      ctx.arc(cx, cy, r + 4, 0, Math.PI * 2)
      ctx.fillStyle = '#022B3A'
      ctx.fill()

      // Arc progress (teal)
      const p = easeOut(Math.min(progress, 1))
      ctx.beginPath()
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p)
      ctx.strokeStyle = '#1F7A8C'
      ctx.lineWidth   = size * 0.06
      ctx.lineCap     = 'round'
      ctx.stroke()

      // Centang (setelah lingkaran selesai)
      if (phase === 'check' || phase === 'done') {
        const cp = easeOut(Math.min(checkProg, 1))

        // Titik-titik path centang
        const pts = [
          [cx - r * 0.42, cy + r * 0.02],
          [cx - r * 0.08, cy + r * 0.38],
          [cx + r * 0.44, cy - r * 0.30],
        ]

        const totalLen = dist(pts[0], pts[1]) + dist(pts[1], pts[2])
        const drawn    = totalLen * cp

        ctx.beginPath()
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth   = size * 0.065
        ctx.lineCap     = 'round'
        ctx.lineJoin    = 'round'

        let rem = drawn
        ctx.moveTo(pts[0][0], pts[0][1])
        for (let i = 1; i < pts.length; i++) {
          const segLen = dist(pts[i-1], pts[i])
          if (rem <= 0) break
          if (rem >= segLen) {
            ctx.lineTo(pts[i][0], pts[i][1])
            rem -= segLen
          } else {
            const t = rem / segLen
            const lx = pts[i-1][0] + (pts[i][0] - pts[i-1][0]) * t
            const ly = pts[i-1][1] + (pts[i][1] - pts[i-1][1]) * t
            ctx.lineTo(lx, ly)
            rem = 0
          }
        }
        ctx.stroke()
      }

      // Animasi
      if (phase === 'circle') {
        progress += 0.028
        if (progress >= 1) { progress = 1; phase = 'check' }
        raf = requestAnimationFrame(draw)
      } else if (phase === 'check') {
        checkProg += 0.035
        if (checkProg >= 1) { checkProg = 1; phase = 'done' }
        raf = requestAnimationFrame(draw)
      }
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={120}
      style={{ display: 'block', margin: '0 auto 24px' }}
    />
  )
}

function dist([x1,y1], [x2,y2]) {
  return Math.sqrt((x2-x1)**2 + (y2-y1)**2)
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export default function PubBuatLaporan() {
  const tambahLaporan = useStore(s => s.tambahLaporan)
  const showToast     = useStore(s => s.showToast)
  const navigate      = useNavigate()

  const [step, setStep]       = useState(1)
  const [loading, setLoading] = useState(false)
  const [laporanId, setLaporanId] = useState('')
  const [gpsLoading, setGpsLoading] = useState(false)

  const [showCamera, setShowCamera]     = useState(false)
  const [photos, setPhotos]             = useState([])
  const [previewPhoto, setPreviewPhoto] = useState(null)

  const [form, setForm] = useState({
    lokasi:'', subLokasi:'', jenis:'Berjualan', jumlah:1,
    deskripsi:'', pelapor:'', anonymous:false, darurat:false,
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const getGPS = () => {
    setGpsLoading(true)
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        set('subLokasi', `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)} (GPS)`)
        setGpsLoading(false)
        showToast('Lokasi GPS berhasil didapat')
      },
      () => {
        setGpsLoading(false)
        showToast('Tidak dapat mengakses GPS', 'var(--amber)')
      }
    )
  }

  const handlePhotoTaken = (rawUrl, blurredUrl, blurZones) => {
    const newPhoto = {
      id: Date.now(),
      raw: rawUrl,
      blurred: blurredUrl,
      blurZones,
      hasBlur: true, // selalu true karena otomatis
    }
    setPhotos(prev => [...prev, newPhoto])
    setShowCamera(false)
    showToast('Foto ditambahkan — wajah telah disensor otomatis')
  }

  const removePhoto = (id) => setPhotos(prev => prev.filter(p => p.id !== id))

  const submit = () => {
    if (!form.lokasi) { showToast('Mohon pilih lokasi kejadian', 'var(--amber)'); return }
    setLoading(true)
    setTimeout(() => {
      const newId = `LP-${Date.now().toString().slice(-6)}`
      setLaporanId(newId)
      tambahLaporan({
        ...form,
        sumber: form.anonymous ? 'Anonim' : (form.pelapor || 'Warga'),
        fotoBukti: photos.map(p => ({ url: p.blurred, hasBlur: p.hasBlur })),
      })
      setLoading(false)
      setStep(2)
    }, 1200)
  }

  const resetForm = () => {
    setStep(1)
    setPhotos([])
    setForm({ lokasi:'', subLokasi:'', jenis:'Berjualan', jumlah:1, deskripsi:'', pelapor:'', anonymous:false, darurat:false })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .laporan-root {
          font-family: 'Inter', sans-serif;
          background: #E1E5F2;
          color: #022B3A;
          min-height: 100vh;
        }

        /* ── PAGE HEADER ── */
        .page-title-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .page-title-logo {
          width: 42px;
          height: 42px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .laporan-header {
          background: #022B3A;
          padding: 48px 40px 40px;
          position: relative;
          overflow: hidden;
        }
        .laporan-header::after {
          content: '';
          position: absolute;
          right: -60px;
          top: -60px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(31,122,140,0.35) 0%, transparent 70%);
          pointer-events: none;
        }
        .laporan-header-inner {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .laporan-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(191,219,247,0.55);
          margin-bottom: 16px;
          font-weight: 500;
        }
        .laporan-breadcrumb button {
          background: none;
          border: none;
          color: rgba(191,219,247,0.55);
          cursor: pointer;
          font-size: 12px;
          font-family: 'Inter', sans-serif;
          padding: 0;
          transition: color 0.15s;
        }
        .laporan-breadcrumb button:hover { color: #BFDBF7; }
        .laporan-breadcrumb span { color: #BFDBF7; }

        .laporan-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(191,219,247,0.12);
          border: 1px solid rgba(191,219,247,0.25);
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 600;
          color: #BFDBF7;
          letter-spacing: 0.04em;
          margin-bottom: 14px;
        }
        .laporan-page-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 10px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .laporan-page-title span { color: #BFDBF7; }
        .laporan-page-sub {
          font-size: 14px;
          color: rgba(191,219,247,0.75);
          line-height: 1.6;
          max-width: 500px;
        }

        /* ── BODY ── */
        .laporan-body {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 40px 80px;
        }

        /* ── DARURAT TOGGLE ── */
        .darurat-toggle {
          background: #FFFFFF;
          border: 2px solid #D6DCE4;
          border-radius: 14px;
          padding: 16px 20px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .darurat-toggle.aktif {
          background: rgba(220,38,38,0.05);
          border-color: #dc2626;
        }
        .darurat-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #022B3A;
          margin-bottom: 3px;
        }
        .darurat-toggle.aktif .darurat-label { color: #dc2626; }
        .darurat-sublabel { font-size: 12px; color: #5A7080; }
        .toggle-pill {
          width: 44px; height: 24px; border-radius: 12px;
          background: #D6DCE4; position: relative;
          transition: background 0.2s; flex-shrink: 0;
        }
        .toggle-pill.aktif { background: #dc2626; }
        .toggle-knob {
          position: absolute; width: 20px; height: 20px;
          border-radius: 50%; background: #fff; top: 2px; left: 2px;
          transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .toggle-pill.aktif .toggle-knob { left: 22px; }

        /* ── FORM CARD ── */
        .form-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #D6DCE4;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .form-card-header {
          background: #022B3A;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .form-card-header-icon {
          width: 32px; height: 32px;
          background: rgba(191,219,247,0.15);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .form-card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700; color: #FFFFFF;
        }
        .form-card-subtitle {
          font-size: 11px; color: rgba(191,219,247,0.6); margin-top: 1px;
        }
        .form-card-body {
          padding: 24px;
          display: flex; flex-direction: column; gap: 18px;
        }

        /* ── FORM ELEMENTS ── */
        .fl-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; font-weight: 700;
          color: #022B3A;
          text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 7px; display: block;
        }
        .fl-label .opt {
          font-weight: 500; text-transform: none;
          letter-spacing: 0; color: #5A7080; font-size: 11px;
        }
        .fl-input {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid #D6DCE4; border-radius: 10px;
          font-family: 'Inter', sans-serif; font-size: 13px;
          color: #022B3A; background: #F8FAFC; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box; appearance: none;
        }
        .fl-input:focus {
          border-color: #1F7A8C;
          box-shadow: 0 0 0 3px rgba(31,122,140,0.12);
          background: #fff;
        }
        .fl-input::placeholder { color: #94A3B0; }
        textarea.fl-input { resize: vertical; }

        .fl-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .fl-input-group { display: flex; gap: 8px; }
        .fl-input-group .fl-input { flex: 1; }

        .btn-gps {
          padding: 0 16px; background: #022B3A; color: #BFDBF7;
          border: none; border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700;
          cursor: pointer; white-space: nowrap; transition: background 0.15s; flex-shrink: 0;
        }
        .btn-gps:hover { background: #1F7A8C; }

        /* ── FOTO ── */
        .foto-perlindungan-banner {
          background: rgba(31,122,140,0.07);
          border: 1px solid rgba(31,122,140,0.2);
          border-radius: 10px; padding: 12px 16px;
          display: flex; gap: 12px; align-items: flex-start;
        }
        .foto-perlindungan-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; font-weight: 700; color: #1F7A8C; margin-bottom: 3px;
        }
        .foto-perlindungan-desc {
          font-size: 11px; color: #5A7080; line-height: 1.6;
        }
        .foto-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
        }
        .foto-item {
          position: relative; aspect-ratio: 4/3; border-radius: 10px;
          overflow: hidden; border: 1.5px solid #D6DCE4; cursor: pointer;
        }
        .foto-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .foto-badge-sensor {
          position: absolute; top: 6px; left: 6px;
          background: rgba(31,122,140,0.92);
          border-radius: 20px; padding: 2px 8px;
          font-size: 9px; font-weight: 800;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .foto-hapus {
          position: absolute; top: 6px; right: 6px;
          width: 24px; height: 24px; border-radius: 50%;
          background: rgba(2,43,58,0.75); border: none; color: #fff;
          cursor: pointer; font-size: 11px;
          display: flex; align-items: center; justify-content: center;
        }
        .foto-caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: rgba(2,43,58,0.55);
          font-size: 10px; text-align: center; padding: 3px 0;
          color: rgba(191,219,247,0.85);
        }
        .btn-tambah-foto {
          width: 100%; padding: 16px 20px; border-radius: 12px;
          border: 2px dashed #BFDBF7; background: transparent;
          color: #5A7080; cursor: pointer; font-size: 13px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.2s;
        }
        .btn-tambah-foto:hover {
          border-color: #1F7A8C; color: #1F7A8C;
          background: rgba(31,122,140,0.04);
        }
        .btn-tambah-foto-sub {
          font-size: 11px; font-weight: 400; color: #94A3B0; margin-top: 1px;
        }
        .foto-max-msg {
          text-align: center; font-size: 12px; color: #5A7080; padding: 10px 0;
        }

        /* ── ANONIM ── */
        .anonim-label {
          display: flex; align-items: center; gap: 10px; cursor: pointer;
          font-size: 13px; color: #022B3A; padding: 10px 14px;
          border-radius: 10px; border: 1.5px solid #D6DCE4; background: #F8FAFC;
          transition: border-color 0.15s;
        }
        .anonim-label:hover { border-color: #1F7A8C; }
        .anonim-label input { accent-color: #1F7A8C; width: 16px; height: 16px; }

        /* ── SUBMIT ── */
        .btn-submit {
          width: 100%; padding: 16px; background: #022B3A; color: #FFFFFF;
          border: none; border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700;
          cursor: pointer; transition: background 0.2s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-submit:hover:not(:disabled) { background: #1F7A8C; transform: translateY(-1px); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .submit-note {
          font-size: 11px; color: #5A7080; text-align: center;
          margin-top: 12px; line-height: 1.6;
        }

        /* ── SUKSES ── */
        .sukses-wrapper { max-width: 540px; margin: 0 auto; padding: 60px 24px; }
        .sukses-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 28px; font-weight: 800; color: #022B3A;
          text-align: center; margin-bottom: 10px;
        }
        .sukses-title span { color: #1F7A8C; }
        .sukses-desc {
          font-size: 14px; color: #5A7080;
          text-align: center; line-height: 1.7; margin-bottom: 28px;
        }
        .sukses-card {
          background: #FFFFFF; border-radius: 16px;
          border: 1px solid #D6DCE4; overflow: hidden; margin-bottom: 24px;
        }
        .sukses-card-header {
          background: #022B3A; padding: 14px 20px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700;
          color: rgba(191,219,247,0.8); text-transform: uppercase; letter-spacing: 0.08em;
        }
        .sukses-card-body { padding: 16px 20px; }
        .sukses-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 8px 0; border-bottom: 1px solid #E1E5F2; font-size: 13px;
        }
        .sukses-row:last-child { border-bottom: none; }
        .sukses-row-key { color: #5A7080; }
        .sukses-row-val {
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; color: #022B3A;
        }
        .sukses-foto-grid {
          display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;
        }
        .sukses-foto-thumb {
          position: relative; width: 64px; height: 64px;
          border-radius: 8px; overflow: hidden; border: 1.5px solid #D6DCE4;
        }
        .sukses-foto-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .sukses-foto-badge {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: rgba(2,43,58,0.7); font-size: 8px; text-align: center;
          padding: 2px 0; color: #BFDBF7; font-weight: 600;
        }
        .sukses-actions { display: flex; gap: 12px; }
        .btn-sukses-secondary {
          flex: 1; padding: 14px;
          border: 2px solid #022B3A; border-radius: 12px; background: transparent;
          color: #022B3A; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s;
        }
        .btn-sukses-secondary:hover { background: #022B3A; color: #fff; }
        .btn-sukses-primary {
          flex: 1; padding: 14px; background: #1F7A8C; border: none;
          border-radius: 12px; color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: background 0.2s;
        }
        .btn-sukses-primary:hover { background: #176878; }

        /* ── PREVIEW MODAL ── */
        .preview-overlay {
          position: fixed; inset: 0; z-index: 9998;
          background: rgba(2,43,58,0.95);
          display: flex; align-items: center; justify-content: center; padding: 16px;
        }
        .preview-modal { position: relative; max-width: 700px; width: 100%; }
        .preview-modal img { width: 100%; border-radius: 16px; display: block; }
        .preview-badge {
          position: absolute; top: 12px; left: 12px;
          background: rgba(31,122,140,0.9); border-radius: 20px;
          padding: 6px 14px; font-size: 11px;
          display: flex; align-items: center; gap: 6px;
          color: #fff; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .preview-close {
          position: absolute; top: 12px; right: 12px;
          background: rgba(2,43,58,0.8); border: none; color: #fff;
          border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 16px;
        }

        /* ── Responsif ── */
        @media (max-width: 768px) {
          .laporan-header { padding: 40px 24px 32px; }
          .laporan-body { padding: 24px 16px 60px; }
          .fl-row { grid-template-columns: 1fr; }
          .foto-grid { grid-template-columns: repeat(2, 1fr); }
          .sukses-actions { flex-direction: column; }
          .sukses-wrapper { padding: 40px 16px; }
        }
      `}</style>

      <div className="laporan-root">

        {showCamera && (
          <CameraCapture
            onPhotoTaken={handlePhotoTaken}
            onClose={() => setShowCamera(false)}
          />
        )}

        {previewPhoto && (
          <div className="preview-overlay" onClick={() => setPreviewPhoto(null)}>
            <div className="preview-modal" onClick={e => e.stopPropagation()}>
              <img src={previewPhoto.blurred} alt="preview" />
              <div className="preview-badge">Identitas disensor otomatis</div>
              <button className="preview-close" onClick={() => setPreviewPhoto(null)}>x</button>
            </div>
          </div>
        )}

        {/* PAGE HEADER */}
        <div className="laporan-header">
          <div className="laporan-header-inner">
            <div className="laporan-breadcrumb">
              <button onClick={() => navigate('/public')}>Beranda</button>
              <span>›</span>
              <span>Buat Laporan</span>
            </div>
            <div className="laporan-badge">Formulir Pelaporan Resmi DP3A</div>
            <div className="page-title-row">
            <img
              src={`${import.meta.env.BASE_URL}logowhite.png`}
              alt="Logo Delcion"
              className="page-title-logo"
            />

            <h1 className="laporan-page-title">
              Buat <span>Laporan</span>
            </h1>
          </div>
            <p className="laporan-page-sub">
              Isi formulir di bawah untuk melaporkan temuan pekerja anak. Identitas Anda sepenuhnya terlindungi.
            </p>
          </div>
        </div>

        <div className="laporan-body">

          {step === 2 ? (
            /* ── SUKSES ── */
            <div className="sukses-wrapper">
              <CheckmarkCanvas />
              <h2 className="sukses-title">Laporan <span>Terkirim!</span></h2>
              <p className="sukses-desc">
                Terima kasih telah melapor. Tim DP3A akan segera menindaklanjuti laporan Anda.
                Anda dapat memantau status laporan di menu Riwayat.
              </p>
              <div className="sukses-card">
                <div className="sukses-card-header">Ringkasan Laporan</div>
                <div className="sukses-card-body">
                  {[
                    ['disaMarkan', `#${laporanId}`],
                    ['Lokasi', form.lokasi],
                    ['Jenis Aktivitas', form.jenis],
                    ['Jumlah Anak', `${form.jumlah} orang`],
                    ['Foto Bukti', `${photos.length} foto`],
                    ['Status', 'Menunggu Proses'],
                  ].map(([k,v]) => (
                    <div key={k} className="sukses-row">
                      <span className="sukses-row-key">{k}</span>
                      <span className="sukses-row-val">{v}</span>
                    </div>
                  ))}
                  {photos.length > 0 && (
                    <div className="sukses-foto-grid">
                      {photos.map(p => (
                        <div key={p.id} className="sukses-foto-thumb">
                          <img src={p.blurred} alt="bukti" />
                          <div className="sukses-foto-badge">SENSOR</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="sukses-actions">
                <button className="btn-sukses-secondary" onClick={resetForm}>Laporan Lain</button>
                <button className="btn-sukses-primary" onClick={() => navigate('/public/riwayat')}>Lihat Riwayat</button>
              </div>
            </div>

          ) : (
            /* ── FORM ── */
            <>
              <div
                className={`darurat-toggle ${form.darurat ? 'aktif' : ''}`}
                onClick={() => set('darurat', !form.darurat)}
              >
                <div>
                  <div className="darurat-label">Situasi Darurat / Mendesak</div>
                  <div className="darurat-sublabel">Aktifkan jika anak dalam bahaya langsung</div>
                </div>
                <div className={`toggle-pill ${form.darurat ? 'aktif' : ''}`}>
                  <div className="toggle-knob" />
                </div>
              </div>

              {/* Card Lokasi */}
              <div className="form-card">
                <div className="form-card-header">
                  <div className="form-card-header-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BFDBF7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <div className="form-card-title">Lokasi Kejadian</div>
                    <div className="form-card-subtitle">Di mana Anda menemukan pekerja anak?</div>
                  </div>
                </div>
                <div className="form-card-body">
                  <div>
                    <label className="fl-label">Lokasi *</label>
                    <select className="fl-input" value={form.lokasi} onChange={e => set('lokasi', e.target.value)}>
                      <option value="">— Pilih lokasi —</option>
                      {LOKASI_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="fl-label">Alamat / Keterangan Lokasi <span className="opt">(opsional)</span></label>
                    <div className="fl-input-group">
                      <input
                        className="fl-input"
                        placeholder="cth: Depan pintu masuk utama, dekat ATM..."
                        value={form.subLokasi}
                        onChange={e => set('subLokasi', e.target.value)}
                      />
                      <button className="btn-gps" onClick={getGPS}>
                        {gpsLoading ? 'Memuat...' : 'GPS'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Detail */}
              <div className="form-card">
                <div className="form-card-header">
                  <div className="form-card-header-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BFDBF7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <div>
                    <div className="form-card-title">Detail Kejadian</div>
                    <div className="form-card-subtitle">Apa yang Anda lihat di lokasi?</div>
                  </div>
                </div>
                <div className="form-card-body">
                  <div className="fl-row">
                    <div>
                      <label className="fl-label">Jenis Aktivitas</label>
                      <select className="fl-input" value={form.jenis} onChange={e => set('jenis', e.target.value)}>
                        <option>Berjualan</option>
                        <option>Mengamen</option>
                        <option>Mengemis</option>
                        <option>Figuran / Kostum</option>
                        <option>Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label className="fl-label">Perkiraan Jumlah Anak</label>
                      <input
                        className="fl-input" type="number" min={1} max={20}
                        value={form.jumlah} onChange={e => set('jumlah', +e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="fl-label">Deskripsi Singkat <span className="opt">(opsional)</span></label>
                    <textarea
                      className="fl-input" rows={3}
                      placeholder="Ceritakan apa yang Anda lihat, ciri-ciri anak, situasi sekitar..."
                      value={form.deskripsi} onChange={e => set('deskripsi', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Card Foto */}
              <div className="form-card">
                <div className="form-card-header">
                  <div className="form-card-header-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BFDBF7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <div className="form-card-title">Foto Bukti</div>
                    <div className="form-card-subtitle">Opsional · maks. 3 foto · wajah disensor otomatis</div>
                  </div>
                </div>
                <div className="form-card-body">
                  <div className="foto-perlindungan-banner">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F7A8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0, marginTop:1}}>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <div>
                      <div className="foto-perlindungan-title">Perlindungan Identitas Anak</div>
                      <div className="foto-perlindungan-desc">
                        Sistem akan mendeteksi dan menyamarkan wajah secara otomatis sesuai UU Perlindungan Anak.
                        Anda tidak perlu menandai area secara manual.
                      </div>
                    </div>
                  </div>

                  {photos.length > 0 && (
                    <div className="foto-grid">
                      {photos.map((photo, idx) => (
                        <div key={photo.id} className="foto-item" onClick={() => setPreviewPhoto(photo)}>
                          <img src={photo.blurred} alt={`Foto ${idx+1}`} />
                          <div className="foto-badge-sensor">DISENSOR OTOMATIS</div>
                          <button
                            className="foto-hapus"
                            onClick={e => { e.stopPropagation(); removePhoto(photo.id) }}
                          >x</button>
                          <div className="foto-caption">Foto {idx+1} · klik untuk besar</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {photos.length < 3 ? (
                    <button className="btn-tambah-foto" type="button" onClick={() => setShowCamera(true)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                      </svg>
                      <div>
                        <div>{photos.length === 0 ? 'Ambil Foto Bukti' : `Tambah Foto (${photos.length}/3)`}</div>
                        <div className="btn-tambah-foto-sub">Wajah anak akan disamarkan otomatis setelah foto diambil</div>
                      </div>
                    </button>
                  ) : (
                    <div className="foto-max-msg">Sudah mencapai batas maksimum 3 foto</div>
                  )}
                </div>
              </div>

              {/* Card Identitas */}
              <div className="form-card">
                <div className="form-card-header">
                  <div className="form-card-header-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BFDBF7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <div className="form-card-title">Identitas Pelapor</div>
                    <div className="form-card-subtitle">Opsional · bisa dikirim anonim</div>
                  </div>
                </div>
                <div className="form-card-body">
                  <div>
                    <label className="fl-label">Nama Pelapor <span className="opt">(opsional)</span></label>
                    <input
                      className="fl-input" placeholder="Nama Anda"
                      disabled={form.anonymous} value={form.pelapor}
                      onChange={e => set('pelapor', e.target.value)}
                      style={{ opacity: form.anonymous ? 0.5 : 1 }}
                    />
                  </div>
                  <label className="anonim-label">
                    <input
                      type="checkbox" checked={form.anonymous}
                      onChange={e => set('anonymous', e.target.checked)}
                    />
                    Laporkan secara anonim — nama tidak akan ditampilkan
                  </label>
                </div>
              </div>

              <button className="btn-submit" onClick={submit} disabled={loading}>
                {loading ? 'Mengirim laporan...' : 'Kirim Laporan'}
              </button>
              <p className="submit-note">
                Data laporan Anda dijaga kerahasiaannya dan hanya digunakan untuk keperluan perlindungan anak.
              </p>
            </>
          )}
        </div>
        
        <FooterPublic />
        
      </div>
    </>
  )
}