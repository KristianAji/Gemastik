import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../../store/useStore'

const N      = '#284B63'
const T      = '#3C6E71'
const TEXT   = '#353535'
const MUTED  = '#6B7C8D'
const BORDER = '#D9D9D9'
const CARD   = '#FFFFFF'
const BG     = '#F4F7F9'
const RED    = '#C0392B'
const GREEN  = '#1E7E4A'

const Icon = {
  camera:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  check:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  pin:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  doc:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  user:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  upload:  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  x:       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  back:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
}

const TUGAS_OPTIONS = [
  { id: 'TGS-001', lokasi: 'Kawasan Megamas' },
  { id: 'TGS-002', lokasi: 'Pasar 45' },
  { id: 'TGS-003', lokasi: 'Manado Town Square' },
]

const STATUS_OPTIONS = [
  { value: 'berhasil',        label: 'Berhasil — Anak dipulangkan ke keluarga',     color: GREEN },
  { value: 'dirujuk',         label: 'Dirujuk — Diserahkan ke Dinas Sosial',         color: T },
  { value: 'tidak_ditemukan', label: 'Tidak Ditemukan — Lokasi sudah kosong',        color: MUTED },
  { value: 'butuh_tindak',    label: 'Perlu Tindak Lanjut — Situasi belum selesai', color: '#D4820A' },
]

