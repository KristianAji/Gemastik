import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'

const N      = '#284B63'
const T      = '#3C6E71'
const TEXT   = '#353535'
const MUTED  = '#6B7C8D'
const BORDER = '#D9D9D9'
const CARD   = '#FFFFFF'
const BG     = '#F4F7F9'
const RED    = '#C0392B'
const AMBER  = '#D4820A'
const GREEN  = '#1E7E4A'

const Icon = {
  pin:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  warning: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  check:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  clock:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  input:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  user:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  arrow:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  phone:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.5 19.79 19.79 0 0 1 1.65 2.9 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  shield:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
}

const TUGAS = [
  {
    id: 'TGS-001', laporanId: 'LP-2024-142',
    lokasi: 'Kawasan Megamas', subLokasi: 'Area parkir depan Hypermart',
    deskripsi: '2 anak terdeteksi berjualan tisu di area parkir. Deteksi AI confidence 94%. Salah satu anak diperkirakan usia 8–10 tahun.',
    jenis: 'Berjualan',
    jumlahAnak: 2,
    prioritas: 'tinggi',
    waktu: '14 mnt lalu',
    ditugaskanOleh: 'Admin DP3A',
    kontak: '0811-430-1234',
    status: 'aktif',
    sumber: 'AI Detection',
    instruksi: 'Dekati dengan pendekatan humanis. Catat identitas anak dan hubungi orang tua. Jangan gunakan kekerasan.',
  },
  {
    id: 'TGS-002', laporanId: 'LP-2024-141',
    lokasi: 'Pasar 45', subLokasi: 'Parkir selatan',
    deskripsi: '1 anak mengamen di area parkir. Dilaporkan warga sekitar pukul 09.15 WITA.',
    jenis: 'Mengamen',
    jumlahAnak: 1,
    prioritas: 'sedang',
    waktu: '1 jam lalu',
    ditugaskanOleh: 'Admin DP3A',
    kontak: '0811-430-1234',
    status: 'aktif',
    sumber: 'Laporan Warga',
    instruksi: 'Identifikasi anak, tanyakan asal sekolah dan nama orang tua. Dokumentasikan dengan foto.',
  },
  {
    id: 'TGS-003', laporanId: 'LP-2024-140',
    lokasi: 'Manado Town Square', subLokasi: 'Pintu masuk utama',
    deskripsi: 'Anak berpakaian figuran karakter di depan mall. Terlihat meminta sumbangan kepada pengunjung.',
    jenis: 'Figuran',
    jumlahAnak: 1,
    prioritas: 'sedang',
    waktu: '5 jam lalu',
    ditugaskanOleh: 'Admin DP3A',
    kontak: '0811-430-1234',
    status: 'aktif',
    sumber: 'Laporan Warga',
    instruksi: 'Koordinasi dengan security mall sebelum mendekati. Catat jam dan lokasi persis.',
  },
]

