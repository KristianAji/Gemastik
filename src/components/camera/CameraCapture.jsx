import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * CameraCapture.jsx
 * Komponen kamera dengan fitur blur manual pada area wajah.
 * 
 * Props:
 *  - onPhotoTaken(dataUrl, blurredDataUrl) → callback saat foto siap
 *  - onClose() → callback saat user menutup kamera
 */
export default function CameraCapture({ onPhotoTaken, onClose }) {
  const videoRef      = useRef(null)
  const canvasRef     = useRef(null)
  const overlayRef    = useRef(null)
  const streamRef     = useRef(null)

  const [phase, setPhase]         = useState('camera')   // 'camera' | 'preview' | 'blur'
  const [rawPhoto, setRawPhoto]   = useState(null)        // dataUrl foto asli
  const [blurZones, setBlurZones] = useState([])          // array {x,y,w,h} dalam persen
  const [drawing, setDrawing]     = useState(false)
  const [startPos, setStartPos]   = useState({ x: 0, y: 0 })
  const [currentRect, setCurrentRect] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [facingMode, setFacingMode]   = useState('environment') // 'environment'=belakang, 'user'=depan
  const [blurIntensity, setBlurIntensity] = useState(18)

  /* ─── Mulai kamera ─── */
  const startCamera = useCallback(async (mode) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraError(null)
    } catch (err) {
      setCameraError('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.')
    }
  }, [])

  useEffect(() => {
    startCamera(facingMode)
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    }
  }, [facingMode, startCamera])

  /* ─── Ganti kamera depan/belakang ─── */
  const flipCamera = () => {
    setFacingMode(f => f === 'environment' ? 'user' : 'environment')
  }

  /* ─── Ambil foto dari video ─── */
  const capturePhoto = () => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width  = video.videoWidth  || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setRawPhoto(dataUrl)
    setBlurZones([])
    setCurrentRect(null)

    // Hentikan kamera sementara
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    setPhase('preview')
  }

  /* ─── Ulang foto ─── */
  const retakePhoto = () => {
    setRawPhoto(null)
    setBlurZones([])
    setCurrentRect(null)
    setPhase('camera')
    startCamera(facingMode)
  }

  /* ─── Koordinat relatif overlay ─── */
  const getRelPos = (e, el) => {
    const rect = el.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: ((clientX - rect.left) / rect.width)  * 100,
      y: ((clientY - rect.top)  / rect.height) * 100,
    }
  }

  const onPointerDown = (e) => {
    e.preventDefault()
    const pos = getRelPos(e, overlayRef.current)
    setStartPos(pos)
    setCurrentRect({ x: pos.x, y: pos.y, w: 0, h: 0 })
    setDrawing(true)
  }

  const onPointerMove = (e) => {
    if (!drawing) return
    e.preventDefault()
    const pos = getRelPos(e, overlayRef.current)
    setCurrentRect({
      x: Math.min(startPos.x, pos.x),
      y: Math.min(startPos.y, pos.y),
      w: Math.abs(pos.x - startPos.x),
      h: Math.abs(pos.y - startPos.y),
    })
  }

  const onPointerUp = (e) => {
    if (!drawing) return
    e.preventDefault()
    if (currentRect && currentRect.w > 2 && currentRect.h > 2) {
      setBlurZones(z => [...z, { ...currentRect, id: Date.now() }])
    }
    setCurrentRect(null)
    setDrawing(false)
  }

  const removeZone = (id) => setBlurZones(z => z.filter(b => b.id !== id))

  /* ─── Render blur ke canvas dan export ─── */
  const applyBlurAndExport = useCallback(() => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width  = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')

        // Gambar foto asli
        ctx.drawImage(img, 0, 0)

        // Terapkan blur per zona
        blurZones.forEach(zone => {
          const px = (zone.x / 100) * img.naturalWidth
          const py = (zone.y / 100) * img.naturalHeight
          const pw = (zone.w / 100) * img.naturalWidth
          const ph = (zone.h / 100) * img.naturalHeight

          // Potong area, blur, tempel kembali
          const offscreen = document.createElement('canvas')
          offscreen.width  = pw
          offscreen.height = ph
          const octx = offscreen.getContext('2d')
          octx.filter = `blur(${blurIntensity}px)`
          octx.drawImage(img, px, py, pw, ph, 0, 0, pw, ph)

          ctx.drawImage(offscreen, px, py, pw, ph)

          // Overlay tanda sensor hitam transparan
          ctx.fillStyle = 'rgba(0,0,0,0.15)'
          ctx.fillRect(px, py, pw, ph)
        })

        resolve(canvas.toDataURL('image/jpeg', 0.92))
      }
      img.src = rawPhoto
    })
  }, [rawPhoto, blurZones, blurIntensity])

  const handleSelesai = async () => {
    const blurredUrl = await applyBlurAndExport()
    onPhotoTaken(rawPhoto, blurredUrl, blurZones)
  }

  /* ═══════════════════════════════════════════
     RENDER: FASE KAMERA
  ═══════════════════════════════════════════ */
  if (phase === 'camera') return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
          <span style={styles.headerTitle}>📷 Ambil Foto</span>
          <button style={styles.flipBtn} onClick={flipCamera} title="Ganti kamera">🔄</button>
        </div>

        {cameraError ? (
          <div style={styles.errorBox}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📵</div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Akses Kamera Ditolak</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{cameraError}</div>
          </div>
        ) : (
          <>
            <div style={styles.videoWrap}>
              <video ref={videoRef} autoPlay playsInline muted style={styles.video} />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              {/* Panduan frame */}
              <div style={styles.guideFrame} />
              <div style={styles.guideLabel}>Arahkan kamera ke lokasi kejadian</div>
            </div>

            <div style={styles.cameraFooter}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 14 }}>
                💡 Identitas anak akan disamarkan sebelum dikirim
              </div>
              <button style={styles.captureBtn} onClick={capturePhoto}>
                <div style={styles.captureInner} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )

  /* ═══════════════════════════════════════════
     RENDER: FASE PREVIEW + BLUR MANUAL
  ═══════════════════════════════════════════ */
  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.modal, maxWidth: 640 }}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.closeBtn} onClick={retakePhoto}>← Ulang</button>
          <span style={styles.headerTitle}>✏️ Tandai Area Wajah</span>
          <button style={{ ...styles.closeBtn, background: 'var(--accent)', color: '#fff', borderRadius: 8, padding: '4px 12px', fontSize: 12 }}
            onClick={handleSelesai}>
            ✓ Selesai
          </button>
        </div>

        {/* Instruksi */}
        <div style={styles.instruction}>
          <span style={{ fontSize: 16 }}>👆</span>
          <span>Seret untuk menandai area wajah anak yang perlu disamarkan</span>
        </div>

        {/* Canvas area gambar + overlay blur */}
        <div style={styles.previewWrap}>
          <img src={rawPhoto} alt="preview" style={styles.previewImg} draggable={false} />

          {/* Zona blur yang sudah dibuat */}
          {blurZones.map(zone => (
            <div key={zone.id} style={{
              position: 'absolute',
              left: `${zone.x}%`, top: `${zone.y}%`,
              width: `${zone.w}%`, height: `${zone.h}%`,
              backdropFilter: `blur(${blurIntensity}px)`,
              WebkitBackdropFilter: `blur(${blurIntensity}px)`,
              background: 'rgba(0,0,0,0.2)',
              border: '2px dashed rgba(232,64,28,0.8)',
              boxSizing: 'border-box',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
              cursor: 'pointer',
            }}>
              <button onClick={() => removeZone(zone.id)} style={styles.removeZoneBtn} title="Hapus area ini">✕</button>
              <div style={styles.blurBadge}>DISENSOR</div>
            </div>
          ))}

          {/* Rect yang sedang digambar */}
          {currentRect && currentRect.w > 1 && (
            <div style={{
              position: 'absolute',
              left: `${currentRect.x}%`, top: `${currentRect.y}%`,
              width: `${currentRect.w}%`, height: `${currentRect.h}%`,
              border: '2px dashed #fff',
              background: 'rgba(255,255,255,0.1)',
              boxSizing: 'border-box',
              pointerEvents: 'none',
            }} />
          )}

          {/* Overlay interaktif untuk menggambar */}
          <div
            ref={overlayRef}
            style={styles.drawOverlay}
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={onPointerUp}
          />
        </div>

        {/* Kontrol blur intensity */}
        <div style={styles.blurControl}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Intensitas Blur</span>
          <input type="range" min={8} max={30} value={blurIntensity}
            onChange={e => setBlurIntensity(+e.target.value)}
            style={{ flex: 1, accentColor: 'var(--accent)' }} />
          <span style={{ fontSize: 12, fontWeight: 700, minWidth: 30 }}>{blurIntensity}px</span>
        </div>

        {/* Info zona */}
        <div style={styles.zoneInfo}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Area disensor: </span>
            <span style={{ fontWeight: 700, color: blurZones.length > 0 ? 'var(--accent)' : 'var(--text-muted)', fontSize: 12 }}>
              {blurZones.length} area
            </span>
          </div>
          {blurZones.length > 0 && (
            <button onClick={() => setBlurZones([])} style={{ fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Hapus semua
            </button>
          )}
        </div>

        {/* Footer aksi */}
        <div style={styles.previewFooter}>
          <button style={styles.btnGhost} onClick={retakePhoto}>📷 Foto Ulang</button>
          <button style={styles.btnPrimary} onClick={handleSelesai}>
            {blurZones.length === 0 ? '⚠️ Kirim Tanpa Blur' : `✓ Gunakan Foto (${blurZones.length} disensor)`}
          </button>
        </div>

        {blurZones.length === 0 && (
          <div style={styles.warningBox}>
            ⚠️ Belum ada area yang disamarkan. Pastikan wajah anak sudah ditandai untuk melindungi identitasnya.
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Styles ─── */
const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 16,
  },
  modal: {
    background: 'var(--surface, #1a1a2e)',
    border: '1px solid var(--border, rgba(255,255,255,0.1))',
    borderRadius: 20,
    width: '100%', maxWidth: 560,
    overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    maxHeight: '95vh',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 18px',
    borderBottom: '1px solid var(--border, rgba(255,255,255,0.08))',
    background: 'rgba(0,0,0,0.2)',
    flexShrink: 0,
  },
  headerTitle: {
    fontWeight: 700, fontSize: 14,
  },
  closeBtn: {
    background: 'none', border: 'none', color: 'var(--text-muted, #888)',
    cursor: 'pointer', fontSize: 13, padding: '4px 8px',
  },
  flipBtn: {
    background: 'none', border: 'none', color: 'var(--text-muted, #888)',
    cursor: 'pointer', fontSize: 18, padding: '4px 8px',
  },
  videoWrap: {
    position: 'relative', width: '100%', aspectRatio: '16/9',
    background: '#000', overflow: 'hidden', flexShrink: 0,
  },
  video: {
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
  },
  guideFrame: {
    position: 'absolute', inset: '15%',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: 12, pointerEvents: 'none',
  },
  guideLabel: {
    position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
    fontSize: 11, color: 'rgba(255,255,255,0.6)',
    background: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: '4px 12px',
    whiteSpace: 'nowrap',
  },
  cameraFooter: {
    padding: '16px 20px 24px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: 'rgba(0,0,0,0.3)',
    flexShrink: 0,
  },
  captureBtn: {
    width: 68, height: 68, borderRadius: '50%',
    border: '4px solid rgba(255,255,255,0.8)',
    background: 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'transform 0.1s',
    padding: 0,
  },
  captureInner: {
    width: 52, height: 52, borderRadius: '50%',
    background: '#fff',
  },
  errorBox: {
    padding: 40, textAlign: 'center', flex: 1,
  },
  instruction: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 16px',
    background: 'rgba(232,64,28,0.08)',
    borderBottom: '1px solid rgba(232,64,28,0.15)',
    fontSize: 12, color: 'var(--text-muted, #888)',
    flexShrink: 0,
  },
  previewWrap: {
    position: 'relative', width: '100%', aspectRatio: '16/9',
    overflow: 'hidden', background: '#000', flexShrink: 0, cursor: 'crosshair',
  },
  previewImg: {
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
    userSelect: 'none', pointerEvents: 'none',
  },
  drawOverlay: {
    position: 'absolute', inset: 0, zIndex: 10,
  },
  removeZoneBtn: {
    position: 'absolute', top: 4, right: 4,
    background: 'rgba(232,64,28,0.9)', border: 'none', color: '#fff',
    borderRadius: '50%', width: 20, height: 20, fontSize: 10,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 11, flexShrink: 0,
  },
  blurBadge: {
    position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
    fontSize: 8, fontWeight: 800, letterSpacing: 1, color: 'rgba(255,255,255,0.6)',
    background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: 4,
    whiteSpace: 'nowrap',
  },
  blurControl: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 16px',
    borderBottom: '1px solid var(--border, rgba(255,255,255,0.08))',
    flexShrink: 0,
  },
  zoneInfo: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 16px',
    flexShrink: 0,
  },
  previewFooter: {
    display: 'flex', gap: 10, padding: '12px 16px',
    borderTop: '1px solid var(--border, rgba(255,255,255,0.08))',
    flexShrink: 0,
  },
  btnGhost: {
    flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600,
    background: 'transparent', border: '1px solid var(--border, rgba(255,255,255,0.15))',
    color: 'var(--text, #fff)', cursor: 'pointer',
  },
  btnPrimary: {
    flex: 2, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700,
    background: 'var(--accent, #E8401C)', border: 'none',
    color: '#fff', cursor: 'pointer',
  },
  warningBox: {
    margin: '0 16px 12px',
    padding: '10px 14px',
    background: 'rgba(245,158,11,0.1)',
    border: '1px solid rgba(245,158,11,0.3)',
    borderRadius: 10, fontSize: 11,
    color: '#f59e0b', lineHeight: 1.6,
    flexShrink: 0,
  },
}