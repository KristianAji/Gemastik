import { useState } from 'react'
import { useStore } from '../store/useStore'

export default function Modal() {
  const activeModal = useStore(s => s.activeModal)
  const closeModal  = useStore(s => s.closeModal)
  if (!activeModal) return null

  const { type, data } = activeModal

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
      {type === 'tugaskan'     && <TugaskanModal data={data} />}
      {type === 'verifikasi'   && <VerifikasiModal data={data} />}
      {type === 'detail'       && <DetailModal data={data} />}
      {type === 'tambah-anak'  && <TambahAnakModal />}
      {type === 'tambah-laporan' && <TambahLaporanModal />}
      {type === 'selesai'      && <SelesaikanModal data={data} />}
      {type === 'lihat-cctv'   && <LihatCCTVModal data={data} />}
      {type === 'konfirmasi'   && <KonfirmasiModal data={data} />}
    </div>
  )
}

/* ── Tugaskan Petugas ─────────────────────────── */
function TugaskanModal({ data }) {
  const petugas        = useStore(s => s.petugas)
  const tugaskanPetugas = useStore(s => s.tugaskanPetugas)
  const closeModal     = useStore(s => s.closeModal)
  const [selected, setSelected] = useState('')

  const tersedia = petugas.filter(p => p.status === 'tersedia')

  return (
    <div className="modal">
      <div className="modal-title">👮 Tugaskan Petugas</div>
      <div className="modal-sub">
        Laporan <strong style={{ color:'var(--text)' }}>#{data.id}</strong> — {data.lokasi}<br/>
        Pilih petugas yang akan ditugaskan ke lokasi ini.
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
        {tersedia.length === 0 && (
          <div style={{ padding:16, textAlign:'center', color:'var(--text-dim)', fontSize:13 }}>
            Semua petugas sedang bertugas.
          </div>
        )}
        {tersedia.map(p => (
          <label key={p.id} style={{
            display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
            borderRadius:10, border:`1.5px solid ${selected === p.id ? 'var(--accent)' : 'var(--border)'}`,
            background: selected === p.id ? 'var(--accent-soft)' : 'var(--surface2)',
            cursor:'pointer', transition:'all 0.15s',
          }}>
            <input type="radio" name="petugas" value={p.id}
              checked={selected === p.id}
              onChange={() => setSelected(p.id)}
              style={{ accentColor:'var(--accent)' }} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600 }}>{p.nama}</div>
              <div style={{ fontSize:11, color:'var(--text-muted)' }}>{p.jabatan}</div>
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:'var(--green)',
              background:'rgba(46,204,113,0.15)', padding:'2px 10px', borderRadius:99 }}>
              Tersedia
            </span>
          </label>
        ))}
      </div>

      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Batal</button>
        <button className="btn btn-primary"
          disabled={!selected}
          onClick={() => tugaskanPetugas(data.id, selected)}
          style={{ opacity: selected ? 1 : 0.5 }}>
          ✓ Tugaskan Sekarang
        </button>
      </div>
    </div>
  )
}

/* ── Verifikasi Laporan ───────────────────────── */
function VerifikasiModal({ data }) {
  const updateLaporanStatus = useStore(s => s.updateLaporanStatus)
  const showToast   = useStore(s => s.showToast)
  const closeModal  = useStore(s => s.closeModal)
  const openModal   = useStore(s => s.openModal)

  const konfirmasi = () => {
    updateLaporanStatus(data.id, 'proses')
    showToast('✓ Laporan terverifikasi — siap ditugaskan')
    closeModal()
    setTimeout(() => openModal('tugaskan', data), 300)
  }
  const tolak = () => {
    updateLaporanStatus(data.id, 'selesai')
    showToast('Laporan ditolak / tidak valid', 'var(--text-dim)')
    closeModal()
  }

  return (
    <div className="modal">
      <div className="modal-title">🔍 Verifikasi Laporan</div>
      <div className="modal-sub">
        Tinjau detail laporan sebelum diproses lebih lanjut.
      </div>

      <div style={{ background:'var(--surface2)', borderRadius:10, padding:16, marginBottom:16 }}>
        <Row label="ID Laporan"  value={`#${data.id}`} mono />
        <Row label="Lokasi"      value={`${data.lokasi}${data.subLokasi ? ' — ' + data.subLokasi : ''}`} />
        <Row label="Jenis"       value={data.jenis} />
        <Row label="Jml Anak"    value={`${data.jumlah} anak`} />
        <Row label="Sumber"      value={data.sumber} />
        <Row label="Waktu"       value={data.waktu} last />
      </div>

      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Tutup</button>
        <button className="btn" style={{ background:'rgba(232,64,28,0.15)', color:'#ff7a5a', border:'1px solid rgba(232,64,28,0.3)' }}
          onClick={tolak}>✗ Tolak</button>
        <button className="btn btn-primary" onClick={konfirmasi}>✓ Verifikasi &amp; Proses</button>
      </div>
    </div>
  )
}

