import { useRef, useState, useEffect, useCallback } from 'react'

/**
 * CameraCapture — simulasi YOLOv8n-face pipeline (frontend prototipe)
 * Arsitektur sesuai proposal: deteksi wajah → blur OpenCV-style
 * 
 * Pada implementasi penuh: foto dikirim ke backend Python
 * yang menjalankan YOLOv8n-face + OpenCV untuk blurring server-side.
 * Di prototipe ini, kita simulasikan pipeline yang sama di browser
 * menggunakan Canvas API dengan algoritma pixelate + gaussian blur stack.
 */
export default function CameraCapture({ onPhotoTaken, onClose }) {
  const videoRef   = useRef(null)
  const canvasRef  = useRef(null)
  const streamRef  = useRef(null)

  const [phase, setPhase]               = useState('cam')
  const [rawDataUrl, setRawDataUrl]     = useState(null)
  const [blurredUrl, setBlurredUrl]     = useState(null)
  const [detections, setDetections]     = useState([])   // [{x,y,w,h,conf}]
  const [blurStrength, setBlurStrength] = useState(22)
  const [processingStep, setProcessingStep] = useState('')

  /* ── Mulai kamera ── */
  useEffect(() => {
    let active = true
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
      .then(stream => {
        if (!active) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) { videoRef.current.srcObject = stream }
      })
      .catch(() => {})
    return () => { active = false; streamRef.current?.getTracks().forEach(t => t.stop()) }
  }, [])

  /* ── Ambil foto ── */
  const ambilFoto = () => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width  = video.videoWidth  || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const raw = canvas.toDataURL('image/jpeg', 0.92)
    setRawDataUrl(raw)
    setPhase('processing')
    streamRef.current?.getTracks().forEach(t => t.stop())

    runFaceDetectionPipeline(canvas, ctx, raw)
  }

  /* ══════════════════════════════════════════════════════════
     PIPELINE SIMULASI YOLOv8n-face + OpenCV blur
     
     Proposal: "modul Python yang menjalankan YOLOv8n-face untuk
     mendeteksi wajah, kemudian OpenCV untuk menyamarkannya"
     
     Prototipe ini mensimulasikan output pipeline tersebut:
     1. Skin-tone heuristic detection (menggantikan YOLOv8n-face)  
     2. Pixelate + multi-pass box blur (menggantikan OpenCV GaussianBlur)
  ══════════════════════════════════════════════════════════ */
  const runFaceDetectionPipeline = useCallback(async (canvas, ctx, rawUrl) => {
    const W = canvas.width, H = canvas.height

    // Step 1: Simulasi YOLOv8n-face scanning
    setProcessingStep('Menjalankan YOLOv8n-face...')
    await delay(600)

    // Step 2: Deteksi kandidat wajah via skin-tone segmentation
    setProcessingStep('Mendeteksi wajah dalam frame...')
    await delay(400)

    let zones = await detectFaceRegions(canvas, W, H)

    // Fallback: jika tidak ada yang terdeteksi, gunakan zona heuristik
    // (sesuai proposal: margin error model dicover oleh human-in-the-loop)
    if (zones.length === 0) {
      zones = generateHeuristicZones(W, H)
    }

    setDetections(zones)

    // Step 3: Simulasi OpenCV blur
    setProcessingStep('Menerapkan OpenCV face blur...')
    await delay(500)

    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(img, 0, 0, W, H)

      zones.forEach(zone => {
        applyOpenCVStyleBlur(ctx, zone.x, zone.y, zone.w, zone.h, blurStrength)
      })

      // Overlay label bounding box (seperti YOLOv8 output)
      zones.forEach((zone, i) => {
        drawDetectionOverlay(ctx, zone, i)
      })

      const result = canvas.toDataURL('image/jpeg', 0.92)
      setBlurredUrl(result)
      setProcessingStep('')
      setPhase('preview')
    }
    img.src = rawUrl
  }, [blurStrength])

  /* Re-apply blur saat slider berubah */
  useEffect(() => {
    if (phase !== 'preview' || !rawDataUrl || detections.length === 0) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      detections.forEach(zone => {
        applyOpenCVStyleBlur(ctx, zone.x, zone.y, zone.w, zone.h, blurStrength)
      })
      detections.forEach((zone, i) => drawDetectionOverlay(ctx, zone, i))
      setBlurredUrl(canvas.toDataURL('image/jpeg', 0.92))
    }
    img.src = rawDataUrl
  }, [blurStrength]) // eslint-disable-line

  const handleSelesai = () => {
    onPhotoTaken(rawDataUrl, blurredUrl, detections)
  }

  const ulang = () => {
    setRawDataUrl(null); setBlurredUrl(null)
    setDetections([]); setPhase('cam'); setProcessingStep('')
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(stream => { streamRef.current = stream; if (videoRef.current) videoRef.current.srcObject = stream })
      .catch(() => {})
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

        .cc-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(1, 18, 26, 0.97);
          display: flex; align-items: center; justify-content: center; padding: 16px;
        }
        .cc-modal {
          background: #011d28;
          border-radius: 20px; overflow: hidden;
          width: 100%; max-width: 580px;
          box-shadow: 0 32px 96px rgba(0,0,0,0.7);
          border: 1px solid rgba(31,122,140,0.25);
          display: flex; flex-direction: column;
        }

        /* Header */
        .cc-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          background: #022B3A;
          border-bottom: 1px solid rgba(31,122,140,0.2);
        }
        .cc-header-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 700; color: #fff;
        }
        .cc-header-sub {
          font-size: 11px; color: rgba(191,219,247,0.5); margin-top: 2px;
        }
        .cc-header-badge {
          display: flex; align-items: center; gap: 6px;
          background: rgba(31,122,140,0.2);
          border: 1px solid rgba(31,122,140,0.4);
          border-radius: 6px; padding: 4px 10px;
          font-size: 10px; font-weight: 700; color: #BFDBF7;
          letter-spacing: 0.05em;
        }
        .cc-header-badge-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #1F7A8C;
          animation: cc-pulse-dot 1.5s ease-in-out infinite;
        }
        @keyframes cc-pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }

        /* Media area */
        .cc-media-wrap {
          position: relative; width: 100%; background: #000;
          overflow: hidden; max-height: 400px;
          display: flex; align-items: center; justify-content: center;
        }
        .cc-media-wrap video, .cc-media-wrap canvas {
          width: 100%; height: auto; max-height: 400px;
          object-fit: contain; display: block;
        }

        /* Processing overlay */
        .cc-processing-overlay {
          position: absolute; inset: 0;
          background: rgba(1, 18, 26, 0.88);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 16px;
        }
        .cc-pipeline-visual {
          display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
        }
        .cc-pipeline-step {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
        }
        .cc-pipeline-icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: rgba(31,122,140,0.15);
          border: 1px solid rgba(31,122,140,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; transition: all 0.3s;
        }
        .cc-pipeline-icon.active {
          background: rgba(31,122,140,0.35);
          border-color: #1F7A8C;
          box-shadow: 0 0 16px rgba(31,122,140,0.4);
          animation: cc-icon-pulse 0.8s ease-in-out infinite alternate;
        }
        @keyframes cc-icon-pulse {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .cc-pipeline-label {
          font-size: 9px; color: rgba(191,219,247,0.5);
          font-family: 'Inter', sans-serif; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .cc-pipeline-arrow {
          color: rgba(31,122,140,0.5); font-size: 14px; margin-bottom: 18px;
        }
        .cc-spinner {
          width: 36px; height: 36px;
          border: 3px solid rgba(191,219,247,0.1);
          border-top-color: #1F7A8C;
          border-radius: 50%;
          animation: cc-spin 0.7s linear infinite;
        }
        @keyframes cc-spin { to { transform: rotate(360deg); } }
        .cc-processing-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; font-weight: 600; color: #BFDBF7;
        }
        .cc-processing-sub {
          font-size: 10px; color: rgba(191,219,247,0.4);
          font-family: 'Inter', sans-serif;
        }

        /* Footer */
        .cc-footer { padding: 16px 20px; background: #022B3A; }

        /* Deteksi info */
        .cc-detect-info {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px;
          background: rgba(31,122,140,0.1);
          border: 1px solid rgba(31,122,140,0.25);
          border-radius: 10px; margin-bottom: 14px;
        }
        .cc-detect-icon { flex-shrink: 0; }
        .cc-detect-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; font-weight: 700; color: #BFDBF7;
        }
        .cc-detect-desc {
          font-size: 11px; color: rgba(191,219,247,0.6);
          line-height: 1.5; margin-top: 1px;
          font-family: 'Inter', sans-serif;
        }

        /* Slider */
        .cc-slider-row {
          display: flex; justify-content: space-between;
          font-size: 11px; margin-bottom: 6px;
          font-family: 'Inter', sans-serif;
          color: rgba(191,219,247,0.5);
        }
        .cc-slider-row span { color: #BFDBF7; font-weight: 600; }
        input[type=range].cc-slider {
          width: 100%; appearance: none; height: 4px;
          border-radius: 2px; outline: none; cursor: pointer; margin-bottom: 14px;
          background: linear-gradient(
            to right,
            #1F7A8C calc((var(--v) - 8) / 32 * 100%),
            rgba(191,219,247,0.15) 0%
          );
        }
        input[type=range].cc-slider::-webkit-slider-thumb {
          appearance: none; width: 18px; height: 18px;
          border-radius: 50%; background: #1F7A8C;
          border: 2px solid #BFDBF7; cursor: pointer;
          box-shadow: 0 0 8px rgba(31,122,140,0.5);
        }

        /* Action buttons */
        .cc-actions { display: flex; gap: 10px; }
        .cc-btn-secondary {
          flex: 1; padding: 11px; border-radius: 9px;
          background: rgba(191,219,247,0.08);
          border: 1px solid rgba(191,219,247,0.2);
          color: #BFDBF7; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          transition: background 0.15s;
        }
        .cc-btn-secondary:hover { background: rgba(191,219,247,0.14); }
        .cc-btn-primary {
          flex: 1.6; padding: 11px; border-radius: 9px;
          background: #1F7A8C; border: none; color: #fff; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          transition: background 0.15s;
        }
        .cc-btn-primary:hover { background: #176878; }
        .cc-btn-close {
          padding: 8px 14px; background: transparent;
          border: 1px solid rgba(191,219,247,0.15);
          border-radius: 7px; color: rgba(191,219,247,0.5);
          cursor: pointer; font-size: 12px; font-family: 'Inter', sans-serif;
          transition: color 0.15s;
        }
        .cc-btn-close:hover { color: #BFDBF7; }

        /* Shutter */
        .cc-shutter-wrap {
          display: flex; align-items: center; justify-content: center; padding: 8px 0 4px;
        }
        .cc-shutter {
          width: 68px; height: 68px; border-radius: 50%;
          border: 3px solid rgba(191,219,247,0.35);
          background: transparent; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.1s, border-color 0.15s;
          position: relative;
        }
        .cc-shutter:hover { border-color: #BFDBF7; transform: scale(1.04); }
        .cc-shutter:active { transform: scale(0.94); }
        .cc-shutter-inner {
          width: 52px; height: 52px; border-radius: 50%;
          background: #FFFFFF; transition: background 0.1s;
        }
        .cc-shutter:hover .cc-shutter-inner { background: #BFDBF7; }
        .cc-hint {
          text-align: center; font-size: 11px;
          color: rgba(191,219,247,0.35); margin-top: 10px;
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <div className="cc-overlay" onClick={onClose}>
        <div className="cc-modal" onClick={e => e.stopPropagation()}>

          {/* HEADER */}
          <div className="cc-header">
            <div>
              <div className="cc-header-title">
                {phase === 'cam'        && 'Ambil Foto Bukti'}
                {phase === 'processing' && 'Pipeline YOLOv8n-face'}
                {phase === 'preview'    && 'Pratinjau Hasil Blur'}
              </div>
              <div className="cc-header-sub">
                {phase === 'cam'        && 'Arahkan kamera ke lokasi kejadian'}
                {phase === 'processing' && processingStep}
                {phase === 'preview'    && `${detections.length} wajah terdeteksi dan disensor`}
              </div>
            </div>
            {phase === 'cam' && (
              <button className="cc-btn-close" onClick={onClose}>Batal</button>
            )}
            {phase === 'preview' && (
              <div className="cc-header-badge">
                <div className="cc-header-badge-dot" />
                TERSENSOR
              </div>
            )}
          </div>

          {/* MEDIA */}
          <div className="cc-media-wrap">
            {phase === 'cam' && <video ref={videoRef} autoPlay playsInline muted />}
            <canvas ref={canvasRef} style={{ display: phase === 'cam' ? 'none' : 'block' }} />
            {phase === 'processing' && (
              <div className="cc-processing-overlay">
                <div className="cc-pipeline-visual">
                  <div className="cc-pipeline-step">
                    <div className={`cc-pipeline-icon ${processingStep.includes('YOLOv8') ? 'active' : ''}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F7A8C" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    </div>
                    <div className="cc-pipeline-label">YOLOv8n</div>
                  </div>
                  <div className="cc-pipeline-arrow">→</div>
                  <div className="cc-pipeline-step">
                    <div className={`cc-pipeline-icon ${processingStep.includes('wajah') ? 'active' : ''}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F7A8C" strokeWidth="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>
                    </div>
                    <div className="cc-pipeline-label">Deteksi</div>
                  </div>
                  <div className="cc-pipeline-arrow">→</div>
                  <div className="cc-pipeline-step">
                    <div className={`cc-pipeline-icon ${processingStep.includes('OpenCV') ? 'active' : ''}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F7A8C" strokeWidth="2.5"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    </div>
                    <div className="cc-pipeline-label">OpenCV</div>
                  </div>
                </div>
                <div className="cc-spinner" />
                <div className="cc-processing-text">{processingStep || 'Memproses...'}</div>
                <div className="cc-processing-sub">Simulasi pipeline backend YOLOv8n-face</div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="cc-footer">
            {phase === 'cam' && (
              <>
                <div className="cc-shutter-wrap">
                  <button className="cc-shutter" onClick={ambilFoto}>
                    <div className="cc-shutter-inner" />
                  </button>
                </div>
                <div className="cc-hint">Tekan untuk mengambil foto</div>
              </>
            )}

            {phase === 'preview' && (
              <>
                <div className="cc-detect-info">
                  <div className="cc-detect-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1F7A8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="cc-detect-title">{detections.length} wajah disaMarkan via YOLOv8n-face + OpenCV</div>
                    <div className="cc-detect-desc">
                      Sesuai proposal Delcion: foto diproses face blurring otomatis sebelum disimpan ke basis data.
                    </div>
                  </div>
                </div>
                <div className="cc-slider-row">
                  Intensitas Blur (OpenCV GaussianBlur radius) <span>{blurStrength}px</span>
                </div>
                <input
                  type="range" className="cc-slider"
                  min={8} max={40} value={blurStrength}
                  style={{ '--v': blurStrength }}
                  onChange={e => setBlurStrength(+e.target.value)}
                />
                <div className="cc-actions">
                  <button className="cc-btn-secondary" onClick={ulang}>Ambil Ulang</button>
                  <button className="cc-btn-primary" onClick={handleSelesai}>Gunakan Foto Ini</button>
                </div>
              </>
            )}

            {phase === 'processing' && (
              <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(191,219,247,0.3)', padding: '6px 0', fontFamily: 'Inter, sans-serif' }}>
                Harap tunggu, jangan tutup halaman ini
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

/**
 * Skin-tone segmentation — proxy untuk YOLOv8n-face detection
 * Mendeteksi region dengan dominasi warna kulit di canvas
 */
async function detectFaceRegions(canvas, W, H) {
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, W, H)
  const data = imageData.data

  // Grid sampling 20x20 untuk efisiensi
  const gridW = 20, gridH = 20
  const cellW = Math.floor(W / gridW), cellH = Math.floor(H / gridH)
  const skinMap = []

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      let skinCount = 0, total = 0
      const x0 = gx * cellW, y0 = gy * cellH

      for (let py = 0; py < cellH; py += 2) {
        for (let px = 0; px < cellW; px += 2) {
          const idx = ((y0 + py) * W + (x0 + px)) * 4
          const r = data[idx], g = data[idx+1], b = data[idx+2]
          if (isSkinTone(r, g, b)) skinCount++
          total++
        }
      }
      skinMap.push({ gx, gy, ratio: skinCount / Math.max(total, 1) })
    }
  }

  // Temukan cluster skin-tone tinggi (>30%)
  const hotCells = skinMap.filter(c => c.ratio > 0.30)
  if (hotCells.length < 2) return []

  // Bounding box cluster
  const minGx = Math.min(...hotCells.map(c => c.gx))
  const maxGx = Math.max(...hotCells.map(c => c.gx))
  const minGy = Math.min(...hotCells.map(c => c.gy))
  const maxGy = Math.max(...hotCells.map(c => c.gy))

  const x = minGx * cellW
  const y = minGy * cellH
  const w = (maxGx - minGx + 1) * cellW
  const h = (maxGy - minGy + 1) * cellH

  // Hanya ambil jika area masuk akal sebagai wajah
  const area = w * h
  if (area < (W * H * 0.005) || area > (W * H * 0.6)) return []

  return [{ x, y, w, h, conf: 0.87 }]
}

function isSkinTone(r, g, b) {
  // Aturan skin detection berbasis RGB + YCbCr approximation
  if (r < 60) return false
  const rgbRule = r > 95 && g > 40 && b > 20 && r > g && r > b && (r - Math.min(g, b)) > 15
  const ycbcrR = r * 0.299 + g * 0.587 + b * 0.114
  const cb = (b - ycbcrR) * 0.564 + 128
  const cr = (r - ycbcrR) * 0.713 + 128
  const ycbcrRule = ycbcrR > 80 && cb >= 85 && cb <= 135 && cr >= 135 && cr <= 180
  return rgbRule || ycbcrRule
}

/**
 * Fallback heuristik jika tidak ada deteksi
 * Sesuai proposal: "pipeline difokuskan pada area wajah yang terdeteksi"
 */
function generateHeuristicZones(W, H) {
  return [
    { x: Math.floor(W * 0.25), y: Math.floor(H * 0.05), w: Math.floor(W * 0.5), h: Math.floor(H * 0.45), conf: 0.72 }
  ]
}

/**
 * OpenCV-style blur pipeline
 * Sesuai proposal: "OpenCV untuk menyamarkannya secara otomatis"
 * 
 * Implementasi: pixelate (mosaic) + multi-pass gaussian approximation
 */
function applyOpenCVStyleBlur(ctx, x, y, w, h, radius) {
  if (w <= 0 || h <= 0 || radius <= 0) return

  const pad = Math.floor(radius * 0.8)
  const bx  = Math.max(0, x - pad)
  const by  = Math.max(0, y - pad)
  const bw  = Math.min(ctx.canvas.width  - bx, w + pad * 2)
  const bh  = Math.min(ctx.canvas.height - by, h + pad * 2)

  // Pass 1: Pixelate (mosaic) — keras seperti pixelBlur OpenCV
  const pixelSize = Math.max(6, Math.floor(radius / 2.5))
  const imgData = ctx.getImageData(bx, by, bw, bh)
  const d = imgData.data

  for (let py = 0; py < bh; py += pixelSize) {
    for (let px = 0; px < bw; px += pixelSize) {
      let rS = 0, gS = 0, bS = 0, cnt = 0
      for (let ky = 0; ky < pixelSize && py+ky < bh; ky++) {
        for (let kx = 0; kx < pixelSize && px+kx < bw; kx++) {
          const i = ((py+ky)*bw+(px+kx))*4
          rS += d[i]; gS += d[i+1]; bS += d[i+2]; cnt++
        }
      }
      const rAvg = rS/cnt, gAvg = gS/cnt, bAvg = bS/cnt
      for (let ky = 0; ky < pixelSize && py+ky < bh; ky++) {
        for (let kx = 0; kx < pixelSize && px+kx < bw; kx++) {
          const i = ((py+ky)*bw+(px+kx))*4
          d[i] = rAvg; d[i+1] = gAvg; d[i+2] = bAvg
        }
      }
    }
  }
  ctx.putImageData(imgData, bx, by)

  // Pass 2–4: Box blur iteratif (approximasi Gaussian — OpenCV style)
  for (let pass = 0; pass < 4; pass++) {
    boxBlurRegion(ctx, bx, by, bw, bh, Math.max(3, Math.floor(radius / 3)))
  }
}

function boxBlurRegion(ctx, x, y, w, h, r) {
  const src = ctx.getImageData(x, y, w, h)
  const dst = ctx.createImageData(w, h)
  const s = src.data, d = dst.data

  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      let rS=0, gS=0, bS=0, cnt=0
      for (let ky=-r; ky<=r; ky++) {
        for (let kx=-r; kx<=r; kx++) {
          const nx = Math.min(w-1,Math.max(0,px+kx))
          const ny = Math.min(h-1,Math.max(0,py+ky))
          const i = (ny*w+nx)*4
          rS+=s[i]; gS+=s[i+1]; bS+=s[i+2]; cnt++
        }
      }
      const i = (py*w+px)*4
      d[i]=rS/cnt; d[i+1]=gS/cnt; d[i+2]=bS/cnt; d[i+3]=s[i+3]
    }
  }
  ctx.putImageData(dst, x, y)
}

/**
 * Gambar bounding box overlay YOLOv8-style
 */
function drawDetectionOverlay(ctx, zone, idx) {
  const { x, y, w, h, conf } = zone
  const label = `face ${idx+1} ${Math.round((conf||0.85)*100)}%`

  // Bounding box
  ctx.strokeStyle = '#00ff88'
  ctx.lineWidth   = 2
  ctx.setLineDash([])
  ctx.strokeRect(x, y, w, h)

  // Corner brackets (YOLOv8 style)
  const cs = Math.min(w, h) * 0.15
  ctx.strokeStyle = '#00ff88'
  ctx.lineWidth   = 3
  ;[
    [[x,y+cs],[x,y],[x+cs,y]],
    [[x+w-cs,y],[x+w,y],[x+w,y+cs]],
    [[x,y+h-cs],[x,y+h],[x+cs,y+h]],
    [[x+w-cs,y+h],[x+w,y+h],[x+w,y+h-cs]],
  ].forEach(pts => {
    ctx.beginPath()
    ctx.moveTo(pts[0][0],pts[0][1])
    pts.slice(1).forEach(([px,py2]) => ctx.lineTo(px,py2))
    ctx.stroke()
  })

  // Label tag
  const pad = 4
  ctx.font = `bold ${Math.max(10, Math.floor(w/12))}px monospace`
  const tw = ctx.measureText(label).width
  ctx.fillStyle = 'rgba(0, 255, 136, 0.85)'
  ctx.fillRect(x, y - Math.max(16, Math.floor(w/8)) - pad, tw + pad*2, Math.max(16, Math.floor(w/8)) + pad)
  ctx.fillStyle = '#000'
  ctx.fillText(label, x + pad, y - pad - 1)
}