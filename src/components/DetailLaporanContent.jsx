import { useState, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

const N      = '#022B3A'
const T      = '#3C6E71'
const TEXT   = '#1a2e3b'
const MUTED  = '#5A7080'
const BORDER = '#D6DCE4'
const CARD   = '#FFFFFF'
const RED    = '#C0392B'
const AMBER  = '#D4820A'
const GREEN  = '#1E7E4A'

const STATUS_STEPS = ['menunggu', 'terverifikasi', 'ditangani']
const STATUS_LABEL = {
  menunggu:       'Menunggu Verifikasi',
  terverifikasi:  'Terverifikasi',
  ditangani:      'Ditangani',
  tidak_valid:    'Tidak Valid',
}

// ── Icons ──────────────────────────────────────────────────────
const Icon = {
  check:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:       <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  pin:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  clock:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  ai:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  shield:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  trash:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>,
  user:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  camera:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  bullhorn:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-7v16l-18-7z"/><path d="M11 18v3a2 2 0 0 0 4 0v-1"/></svg>,
}

/* Load Leaflet dari CDN sekali saja */
function useLeaflet() {
  const [ready, setReady] = useState(typeof window !== 'undefined' && !!window.L)
  useEffect(() => {
    if (window.L) { setReady(true); return }
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => setReady(true)
    document.body.appendChild(script)
  }, [])
  return ready
}

function MiniMap({ lat, lng, label }) {
  const mapRef = useRef(null)
  const elRef  = useRef(null)
  const ready  = useLeaflet()

  useEffect(() => {
    if (!ready || !elRef.current || mapRef.current) return
    const L = window.L
    const map = L.map(elRef.current, { zoomControl:true, attributionControl:false }).setView([lat, lng], 16)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:16px;height:16px;border-radius:50%;background:${RED};border:3px solid #fff;box-shadow:0 0 0 4px rgba(192,57,43,0.25);"></div>`,
      iconSize: [16,16],
    })
    L.marker([lat, lng], { icon }).addTo(map).bindPopup(label)
    mapRef.current = map
    setTimeout(() => map.invalidateSize(), 200)
    return () => { map.remove(); mapRef.current = null }
  }, [ready, lat, lng, label])

  if (!ready) {
    return (
      <div style={{
        height:220, display:'flex', alignItems:'center', justifyContent:'center',
        background:'#F1F4F8', fontSize:12, color:MUTED,
      }}>
        Memuat peta...
      </div>
    )
  }
  return <div ref={elRef} style={{ height:220, width:'100%' }} />
}

