import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { useState, useEffect } from 'react'

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

const I = {
  shield:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  tugas:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  input:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  riwayat: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  pin:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  warning: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  check:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  arrow:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  clock:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  user:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
}

// Data dummy penugasan aktif (nanti diganti dari store)
const TUGAS_DUMMY = [
  { id:'TGS-001', lokasi:'Kawasan Megamas', deskripsi:'2 anak terdeteksi berjualan tisu di area parkir.', prioritas:'tinggi', waktu:'14 mnt lalu', status:'aktif' },
  { id:'TGS-002', lokasi:'Pasar 45',        deskripsi:'1 anak mengamen di area parkir selatan.',         prioritas:'sedang', waktu:'1 jam lalu',  status:'aktif' },
  { id:'TGS-003', lokasi:'Matos',           deskripsi:'Anak berpakaian figuran karakter di depan mall.', prioritas:'sedang', waktu:'5 jam lalu',  status:'aktif' },
]

const RIWAYAT_DUMMY = [
  { id:'TGS-000', lokasi:'Jl. Boulevard', deskripsi:'3 anak dipulangkan ke keluarga.', waktu:'Kemarin, 15:30', selesai: true },
  { id:'TGS-099', lokasi:'Kawasan Wenang', deskripsi:'2 anak mengemis berhasil ditangani.', waktu:'2 hari lalu', selesai: true },
]

