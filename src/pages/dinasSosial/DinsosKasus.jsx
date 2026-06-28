import { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import {
  N, T, TEXT, MUTED, BORDER, BG, RED, AMBER, GREEN,
  KASUS_DATA, Icon, SHARED_STYLES,
} from './dinsoConstants'

export default function DinsosKasus() {
  const showToast = useStore(s => s.showToast)
  const [clock, setClock]         = useState('')
  const [filter, setFilter]       = useState('semua')
  const [kasusDetail, setKasusDetail] = useState(null)
  const [refreshing, setRefreshing]   = useState(false)
  // State lokal kasus agar progres bisa ditambah tanpa backend
  const [kasusLocal, setKasusLocal]   = useState(KASUS_DATA)

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const totalSelesai = kasusLocal.filter(k => k.status === 'selesai').length
  const totalProses  = kasusLocal.filter(k => k.status === 'proses').length
  const tingkat      = Math.round((totalSelesai / kasusLocal.length) * 100)

  const filtered = filter === 'semua'
    ? kasusLocal
    : kasusLocal.filter(k => k.status === filter)

  const handleAddProgres = (kasusId, aksi) => {
    const entry = {
      tgl:  new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      aksi,
      aktor: 'Dinas Sosial',
    }
    setKasusLocal(prev => prev.map(k =>
      k.id === kasusId ? { ...k, progres: [...k.progres, entry] } : k
    ))
    // Refresh detail panel
    setKasusDetail(prev => prev
      ? { ...prev, progres: [...prev.progres, entry] }
      : prev
    )
    showToast('Progres baru berhasil disimpan')
  }

  const handleTandaiSelesai = (kasusId) => {
    setKasusLocal(prev => prev.map(k =>
      k.id === kasusId ? { ...k, status: 'selesai' } : k
    ))
    setKasusDetail(prev => prev ? { ...prev, status: 'selesai' } : prev)
    showToast('Kasus ditandai selesai')
  }

  return (
    <>
      <style>{`
        ${SHARED_STYLES}

        /* ── Filter ── */
        .kasus-filter-group {
          display: flex; gap: 6px; padding: 14px 20px;
          border-bottom: 1px solid ${BORDER};
        }
        .kasus-filter-btn {
          padding: 6px 14px; border-radius: 999px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 600;
          cursor: pointer; transition: all 0.15s;
          border: 1.5px solid ${BORDER}; background: transparent; color: ${MUTED};
        }
        .kasus-filter-btn:hover { border-color: ${T}; color: ${T}; }
        .kasus-filter-btn.active { background: ${N}; color: #fff; border-color: ${N}; }

        /* ── List item ── */
        .kasus-item {
          padding: 14px 20px; border-bottom: 1px solid ${BORDER};
          display: flex; align-items: center; gap: 14px;
          cursor: pointer; transition: background 0.15s;
        }
        .kasus-item:last-child { border-bottom: none; }
        .kasus-item:hover { background: #F8FAFC; }
        .kasus-id {
          font-size: 10px; font-weight: 700; color: ${MUTED};
          font-family: 'Inter', monospace; flex-shrink: 0; min-width: 54px;
        }
        .kasus-nama {
          font-size: 12px; font-weight: 700; color: ${TEXT};
          font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 3px;
        }
        .kasus-meta { font-size: 11px; color: ${MUTED}; display: flex; flex-wrap: wrap; gap: 10px; }
        .kasus-arrow { margin-left: auto; color: ${MUTED}; flex-shrink: 0; transition: transform 0.15s; }
        .kasus-item:hover .kasus-arrow { transform: translateX(3px); }

        /* ── Detail Panel ── */
        .detail-overlay {
          position: fixed; inset: 0; background: rgba(2,43,58,0.4);
          z-index: 200; display: flex; justify-content: flex-end;
          animation: ds-fadein 0.2s ease;
        }
        .detail-panel {
          width: 440px; max-width: 100%; background: #fff;
          display: flex; flex-direction: column;
          animation: ds-slidein 0.25s ease; overflow-y: auto;
        }
        .detail-head {
          padding: 22px; background: ${N}; color: #fff;
          display: flex; align-items: flex-start; justify-content: space-between;
          flex-shrink: 0;
        }
        .detail-id { font-size: 10px; color: rgba(191,219,247,0.5); font-family: 'Inter',monospace; margin-bottom: 6px; }
        .detail-nama { font-family: 'Plus Jakarta Sans',sans-serif; font-size: 17px; font-weight: 800; margin-bottom: 4px; }
        .detail-lokasi { font-size: 12px; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 5px; }
        .detail-close {
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
          color: #fff; border-radius: 8px; padding: 6px 13px; font-size: 12px;
          font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans',sans-serif;
          flex-shrink: 0; margin-top: 2px; transition: background 0.15s;
        }
        .detail-close:hover { background: rgba(255,255,255,0.2); }
        .detail-body { padding: 20px 22px; flex: 1; }

        /* ── Timeline ── */
        .timeline { display: flex; flex-direction: column; gap: 0; margin-top: 14px; }
        .timeline-item { display: flex; gap: 14px; position: relative; }
        .timeline-item:not(:last-child)::before {
          content: ''; position: absolute; left: 13px; top: 26px; bottom: 0;
          width: 1.5px; background: ${BORDER};
        }
        .timeline-dot {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(60,110,113,0.1); border: 2px solid ${T};
          display: flex; align-items: center; justify-content: center;
          color: ${T}; flex-shrink: 0; margin-top: 2px; z-index: 1;
        }
        .timeline-dot.done { background: ${T}; color: #fff; }
        .timeline-content { padding-bottom: 16px; flex: 1; }
        .timeline-tgl { font-size: 10px; color: ${MUTED}; margin-bottom: 3px; font-family: 'Inter',monospace; }
        .timeline-aksi { font-size: 12px; color: ${TEXT}; line-height: 1.5; font-family: 'Plus Jakarta Sans',sans-serif; font-weight: 500; }
        .timeline-aktor { display: inline-block; margin-top: 4px; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 99px; }

        /* ── Add progres form ── */
        .add-progres {
          margin: 0 22px 22px; border: 1.5px dashed ${BORDER};
          border-radius: 12px; padding: 16px;
        }
        .add-progres-title {
          font-family: 'Plus Jakarta Sans',sans-serif; font-size: 12px;
          font-weight: 700; color: ${N}; margin-bottom: 10px;
        }
        .add-textarea {
          width: 100%; padding: 10px 12px; border: 1.5px solid ${BORDER};
          border-radius: 8px; font-size: 12px; font-family: 'Inter',sans-serif;
          color: ${TEXT}; resize: none; outline: none; line-height: 1.5;
          transition: border-color 0.15s;
        }
        .add-textarea:focus { border-color: ${T}; }
        .add-btn {
          margin-top: 8px; display: flex; align-items: center; gap: 6px;
          padding: 9px 18px; background: ${T}; color: #fff; border: none;
          border-radius: 8px; font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: 12px; font-weight: 700; cursor: pointer; transition: background 0.2s;
        }
        .add-btn:hover { background: #2f5759; }
        .selesai-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 18px; background: rgba(30,126,74,0.1); color: ${GREEN};
          border: 1.5px solid ${GREEN}; border-radius: 8px;
          font-family: 'Plus Jakarta Sans',sans-serif; font-size: 12px; font-weight: 700;
          cursor: pointer; transition: background 0.2s;
        }
        .selesai-btn:hover { background: rgba(30,126,74,0.18); }
      `}</style>

      <div className="ds-root">

        {/* ── BANNER ── */}
        <div className="ds-banner">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="ds-banner-eyebrow">Portal Dinas Sosial — Kota Manado</div>
            <div className="ds-banner-title">
              Tindak Lanjut<br/>
              <span>Manajemen Kasus</span>
            </div>
            <div className="ds-banner-sub">
              Pencatatan progres penanganan per kasus yang telah ditangani Satpol PP.
              Saat ini terdapat <strong>{totalProses} kasus aktif</strong> dan{' '}
              <strong>{totalSelesai} kasus selesai</strong>.
            </div>
            <div className="ds-banner-clock">{clock} WITA</div>
          </div>
          <div className="ds-banner-actions">
            <button className="ds-btn-teal">{Icon.kasus} Tambah Kasus Baru</button>
            <button className="ds-btn-ghost" onClick={() => {
              setRefreshing(true)
              setTimeout(() => { setRefreshing(false); showToast('Data kasus diperbarui') }, 1200)
            }}>
              <span style={{ display: 'inline-flex', animation: refreshing ? 'ds-spin 0.7s linear infinite' : 'none' }}>
                {Icon.refresh}
              </span>
              {refreshing ? 'Memperbarui...' : 'Perbarui Data'}
            </button>
          </div>
        </div>

        {/* ── KPI ── */}
        <div className="ds-kpi-grid">
          {[
            { icon: Icon.total, num: kasusLocal.length, label: 'Total Kasus',          delta: 'Semua kasus terverifikasi',          fill: 100    },
            { icon: Icon.kasus, num: totalProses,        label: 'Kasus Aktif (Proses)', delta: 'Membutuhkan tindak lanjut segera',   fill: totalProses / kasusLocal.length * 100 },
            { icon: Icon.check, num: totalSelesai,       label: 'Kasus Selesai',        delta: 'Berhasil dikembalikan ke keluarga',  fill: tingkat },
            { icon: Icon.chart, num: `${tingkat}%`,      label: 'Tingkat Penanganan',   delta: 'Target 85% — On track',             fill: tingkat },
          ].map((k, i) => (
            <div key={i} className="ds-kpi-card">
              <div className="ds-kpi-icon-wrap">{k.icon}</div>
              <div className="ds-kpi-num">{k.num}</div>
              <div className="ds-kpi-label">{k.label}</div>
              <div className="ds-kpi-delta">{k.delta}</div>
              <div className="ds-kpi-bar">
                <div className="ds-kpi-bar-fill" style={{ width: `${k.fill}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── LIST KASUS ── */}
        <div className="ds-card">
          <div className="ds-card-head">
            <div className="ds-card-title">{Icon.kasus} Daftar Kasus</div>
            <span style={{ fontSize: 11, color: MUTED }}>{filtered.length} kasus ditampilkan</span>
          </div>

          {/* Filter */}
          <div className="kasus-filter-group">
            {[
              { key: 'semua',   label: `Semua (${kasusLocal.length})` },
              { key: 'proses',  label: `Aktif (${totalProses})`       },
              { key: 'selesai', label: `Selesai (${totalSelesai})`    },
            ].map(f => (
              <button
                key={f.key}
                className={`kasus-filter-btn${filter === f.key ? ' active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.map(k => (
            <div key={k.id} className="kasus-item" onClick={() => setKasusDetail(k)}>
              <span className="kasus-id">{k.id}</span>
              <div style={{ flex: 1 }}>
                <div className="kasus-nama">{k.nama}</div>
                <div className="kasus-meta">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    {Icon.pin} {k.lokasi}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    {Icon.clock} {k.tanggal}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    {Icon.user} {k.petugas}
                  </span>
                </div>
              </div>
              <span className="ds-pill" style={{
                background: k.status === 'selesai' ? 'rgba(30,126,74,0.1)' : 'rgba(212,130,10,0.1)',
                color:      k.status === 'selesai' ? GREEN : AMBER,
              }}>
                {k.status === 'selesai' ? Icon.check : Icon.clock}
                {k.status === 'selesai' ? 'Selesai' : 'Proses'}
              </span>
              <span style={{ fontSize: 11, color: MUTED, marginLeft: 4, flexShrink: 0 }}>
                {k.progres.length} langkah
              </span>
              <div className="kasus-arrow">{Icon.arrow}</div>
            </div>
          ))}
        </div>

      </div>

      {/* ── DETAIL PANEL ── */}
      {kasusDetail && (
        <KasusDetail
          kasus={kasusDetail}
          onClose={() => setKasusDetail(null)}
          onAddProgres={(aksi) => handleAddProgres(kasusDetail.id, aksi)}
          onTandaiSelesai={() => handleTandaiSelesai(kasusDetail.id)}
        />
      )}
    </>
  )
}

/* ── Detail Side Panel ─────────────────────────────────────── */
function KasusDetail({ kasus, onClose, onAddProgres, onTandaiSelesai }) {
  const [newAksi, setNewAksi] = useState('')

  const AKTOR_COLOR = {
    'Satpol PP':    { bg: 'rgba(192,57,43,0.1)',  color: RED   },
    'Dinas Sosial': { bg: 'rgba(60,110,113,0.1)', color: T     },
    'AI CCTV':      { bg: 'rgba(212,130,10,0.1)', color: AMBER },
    'Warga':        { bg: 'rgba(30,126,74,0.1)',  color: GREEN },
  }

  const handleSubmit = () => {
    if (!newAksi.trim()) return
    onAddProgres(newAksi.trim())
    setNewAksi('')
  }

  return (
    <div className="detail-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="detail-panel">

        {/* Head */}
        <div className="detail-head">
          <div>
            <div className="detail-id">{kasus.id}</div>
            <div className="detail-nama">{kasus.nama}</div>
            <div className="detail-lokasi">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {kasus.lokasi}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>Tutup ✕</button>
        </div>

        {/* Info baris */}
        <div style={{ padding: '16px 22px 0' }}>
          {[
            { label: 'Tanggal masuk', val: kasus.tanggal  },
            { label: 'Petugas',       val: kasus.petugas  },
            { label: 'Status',        val: kasus.status === 'selesai' ? '✅ Selesai' : '🔄 Dalam proses' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${BORDER}`, fontSize: 12 }}>
              <span style={{ color: MUTED }}>{r.label}</span>
              <span style={{ fontWeight: 700, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{r.val}</span>
            </div>
          ))}

          {/* Tandai selesai */}
          {kasus.status !== 'selesai' && (
            <div style={{ paddingTop: 12, paddingBottom: 4 }}>
              <button className="selesai-btn" onClick={onTandaiSelesai}>
                {Icon.check} Tandai Kasus Selesai
              </button>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="detail-body">
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, fontWeight: 700, color: N, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2.2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Kronologi Penanganan
          </div>
          <div className="timeline">
            {kasus.progres.map((p, i) => {
              const ac = AKTOR_COLOR[p.aktor] || { bg: 'rgba(60,110,113,0.1)', color: T }
              const isDone = i < kasus.progres.length - 1
              return (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot${isDone ? ' done' : ''}`}>
                    {isDone
                      ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-tgl">{p.tgl}</div>
                    <div className="timeline-aksi">{p.aksi}</div>
                    <span className="timeline-aktor" style={{ background: ac.bg, color: ac.color }}>
                      {p.aktor}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Form tambah progres */}
        <div className="add-progres">
          <div className="add-progres-title">+ Tambah Progres Baru</div>
          <textarea
            className="add-textarea"
            rows={3}
            placeholder="Tulis tindakan atau perkembangan terbaru kasus ini..."
            value={newAksi}
            onChange={e => setNewAksi(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSubmit() }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="add-btn" onClick={handleSubmit}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Simpan Progres
            </button>
            <span style={{ fontSize: 10, color: MUTED, alignSelf: 'center' }}>Ctrl+Enter untuk simpan</span>
          </div>
        </div>

      </div>
    </div>
  )
}