export default function DetailLaporanContent({ laporan, onClose, embedded = false }) {
  const updateLaporan = useStore(s => s.updateLaporan)
  const petugasList   = useStore(s => s.petugasList) || DEFAULT_PETUGAS
  const showToast     = useStore(s => s.showToast)

  const [data, setData] = useState(() => ({
    status: 'menunggu',
    screenshot: null,
    lat: 1.4870,
    lng: 124.8420,
    waktu: new Date().toLocaleString('id-ID'),
    klasifikasi: 'Anak berjualan',
    confidence: 92,
    estimasiUsia: '8–11 tahun',
    sumber: 'cctv',
    lokasi: 'Kawasan Megamas',
    petugasId: null,
    ...laporan,
  }))
  const [confirming, setConfirming] = useState(null) // 'valid' | 'invalid' | null

  const persist = (patch) => {
    const next = { ...data, ...patch }
    setData(next)
    updateLaporan?.(next.id, patch)
  }

  const handleVerifikasi = (valid) => {
    if (valid) {
      persist({ status:'terverifikasi' })
      showToast?.('Laporan ditandai Terverifikasi')
    } else {
      // Tidak valid → hapus tangkapan layar otomatis
      persist({ status:'tidak_valid', screenshot:null, screenshotDeletedAt:new Date().toISOString() })
      showToast?.('Laporan ditandai Tidak Valid — tangkapan layar dihapus otomatis')
    }
    setConfirming(null)
  }

  const handleTugaskan = (petugasId) => {
    persist({ petugasId, status: data.status === 'menunggu' ? 'terverifikasi' : data.status })
    const p = petugasList.find(p => p.id === petugasId)
    showToast?.(p ? `Ditugaskan ke ${p.nama}` : 'Penugasan diperbarui')
  }

  const handleTandaiDitangani = () => {
    persist({ status:'ditangani', selesaiAt:new Date().toISOString() })
    showToast?.('Laporan ditandai Ditangani')
  }

  const isInvalid    = data.status === 'tidak_valid'
  const currentStepI = STATUS_STEPS.indexOf(data.status)

  return (
    <div className="dl-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        .dl-root * { box-sizing:border-box; }
        .dl-root { font-family:'Inter', sans-serif; color:${TEXT}; }

        .dl-grid { display:grid; grid-template-columns:1fr 320px; gap:18px; }
        .dl-card { background:${CARD}; border:1px solid ${BORDER}; border-radius:14px; overflow:hidden; margin-bottom:14px; }
        .dl-card-head {
          padding:13px 18px; border-bottom:1px solid ${BORDER};
          font-family:'Plus Jakarta Sans', sans-serif; font-size:12.5px; font-weight:700; color:${N};
          display:flex; align-items:center; gap:8px;
        }
        .dl-card-body { padding:16px 18px; }

        /* Screenshot */
        .dl-shot {
          aspect-ratio:16/9; background:#060f1c; position:relative;
          display:flex; align-items:center; justify-content:center;
        }
        .dl-shot img { width:100%; height:100%; object-fit:cover; display:block; }
        .dl-shot-empty { color:rgba(255,255,255,0.3); font-size:12px; text-align:center; padding:20px; }
        .dl-shot-badge {
          position:absolute; top:10px; left:10px;
          background:rgba(192,57,43,0.85); color:#fff; font-size:10px; font-weight:700;
          padding:4px 10px; border-radius:7px;
        }

        /* Status tracker */
        .dl-tracker { display:flex; align-items:center; padding:6px 4px; }
        .dl-step { flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; position:relative; }
        .dl-step-dot {
          width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center;
          font-size:11px; font-weight:700; border:2px solid ${BORDER}; background:#fff; color:${MUTED}; z-index:1;
        }
        .dl-step.done .dl-step-dot { background:${T}; border-color:${T}; color:#fff; }
        .dl-step.current .dl-step-dot { border-color:${T}; color:${T}; }
        .dl-step-label { font-size:10.5px; font-weight:600; color:${MUTED}; text-align:center; }
        .dl-step.done .dl-step-label, .dl-step.current .dl-step-label { color:${TEXT}; }
        .dl-step-line {
          position:absolute; top:13px; left:-50%; width:100%; height:2px; background:${BORDER}; z-index:0;
        }
        .dl-step:first-child .dl-step-line { display:none; }
        .dl-step.done .dl-step-line { background:${T}; }
        .dl-invalid-banner {
          margin-top:10px; padding:10px 14px; border-radius:10px;
          background:rgba(192,57,43,0.08); border:1px solid rgba(192,57,43,0.2);
          color:${RED}; font-size:11.5px; font-weight:600; display:flex; align-items:center; gap:8px;
        }

        /* Info rows */
        .dl-row { display:flex; align-items:flex-start; gap:9px; padding:8px 0; border-bottom:1px solid ${BORDER}; }
        .dl-row:last-child { border-bottom:none; }
        .dl-row-icon { color:${T}; margin-top:1px; flex-shrink:0; }
        .dl-row-label { font-size:11px; color:${MUTED}; margin-bottom:2px; }
        .dl-row-val { font-size:12.5px; font-weight:700; color:${TEXT}; font-family:'Plus Jakarta Sans', sans-serif; }
        .dl-conf-bar { height:5px; border-radius:3px; background:rgba(60,110,113,0.12); margin-top:6px; overflow:hidden; width:100%; }
        .dl-conf-fill { height:100%; background:${T}; border-radius:3px; }

        /* HITL buttons */
        .dl-hitl { display:flex; gap:10px; }
        .dl-btn {
          flex:1; padding:12px 10px; border-radius:11px; border:1.5px solid transparent;
          font-family:'Plus Jakarta Sans', sans-serif; font-size:12.5px; font-weight:700;
          display:flex; align-items:center; justify-content:center; gap:7px; cursor:pointer; transition:all 0.18s;
        }
        .dl-btn-valid { background:rgba(30,126,74,0.1); color:${GREEN}; border-color:rgba(30,126,74,0.3); }
        .dl-btn-valid:hover { background:${GREEN}; color:#fff; }
        .dl-btn-invalid { background:rgba(192,57,43,0.08); color:${RED}; border-color:rgba(192,57,43,0.25); }
        .dl-btn-invalid:hover { background:${RED}; color:#fff; }
        .dl-btn-done { background:${T}; color:#fff; width:100%; padding:12px; border-radius:11px; border:none;
          font-family:'Plus Jakarta Sans', sans-serif; font-size:12.5px; font-weight:700; cursor:pointer; transition:background 0.18s; }
        .dl-btn-done:hover { background:#2f5759; }
        .dl-btn-done:disabled { background:${BORDER}; color:${MUTED}; cursor:not-allowed; }

        /* Confirm inline */
        .dl-confirm-box { background:#F8FAFC; border:1px solid ${BORDER}; border-radius:10px; padding:12px 14px; margin-top:10px; }
        .dl-confirm-text { font-size:11.5px; color:${TEXT}; margin-bottom:10px; line-height:1.5; }
        .dl-confirm-actions { display:flex; gap:8px; }
        .dl-confirm-cancel, .dl-confirm-ok {
          flex:1; padding:8px; border-radius:8px; font-size:11.5px; font-weight:700; cursor:pointer;
          font-family:'Plus Jakarta Sans', sans-serif; border:1px solid ${BORDER}; background:#fff; color:${MUTED};
        }
        .dl-confirm-ok { background:${RED}; color:#fff; border-color:${RED}; }

        /* Select petugas */
        .dl-select {
          width:100%; padding:10px 12px; border-radius:10px; border:1px solid ${BORDER};
          font-size:12.5px; font-family:'Inter', sans-serif; color:${TEXT}; background:#fff;
          cursor:pointer;
        }
        .dl-assigned {
          margin-top:10px; display:flex; align-items:center; gap:9px;
          background:rgba(60,110,113,0.07); border:1px solid rgba(60,110,113,0.2);
          border-radius:10px; padding:9px 12px;
        }
        .dl-assigned-icon {
          width:30px; height:30px; border-radius:50%; background:rgba(60,110,113,0.15);
          display:flex; align-items:center; justify-content:center; color:${T}; flex-shrink:0;
        }
        .dl-assigned-name { font-size:12px; font-weight:700; color:${TEXT}; font-family:'Plus Jakarta Sans', sans-serif; }
        .dl-assigned-unit { font-size:10.5px; color:${MUTED}; }

        @media (max-width: 900px) {
          .dl-grid { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="dl-grid">

        {/* ── Kolom kiri ── */}
        <div>
          <div className="dl-card">
            <div className="dl-card-head">{Icon.camera} Tangkapan Layar Deteksi</div>
            <div className="dl-shot">
              {data.screenshot ? (
                <img src={data.screenshot} alt="Tangkapan layar deteksi" />
              ) : isInvalid ? (
                <div className="dl-shot-empty">
                  Tangkapan layar telah dihapus otomatis<br/>(laporan ditandai Tidak Valid)
                </div>
              ) : (
                <div className="dl-shot-empty">Tidak ada gambar untuk laporan ini</div>
              )}
              {data.sumber === 'cctv' && !isInvalid && (
                <span className="dl-shot-badge">Deteksi AI — CCTV</span>
              )}
            </div>
          </div>

          <div className="dl-card">
            <div className="dl-card-head">{Icon.pin} Lokasi pada Peta</div>
            <MiniMap lat={data.lat} lng={data.lng} label={data.lokasi} />
            <div style={{ padding:'10px 18px', fontSize:11.5, color:MUTED }}>
              {data.lokasi} &nbsp;·&nbsp; {data.lat?.toFixed(5)}, {data.lng?.toFixed(5)}
            </div>
          </div>

          <div className="dl-card">
            <div className="dl-card-head">Status Penanganan</div>
            <div className="dl-card-body">
              {isInvalid ? (
                <div className="dl-invalid-banner">{Icon.x} Laporan ini ditandai Tidak Valid dan dikeluarkan dari proses penanganan.</div>
              ) : (
                <>
                  <div className="dl-tracker">
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step} className={`dl-step${i < currentStepI ? ' done' : ''}${i === currentStepI ? ' current' : ''}`}>
                        <span className="dl-step-line" />
                        <span className="dl-step-dot">{i < currentStepI ? Icon.check : i + 1}</span>
                        <span className="dl-step-label">{STATUS_LABEL[step]}</span>
                      </div>
                    ))}
                  </div>
                  {data.status === 'terverifikasi' && (
                    <button className="dl-btn-done" style={{ marginTop:14 }} onClick={handleTandaiDitangani}>
                      Tandai Sudah Ditangani
                    </button>
                  )}
                  {data.status === 'ditangani' && (
                    <div style={{ marginTop:14, fontSize:11.5, color:GREEN, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
                      {Icon.check} Kasus ini telah selesai ditangani
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Kolom kanan ── */}
        <div>
          <div className="dl-card">
            <div className="dl-card-head">{Icon.ai} Hasil Klasifikasi Model</div>
            <div className="dl-card-body">
              <div className="dl-row">
                <span className="dl-row-icon">{Icon.clock}</span>
                <div>
                  <div className="dl-row-label">Waktu Deteksi</div>
                  <div className="dl-row-val">{data.waktu}</div>
                </div>
              </div>
              <div className="dl-row">
                <span className="dl-row-icon">{data.sumber === 'cctv' ? Icon.camera : Icon.bullhorn}</span>
                <div>
                  <div className="dl-row-label">Sumber</div>
                  <div className="dl-row-val">{data.sumber === 'cctv' ? 'Deteksi otomatis CCTV' : 'Laporan warga'}</div>
                </div>
              </div>
              <div className="dl-row" style={{ flexDirection:'column', alignItems:'stretch' }}>
                <div style={{ display:'flex', gap:9 }}>
                  <span className="dl-row-icon">{Icon.ai}</span>
                  <div style={{ flex:1 }}>
                    <div className="dl-row-label">Jenis Aktivitas</div>
                    <div className="dl-row-val">{data.klasifikasi}</div>
                  </div>
                </div>
              </div>
              <div className="dl-row" style={{ flexDirection:'column', alignItems:'stretch' }}>
                <div className="dl-row-label">Confidence Model</div>
                <div className="dl-row-val">{data.confidence}%</div>
                <div className="dl-conf-bar"><div className="dl-conf-fill" style={{ width:`${data.confidence}%` }} /></div>
              </div>
              <div className="dl-row">
                <span className="dl-row-icon">{Icon.user}</span>
                <div>
                  <div className="dl-row-label">Estimasi Usia</div>
                  <div className="dl-row-val">{data.estimasiUsia}</div>
                </div>
              </div>
            </div>
          </div>

          {!isInvalid && data.status === 'menunggu' && (
            <div className="dl-card">
              <div className="dl-card-head">Konfirmasi Manual (HITL)</div>
              <div className="dl-card-body">
                {confirming === null && (
                  <div className="dl-hitl">
                    <button className="dl-btn dl-btn-valid" onClick={() => setConfirming('valid')}>{Icon.check} Terverifikasi</button>
                    <button className="dl-btn dl-btn-invalid" onClick={() => setConfirming('invalid')}>{Icon.x} Tidak Valid</button>
                  </div>
                )}
                {confirming === 'invalid' && (
                  <div className="dl-confirm-box">
                    <div className="dl-confirm-text">
                      {Icon.trash} Tangkapan layar akan <strong>dihapus otomatis</strong> dan laporan ini dikeluarkan dari proses penanganan. Lanjutkan?
                    </div>
                    <div className="dl-confirm-actions">
                      <button className="dl-confirm-cancel" onClick={() => setConfirming(null)}>Batal</button>
                      <button className="dl-confirm-ok" onClick={() => handleVerifikasi(false)}>Ya, Tidak Valid</button>
                    </div>
                  </div>
                )}
                {confirming === 'valid' && (
                  <div className="dl-confirm-box">
                    <div className="dl-confirm-text">Tandai laporan ini sebagai <strong>Terverifikasi</strong> dan lanjutkan ke proses penugasan?</div>
                    <div className="dl-confirm-actions">
                      <button className="dl-confirm-cancel" onClick={() => setConfirming(null)}>Batal</button>
                      <button className="dl-confirm-ok" style={{ background:GREEN, borderColor:GREEN }} onClick={() => handleVerifikasi(true)}>Ya, Terverifikasi</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isInvalid && data.status !== 'menunggu' && (
            <div className="dl-card">
              <div className="dl-card-head">{Icon.shield} Penugasan Satpol PP</div>
              <div className="dl-card-body">
                <select
                  className="dl-select"
                  value={data.petugasId || ''}
                  onChange={e => handleTugaskan(e.target.value)}
                >
                  <option value="">— Pilih petugas / unit —</option>
                  {petugasList.map(p => (
                    <option key={p.id} value={p.id}>{p.nama} · {p.unit}</option>
                  ))}
                </select>

                {data.petugasId && (() => {
                  const p = petugasList.find(p => p.id === data.petugasId)
                  if (!p) return null
                  return (
                    <div className="dl-assigned">
                      <span className="dl-assigned-icon">{Icon.user}</span>
                      <div>
                        <div className="dl-assigned-name">{p.nama}</div>
                        <div className="dl-assigned-unit">{p.unit} · {p.wilayah}</div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {!embedded && onClose && (
        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:6 }}>
          <button
            onClick={onClose}
            style={{
              padding:'10px 22px', borderRadius:10, border:`1px solid ${BORDER}`,
              background:'#fff', color:MUTED, fontSize:12.5, fontWeight:700,
              fontFamily:'Plus Jakarta Sans, sans-serif', cursor:'pointer',
            }}
          >
            Tutup
          </button>
        </div>
      )}
    </div>
  )
}

export const DEFAULT_PETUGAS = [
  { id:'p1', nama:'Satpol PP Unit Megamas',   unit:'Unit Reaksi Cepat', wilayah:'Wenang' },
  { id:'p2', nama:'Satpol PP Unit Pasar 45',  unit:'Unit Ketertiban',  wilayah:'Wenang' },
  { id:'p3', nama:'Satpol PP Unit Malalayang',unit:'Unit Reaksi Cepat',wilayah:'Malalayang' },
]