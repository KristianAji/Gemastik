import { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import {
  N, T, TEXT, MUTED, BORDER, BG, RED, AMBER, GREEN,
  KASUS_DATA, PETA_TITIK, Icon, SHARED_STYLES,
} from './dinsoConstants'

export default function DinsosExport() {
  const showToast = useStore(s => s.showToast)
  const [clock, setClock]         = useState('')
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const totalSelesai = KASUS_DATA.filter(k => k.status === 'selesai').length
  const totalProses  = KASUS_DATA.filter(k => k.status === 'proses').length

  const handleExport = (tipe) => {
    setExportLoading(true)
    setTimeout(() => {
      setExportLoading(false)
      let rows
      if (tipe === 'lokasi') {
        const header = ['Lokasi', 'Jumlah Laporan', 'Status']
        rows = PETA_TITIK.map(p => [p.label, p.count, p.alert ? 'CCTV Aktif' : 'Terverifikasi'])
        const csv  = [header, ...rows].map(r => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.href = url; a.download = `laporan-dinsos-lokasi-${new Date().toISOString().slice(0,10)}.csv`
        a.click(); URL.revokeObjectURL(url)
      } else {
        const header = ['ID Kasus', 'Nama', 'Lokasi', 'Tanggal', 'Status', 'Petugas']
        const data   = tipe === 'semua'    ? KASUS_DATA
                     : tipe === 'selesai'  ? KASUS_DATA.filter(k => k.status === 'selesai')
                     :                       KASUS_DATA.filter(k => k.status === 'proses')
        rows = data.map(k => [k.id, k.nama, k.lokasi, k.tanggal, k.status, k.petugas])
        const csv  = [header, ...rows].map(r => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.href = url; a.download = `laporan-dinsos-${tipe}-${new Date().toISOString().slice(0,10)}.csv`
        a.click(); URL.revokeObjectURL(url)
      }
      showToast(`File CSV "${tipe}" berhasil diunduh`)
    }, 1200)
  }

  return (
    <>
      <style>{`
        ${SHARED_STYLES}

        .export-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 20px; }
        .export-card {
          border: 1.5px solid ${BORDER}; border-radius: 12px; padding: 20px;
          display: flex; flex-direction: column; gap: 10px;
          transition: border-color 0.2s, box-shadow 0.2s; cursor: pointer;
        }
        .export-card:hover { border-color: ${T}; box-shadow: 0 4px 18px rgba(60,110,113,0.1); }
        .export-card-icon {
          width: 44px; height: 44px; border-radius: 10px;
          background: rgba(60,110,113,0.08); border: 1px solid rgba(60,110,113,0.15);
          display: flex; align-items: center; justify-content: center; color: ${T};
        }
        .export-card-title {
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
          font-weight: 700; color: ${N};
        }
        .export-card-sub { font-size: 12px; color: ${MUTED}; line-height: 1.5; }
        .export-btn {
          display: flex; align-items: center; gap: 7px; padding: 10px 18px;
          border-radius: 8px; background: ${T}; color: #fff; border: none;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700;
          cursor: pointer; transition: background 0.2s; align-self: flex-start; margin-top: 4px;
        }
        .export-btn:hover { background: #2f5759; }
        .export-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .preview-table { width: 100%; border-collapse: collapse; font-size: 11px; font-family: 'Inter', sans-serif; }
        .preview-th {
          padding: 10px 16px; text-align: left; color: ${MUTED}; font-weight: 600;
          border-bottom: 1px solid ${BORDER}; white-space: nowrap; background: #F8FAFC;
        }
        .preview-td { padding: 9px 16px; border-bottom: 1px solid ${BORDER}; }

        @media (max-width: 800px) { .export-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="ds-root">

        {/* ── BANNER ── */}
        <div className="ds-banner">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="ds-banner-eyebrow">Portal Dinas Sosial — Kota Manado</div>
            <div className="ds-banner-title">
              Export<br/>
              <span>Data Laporan CSV</span>
            </div>
            <div className="ds-banner-sub">
              Unduh data laporan yang telah terverifikasi dalam format CSV.
              Tersedia <strong>4 jenis export</strong> — semua kasus, selesai, proses, dan per lokasi.
            </div>
            <div className="ds-banner-clock">{clock} WITA</div>
          </div>
          <div className="ds-banner-actions">
            <button
              className="ds-btn-teal"
              disabled={exportLoading}
              onClick={() => handleExport('semua')}
            >
              {Icon.export}
              {exportLoading ? 'Mengunduh...' : 'Export Semua Data'}
            </button>
          </div>
        </div>

        {/* ── KPI ── */}
        <div className="ds-kpi-grid">
          {[
            { icon: Icon.total,   num: KASUS_DATA.length, label: 'Total Baris Data',        delta: 'Semua kasus terverifikasi',  fill: 100 },
            { icon: Icon.check,   num: totalSelesai,       label: 'Kasus Selesai',           delta: 'Siap export sebagai arsip',  fill: totalSelesai / KASUS_DATA.length * 100 },
            { icon: Icon.kasus,   num: totalProses,        label: 'Kasus Aktif',             delta: 'Data real-time',             fill: totalProses / KASUS_DATA.length * 100 },
            { icon: Icon.peta,    num: PETA_TITIK.length,  label: 'Titik Lokasi',            delta: 'Tersedia sebagai data GIS',  fill: 100 },
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

        {/* ── KARTU EXPORT ── */}
        <div className="ds-card">
          <div className="ds-card-head">
            <div className="ds-card-title">{Icon.export} Pilih Jenis Export</div>
          </div>
          <div className="export-grid">
            {[
              {
                icon: Icon.total,
                title: 'Semua Kasus Terverifikasi',
                sub: 'Seluruh data laporan yang telah diverifikasi admin, termasuk lokasi, tanggal, dan status penanganan.',
                tipe: 'semua',
                count: KASUS_DATA.length,
              },
              {
                icon: Icon.check,
                title: 'Kasus Selesai Ditangani',
                sub: 'Data kasus yang telah berhasil ditangani oleh Satpol PP dan Dinas Sosial beserta progres kronologi.',
                tipe: 'selesai',
                count: totalSelesai,
              },
              {
                icon: Icon.warning,
                title: 'Kasus Masih Diproses',
                sub: 'Data kasus yang saat ini sedang dalam proses penanganan oleh petugas di lapangan.',
                tipe: 'proses',
                count: totalProses,
              },
              {
                icon: Icon.peta,
                title: 'Data per Lokasi Rawan',
                sub: 'Rekapitulasi laporan dikelompokkan berdasarkan lokasi geografis titik rawan Kota Manado.',
                tipe: 'lokasi',
                count: PETA_TITIK.length,
              },
            ].map(e => (
              <div key={e.tipe} className="export-card" onClick={() => handleExport(e.tipe)}>
                <div className="export-card-icon">{e.icon}</div>
                <div>
                  <div className="export-card-title">{e.title}</div>
                  <div className="export-card-sub">{e.sub}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <span style={{ fontSize: 11, color: MUTED, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600 }}>
                    {e.count} baris data
                  </span>
                  <button
                    className="export-btn"
                    disabled={exportLoading}
                    onClick={ev => { ev.stopPropagation(); handleExport(e.tipe) }}
                  >
                    {Icon.export}
                    {exportLoading ? 'Mengunduh...' : 'Unduh CSV'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PREVIEW TABEL ── */}
        <div className="ds-card">
          <div className="ds-card-head">
            <div className="ds-card-title">Preview Data — {KASUS_DATA.length} baris pertama</div>
            <span style={{ fontSize: 11, color: MUTED }}>Format: CSV, UTF-8, delimiter koma</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="preview-table">
              <thead>
                <tr>
                  {['ID Kasus', 'Nama', 'Lokasi', 'Tanggal', 'Status', 'Petugas'].map(h => (
                    <th key={h} className="preview-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KASUS_DATA.map((k, i) => (
                  <tr key={k.id} style={{ background: i % 2 === 0 ? '#fff' : '#FAFBFD' }}>
                    <td className="preview-td" style={{ fontFamily: "'Inter',monospace", color: T, fontWeight: 600 }}>{k.id}</td>
                    <td className="preview-td" style={{ fontWeight: 500 }}>{k.nama}</td>
                    <td className="preview-td" style={{ color: MUTED }}>{k.lokasi}</td>
                    <td className="preview-td" style={{ color: MUTED, whiteSpace: 'nowrap' }}>{k.tanggal}</td>
                    <td className="preview-td">
                      <span className="ds-pill" style={{
                        background: k.status === 'selesai' ? 'rgba(30,126,74,0.1)' : 'rgba(212,130,10,0.1)',
                        color:      k.status === 'selesai' ? GREEN : AMBER,
                      }}>
                        {k.status === 'selesai' ? Icon.check : Icon.clock} {k.status}
                      </span>
                    </td>
                    <td className="preview-td" style={{ color: MUTED }}>{k.petugas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  )
}