import { useNavigate } from 'react-router-dom'
import DetailLaporanContent from './DetailLaporanContent'

const N      = '#022B3A'

const Icon = {
  x:        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  expand:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
}

export default function ModalDetailLaporan({ laporan, onClose }) {
  const navigate = useNavigate()

  if (!laporan) return null

  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, background:'rgba(2,43,58,0.55)',
        backdropFilter:'blur(3px)', zIndex:1000,
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:'#E1E5F2', borderRadius:18,
          width:'100%', maxWidth:920, maxHeight:'90vh',
          overflowY:'auto', position:'relative',
          boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{
          position:'sticky', top:0, zIndex:2,
          background:N, padding:'16px 22px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          fontFamily:"'Plus Jakarta Sans', sans-serif",
        }}>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:'#fff' }}>Detail Laporan</div>
            <div style={{ fontSize:11.5, color:'rgba(191,219,247,0.6)', marginTop:2 }}>
              {laporan.lokasi || 'Lokasi tidak diketahui'}
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button
              onClick={() => { onClose?.(); navigate(`/admin/laporan/${laporan.id}`) }}
              title="Buka sebagai halaman penuh"
              style={{
                width:34, height:34, borderRadius:9, border:'1px solid rgba(255,255,255,0.2)',
                background:'rgba(255,255,255,0.08)', color:'#BFDBF7',
                display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
              }}
            >
              {Icon.expand}
            </button>
            <button
              onClick={onClose}
              style={{
                width:34, height:34, borderRadius:9, border:'1px solid rgba(255,255,255,0.2)',
                background:'rgba(255,255,255,0.08)', color:'#fff',
                display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
              }}
            >
              {Icon.x}
            </button>
          </div>
        </div>

        <div style={{ padding:20 }}>
          <DetailLaporanContent laporan={laporan} onClose={onClose} />
        </div>
      </div>
    </div>
  )
}