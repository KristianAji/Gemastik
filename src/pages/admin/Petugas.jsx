import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { DEFAULT_PETUGAS } from '../../components/DetailLaporanContent'

const N      = '#022B3A'
const T      = '#3C6E71'
const TEXT   = '#1a2e3b'
const MUTED  = '#5A7080'
const BORDER = '#D6DCE4'
const CARD   = '#FFFFFF'
const BG     = '#E1E5F2'
const RED    = '#C0392B'

const Icon = {
  shield: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  plus:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 1 1 3 3L12 15l-4 1 1-4z"/></svg>,
  trash:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>,
  user:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  x:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
}

const BLANK = { nama:'', unit:'', wilayah:'' }

export default function AdminPetugas() {
  const storePetugas    = useStore(s => s.petugasList)
  const setPetugasStore = useStore(s => s.setPetugasList)
  const showToast       = useStore(s => s.showToast)

  // fallback ke state lokal kalau store belum punya petugasList/setPetugasList
  const [localList, setLocalList] = useState(storePetugas || DEFAULT_PETUGAS)
  const list    = storePetugas || localList
  const setList = (next) => {
    if (setPetugasStore) setPetugasStore(next)
    else setLocalList(next)
  }

  const [form, setForm]       = useState(BLANK)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm]   = useState(false)

  const resetForm = () => { setForm(BLANK); setEditingId(null); setShowForm(false) }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nama.trim() || !form.unit.trim() || !form.wilayah.trim()) {
      showToast?.('Lengkapi semua kolom terlebih dahulu')
      return
    }
    if (editingId) {
      setList(list.map(p => p.id === editingId ? { ...p, ...form } : p))
      showToast?.('Data petugas diperbarui')
    } else {
      setList([...list, { id:'p' + Date.now(), ...form }])
      showToast?.('Petugas / unit baru ditambahkan')
    }
    resetForm()
  }

  const handleEdit = (p) => {
    setForm({ nama:p.nama, unit:p.unit, wilayah:p.wilayah })
    setEditingId(p.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setList(list.filter(p => p.id !== id))
    showToast?.('Petugas / unit dihapus')
  }

  return (
    <div className="ap-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        .ap-root * { box-sizing:border-box; }
        .ap-root { font-family:'Inter', sans-serif; background:${BG}; color:${TEXT}; flex:1; overflow-y:auto; padding:28px 32px 60px; }

        .ap-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; margin-bottom:20px; }
        .ap-title-wrap { display:flex; align-items:center; gap:12px; }
        .ap-title-icon { width:42px; height:42px; border-radius:12px; background:rgba(60,110,113,0.1); border:1px solid rgba(60,110,113,0.25); display:flex; align-items:center; justify-content:center; color:${T}; }
        .ap-title { font-family:'Plus Jakarta Sans', sans-serif; font-size:19px; font-weight:800; color:${N}; }
        .ap-subtitle { font-size:12px; color:${MUTED}; margin-top:3px; }
        .ap-add-btn {
          display:flex; align-items:center; gap:8px; padding:11px 20px; border-radius:10px; border:none;
          background:${T}; color:#fff; font-size:12.5px; font-weight:700;
          font-family:'Plus Jakarta Sans', sans-serif; cursor:pointer; transition:background 0.15s;
        }
        .ap-add-btn:hover { background:#2f5759; }

        .ap-form-card {
          background:${CARD}; border:1px solid ${BORDER}; border-radius:14px; padding:20px; margin-bottom:18px;
        }
        .ap-form-title { font-family:'Plus Jakarta Sans', sans-serif; font-size:13px; font-weight:700; color:${N}; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between; }
        .ap-form-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:14px; }
        .ap-field-label { font-size:11px; font-weight:600; color:${MUTED}; margin-bottom:6px; display:block; }
        .ap-input {
          width:100%; padding:10px 12px; border-radius:9px; border:1px solid ${BORDER};
          font-size:12.5px; font-family:'Inter', sans-serif; color:${TEXT};
        }
        .ap-input:focus { outline:none; border-color:${T}; }
        .ap-form-actions { display:flex; gap:10px; justify-content:flex-end; }
        .ap-btn-cancel {
          padding:10px 18px; border-radius:9px; border:1px solid ${BORDER}; background:#fff; color:${MUTED};
          font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans', sans-serif; cursor:pointer;
        }
        .ap-btn-save {
          padding:10px 22px; border-radius:9px; border:none; background:${T}; color:#fff;
          font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans', sans-serif; cursor:pointer;
        }
        .ap-btn-save:hover { background:#2f5759; }

        .ap-table-card { background:${CARD}; border:1px solid ${BORDER}; border-radius:14px; overflow:hidden; }
        .ap-row {
          display:grid; grid-template-columns:46px 1.4fr 1fr 1fr 90px;
          align-items:center; padding:13px 18px; border-bottom:1px solid ${BORDER}; gap:10px;
        }
        .ap-row:last-child { border-bottom:none; }
        .ap-row.head { background:#F8FAFC; font-size:10.5px; font-weight:700; color:${MUTED}; text-transform:uppercase; letter-spacing:0.5px; padding:11px 18px; }
        .ap-avatar { width:32px; height:32px; border-radius:50%; background:rgba(60,110,113,0.1); border:1px solid rgba(60,110,113,0.25); display:flex; align-items:center; justify-content:center; color:${T}; }
        .ap-nama { font-size:12.5px; font-weight:700; color:${TEXT}; font-family:'Plus Jakarta Sans', sans-serif; }
        .ap-unit, .ap-wilayah { font-size:12px; color:${MUTED}; }
        .ap-row-actions { display:flex; gap:6px; justify-content:flex-end; }
        .ap-icon-btn {
          width:30px; height:30px; border-radius:8px; border:1px solid ${BORDER}; background:#fff;
          display:flex; align-items:center; justify-content:center; cursor:pointer; color:${MUTED}; transition:all 0.15s;
        }
        .ap-icon-btn:hover { border-color:${T}; color:${T}; }
        .ap-icon-btn.danger:hover { border-color:${RED}; color:${RED}; }
        .ap-empty { padding:50px 20px; text-align:center; color:${MUTED}; font-size:13px; }

        @media (max-width:800px) {
          .ap-form-grid { grid-template-columns:1fr; }
          .ap-row { grid-template-columns:36px 1fr; grid-template-areas:"avatar nama" ". unit" ". wilayah" ". actions"; row-gap:4px; }
          .ap-row.head { display:none; }
        }
      `}</style>

      <div className="ap-header">
        <div className="ap-title-wrap">
          <span className="ap-title-icon">{Icon.shield}</span>
          <div>
            <div className="ap-title">Petugas &amp; Unit UPTD PPA</div>
            <div className="ap-subtitle">Kelola daftar petugas/unit untuk penugasan pada laporan terverifikasi</div>
          </div>
        </div>
        {!showForm && (
          <button className="ap-add-btn" onClick={() => setShowForm(true)}>{Icon.plus} Tambah Petugas / Unit</button>
        )}
      </div>

      {showForm && (
        <form className="ap-form-card" onSubmit={handleSubmit}>
          <div className="ap-form-title">
            {editingId ? 'Edit Petugas / Unit' : 'Tambah Petugas / Unit Baru'}
            <span className="ap-icon-btn" onClick={resetForm} style={{ border:'none' }}>{Icon.x}</span>
          </div>
          <div className="ap-form-grid">
            <div>
              <label className="ap-field-label">Nama Petugas / Unit</label>
              <input className="ap-input" value={form.nama} onChange={e => setForm(f => ({ ...f, nama:e.target.value }))} placeholder="cth. UPTD PPA Unit Megamas" />
            </div>
            <div>
              <label className="ap-field-label">Unit / Divisi</label>
              <input className="ap-input" value={form.unit} onChange={e => setForm(f => ({ ...f, unit:e.target.value }))} placeholder="cth. Unit Reaksi Cepat" />
            </div>
            <div>
              <label className="ap-field-label">Wilayah Tugas</label>
              <input className="ap-input" value={form.wilayah} onChange={e => setForm(f => ({ ...f, wilayah:e.target.value }))} placeholder="cth. Wenang" />
            </div>
          </div>
          <div className="ap-form-actions">
            <button type="button" className="ap-btn-cancel" onClick={resetForm}>Batal</button>
            <button type="submit" className="ap-btn-save">{editingId ? 'Simpan Perubahan' : 'Tambah'}</button>
          </div>
        </form>
      )}

      <div className="ap-table-card">
        <div className="ap-row head">
          <span></span><span>Nama Petugas / Unit</span><span>Unit / Divisi</span><span>Wilayah</span><span></span>
        </div>
        {list.map(p => (
          <div key={p.id} className="ap-row">
            <span className="ap-avatar">{Icon.user}</span>
            <span className="ap-nama">{p.nama}</span>
            <span className="ap-unit">{p.unit}</span>
            <span className="ap-wilayah">{p.wilayah}</span>
            <div className="ap-row-actions">
              <span className="ap-icon-btn" onClick={() => handleEdit(p)}>{Icon.edit}</span>
              <span className="ap-icon-btn danger" onClick={() => handleDelete(p.id)}>{Icon.trash}</span>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="ap-empty">Belum ada data petugas / unit UPTD PPA</div>}
      </div>
    </div>
  )
}