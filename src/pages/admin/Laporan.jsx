import { useState } from 'react'
import { useStore } from '../../store/useStore'

export default function AdminLaporan() {
  const laporan    = useStore(s => s.laporan)
  const openModal  = useStore(s => s.openModal)
  const showToast  = useStore(s => s.showToast)
  const [filter, setFilter]   = useState('semua')
  const [search,  setSearch]  = useState('')
  const [page, setPage]       = useState(1)
  const PER_PAGE = 10

  const filtered = laporan.filter(l => {
    if (filter === 'baru'    && l.status !== 'baru')    return false
    if (filter === 'proses'  && l.status !== 'proses')  return false
    if (filter === 'selesai' && l.status !== 'selesai') return false
    if (filter === 'ai'      && !l.sumber.includes('AI')) return false
    if (filter === 'warga'   && l.sumber.includes('AI')) return false
    if (search && !l.lokasi.toLowerCase().includes(search.toLowerCase()) && !l.sumber.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const pages   = Math.ceil(filtered.length / PER_PAGE)
  const paged   = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)

  const statusColor = { baru:'s-baru', proses:'s-proses', selesai:'s-selesai' }
  const jenisColor  = { Berjualan:'red', Mengamen:'amber', Mengemis:'amber', Figuran:'red' }

  const counts = {
    semua: laporan.length,
    baru: laporan.filter(l=>l.status==='baru').length,
    proses: laporan.filter(l=>l.status==='proses').length,
    selesai: laporan.filter(l=>l.status==='selesai').length,
  }

  const handleExport = () => {
    const csv = ['ID,Lokasi,Jenis,Jumlah,Sumber,Waktu,Status',
      ...laporan.map(l => `${l.id},"${l.lokasi}",${l.jenis},${l.jumlah},"${l.sumber}","${l.waktu}",${l.status}`)
    ].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' }))
    a.download = 'laporan-delcion.csv'
    a.click()
    showToast('✓ File CSV berhasil diunduh')
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Topbar */}
      <div style={{ padding:'12px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800 }}>📋 Semua Laporan</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Total {laporan.length} laporan tercatat</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-sm" onClick={() => openModal('tambah-laporan')}
            style={{ background:'rgba(46,204,113,0.15)', color:'var(--green)', border:'1px solid rgba(46,204,113,0.3)' }}>
            + Tambah Manual
          </button>
          <button className="btn btn-sm btn-ghost" onClick={handleExport}>⬇ Export CSV</button>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:20 }}>
        {/* Filters */}
        <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
          {[
            { key:'semua',   label:`Semua (${counts.semua})` },
            { key:'baru',    label:`Baru (${counts.baru})` },
            { key:'proses',  label:`Diproses (${counts.proses})` },
            { key:'selesai', label:`Selesai (${counts.selesai})` },
            { key:'ai',      label:'🤖 AI Detection' },
            { key:'warga',   label:'👤 Laporan Warga' },
          ].map(f => (
            <button key={f.key}
              onClick={() => { setFilter(f.key); setPage(1) }}
              style={{ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:500, cursor:'pointer',
                background: filter===f.key ? 'var(--accent)' : 'transparent',
                color: filter===f.key ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${filter===f.key ? 'var(--accent)' : 'var(--border)'}`,
                transition:'all 0.15s' }}>
              {f.label}
            </button>
          ))}
          <input
            style={{ marginLeft:'auto', padding:'6px 12px', borderRadius:8, border:'1px solid var(--border)',
              background:'var(--surface2)', color:'var(--text)', fontSize:12, outline:'none', width:220 }}
            placeholder="🔍 Cari lokasi, pelapor..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>

        {/* Table */}
        <div style={{ background:'var(--surface)', borderRadius:12, border:'1px solid var(--border)', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['ID','Lokasi','Jenis','Jml Anak','Sumber','Waktu','Status','Aksi'].map(h => (
                  <th key={h} style={{ textAlign:'left', fontSize:10, fontWeight:700, textTransform:'uppercase',
                    letterSpacing:'1px', color:'var(--text-dim)', padding:'10px 12px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map(l => (
                <tr key={l.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', transition:'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'12px 12px', fontFamily:'monospace', color:'var(--text-dim)', fontSize:11 }}>#{l.id}</td>
                  <td style={{ padding:'12px 12px' }}>
                    <div style={{ fontSize:12, fontWeight:600 }}>{l.lokasi}</div>
                    {l.subLokasi && <div style={{ fontSize:10, color:'var(--text-dim)' }}>{l.subLokasi}</div>}
                  </td>
                  <td style={{ padding:'12px 12px' }}>
                    <span className={`tag ${jenisColor[l.jenis]||'amber'}`}>{l.jenis}</span>
                  </td>
                  <td style={{ padding:'12px 12px', fontSize:12 }}>{l.jumlah}</td>
                  <td style={{ padding:'12px 12px', fontSize:12, color:'var(--text-muted)' }}>{l.sumber.includes('AI') ? '🤖 AI' : `👤 ${l.sumber}`}</td>
                  <td style={{ padding:'12px 12px', fontSize:12, color:'var(--text-muted)' }}>{l.waktu}</td>
                  <td style={{ padding:'12px 12px' }}>
                    <span className={`status-pill ${statusColor[l.status]}`}>{l.status==='baru'?'Baru':l.status==='proses'?'Diproses':'Selesai'}</span>
                  </td>
                  <td style={{ padding:'12px 12px' }}>
                    <div style={{ display:'flex', gap:4 }}>
                      {l.status === 'baru' && (
                        <button className="btn btn-primary btn-sm" onClick={() => openModal('tugaskan', l)}>Tugaskan</button>
                      )}
                      {l.status === 'proses' && (
                        <button className="btn btn-green btn-sm" onClick={() => openModal('selesai', l)}>Selesaikan</button>
                      )}
                      <button className="btn btn-ghost btn-sm" onClick={() => openModal('detail', l)}>Detail</button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={8} style={{ padding:40, textAlign:'center', color:'var(--text-dim)', fontSize:13 }}>Tidak ada laporan ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display:'flex', gap:4, justifyContent:'center', marginTop:20 }}>
            {Array.from({ length: pages }, (_, i) => i+1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                style={{ width:32, height:32, borderRadius:6, border:`1px solid ${p===page?'var(--accent)':'var(--border)'}`,
                  background: p===page?'var(--accent)':'transparent',
                  color: p===page?'#fff':'var(--text-muted)', fontSize:12, cursor:'pointer' }}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}