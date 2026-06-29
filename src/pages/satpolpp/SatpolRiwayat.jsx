import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
  clock:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  pin:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  check:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  user:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  arrow:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  search:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  doc:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  shield:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  chart:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
}

const RIWAYAT = [
  {
    id: 'TGS-000', laporanId: 'LP-2024-139',
    lokasi: 'Jl. Boulevard', subLokasi: 'Depan BCA Tower',
    deskripsi: '3 anak berhasil dipulangkan ke keluarga.',
    jenis: 'Mengamen',
    jumlahAnak: 3,
    status: 'berhasil',
    tanggal: '28 Jun 2024',
    waktuTiba: '15:10',
    waktuSelesai: '16:45',
    durasi: '1j 35m',
    catatan: 'Anak kooperatif dan mau dipulangkan. Orang tua dihubungi via telepon dan datang menjemput dalam 30 menit.',
    tindakan: 'Dipulangkan ke keluarga',
  },
  {
    id: 'TGS-098', laporanId: 'LP-2024-138',
    lokasi: 'Kawasan Wenang', subLokasi: 'Depan Kantor Walikota',
    deskripsi: '2 anak mengemis. Diserahkan ke Dinas Sosial untuk pendampingan.',
    jenis: 'Mengemis',
    jumlahAnak: 2,
    status: 'dirujuk',
    tanggal: '27 Jun 2024',
    waktuTiba: '09:30',
    waktuSelesai: '11:00',
    durasi: '1j 30m',
    catatan: 'Anak tidak bisa menyebutkan alamat orang tua. Diserahkan ke Dinsos untuk pendataan dan perlindungan lebih lanjut.',
    tindakan: 'Diserahkan ke Dinas Sosial',
  },
  {
    id: 'TGS-097', laporanId: 'LP-2024-137',
    lokasi: 'Pasar Bersehati', subLokasi: 'Pintu masuk timur',
    deskripsi: 'Laporan tidak terverifikasi. Lokasi kosong saat petugas tiba.',
    jenis: 'Berjualan',
    jumlahAnak: 0,
    status: 'tidak_ditemukan',
    tanggal: '26 Jun 2024',
    waktuTiba: '11:00',
    waktuSelesai: '11:30',
    durasi: '30m',
    catatan: 'Saat tiba di lokasi, tidak ada anak yang ditemukan. Kemungkinan sudah pindah atau laporan tidak akurat.',
    tindakan: 'Tidak ada tindakan',
  },
  {
    id: 'TGS-096', laporanId: 'LP-2024-136',
    lokasi: 'Kawasan Megamas', subLokasi: 'Parkir timur',
    deskripsi: '1 anak berjualan kantong plastik. Dipulangkan ke keluarga.',
    jenis: 'Berjualan',
    jumlahAnak: 1,
    status: 'berhasil',
    tanggal: '25 Jun 2024',
    waktuTiba: '13:45',
    waktuSelesai: '14:30',
    durasi: '45m',
    catatan: 'Anak berusia sekitar 10 tahun. Mengaku disuruh orang tua. Petugas menginformasikan program beasiswa ke keluarga.',
    tindakan: 'Dipulangkan dan edukasi keluarga',
  },
]

const STATUS_META = {
  berhasil:        { label: 'Berhasil',         color: GREEN, bg: 'rgba(30,126,74,0.1)' },
  dirujuk:         { label: 'Dirujuk Dinsos',   color: T,     bg: 'rgba(60,110,113,0.1)' },
  tidak_ditemukan: { label: 'Tidak Ditemukan',  color: MUTED, bg: 'rgba(107,124,141,0.1)' },
  butuh_tindak:    { label: 'Tindak Lanjut',    color: AMBER, bg: 'rgba(212,130,10,0.1)' },
}

