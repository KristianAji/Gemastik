import { useState } from 'react'
import { useStore } from '../store/useStore'
import { useNavigate } from 'react-router-dom'
import DetailLaporanContent from './DetailLaporanContent'

const N      = '#022B3A'
const T      = '#3C6E71'
const TEXT   = '#1a2e3b'
const MUTED  = '#5A7080'
const BORDER = '#D6DCE4'
const CARD   = '#FFFFFF'
const BG     = '#E1E5F2'
const RED    = '#C0392B'
const AMBER  = '#D4820A'
const GREEN  = '#1E7E4A'

export default function Modal() {
  const activeModal = useStore(s => s.activeModal)
  const closeModal  = useStore(s => s.closeModal)
  if (!activeModal) return null

  const { type, data } = activeModal

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        .m-backdrop {
          position: fixed; inset: 0;
          background: rgba(2,43,58,0.5);
          backdrop-filter: blur(3px);
          z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }
        .m-box {
          background: ${BG}; border-radius: 16px;
          width: 100%; max-width: 480px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
          overflow: hidden;
        }
        .m-box-wide {
          background: ${BG}; border-radius: 16px;
          width: 100%; max-width: 940px; max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }
        .m-head {
          background: ${N}; padding: 16px 20px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 2;
        }
        .m-head-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 800; color: #fff;
        }
        .m-head-sub { font-size: 11px; color: rgba(191,219,247,0.5); margin-top: 2px; }
        .m-head-actions { display: flex; gap: 8px; }
        .m-head-btn {
          width: 32px; height: 32px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08); color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s;
        }
        .m-head-btn:hover { background: rgba(255,255,255,0.16); }

        .m-card {
          background: ${CARD}; border: 1px solid ${BORDER};
          border-radius: 12px; overflow: hidden; margin-bottom: 14px;
        }
        .m-card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12.5px; font-weight: 700; color: ${N};
          padding: 12px 16px; border-bottom: 1px solid ${BORDER};
        }
        .m-card-body { padding: 14px 16px; }

        .m-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 800; color: ${N};
          margin-bottom: 6px;
        }
        .m-sub { font-size: 12px; color: ${MUTED}; margin-bottom: 16px; line-height: 1.55; }

        .m-body { padding: 20px; }

        .m-row {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 9px 0; border-bottom: 1px solid ${BORDER};
        }
        .m-row:last-child { border-bottom: none; padding-bottom: 0; }
        .m-row-label { font-size: 11px; color: ${MUTED}; }
        .m-row-val { font-size: 12.5px; font-weight: 700; color: ${TEXT}; font-family: 'Plus Jakarta Sans', sans-serif; max-width: 60%; text-align: right; }

        .m-footer {
          display: flex; justify-content: flex-end; gap: 8px;
          padding: 14px 20px; border-top: 1px solid ${BORDER};
          background: #F8FAFC;
        }

        .m-btn {
          padding: 9px 18px; border-radius: 9px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; font-weight: 700; cursor: pointer;
          transition: all 0.15s; border: none;
        }
        .m-btn-ghost { background: ${CARD}; color: ${MUTED}; border: 1px solid ${BORDER}; }
        .m-btn-ghost:hover { border-color: ${T}; color: ${T}; }
        .m-btn-primary { background: ${T}; color: #fff; }
        .m-btn-primary:hover { background: #2f5759; }
        .m-btn-green { background: rgba(30,126,74,0.1); color: ${GREEN}; border: 1px solid rgba(30,126,74,0.3); }
        .m-btn-green:hover { background: ${GREEN}; color: #fff; }
        .m-btn-red { background: rgba(192,57,43,0.1); color: ${RED}; border: 1px solid rgba(192,57,43,0.3); }
        .m-btn-red:hover { background: ${RED}; color: #fff; }

        .m-input {
          width: 100%; padding: 10px 12px; border-radius: 9px;
          border: 1px solid ${BORDER}; background: ${CARD};
          font-size: 12.5px; font-family: 'Inter', sans-serif; color: ${TEXT};
          outline: none;
        }
        .m-input:focus { border-color: ${T}; }
        .m-label { font-size: 11px; font-weight: 600; color: ${MUTED}; margin-bottom: 6px; display: block; }
        .m-form-group { margin-bottom: 12px; }

        .m-radio-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; border-radius: 10px;
          border: 1.5px solid ${BORDER}; background: #F8FAFC;
          cursor: pointer; transition: all 0.15s; margin-bottom: 8px;
        }
        .m-radio-item.selected { border-color: ${T}; background: rgba(60,110,113,0.06); }
        .m-radio-item:hover { border-color: ${T}; }
      `}</style>

      <div
        className="m-backdrop"
        onClick={e => e.target === e.currentTarget && closeModal()}
      >
        {type === 'detail'         && <DetailModal    data={data} />}
        {type === 'tugaskan'       && <TugaskanModal  data={data} />}
        {type === 'verifikasi'     && <VerifikasiModal data={data} />}
        {type === 'selesai'        && <SelesaikanModal data={data} />}
        {type === 'tambah-laporan' && <TambahLaporanModal />}
        {type === 'tambah-anak'    && <TambahAnakModal />}
        {type === 'lihat-cctv'     && <LihatCCTVModal data={data} />}
        {type === 'konfirmasi'     && <KonfirmasiModal data={data} />}
      </div>
    </>
  )
}

/* ── Detail Laporan (pakai DetailLaporanContent) ── */
function DetailModal({ data }) {
  const closeModal = useStore(s => s.closeModal)
  const navigate   = useNavigate()

  const IconExpand = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
  const IconX      = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

  return (
    <div className="m-box-wide">
      <div className="m-head">
        <div>
          <div className="m-head-title">Detail Laporan #{data?.id}</div>
          <div className="m-head-sub">{data?.lokasi || 'Lokasi tidak diketahui'}</div>
        </div>
        <div className="m-head-actions">
          <button
            className="m-head-btn"
            title="Buka halaman penuh"
            onClick={() => { closeModal(); navigate(`/admin/laporan/${data?.id}`) }}
          >
            {IconExpand}
          </button>
          <button className="m-head-btn" onClick={closeModal}>{IconX}</button>
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <DetailLaporanContent laporan={data} onClose={closeModal} embedded />
      </div>
    </div>
  )
}

/* ── Tugaskan Petugas ── */
function TugaskanModal({ data }) {
  const petugas         = useStore(s => s.petugas)
  const tugaskanPetugas = useStore(s => s.tugaskanPetugas)
  const closeModal      = useStore(s => s.closeModal)
  const [selected, setSelected] = useState('')

  const tersedia = (petugas || []).filter(p => p.status === 'tersedia')

  return (
    <div className="m-box">
      <div className="m-head">
        <div>
          <div className="m-head-title">Tugaskan Petugas</div>
          <div className="m-head-sub">Laporan #{data?.id} — {data?.lokasi}</div>
        </div>
      </div>
      <div className="m-body">
        {tersedia.length === 0 ? (
          <div style={{ padding: '20px 0', textAlign: 'center', color: MUTED, fontSize: 13 }}>
            Semua petugas sedang bertugas.
          </div>
        ) : tersedia.map(p => (
          <div
            key={p.id}
            className={`m-radio-item${selected === p.id ? ' selected' : ''}`}
            onClick={() => setSelected(p.id)}
          >
            <input
              type="radio" name="petugas" value={p.id}
              checked={selected === p.id}
              onChange={() => setSelected(p.id)}
              style={{ accentColor: T }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.nama}</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{p.jabatan}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: GREEN, background: 'rgba(30,126,74,0.1)', padding: '3px 10px', borderRadius: 99 }}>
              Tersedia
            </span>
          </div>
        ))}
      </div>
      <div className="m-footer">
        <button className="m-btn m-btn-ghost" onClick={closeModal}>Batal</button>
        <button
          className="m-btn m-btn-primary"
          disabled={!selected}
          style={{ opacity: selected ? 1 : 0.5 }}
          onClick={() => tugaskanPetugas(data.id, selected)}
        >
          ✓ Tugaskan Sekarang
        </button>
      </div>
    </div>
  )
}

/* ── Verifikasi Laporan ── */
function VerifikasiModal({ data }) {
  const updateLaporanStatus = useStore(s => s.updateLaporanStatus)
  const showToast  = useStore(s => s.showToast)
  const closeModal = useStore(s => s.closeModal)
  const openModal  = useStore(s => s.openModal)

  const konfirmasi = () => {
    updateLaporanStatus(data.id, 'proses')
    showToast('✓ Laporan terverifikasi — siap ditugaskan')
    closeModal()
    setTimeout(() => openModal('tugaskan', data), 300)
  }
  const tolak = () => {
    updateLaporanStatus(data.id, 'selesai')
    showToast('Laporan ditolak / tidak valid')
    closeModal()
  }

  return (
    <div className="m-box">
      <div className="m-head">
        <div><div className="m-head-title">Verifikasi Laporan</div></div>
      </div>
      <div className="m-body">
        <div className="m-sub">Tinjau detail laporan sebelum diproses lebih lanjut.</div>
        <div className="m-card">
          <div className="m-card-body">
            <MRow label="ID Laporan" value={`#${data.id}`} mono />
            <MRow label="Lokasi"     value={`${data.lokasi}${data.subLokasi ? ' — ' + data.subLokasi : ''}`} />
            <MRow label="Jenis"      value={data.jenis} />
            <MRow label="Jml Anak"   value={`${data.jumlah} anak`} />
            <MRow label="Sumber"     value={data.sumber} />
            <MRow label="Waktu"      value={data.waktu} last />
          </div>
        </div>
      </div>
      <div className="m-footer">
        <button className="m-btn m-btn-ghost" onClick={closeModal}>Tutup</button>
        <button className="m-btn m-btn-red"   onClick={tolak}>✗ Tolak</button>
        <button className="m-btn m-btn-primary" onClick={konfirmasi}>✓ Verifikasi &amp; Proses</button>
      </div>
    </div>
  )
}

/* ── Selesaikan Laporan ── */
function SelesaikanModal({ data }) {
  const selesaikanLaporan = useStore(s => s.selesaikanLaporan)
  const closeModal = useStore(s => s.closeModal)
  const [catatan, setCatatan] = useState('')

  return (
    <div className="m-box">
      <div className="m-head">
        <div><div className="m-head-title">Selesaikan Penanganan</div></div>
      </div>
      <div className="m-body">
        <div className="m-sub">
          Konfirmasi bahwa laporan <strong style={{ color: TEXT }}>#{data?.id}</strong> telah ditangani.
        </div>
        <div className="m-form-group">
          <label className="m-label">Catatan Penanganan (opsional)</label>
          <textarea
            className="m-input"
            rows={3}
            placeholder="Misal: Anak berhasil dijemput dan dipulangkan ke keluarga..."
            value={catatan}
            onChange={e => setCatatan(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>
      </div>
      <div className="m-footer">
        <button className="m-btn m-btn-ghost" onClick={closeModal}>Batal</button>
        <button className="m-btn m-btn-green" onClick={() => selesaikanLaporan(data.id)}>✓ Konfirmasi Selesai</button>
      </div>
    </div>
  )
}

/* ── Tambah Laporan ── */
function TambahLaporanModal() {
  const tambahLaporan = useStore(s => s.tambahLaporan)
  const showToast     = useStore(s => s.showToast)
  const closeModal    = useStore(s => s.closeModal)
  const [form, setForm] = useState({ lokasi: '', subLokasi: '', jenis: 'Berjualan', jumlah: 1, sumber: 'Manual', pelapor: '' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const submit = () => {
    if (!form.lokasi) return
    tambahLaporan(form)
    showToast('✓ Laporan berhasil ditambahkan')
    closeModal()
  }

  return (
    <div className="m-box">
      <div className="m-head">
        <div><div className="m-head-title">Tambah Laporan Manual</div></div>
      </div>
      <div className="m-body">
        <div className="m-form-group">
          <label className="m-label">Lokasi *</label>
          <input className="m-input" placeholder="cth: Kawasan Megamas" value={form.lokasi} onChange={e => set('lokasi', e.target.value)} />
        </div>
        <div className="m-form-group">
          <label className="m-label">Sub-lokasi / Alamat</label>
          <input className="m-input" placeholder="cth: Jl. Pierre Tendean" value={form.subLokasi} onChange={e => set('subLokasi', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="m-form-group">
            <label className="m-label">Jenis</label>
            <select className="m-input" value={form.jenis} onChange={e => set('jenis', e.target.value)}>
              <option>Berjualan</option>
              <option>Mengamen</option>
              <option>Mengemis</option>
              <option>Figuran</option>
            </select>
          </div>
          <div className="m-form-group">
            <label className="m-label">Jumlah Anak</label>
            <input className="m-input" type="number" min={1} value={form.jumlah} onChange={e => set('jumlah', +e.target.value)} />
          </div>
        </div>
        <div className="m-form-group">
          <label className="m-label">Nama Pelapor</label>
          <input className="m-input" placeholder="Nama atau 'Anonim'" value={form.pelapor} onChange={e => set('pelapor', e.target.value)} />
        </div>
      </div>
      <div className="m-footer">
        <button className="m-btn m-btn-ghost" onClick={closeModal}>Batal</button>
        <button className="m-btn m-btn-primary" onClick={submit}>+ Simpan Laporan</button>
      </div>
    </div>
  )
}

/* ── Tambah Anak ── */
function TambahAnakModal() {
  const tambahAnak = useStore(s => s.tambahAnak)
  const showToast  = useStore(s => s.showToast)
  const closeModal = useStore(s => s.closeModal)
  const [form, setForm] = useState({ nama: '', usia: '', gender: 'Laki-laki', lokasi: '', aktivitas: 'Berjualan', status: 'proses' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const submit = () => {
    if (!form.nama || !form.lokasi) return
    tambahAnak(form)
    showToast('✓ Data anak berhasil ditambahkan')
    closeModal()
  }

  return (
    <div className="m-box">
      <div className="m-head">
        <div><div className="m-head-title">Tambah Data Anak</div></div>
      </div>
      <div className="m-body">
        <div className="m-form-group">
          <label className="m-label">Inisial Nama *</label>
          <input className="m-input" placeholder="cth: A.R." value={form.nama} onChange={e => set('nama', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="m-form-group">
            <label className="m-label">Estimasi Usia</label>
            <input className="m-input" placeholder="cth: ±9 thn" value={form.usia} onChange={e => set('usia', e.target.value)} />
          </div>
          <div className="m-form-group">
            <label className="m-label">Jenis Kelamin</label>
            <select className="m-input" value={form.gender} onChange={e => set('gender', e.target.value)}>
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </select>
          </div>
        </div>
        <div className="m-form-group">
          <label className="m-label">Lokasi Ditemukan *</label>
          <input className="m-input" placeholder="cth: Kawasan Megamas" value={form.lokasi} onChange={e => set('lokasi', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="m-form-group">
            <label className="m-label">Jenis Aktivitas</label>
            <select className="m-input" value={form.aktivitas} onChange={e => set('aktivitas', e.target.value)}>
              <option>Berjualan</option>
              <option>Mengamen</option>
              <option>Mengemis</option>
              <option>Figuran</option>
            </select>
          </div>
          <div className="m-form-group">
            <label className="m-label">Status</label>
            <select className="m-input" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="proses">Diproses</option>
              <option value="perlu">Perlu Tindak Lanjut</option>
              <option value="pulang">Sudah Pulang</option>
            </select>
          </div>
        </div>
      </div>
      <div className="m-footer">
        <button className="m-btn m-btn-ghost" onClick={closeModal}>Batal</button>
        <button className="m-btn m-btn-primary" onClick={submit}>+ Simpan Data</button>
      </div>
    </div>
  )
}

/* ── Lihat CCTV ── */
function LihatCCTVModal({ data }) {
  const closeModal = useStore(s => s.closeModal)
  return (
    <div className="m-box" style={{ maxWidth: 560 }}>
      <div className="m-head">
        <div><div className="m-head-title">{data?.camLabel || 'CCTV Live'}</div></div>
      </div>
      <div className="m-body">
        <div style={{ background: '#050e1a', borderRadius: 10, overflow: 'hidden', marginBottom: 12, aspectRatio: '16/9' }}>
          <SimulatedFeed label={data?.camLabel} hasAlert={data?.hasAlert} />
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: MUTED }}>
          <span>📍 {data?.lokasi}</span>
          <span>🎥 {data?.resolusi || '1080p'}</span>
          <span style={{ color: GREEN, fontWeight: 700 }}>● LIVE</span>
        </div>
      </div>
      <div className="m-footer">
        <button className="m-btn m-btn-ghost" onClick={closeModal}>Tutup</button>
      </div>
    </div>
  )
}

function SimulatedFeed({ label, hasAlert }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#050e1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="100%" height="100%" viewBox="0 0 560 315" style={{ position: 'absolute', inset: 0 }}>
        <rect width="560" height="315" fill="#060f1c"/>
        <rect y="220" width="560" height="95" fill="#0a1828"/>
        <rect x="0"   y="80"  width="90"  height="140" fill="#0d1f38" rx="2"/>
        <rect x="100" y="100" width="70"  height="120" fill="#0c1c32" rx="2"/>
        <rect x="180" y="60"  width="110" height="160" fill="#0e2040" rx="2"/>
        <rect x="350" y="90"  width="80"  height="130" fill="#0d1f38" rx="2"/>
        <rect x="440" y="70"  width="120" height="150" fill="#0c1c32" rx="2"/>
        <rect y="200" width="560" height="30" fill="#0f1e2e"/>
        <line x1="0" y1="215" x2="560" y2="215" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="20 15"/>
        <ellipse cx="180" cy="197" rx="10" ry="22" fill="#1a3050"/>
        <circle  cx="180" cy="170" r="8"   fill="#1a3050"/>
        <ellipse cx="230" cy="200" rx="9"  ry="20" fill="#1a3050"/>
        <circle  cx="230" cy="175" r="7"   fill="#1a3050"/>
        {hasAlert && <>
          <rect x="165" y="155" width="30" height="65" fill="none" stroke="#E8401C" strokeWidth="1.5" rx="1"/>
          <rect x="163" y="153" width="34" height="7" fill="#E8401C"/>
          <text x="180" y="158" textAnchor="middle" fill="#fff" fontSize="5" fontFamily="monospace">Anak 94%</text>
        </>}
        <text x="10" y="308" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">{new Date().toLocaleString('id-ID')}</text>
        <text x="550" y="308" textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">{label}</text>
      </svg>
    </div>
  )
}

/* ── Konfirmasi ── */
function KonfirmasiModal({ data }) {
  const closeModal = useStore(s => s.closeModal)
  return (
    <div className="m-box" style={{ maxWidth: 380 }}>
      <div className="m-head">
        <div><div className="m-head-title">{data?.judul}</div></div>
      </div>
      <div className="m-body">
        <div className="m-sub">{data?.deskripsi}</div>
      </div>
      <div className="m-footer">
        <button className="m-btn m-btn-ghost" onClick={closeModal}>Batal</button>
        <button className="m-btn m-btn-primary" onClick={() => { data?.onConfirm?.(); closeModal() }}>
          {data?.confirmLabel || 'Konfirmasi'}
        </button>
      </div>
    </div>
  )
}

/* ── Row helper ── */
function MRow({ label, value, mono, last }) {
  return (
    <div className="m-row" style={{ paddingBottom: last ? 0 : 9, marginBottom: last ? 0 : 9, borderBottom: last ? 'none' : `1px solid ${BORDER}` }}>
      <span className="m-row-label">{label}</span>
      <span className="m-row-val" style={{ fontFamily: mono ? 'monospace' : "'Plus Jakarta Sans', sans-serif" }}>{value}</span>
    </div>
  )
}