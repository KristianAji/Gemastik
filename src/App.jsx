import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import PublicLayout from './components/PublicLayout'
import Toast from './components/Toast'
import Modal from './components/Modal'

// Admin pages
import AdminBeranda    from './pages/admin/Beranda'
import AdminCCTV       from './pages/admin/CCTV'
import AdminPeta       from './pages/admin/Peta'
import AdminNotifikasi from './pages/admin/Notifikasi'
import AdminLaporan    from './pages/admin/Laporan'
import AdminStatistik  from './pages/admin/Statistik'

// Public pages
import PubBeranda  from './pages/public/Beranda'
import PubLaporan  from './pages/public/BuatLaporan'
import PubRiwayat  from './pages/public/Riwayat'
import PubPeta     from './pages/public/Peta'
import PubTentang  from './pages/public/Tentang'

import './styles/globals.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminBeranda />} />
          <Route path="cctv"       element={<AdminCCTV />} />
          <Route path="peta"       element={<AdminPeta />} />
          <Route path="notifikasi" element={<AdminNotifikasi />} />
          <Route path="laporan"    element={<AdminLaporan />} />
          <Route path="statistik"  element={<AdminStatistik />} />
        </Route>

        {/* Public */}
        <Route path="/public" element={<PublicLayout />}>
          <Route index element={<PubBeranda />} />
          <Route path="laporan"  element={<PubLaporan />} />
          <Route path="riwayat"  element={<PubRiwayat />} />
          <Route path="peta"     element={<PubPeta />} />
          <Route path="tentang"  element={<PubTentang />} />
        </Route>
      </Routes>

      <Toast />
      <Modal />
    </BrowserRouter>
  )
}