export default function SatpolRiwayat() {
  const navigate = useNavigate()
  const [filter,   setFilter]   = useState('semua')
  const [search,   setSearch]   = useState('')
  const [expanded, setExpanded] = useState(null)

  const filtered = RIWAYAT.filter(r => {
    if (filter !== 'semua' && r.status !== filter) return false
    if (search && !r.lokasi.toLowerCase().includes(search.toLowerCase()) &&
        !r.id.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalAnak    = RIWAYAT.reduce((a, r) => a + r.jumlahAnak, 0)
  const totalBerhasil = RIWAYAT.filter(r => r.status === 'berhasil').length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sr-root * { box-sizing: border-box; }
        .sr-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: ${BG}; color: ${TEXT};
          flex: 1; overflow-y: auto;
          padding: 28px 32px 60px;
          display: flex; flex-direction: column; gap: 24px;
        }

        /* BANNER */
        .sr-banner {
          background: ${N}; border-radius: 18px;
          padding: 28px 36px; display: flex;
          align-items: center; justify-content: space-between; gap: 24px;
          position: relative; overflow: hidden;
        }
        .sr-banner::before {
          content: ''; position: absolute; right: -80px; top: -80px;
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(60,110,113,0.3) 0%, transparent 65%);
          pointer-events: none;
        }
        .sr-banner-eyebrow { font-size: 11px; color: rgba(191,219,247,0.5); margin-bottom: 8px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
        .sr-banner-title { font-size: clamp(22px,3vw,28px); font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 8px; letter-spacing: -0.02em; }
        .sr-banner-title span { color: #BFDBF7; }
        .sr-banner-sub { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.6; }
        .sr-banner-sub strong { color: #fff; font-weight: 700; }
        .sr-banner-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; flex-shrink: 0; position: relative; z-index: 1; }
        .sr-stat-box {
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px; padding: 14px 18px; text-align: center;
        }
        .sr-stat-num   { font-size: 28px; font-weight: 800; color: #fff; line-height: 1; letter-spacing: -0.03em; }
        .sr-stat-label { font-size: 10px; color: rgba(191,219,247,0.6); font-weight: 600; margin-top: 4px; }

        /* KPI ROW */
        .sr-kpi-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        .sr-kpi-card {
          background: rgba(255,255,255,0.55); backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.7); border-radius: 14px;
          padding: 18px 20px; position: relative; overflow: hidden;
        }
        .sr-kpi-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0;
          height: 3px; background: var(--ac,${T}); border-radius: 14px 14px 0 0;
        }
        .sr-kpi-icon { width: 36px; height: 36px; border-radius: 9px; background: var(--ib,rgba(60,110,113,0.1)); border: 1px solid var(--ib,rgba(60,110,113,0.2)); display: flex; align-items: center; justify-content: center; color: var(--ac,${T}); margin-bottom: 12px; }
        .sr-kpi-num   { font-size: 28px; font-weight: 800; color: var(--ac,${T}); line-height: 1; margin-bottom: 4px; letter-spacing: -0.02em; }
        .sr-kpi-label { font-size: 11px; color: ${MUTED}; font-weight: 500; }

        /* TOOLBAR */
        .sr-toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .sr-filter-pill {
          padding: 7px 16px; border-radius: 999px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s;
          background: rgba(255,255,255,0.7); color: ${MUTED}; border: 1.5px solid ${BORDER};
        }
        .sr-filter-pill:hover { border-color: ${T}; color: ${T}; }
        .sr-filter-pill.active { background: ${N}; color: #fff; border-color: ${N}; }
        .sr-search-wrap { position: relative; margin-left: auto; }
        .sr-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: ${MUTED}; display: flex; }
        .sr-search {
          padding: 8px 14px 8px 32px; border-radius: 9px;
          border: 1px solid ${BORDER}; background: ${CARD};
          color: ${TEXT}; font-size: 12px; outline: none; width: 200px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sr-search:focus { border-color: ${T}; }

        /* RIWAYAT CARD */
        .sr-card { background: ${CARD}; border: 1px solid ${BORDER}; border-radius: 14px; overflow: hidden; }
        .sr-item {
          padding: 16px 20px; border-bottom: 1px solid ${BORDER};
          cursor: pointer; transition: background 0.12s;
        }
        .sr-item:last-child { border-bottom: none; }
        .sr-item:hover { background: #F8FAFC; }
        .sr-item-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
        .sr-item-id   { font-size: 10px; color: ${MUTED}; font-family: monospace; margin-bottom: 3px; }
        .sr-item-lokasi { font-size: 13px; font-weight: 700; color: ${N}; display: flex; align-items: center; gap: 5px; }
        .sr-item-sub    { font-size: 11px; color: ${MUTED}; margin-top: 1px; }
        .sr-item-right  { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
        .sr-item-date   { font-size: 11px; color: #9BAAB5; white-space: nowrap; }
        .sr-item-desc   { font-size: 12px; color: ${MUTED}; line-height: 1.6; margin-bottom: 8px; }
        .sr-item-footer { display: flex; align-items: center; gap: 10px; }
        .sr-pill { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 4px; }
        .sr-meta  { font-size: 10px; color: #9BAAB5; display: flex; align-items: center; gap: 4px; }

        /* EXPANDED */
        .sr-detail {
          background: #F8FAFC; border-top: 1px solid ${BORDER};
          padding: 14px 20px; display: flex; flex-direction: column; gap: 10px;
        }
        .sr-detail-row { display: flex; gap: 20px; flex-wrap: wrap; }
        .sr-detail-item { font-size: 11px; color: ${MUTED}; display: flex; align-items: center; gap: 5px; }
        .sr-detail-item strong { color: ${TEXT}; font-weight: 700; }
        .sr-detail-catatan {
          background: ${CARD}; border: 1px solid ${BORDER}; border-radius: 9px;
          padding: 12px 14px; font-size: 12px; color: ${TEXT}; line-height: 1.7;
        }
        .sr-detail-label { font-size: 10px; font-weight: 700; color: ${N}; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px; }

        /* EMPTY */
        .sr-empty { padding: 60px 20px; text-align: center; color: ${MUTED}; }

        @media (max-width: 1100px) { .sr-kpi-row { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 768px) {
          .sr-root { padding: 20px 16px 60px; }
          .sr-banner { flex-direction: column; }
          .sr-banner-stats { width: 100%; }
          .sr-search-wrap { margin-left: 0; width: 100%; }
          .sr-search { width: 100%; }
        }
      `}</style>

      <div className="sr-root">

        {/* BANNER */}
        <div className="sr-banner">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="sr-banner-eyebrow">Rekam Jejak Penugasan</div>
            <div className="sr-banner-title">
              Riwayat <span>Penanganan Lapangan</span>
            </div>
            <div className="sr-banner-sub">
              Total <strong>{RIWAYAT.length} penugasan</strong> telah selesai.{' '}
              <strong>{totalAnak} anak</strong> berhasil didata dan ditangani.
            </div>
          </div>
          <div className="sr-banner-stats">
            {[
              { num: RIWAYAT.length,  label: 'Total Selesai' },
              { num: totalBerhasil,   label: 'Berhasil' },
              { num: totalAnak,       label: 'Anak Ditangani' },
              { num: `${Math.round((totalBerhasil/RIWAYAT.length)*100)}%`, label: 'Tingkat Berhasil' },
            ].map((s, i) => (
              <div key={i} className="sr-stat-box">
                <div className="sr-stat-num">{s.num}</div>
                <div className="sr-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* KPI */}
        <div className="sr-kpi-row">
          {[
            { icon: Icon.shield, num: RIWAYAT.length,   label: 'Total Penugasan',   ac: T,     ib: 'rgba(60,110,113,0.1)' },
            { icon: Icon.check,  num: totalBerhasil,     label: 'Berhasil',          ac: GREEN, ib: 'rgba(30,126,74,0.1)' },
            { icon: Icon.user,   num: totalAnak,         label: 'Anak Ditangani',    ac: N,     ib: 'rgba(40,75,99,0.1)' },
            { icon: Icon.chart,  num: `${Math.round((totalBerhasil/RIWAYAT.length)*100)}%`, label: 'Tingkat Keberhasilan', ac: T, ib: 'rgba(60,110,113,0.1)' },
          ].map((k, i) => (
            <div key={i} className="sr-kpi-card" style={{ '--ac': k.ac, '--ib': k.ib }}>
              <div className="sr-kpi-icon">{k.icon}</div>
              <div className="sr-kpi-num">{k.num}</div>
              <div className="sr-kpi-label">{k.label}</div>
            </div>
          ))}
        </div>

        {/* TOOLBAR */}
        <div className="sr-toolbar">
          {[
            { key: 'semua',          label: `Semua (${RIWAYAT.length})` },
            { key: 'berhasil',       label: `Berhasil (${RIWAYAT.filter(r=>r.status==='berhasil').length})` },
            { key: 'dirujuk',        label: 'Dirujuk Dinsos' },
            { key: 'tidak_ditemukan',label: 'Tidak Ditemukan' },
          ].map(f => (
            <button
              key={f.key}
              className={`sr-filter-pill${filter === f.key ? ' active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
          <div className="sr-search-wrap">
            <span className="sr-search-icon">{Icon.search}</span>
            <input
              className="sr-search" placeholder="Cari lokasi, ID..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* LIST */}
        <div className="sr-card">
          {filtered.length === 0 ? (
            <div className="sr-empty">
              <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Tidak ada riwayat ditemukan</div>
            </div>
          ) : filtered.map(r => {
            const meta  = STATUS_META[r.status] ?? { label: r.status, color: MUTED, bg: '#eee' }
            const isOpen = expanded === r.id
            return (
              <div key={r.id}>
                <div className="sr-item" onClick={() => setExpanded(isOpen ? null : r.id)}>
                  <div className="sr-item-head">
                    <div>
                      <div className="sr-item-id">{r.id}</div>
                      <div className="sr-item-lokasi">{Icon.pin} {r.lokasi}</div>
                      <div className="sr-item-sub">{r.subLokasi}</div>
                    </div>
                    <div className="sr-item-right">
                      <span className="sr-item-date">{r.tanggal}</span>
                      <span className="sr-pill" style={{ background: meta.bg, color: meta.color }}>
                        {r.status === 'berhasil' && Icon.check} {meta.label}
                      </span>
                    </div>
                  </div>
                  <div className="sr-item-desc">{r.deskripsi}</div>
                  <div className="sr-item-footer">
                    <span className="sr-pill" style={{ background: 'rgba(60,110,113,0.1)', color: T }}>{r.jenis}</span>
                    {r.jumlahAnak > 0 && (
                      <span className="sr-meta">{Icon.user} {r.jumlahAnak} anak</span>
                    )}
                    <span className="sr-meta">{Icon.clock} {r.durasi}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: isOpen ? T : MUTED, fontWeight: 600 }}>
                      {isOpen ? 'Tutup' : 'Detail'} {Icon.arrow}
                    </span>
                  </div>
                </div>
                {isOpen && (
                  <div className="sr-detail">
                    <div className="sr-detail-row">
                      <div className="sr-detail-item">{Icon.clock} Tiba: <strong>{r.waktuTiba}</strong></div>
                      <div className="sr-detail-item">{Icon.clock} Selesai: <strong>{r.waktuSelesai}</strong></div>
                      <div className="sr-detail-item">{Icon.doc} Tindakan: <strong>{r.tindakan}</strong></div>
                    </div>
                    <div>
                      <div className="sr-detail-label">Catatan Lapangan</div>
                      <div className="sr-detail-catatan">{r.catatan}</div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </>
  )
}