export default function SatpolInput() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const showToast = useStore(s => s.showToast)

  const [form, setForm] = useState({
    tugasId:      location.state?.tugasId ?? '',
    lokasi:       location.state?.lokasi  ?? '',
    status:       '',
    jumlahAnak:   '',
    catatan:      '',
    namaAnak:     '',
    kondisi:      '',
    tindakan:     '',
    waktuTiba:    '',
    waktuSelesai: '',
  })
  const [fotos,      setFotos]      = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleFoto = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => setFotos(f => [...f, { name: file.name, url: ev.target.result }])
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = () => {
    if (!form.tugasId || !form.status || !form.catatan) {
      showToast?.('Lengkapi field yang wajib diisi')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      showToast?.('Laporan lapangan berhasil dikirim ke Dinsos')
    }, 1400)
  }

  if (submitted) {
    return (
      <div style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: BG, flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: 40, minHeight: '60vh',
      }}>
        <div style={{
          background: CARD, borderRadius: 20, padding: '48px 40px',
          textAlign: 'center', maxWidth: 440, width: '100%',
          border: `1px solid ${BORDER}`,
          boxShadow: '0 8px 40px rgba(40,75,99,0.10)',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(30,126,74,0.1)', border: `2px solid ${GREEN}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', color: GREEN,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: N, marginBottom: 10 }}>
            Laporan Terkirim!
          </div>
          <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, marginBottom: 28 }}>
            Hasil penanganan lapangan berhasil dikirim ke Dinsos. Penugasan <strong>{form.tugasId}</strong> telah ditandai selesai.
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/satpolpp/riwayat')}
              style={{
                padding: '10px 22px', background: T, color: '#fff',
                border: 'none', borderRadius: 9,
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Lihat Riwayat
            </button>
            <button
              onClick={() => {
                setSubmitted(false)
                setForm({ tugasId:'', lokasi:'', status:'', jumlahAnak:'', catatan:'', namaAnak:'', kondisi:'', tindakan:'', waktuTiba:'', waktuSelesai:'' })
                setFotos([])
              }}
              style={{
                padding: '10px 22px', background: 'transparent', color: N,
                border: `1.5px solid ${BORDER}`, borderRadius: 9,
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Input Baru
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .si-root * { box-sizing: border-box; }
        .si-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: ${BG}; color: ${TEXT};
          flex: 1; overflow-y: auto;
          padding: 28px 32px 60px;
          display: flex; flex-direction: column; gap: 20px;
        }

        .si-page-head { display: flex; align-items: center; gap: 14px; }
        .si-page-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(60,110,113,0.1); border: 1px solid rgba(60,110,113,0.25);
          display: flex; align-items: center; justify-content: center; color: ${T};
        }
        .si-page-title { font-size: 20px; font-weight: 800; color: ${N}; }
        .si-page-sub   { font-size: 12px; color: ${MUTED}; margin-top: 2px; }

        .si-card { background: ${CARD}; border: 1px solid ${BORDER}; border-radius: 14px; overflow: hidden; }
        .si-card-head {
          padding: 14px 20px; border-bottom: 1px solid ${BORDER};
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 700; color: ${N};
        }

        .si-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 20px; }
        .si-form-full { grid-column: 1/-1; }
        .si-label { font-size: 11px; font-weight: 700; color: ${N}; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.06em; }
        .si-required { color: ${RED}; margin-left: 2px; }
        .si-input, .si-select, .si-textarea {
          width: 100%; padding: 10px 14px; border-radius: 9px;
          border: 1.5px solid ${BORDER}; background: ${BG};
          color: ${TEXT}; font-size: 13px; outline: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: border-color 0.15s;
        }
        .si-input:focus, .si-select:focus, .si-textarea:focus { border-color: ${T}; background: ${CARD}; }
        .si-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }

        .si-status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 20px; }
        .si-status-option {
          padding: 12px 14px; border-radius: 11px;
          border: 1.5px solid ${BORDER}; background: #F8FAFC;
          cursor: pointer; transition: all 0.15s;
        }
        .si-status-option:hover { border-color: ${T}; background: rgba(60,110,113,0.05); }
        .si-status-option.selected { border-color: var(--sc); background: var(--sb); }
        .si-status-radio { display: none; }
        .si-status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--sc,${MUTED}); display: inline-block; margin-right: 6px; }
        .si-status-label { font-size: 12px; font-weight: 600; color: ${TEXT}; }

        /* ── FOTO ── */
        .si-foto-area { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
        .si-foto-drop {
          border: 2px dashed ${BORDER}; border-radius: 12px;
          padding: 36px 20px; cursor: pointer; transition: all 0.18s;
          background: #F8FAFC; display: flex; align-items: center;
          justify-content: center; width: 100%;
        }
        .si-foto-drop:hover { border-color: ${T}; background: rgba(60,110,113,0.04); }
        .si-foto-input { display: none; }
        .si-foto-inner { display: flex; flex-direction: column; align-items: center; gap: 10px; pointer-events: none; }
        .si-foto-icon-wrap {
          width: 52px; height: 52px; border-radius: 14px;
          background: rgba(60,110,113,0.08); border: 1px solid rgba(60,110,113,0.18);
          display: flex; align-items: center; justify-content: center; color: ${T};
        }
        .si-foto-label { font-size: 13px; font-weight: 700; color: ${N}; margin-bottom: 2px; }
        .si-foto-sub   { font-size: 11px; color: ${MUTED}; }
        .si-foto-grid  { display: grid; grid-template-columns: repeat(auto-fill, 90px); gap: 10px; }
        .si-foto-thumb {
          width: 90px; height: 90px; border-radius: 8px;
          overflow: hidden; position: relative; border: 1px solid ${BORDER};
        }
        .si-foto-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .si-foto-remove {
          position: absolute; top: 4px; right: 4px;
          width: 20px; height: 20px; border-radius: 50%;
          background: rgba(0,0,0,0.55); border: none; color: #fff;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .si-foto-count { font-size: 11px; color: ${MUTED}; font-weight: 500; }

        .si-footer { padding: 20px; border-top: 1px solid ${BORDER}; display: flex; gap: 10px; }
        .si-btn-submit {
          flex: 1; padding: 13px; background: ${T}; color: #fff;
          border: none; border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 800;
          cursor: pointer; transition: background 0.18s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .si-btn-submit:hover:not(:disabled) { background: #2f5759; }
        .si-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .si-btn-back {
          padding: 13px 20px; background: transparent; color: ${N};
          border: 1.5px solid ${BORDER}; border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.18s;
          display: flex; align-items: center; gap: 6px;
        }
        .si-btn-back:hover { border-color: ${N}; }

        @keyframes si-spin { to { transform: rotate(360deg); } }
        .si-spin { animation: si-spin 0.7s linear infinite; display: inline-flex; }

        @media (max-width: 768px) {
          .si-root { padding: 20px 16px 60px; }
          .si-form-grid { grid-template-columns: 1fr; }
          .si-status-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="si-root">

        {/* PAGE HEADER */}
        <div className="si-page-head">
          <div className="si-page-icon">{Icon.doc}</div>
          <div>
            <div className="si-page-title">Input Hasil Lapangan</div>
            <div className="si-page-sub">Laporkan hasil penanganan langsung ke Dinsos</div>
          </div>
        </div>

        {/* PENUGASAN */}
        <div className="si-card">
          <div className="si-card-head">{Icon.pin} Penugasan yang Ditangani <span style={{ color: RED }}>*</span></div>
          <div style={{ padding: 20 }}>
            <select
              className="si-select"
              value={form.tugasId}
              onChange={e => {
                const opt = TUGAS_OPTIONS.find(t => t.id === e.target.value)
                set('tugasId', e.target.value)
                set('lokasi', opt?.lokasi ?? '')
              }}
            >
              <option value="">— Pilih penugasan —</option>
              {TUGAS_OPTIONS.map(t => (
                <option key={t.id} value={t.id}>{t.id} — {t.lokasi}</option>
              ))}
            </select>
            {form.lokasi && (
              <div style={{ marginTop: 8, fontSize: 12, color: T, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                {Icon.pin} {form.lokasi}
              </div>
            )}
          </div>
        </div>

        {/* STATUS PENANGANAN */}
        <div className="si-card">
          <div className="si-card-head">{Icon.check} Status Penanganan <span style={{ color: RED }}>*</span></div>
          <div className="si-status-grid">
            {STATUS_OPTIONS.map(s => (
              <label
                key={s.value}
                className={`si-status-option${form.status === s.value ? ' selected' : ''}`}
                style={{ '--sc': s.color, '--sb': `${s.color}15` }}
              >
                <input
                  type="radio" className="si-status-radio"
                  name="status" value={s.value}
                  checked={form.status === s.value}
                  onChange={() => set('status', s.value)}
                />
                <span className="si-status-dot" />
                <span className="si-status-label">{s.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* DETAIL PENANGANAN */}
        <div className="si-card">
          <div className="si-card-head">{Icon.doc} Detail Penanganan</div>
          <div className="si-form-grid">
            <div>
              <div className="si-label">Jumlah Anak Ditemukan</div>
              <input className="si-input" type="number" min="0" placeholder="0"
                value={form.jumlahAnak} onChange={e => set('jumlahAnak', e.target.value)} />
            </div>
            <div>
              <div className="si-label">Waktu Tiba di Lokasi</div>
              <input className="si-input" type="time"
                value={form.waktuTiba} onChange={e => set('waktuTiba', e.target.value)} />
            </div>
            <div>
              <div className="si-label">Nama Anak (jika diketahui)</div>
              <input className="si-input" type="text" placeholder="Nama 1, Nama 2..."
                value={form.namaAnak} onChange={e => set('namaAnak', e.target.value)} />
            </div>
            <div>
              <div className="si-label">Waktu Selesai</div>
              <input className="si-input" type="time"
                value={form.waktuSelesai} onChange={e => set('waktuSelesai', e.target.value)} />
            </div>
            <div className="si-form-full">
              <div className="si-label">Kondisi Anak</div>
              <input className="si-input" type="text" placeholder="Contoh: Baik, sehat, kooperatif..."
                value={form.kondisi} onChange={e => set('kondisi', e.target.value)} />
            </div>
            <div className="si-form-full">
              <div className="si-label">Tindakan yang Dilakukan</div>
              <input className="si-input" type="text" placeholder="Contoh: Dipulangkan ke keluarga, diserahkan ke Dinsos..."
                value={form.tindakan} onChange={e => set('tindakan', e.target.value)} />
            </div>
            <div className="si-form-full">
              <div className="si-label">Catatan Lapangan <span className="si-required">*</span></div>
              <textarea className="si-textarea"
                placeholder="Tuliskan situasi di lapangan secara detail: kondisi lokasi, perilaku anak, respons masyarakat, kendala yang ditemui..."
                value={form.catatan}
                onChange={e => set('catatan', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* FOTO */}
        <div className="si-card">
          <div className="si-card-head">{Icon.camera} Dokumentasi Foto</div>
          <div className="si-foto-area">
            <label className="si-foto-drop">
              <input type="file" className="si-foto-input" accept="image/*" multiple onChange={handleFoto} />
              <div className="si-foto-inner">
                <div className="si-foto-icon-wrap">{Icon.upload}</div>
                <div style={{ textAlign: 'center' }}>
                  <div className="si-foto-label">Klik untuk tambah foto</div>
                  <div className="si-foto-sub">PNG, JPG hingga 5MB per file</div>
                </div>
              </div>
            </label>

            {fotos.length > 0 && (
              <>
                <div className="si-foto-grid">
                  {fotos.map((f, i) => (
                    <div key={i} className="si-foto-thumb">
                      <img src={f.url} alt={f.name} />
                      <button className="si-foto-remove" onClick={() => setFotos(fs => fs.filter((_, j) => j !== i))}>
                        {Icon.x}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="si-foto-count">{fotos.length} foto ditambahkan</div>
              </>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="si-card">
          <div className="si-footer">
            <button className="si-btn-back" onClick={() => navigate('/satpolpp/tugas')}>
              {Icon.back} Kembali
            </button>
            <button className="si-btn-submit" onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <span className="si-spin">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                </span>
              ) : Icon.check}
              {submitting ? 'Mengirim...' : 'Kirim Laporan ke Dinsos'}
            </button>
          </div>
        </div>

      </div>
    </>
  )
}