export default function SatpolTugas() {
  const navigate  = useNavigate()
  const showToast = useStore(s => s.showToast)
  const [expanded, setExpanded] = useState(null)
  const [filter,   setFilter]   = useState('semua')

  const filtered = TUGAS.filter(t =>
    filter === 'semua' || t.prioritas === filter
  )

  const handleMulai = (t) => {
    showToast?.(`Penanganan ${t.id} dimulai`)
    navigate('/satpolpp/input', { state: { tugasId: t.id, lokasi: t.lokasi } })
  }

  const prioritasMeta = {
    tinggi: { color: RED,   bg: 'rgba(192,57,43,0.1)',  label: 'Prioritas Tinggi' },
    sedang: { color: AMBER, bg: 'rgba(212,130,10,0.1)', label: 'Prioritas Sedang' },
    rendah: { color: T,     bg: 'rgba(60,110,113,0.1)', label: 'Prioritas Rendah' },
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .st-root * { box-sizing: border-box; }
        .st-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: ${BG}; color: ${TEXT};
          flex: 1; overflow-y: auto;
          padding: 28px 32px 60px;
          display: flex; flex-direction: column; gap: 24px;
        }

        /* BANNER */
        .st-banner {
          background: ${N}; border-radius: 18px;
          padding: 28px 36px; display: flex;
          align-items: center; justify-content: space-between; gap: 24px;
          position: relative; overflow: hidden;
        }
        .st-banner::before {
          content: ''; position: absolute; right: -80px; top: -80px;
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(60,110,113,0.3) 0%, transparent 65%);
          pointer-events: none;
        }
        .st-banner-eyebrow { font-size: 11px; color: rgba(191,219,247,0.5); margin-bottom: 8px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
        .st-banner-title { font-size: clamp(22px,3vw,28px); font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 8px; letter-spacing: -0.02em; }
        .st-banner-title span { color: #BFDBF7; }
        .st-banner-sub { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.6; max-width: 420px; }
        .st-banner-sub strong { color: #fff; font-weight: 700; }
        .st-banner-kpi { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; position: relative; z-index: 1; }
        .st-kpi-box {
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px; padding: 14px 20px; text-align: center; min-width: 110px;
        }
        .st-kpi-num { font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -0.03em; line-height: 1; }
        .st-kpi-label { font-size: 10px; color: rgba(191,219,247,0.6); font-weight: 600; margin-top: 4px; }

        /* FILTER */
        .st-filter-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .st-filter-pill {
          padding: 7px 16px; border-radius: 999px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s;
          background: rgba(255,255,255,0.7); color: ${MUTED}; border: 1.5px solid ${BORDER};
        }
        .st-filter-pill:hover { background: rgba(60,110,113,0.08); border-color: ${T}; color: ${T}; }
        .st-filter-pill.active { background: ${N}; color: #fff; border-color: ${N}; }

        /* TUGAS CARD */
        .st-tugas-card {
          background: ${CARD}; border: 1.5px solid ${BORDER};
          border-radius: 14px; overflow: hidden;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .st-tugas-card:hover { box-shadow: 0 4px 20px rgba(40,75,99,0.08); }
        .st-tugas-card.tinggi { border-left: 4px solid ${RED}; }
        .st-tugas-card.sedang { border-left: 4px solid ${AMBER}; }

        .st-tugas-head {
          padding: 16px 20px; display: flex;
          align-items: flex-start; justify-content: space-between; gap: 12px;
          cursor: pointer;
        }
        .st-tugas-id { font-size: 10px; font-weight: 700; color: ${MUTED}; font-family: monospace; margin-bottom: 4px; }
        .st-tugas-lokasi { font-size: 14px; font-weight: 800; color: ${N}; display: flex; align-items: center; gap: 6px; }
        .st-tugas-sub { font-size: 11px; color: ${MUTED}; margin-top: 2px; }
        .st-tugas-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
        .st-pill { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }

        .st-tugas-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
        .st-tugas-time { font-size: 11px; color: #9BAAB5; white-space: nowrap; }

        .st-tugas-body {
          padding: 0 20px 16px;
          border-top: 1px solid ${BORDER};
        }
        .st-tugas-desc { font-size: 12px; color: ${TEXT}; line-height: 1.7; padding: 14px 0 12px; }
        .st-instruksi {
          background: rgba(40,75,99,0.05); border: 1px solid rgba(40,75,99,0.12);
          border-radius: 10px; padding: 12px 14px; margin-bottom: 14px;
        }
        .st-instruksi-label { font-size: 10px; font-weight: 700; color: ${N}; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 5px; }
        .st-instruksi-text  { font-size: 12px; color: ${MUTED}; line-height: 1.6; }
        .st-detail-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 14px; }
        .st-detail-item { font-size: 11px; color: ${MUTED}; display: flex; align-items: center; gap: 5px; }
        .st-detail-item strong { color: ${TEXT}; font-weight: 700; }
        .st-tugas-actions { display: flex; gap: 8px; }

        .st-btn-primary {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 20px; background: ${T}; color: #fff;
          border: none; border-radius: 9px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: background 0.18s;
        }
        .st-btn-primary:hover { background: #2f5759; }
        .st-btn-outline {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 20px; background: transparent; color: ${N};
          border: 1.5px solid ${BORDER}; border-radius: 9px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.18s;
        }
        .st-btn-outline:hover { border-color: ${T}; color: ${T}; }

        /* EMPTY */
        .st-empty { padding: 60px 20px; text-align: center; color: ${MUTED}; }

        @media (max-width: 768px) {
          .st-root { padding: 20px 16px 60px; }
          .st-banner { flex-direction: column; }
        }
      `}</style>

      <div className="st-root">

        {/* BANNER */}
        <div className="st-banner">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="st-banner-eyebrow">Diterima dari DP3A</div>
            <div className="st-banner-title">
              Penugasan Aktif —{' '}
              <span>{TUGAS.filter(t => t.status === 'aktif').length} Lokasi</span>
            </div>
            <div className="st-banner-sub">
              <strong>{TUGAS.filter(t => t.prioritas === 'tinggi').length} prioritas tinggi</strong>{' '}
              membutuhkan penanganan segera. Selesaikan penugasan dan input hasil lapangan.
            </div>
          </div>
          <div className="st-banner-kpi">
            <div className="st-kpi-box">
              <div className="st-kpi-num">{TUGAS.filter(t => t.status === 'aktif').length}</div>
              <div className="st-kpi-label">Aktif</div>
            </div>
            <div className="st-kpi-box">
              <div className="st-kpi-num">{TUGAS.reduce((a, t) => a + t.jumlahAnak, 0)}</div>
              <div className="st-kpi-label">Anak Terlibat</div>
            </div>
          </div>
        </div>

        {/* FILTER */}
        <div className="st-filter-row">
          {[
            { key: 'semua',  label: `Semua (${TUGAS.length})` },
            { key: 'tinggi', label: `Prioritas Tinggi (${TUGAS.filter(t=>t.prioritas==='tinggi').length})` },
            { key: 'sedang', label: `Prioritas Sedang (${TUGAS.filter(t=>t.prioritas==='sedang').length})` },
          ].map(f => (
            <button
              key={f.key}
              className={`st-filter-pill${filter === f.key ? ' active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* TUGAS LIST */}
        {filtered.length === 0 ? (
          <div className="st-empty">
            <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Tidak ada penugasan aktif</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>Semua penugasan telah diselesaikan</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(t => {
              const meta = prioritasMeta[t.prioritas]
              const isOpen = expanded === t.id
              return (
                <div key={t.id} className={`st-tugas-card ${t.prioritas}`}>
                  <div className="st-tugas-head" onClick={() => setExpanded(isOpen ? null : t.id)}>
                    <div style={{ flex: 1 }}>
                      <div className="st-tugas-id">{t.id} · {t.sumber}</div>
                      <div className="st-tugas-lokasi">{Icon.pin} {t.lokasi}</div>
                      <div className="st-tugas-sub">{t.subLokasi}</div>
                      <div className="st-tugas-badges">
                        <span className="st-pill" style={{ background: meta.bg, color: meta.color }}>
                          {Icon.warning} {meta.label}
                        </span>
                        <span className="st-pill" style={{ background: 'rgba(60,110,113,0.1)', color: T }}>
                          {t.jenis}
                        </span>
                        <span className="st-pill" style={{ background: 'rgba(40,75,99,0.08)', color: N }}>
                          {Icon.user} {t.jumlahAnak} anak
                        </span>
                      </div>
                    </div>
                    <div className="st-tugas-meta">
                      <span className="st-tugas-time">{Icon.clock} {t.waktu}</span>
                      <span style={{
                        fontSize: 10, color: isOpen ? T : MUTED,
                        fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                        {isOpen ? 'Tutup' : 'Detail'} {Icon.arrow}
                      </span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="st-tugas-body">
                      <div className="st-tugas-desc">{t.deskripsi}</div>
                      <div className="st-instruksi">
                        <div className="st-instruksi-label">📋 Instruksi dari DP3A</div>
                        <div className="st-instruksi-text">{t.instruksi}</div>
                      </div>
                      <div className="st-detail-row">
                        <div className="st-detail-item">{Icon.user} Ditugaskan oleh: <strong>{t.ditugaskanOleh}</strong></div>
                        <div className="st-detail-item">{Icon.phone} Kontak: <strong>{t.kontak}</strong></div>
                      </div>
                      <div className="st-tugas-actions">
                        <button className="st-btn-primary" onClick={() => handleMulai(t)}>
                          {Icon.input} Mulai & Input Hasil
                        </button>
                        <button className="st-btn-outline">
                          {Icon.phone} Hubungi DP3A
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

      </div>
    </>
  )
}