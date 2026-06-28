import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import DetailLaporanContent from '../../components/DetailLaporanContent'

const N      = '#022B3A'
const T      = '#3C6E71'
const TEXT   = '#1a2e3b'
const MUTED  = '#5A7080'
const BORDER = '#D6DCE4'
const BG     = '#E1E5F2'

const Icon = {
  back:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  print: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  share: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>,
  doc:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
}

export default function LaporanDetail() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const laporan   = useStore(s => (s.laporan || []).find(l => String(l.id) === String(id)))
  const showToast = useStore(s => s.showToast)

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      showToast?.('Tautan laporan disalin ke clipboard')
    } catch {
      showToast?.('Gagal menyalin tautan')
    }
  }

  return (
    <div className="ld-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        .ld-root * { box-sizing:border-box; }
        .ld-root {
          font-family:'Inter', sans-serif; background:${BG}; color:${TEXT};
          flex:1; overflow-y:auto; padding:24px 32px 60px;
        }
        .ld-topbar {
          display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px;
          margin-bottom:18px;
        }
        .ld-back {
          display:flex; align-items:center; gap:8px; font-size:12.5px; font-weight:700;
          color:${MUTED}; background:#fff; border:1px solid ${BORDER}; border-radius:9px;
          padding:9px 16px; cursor:pointer; font-family:'Plus Jakarta Sans', sans-serif;
          transition:all 0.15s;
        }
        .ld-back:hover { color:${N}; border-color:${T}; }
        .ld-title-wrap { display:flex; align-items:center; gap:12px; }
        .ld-title-icon {
          width:40px; height:40px; border-radius:11px; background:rgba(60,110,113,0.1);
          border:1px solid rgba(60,110,113,0.25); display:flex; align-items:center; justify-content:center; color:${T};
        }
        .ld-title { font-family:'Plus Jakarta Sans', sans-serif; font-size:18px; font-weight:800; color:${N}; }
        .ld-subtitle { font-size:12px; color:${MUTED}; margin-top:2px; }
        .ld-actions { display:flex; gap:8px; }
        .ld-action-btn {
          display:flex; align-items:center; gap:7px; padding:9px 16px; border-radius:9px;
          border:1px solid ${BORDER}; background:#fff; color:${TEXT}; font-size:12px; font-weight:700;
          font-family:'Plus Jakarta Sans', sans-serif; cursor:pointer; transition:all 0.15s;
        }
        .ld-action-btn:hover { border-color:${T}; color:${T}; }
        .ld-empty {
          background:#fff; border:1px solid ${BORDER}; border-radius:14px; padding:60px 30px;
          text-align:center; color:${MUTED}; font-size:13px;
        }
        @media print {
          .ld-back, .ld-actions { display:none !important; }
        }
      `}</style>

      <div className="ld-topbar">
        <button className="ld-back" onClick={() => navigate('/admin/laporan')}>
          {Icon.back} Kembali ke Semua Laporan
        </button>
        <div className="ld-actions">
          <button className="ld-action-btn" onClick={handleShare}>{Icon.share} Bagikan Tautan</button>
          <button className="ld-action-btn" onClick={() => window.print()}>{Icon.print} Cetak / PDF</button>
        </div>
      </div>

      {laporan ? (
        <>
          <div className="ld-title-wrap" style={{ marginBottom:18 }}>
            <span className="ld-title-icon">{Icon.doc}</span>
            <div>
              <div className="ld-title">Laporan #{laporan.id} — {laporan.lokasi}</div>
              <div className="ld-subtitle">Detail lengkap untuk verifikasi, penugasan, dan dokumentasi dinas</div>
            </div>
          </div>
          <DetailLaporanContent laporan={laporan} embedded />
        </>
      ) : (
        <div className="ld-empty">
          Laporan dengan ID <strong>{id}</strong> tidak ditemukan. Mungkin sudah dihapus atau ID tidak valid.
        </div>
      )}
    </div>
  )
}