/* ── Detail Laporan ───────────────────────────── */
function DetailModal({ data }) {
  const closeModal = useStore(s => s.closeModal)
  const openModal  = useStore(s => s.openModal)

  const statusColor = { baru:'#ff7a5a', proses:'var(--amber)', selesai:'var(--green)' }
  const statusLabel = { baru:'Baru', proses:'Diproses', selesai:'Selesai' }

  return (
    <div className="modal" style={{ maxWidth:500 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
        <div className="modal-title">📋 Detail Laporan</div>
        <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99,
          color: statusColor[data.status], background: `${statusColor[data.status]}22` }}>
          {statusLabel[data.status]}
        </span>
      </div>

      <div style={{ background:'var(--surface2)', borderRadius:10, padding:16, marginBottom:16 }}>
        <Row label="ID"       value={`#${data.id}`} mono />
        <Row label="Lokasi"   value={data.lokasi} />
        <Row label="Alamat"   value={data.subLokasi || '—'} />
        <Row label="Jenis"    value={data.jenis} />
        <Row label="Anak"     value={`${data.jumlah} orang`} />
        <Row label="Sumber"   value={data.sumber} />
        <Row label="Waktu"    value={data.waktu} last />
      </div>

      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Tutup</button>
        {data.status === 'baru' && (
          <button className="btn btn-primary"
            onClick={() => { closeModal(); setTimeout(() => openModal('tugaskan', data), 200) }}>
            👮 Tugaskan Petugas
          </button>
        )}
        {data.status === 'proses' && (
          <button className="btn btn-green"
            onClick={() => { closeModal(); setTimeout(() => openModal('selesai', data), 200) }}>
            ✓ Tandai Selesai
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Selesaikan Laporan ───────────────────────── */
function SelesaikanModal({ data }) {
  const selesaikanLaporan = useStore(s => s.selesaikanLaporan)
  const closeModal = useStore(s => s.closeModal)
  const [catatan, setCatatan] = useState('')

  return (
    <div className="modal">
      <div className="modal-title">✅ Selesaikan Penanganan</div>
      <div className="modal-sub">Konfirmasi bahwa laporan <strong style={{ color:'var(--text)' }}>#{data.id}</strong> telah ditangani.</div>

      <div className="form-group">
        <label className="form-label">Catatan Penanganan (opsional)</label>
        <textarea className="input" rows={3}
          placeholder="Misal: Anak berhasil dijemput dan dipulangkan ke keluarga..."
          value={catatan} onChange={e => setCatatan(e.target.value)}
          style={{ resize:'vertical' }} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Batal</button>
        <button className="btn btn-green" onClick={() => selesaikanLaporan(data.id)}>✓ Konfirmasi Selesai</button>
      </div>
    </div>
  )
}

/* ── Lihat CCTV ───────────────────────────────── */
function LihatCCTVModal({ data }) {
  const closeModal = useStore(s => s.closeModal)
  return (
    <div className="modal" style={{ maxWidth:560 }}>
      <div className="modal-title">📹 {data.camLabel || 'CCTV Live'}</div>
      <div style={{ background:'#050e1a', borderRadius:10, overflow:'hidden', marginBottom:16, position:'relative', aspectRatio:'16/9' }}>
        <SimulatedFeed label={data.camLabel} hasAlert={data.hasAlert} />
      </div>
      <div style={{ display:'flex', gap:12, fontSize:12, color:'var(--text-muted)', marginBottom:16 }}>
        <span>📍 {data.lokasi}</span>
        <span>🎥 {data.resolusi || '1080p'}</span>
        <span className="live-dot" style={{ marginTop:3 }} /> <span style={{ color:'var(--green)' }}>LIVE</span>
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Tutup</button>
      </div>
    </div>
  )
}

function SimulatedFeed({ label, hasAlert }) {
  return (
    <div style={{ width:'100%', height:'100%', position:'relative', background:'#050e1a',
      display:'flex', alignItems:'center', justifyContent:'center' }}>
      {/* Simulated scene */}
      <svg width="100%" height="100%" viewBox="0 0 560 315" style={{ position:'absolute', inset:0 }}>
        <rect width="560" height="315" fill="#060f1c"/>
        {/* Ground */}
        <rect y="220" width="560" height="95" fill="#0a1828"/>
        {/* Buildings bg */}
        <rect x="0"   y="80"  width="90"  height="140" fill="#0d1f38" rx="2"/>
        <rect x="100" y="100" width="70"  height="120" fill="#0c1c32" rx="2"/>
        <rect x="180" y="60"  width="110" height="160" fill="#0e2040" rx="2"/>
        <rect x="350" y="90"  width="80"  height="130" fill="#0d1f38" rx="2"/>
        <rect x="440" y="70"  width="120" height="150" fill="#0c1c32" rx="2"/>
        {/* Road */}
        <rect y="200" width="560" height="30" fill="#0f1e2e"/>
        <line x1="0" y1="215" x2="560" y2="215" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="20 15"/>
        {/* People silhouettes */}
        <ellipse cx="180" cy="197" rx="10" ry="22" fill="#1a3050"/>
        <circle  cx="180" cy="170" r="8"   fill="#1a3050"/>
        <ellipse cx="230" cy="200" rx="9"  ry="20" fill="#1a3050"/>
        <circle  cx="230" cy="175" r="7"   fill="#1a3050"/>
        <ellipse cx="350" cy="198" rx="8"  ry="19" fill="#1a3050"/>
        <circle  cx="350" cy="175" r="7"   fill="#1a3050"/>
        {/* Detection boxes */}
        {hasAlert && <>
          <rect x="165" y="155" width="30" height="65" fill="none" stroke="#E8401C" strokeWidth="1.5" rx="1"/>
          <rect x="163" y="153" width="34" height="7" fill="#E8401C"/>
          <text x="180" y="158" textAnchor="middle" fill="#fff" fontSize="5" fontFamily="DM Sans">Anak 94%</text>
          <rect x="215" y="160" width="28" height="60" fill="none" stroke="#F5A623" strokeWidth="1.5" rx="1"/>
          <rect x="213" y="158" width="32" height="7" fill="#F5A623"/>
          <text x="229" y="163" textAnchor="middle" fill="#000" fontSize="5" fontFamily="DM Sans">Anak 87%</text>
        </>}
        {/* Scanline */}
        <rect width="560" height="315" fill="url(#scanline)" opacity="0.15"/>
        <defs>
          <pattern id="scanline" width="1" height="3" patternUnits="userSpaceOnUse">
            <rect width="1" height="1" fill="rgba(0,0,0,0.5)"/>
          </pattern>
        </defs>
        {/* Timestamp */}
        <text x="10" y="308" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">{new Date().toLocaleString('id-ID')}</text>
        <text x="550" y="308" textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">{label}</text>
      </svg>
    </div>
  )
}

/* ── Tambah Anak ──────────────────────────────── */
function TambahAnakModal() {
  const tambahAnak = useStore(s => s.tambahAnak)
  const showToast  = useStore(s => s.showToast)
  const closeModal = useStore(s => s.closeModal)
  const [form, setForm] = useState({ nama:'', usia:'', gender:'Laki-laki', lokasi:'', aktivitas:'Berjualan', status:'proses' })

  const set = (k,v) => setForm(f => ({ ...f, [k]:v }))
  const submit = () => {
    if (!form.nama || !form.lokasi) return
    tambahAnak(form)
    showToast('✓ Data anak berhasil ditambahkan')
    closeModal()
  }

  return (
    <div className="modal">
      <div className="modal-title">+ Tambah Data Anak</div>
      <div className="modal-sub">Tambahkan profil anak yang ditemukan ke sistem.</div>

      <div className="form-group">
        <label className="form-label">Inisial Nama *</label>
        <input className="input" placeholder="cth: A.R." value={form.nama} onChange={e => set('nama', e.target.value)} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div className="form-group">
          <label className="form-label">Estimasi Usia</label>
          <input className="input" placeholder="cth: ±9 thn" value={form.usia} onChange={e => set('usia', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Jenis Kelamin</label>
          <select className="input" value={form.gender} onChange={e => set('gender', e.target.value)}>
            <option>Laki-laki</option>
            <option>Perempuan</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Lokasi Ditemukan *</label>
        <input className="input" placeholder="cth: Kawasan Megamas" value={form.lokasi} onChange={e => set('lokasi', e.target.value)} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div className="form-group">
          <label className="form-label">Jenis Aktivitas</label>
          <select className="input" value={form.aktivitas} onChange={e => set('aktivitas', e.target.value)}>
            <option>Berjualan</option><option>Mengamen</option>
            <option>Mengemis</option><option>Figuran</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="proses">Diproses</option>
            <option value="perlu">Perlu Tindak Lanjut</option>
            <option value="pulang">Sudah Pulang</option>
          </select>
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Batal</button>
        <button className="btn btn-primary" onClick={submit}>+ Simpan Data</button>
      </div>
    </div>
  )
}

/* ── Tambah Laporan (Admin) ───────────────────── */
function TambahLaporanModal() {
  const tambahLaporan = useStore(s => s.tambahLaporan)
  const showToast     = useStore(s => s.showToast)
  const closeModal    = useStore(s => s.closeModal)
  const [form, setForm] = useState({ lokasi:'', subLokasi:'', jenis:'Berjualan', jumlah:1, sumber:'Manual', pelapor:'' })

  const set = (k,v) => setForm(f => ({ ...f, [k]:v }))
  const submit = () => {
    if (!form.lokasi) return
    tambahLaporan(form)
    showToast('✓ Laporan berhasil ditambahkan')
    closeModal()
  }

  return (
    <div className="modal">
      <div className="modal-title">+ Tambah Laporan</div>
      <div className="modal-sub">Input laporan secara manual.</div>

      <div className="form-group">
        <label className="form-label">Lokasi *</label>
        <input className="input" placeholder="cth: Kawasan Megamas" value={form.lokasi} onChange={e => set('lokasi', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Sub-lokasi / Alamat</label>
        <input className="input" placeholder="cth: Jl. Pierre Tendean" value={form.subLokasi} onChange={e => set('subLokasi', e.target.value)} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div className="form-group">
          <label className="form-label">Jenis</label>
          <select className="input" value={form.jenis} onChange={e => set('jenis', e.target.value)}>
            <option>Berjualan</option><option>Mengamen</option>
            <option>Mengemis</option><option>Figuran</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Jumlah Anak</label>
          <input className="input" type="number" min={1} value={form.jumlah} onChange={e => set('jumlah', +e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Nama Pelapor</label>
        <input className="input" placeholder="Nama atau 'Anonim'" value={form.pelapor} onChange={e => set('pelapor', e.target.value)} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Batal</button>
        <button className="btn btn-primary" onClick={submit}>+ Simpan Laporan</button>
      </div>
    </div>
  )
}

/* ── Konfirmasi ───────────────────────────────── */
function KonfirmasiModal({ data }) {
  const closeModal = useStore(s => s.closeModal)
  return (
    <div className="modal" style={{ maxWidth:380 }}>
      <div className="modal-title">{data.icon || '⚠️'} {data.judul}</div>
      <div className="modal-sub">{data.deskripsi}</div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={closeModal}>Batal</button>
        <button className="btn btn-primary" onClick={() => { data.onConfirm?.(); closeModal() }}>{data.confirmLabel || 'Konfirmasi'}</button>
      </div>
    </div>
  )
}

/* ── Row helper ───────────────────────────────── */
function Row({ label, value, mono, last }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start',
      paddingBottom: last ? 0 : 10, marginBottom: last ? 0 : 10,
      borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      <span style={{ fontSize:11, color:'var(--text-dim)' }}>{label}</span>
      <span style={{ fontSize:12, fontWeight:600, fontFamily: mono ? 'monospace' : 'inherit',
        maxWidth:'60%', textAlign:'right' }}>{value}</span>
    </div>
  )
}