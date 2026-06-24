import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout    from './components/AdminLayout'
import PublicLayout   from './components/PublicLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Toast          from './components/Toast'
import Modal          from './components/Modal'
import Login          from './pages/Login'

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
    <HashRouter>
      <Routes>
        {/* Root → halaman login */}
        <Route path="/"      element={<Navigate to="/public" replace />} />
        <Route path="/login" element={<Login />} />

        {/* ── Admin (hanya role 'admin') ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index          element={<AdminBeranda />} />
          <Route path="cctv"       element={<AdminCCTV />} />
          <Route path="peta"       element={<AdminPeta />} />
          <Route path="notifikasi" element={<AdminNotifikasi />} />
          <Route path="laporan"    element={<AdminLaporan />} />
          <Route path="statistik"  element={<AdminStatistik />} />
        </Route>

        {/* ── Public (hanya role 'public') ── */}
        // SESUDAH
          <Route path="/public" element={<PublicLayout />}>
          <Route index         element={<PubBeranda />} />
          <Route path="laporan"  element={<PubLaporan />} />
          <Route path="riwayat"  element={<PubRiwayat />} />
          <Route path="peta"     element={<PubPeta />} />
          <Route path="tentang"  element={<PubTentang />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toast />
      <Modal />
    </HashRouter>
  )
}