export default function SatpolBeranda() {
  const navigate = useNavigate()
  const user     = useStore(s => s.user)
  const [clock, setClock] = useState({ date: '', time: '' })

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock({
        date: now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      })
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const tugasAktif  = TUGAS_DUMMY.filter(t => t.status === 'aktif').length
  const tugasTinggi = TUGAS_DUMMY.filter(t => t.prioritas === 'tinggi').length
  const selesaiHari = RIWAYAT_DUMMY.filter(r => r.waktu.includes('Kemarin') || r.selesai).length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sb-root * { box-sizing: border-box; }
        .sb-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: ${BG};
          color: ${TEXT};
          flex: 1; overflow-y: auto;
          padding: 36px 36px 60px;
          display: flex; flex-direction: column; gap: 28px;
        }

        /* HERO */
        .sb-hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; }
        .sb-hero-eyebrow { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: ${T}; margin-bottom: 10px; }
        .sb-hero-title { font-size: clamp(22px,2.5vw,30px); font-weight: 800; color: ${N}; line-height: 1.2; letter-spacing: -0.02em; margin: 0 0 6px; }
        .sb-hero-sub { font-size: 13px; color: ${MUTED}; line-height: 1.7; max-width: 520px; margin: 0 0 20px; }
        .sb-hero-actions { display: flex; gap: 10px; flex-wrap: wrap; }

        .sb-btn-primary {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 20px; background: ${N}; color: #fff;
          border: none; border-radius: 9px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: background 0.18s, transform 0.12s;
        }
        .sb-btn-primary:hover { background: ${T}; transform: translateY(-1px); }
        .sb-btn-glass {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 20px;
          background: rgba(255,255,255,0.65); backdrop-filter: blur(12px);
          color: ${N}; border: 1px solid rgba(255,255,255,0.8); border-radius: 9px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; box-shadow: 0 2px 12px rgba(40,75,99,0.08);
          transition: all 0.18s;
        }
        .sb-btn-glass:hover { background: rgba(255,255,255,0.88); transform: translateY(-1px); }

        /* CLOCK */
        .sb-clock-box {
          background: rgba(255,255,255,0.50); backdrop-filter: blur(30px);
          border: 1px solid rgba(255,255,255,0.45);
          box-shadow: 0 8px 30px rgba(40,75,99,0.08);
          border-radius: 16px; padding: 22px 24px;
          width: 240px; flex-shrink: 0;
          display: flex; flex-direction: column; align-items: flex-end; gap: 6px;
        }
        .sb-clock-wita { font-size: 10px; font-weight: 700; color: ${T}; letter-spacing: 0.08em; }
        .sb-clock-time { font-size: 46px; font-weight: 800; color: ${N}; letter-spacing: -0.04em; }
        .sb-clock-date { color: ${MUTED}; font-size: 12px; }

        /* STATS */
        .sb-stats-section { background: ${CARD}; border: 1px solid ${BORDER}; border-radius: 16px; overflow: hidden; }
        .sb-stats-row { display: flex; }
        .sb-stat-item { flex: 1; padding: 36px 28px 28px; border-right: 1px solid ${BORDER}; }
        .sb-stat-item:last-child { border-right: none; }
        .sb-stat-num { font-size: clamp(48px,5vw,64px); font-weight: 800; line-height: 1; margin-bottom: 10px; letter-spacing: -0.03em; }
        .sb-stat-label { font-size: 13px; font-weight: 500; color: ${MUTED}; margin-bottom: 20px; }
        .sb-stat-bar { height: 3px; border-radius: 2px; background: ${BORDER}; overflow: hidden; }
        .sb-stat-bar-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }

        /* CARD */
        .sb-card { background: ${CARD}; border: 1px solid ${BORDER}; border-radius: 14px; overflow: hidden; }
        .sb-card-head { padding: 14px 20px; border-bottom: 1px solid ${BORDER}; display: flex; align-items: center; justify-content: space-between; }
        .sb-card-title { font-size: 13px; font-weight: 700; color: ${N}; display: flex; align-items: center; gap: 8px; }
        .sb-card-link {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; color: ${T}; font-weight: 600;
          background: none; border: none; padding: 0; cursor: pointer; font-family: inherit;
          transition: color 0.15s;
        }
        .sb-card-link:hover { color: ${N}; }

        /* MAIN GRID */
        .sb-main-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }

        /* TUGAS ITEM */
        .sb-tugas-item {
          padding: 14px 20px; border-bottom: 1px solid ${BORDER};
          display: flex; gap: 12px; align-items: flex-start;
          cursor: pointer; transition: background 0.12s;
        }
        .sb-tugas-item:last-child { border-bottom: none; }
        .sb-tugas-item:hover { background: #F8FAFC; }
        .sb-tugas-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
        .sb-tugas-title { font-size: 12px; font-weight: 700; color: ${TEXT}; margin-bottom: 3px; display: flex; align-items: center; gap: 6px; }
        .sb-tugas-desc  { font-size: 11px; color: ${MUTED}; line-height: 1.6; }
        .sb-tugas-meta  { font-size: 10px; color: #9BAAB5; flex-shrink: 0; padding-top: 2px; white-space: nowrap; }
        .sb-pill { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; display: inline-flex; align-items: center; gap: 4px; }

        /* QUICK ACCESS */
        .sb-qa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 14px; }
        .sb-qa-item {
          padding: 12px 10px; border-radius: 10px;
          border: 1px solid ${BORDER}; background: #F8FAFC;
          cursor: pointer; text-align: center; transition: all 0.18s;
        }
        .sb-qa-item:hover { border-color: ${T}; background: rgba(60,110,113,0.05); }
        .sb-qa-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: rgba(40,75,99,0.08); border: 1px solid rgba(40,75,99,0.12);
          display: flex; align-items: center; justify-content: center;
          color: ${N}; margin: 0 auto 8px;
        }
        .sb-qa-label { font-size: 11px; font-weight: 600; color: ${TEXT}; }

        /* RIWAYAT */
        .sb-riwayat-item {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 20px; border-bottom: 1px solid ${BORDER};
        }
        .sb-riwayat-item:last-child { border-bottom: none; }
        .sb-riwayat-name { flex: 1; font-size: 12px; font-weight: 700; color: ${TEXT}; }
        .sb-riwayat-sub  { font-size: 10px; color: ${MUTED}; }

        @media (max-width: 1100px) {
          .sb-main-grid { grid-template-columns: 1fr; }
          .sb-hero { flex-direction: column; }
          .sb-clock-box { width: 100%; align-items: flex-start; }
          .sb-root { padding: 20px 20px 60px; }
        }
        @media (max-width: 700px) {
          .sb-stats-row { flex-direction: column; }
          .sb-stat-item { border-right: none; border-bottom: 1px solid ${BORDER}; }
          .sb-stat-item:last-child { border-bottom: none; }
        }
      `}</style>

      <div className="sb-root">

        {/* HERO */}
        <div className="sb-hero">
          <div>
            <div className="sb-hero-eyebrow">Selamat bertugas, Petugas Satpol PP</div>
            <h1 className="sb-hero-title">
              Dashboard Delcion:<br/>
              Penugasan &amp; Penanganan<br/>
              Pekerja Anak Kota Manado
            </h1>
            <p className="sb-hero-sub">
              Terdapat <strong>{tugasAktif} penugasan aktif</strong> yang perlu ditangani hari ini.{' '}
              {tugasTinggi > 0 && <><strong>{tugasTinggi} prioritas tinggi</strong> membutuhkan respons segera.</>}
            </p>
            <div className="sb-hero-actions">
              <button className="sb-btn-primary" onClick={() => navigate('/satpolpp/tugas')}>
                {I.tugas} Lihat Penugasan
                {tugasAktif > 0 && (
                  <span style={{ background: 'rgba(191,219,247,0.25)', borderRadius: '99px', fontSize: 10, fontWeight: 800, padding: '1px 7px' }}>
                    {tugasAktif}
                  </span>
                )}
              </button>
              <button className="sb-btn-glass" onClick={() => navigate('/satpolpp/input')}>
                {I.input} Input Lapangan
              </button>
            </div>
          </div>
          <div className="sb-clock-box">
            <div className="sb-clock-wita">WITA</div>
            <div className="sb-clock-time">{clock.time}</div>
            <div className="sb-clock-date">{clock.date}</div>
          </div>
        </div>

        {/* STATISTIK */}
        <div className="sb-stats-section">
          <div className="sb-stats-row">
            {[
              { num: tugasAktif,  label: 'Penugasan Aktif',      color: N,     fill: 100 },
              { num: tugasTinggi, label: 'Prioritas Tinggi',      color: RED,   fill: tugasAktif ? (tugasTinggi/tugasAktif)*100 : 0 },
              { num: selesaiHari, label: 'Selesai Hari Ini',      color: GREEN, fill: tugasAktif ? (selesaiHari/(tugasAktif+selesaiHari))*100 : 0 },
              { num: `${tugasAktif + selesaiHari}`, label: 'Total Ditugaskan', color: T, fill: 80 },
            ].map((s, i) => (
              <div key={i} className="sb-stat-item">
                <div className="sb-stat-num" style={{ color: s.color }}>{s.num}</div>
                <div className="sb-stat-label">{s.label}</div>
                <div className="sb-stat-bar">
                  <div className="sb-stat-bar-fill" style={{ width: `${s.fill}%`, background: s.color, opacity: 0.5 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="sb-main-grid">

          {/* Penugasan Aktif */}
          <div className="sb-card">
            <div className="sb-card-head">
              <div className="sb-card-title" style={{ color: RED }}>{I.warning} Penugasan Aktif</div>
              <button className="sb-card-link" onClick={() => navigate('/satpolpp/tugas')}>
                Lihat semua {I.arrow}
              </button>
            </div>
            {TUGAS_DUMMY.map(t => (
              <div key={t.id} className="sb-tugas-item" onClick={() => navigate('/satpolpp/tugas')}>
                <div className="sb-tugas-dot" style={{ background: t.prioritas === 'tinggi' ? RED : AMBER }} />
                <div style={{ flex: 1 }}>
                  <div className="sb-tugas-title">
                    {I.pin} {t.lokasi}
                    <span className="sb-pill" style={{
                      background: t.prioritas === 'tinggi' ? 'rgba(192,57,43,0.1)' : 'rgba(212,130,10,0.1)',
                      color: t.prioritas === 'tinggi' ? RED : AMBER,
                    }}>
                      {t.prioritas === 'tinggi' ? 'Tinggi' : 'Sedang'}
                    </span>
                  </div>
                  <div className="sb-tugas-desc">{t.deskripsi}</div>
                </div>
                <div className="sb-tugas-meta">{t.waktu}</div>
              </div>
            ))}
          </div>

          {/* Kolom kanan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Akses Cepat */}
            <div className="sb-card">
              <div className="sb-card-head">
                <div className="sb-card-title">Akses Cepat</div>
              </div>
              <div className="sb-qa-grid">
                {[
                  { icon: I.tugas,   label: 'Penugasan',    href: '/satpolpp/tugas' },
                  { icon: I.input,   label: 'Input Hasil',  href: '/satpolpp/input' },
                  { icon: I.riwayat, label: 'Riwayat',      href: '/satpolpp/riwayat' },
                  { icon: I.shield,  label: 'Profil Tugas', href: '/satpolpp/riwayat' },
                ].map(q => (
                  <div key={q.label} className="sb-qa-item" onClick={() => navigate(q.href)}>
                    <div className="sb-qa-icon">{q.icon}</div>
                    <div className="sb-qa-label">{q.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Riwayat Terakhir */}
            <div className="sb-card">
              <div className="sb-card-head">
                <div className="sb-card-title">{I.check} Terakhir Selesai</div>
                <button className="sb-card-link" onClick={() => navigate('/satpolpp/riwayat')}>
                  Semua {I.arrow}
                </button>
              </div>
              {RIWAYAT_DUMMY.map(r => (
                <div key={r.id} className="sb-riwayat-item">
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="sb-riwayat-name">{r.lokasi}</div>
                    <div className="sb-riwayat-sub">{r.waktu}</div>
                  </div>
                  <span className="sb-pill" style={{ background: 'rgba(30,126,74,0.1)', color: GREEN }}>
                    {I.check} Selesai
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </>
  )
}