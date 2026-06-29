import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout    from './components/AdminLayout'
import PublicLayout   from './components/PublicLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Toast          from './components/Toast'
import Modal          from './components/Modal'
import Login          from './pages/Login'

// Admin pages
import AdminBeranda     from './pages/admin/Beranda'
import AdminCCTV        from './pages/admin/CCTV'
import AdminPeta        from './pages/admin/Peta'
import AdminNotifikasi  from './pages/admin/Notifikasi'
import AdminLaporan     from './pages/admin/Laporan'
import AdminStatistik   from './pages/admin/Statistik'
import AdminKelolaAkun  from './pages/admin/KelolaAkun'
import LaporanDetail    from './pages/admin/LaporanDetail'
import Petugas          from './pages/admin/Petugas'

// Dinas Sosial
import DinsosLayout    from './pages/dinasSosial/DinsosLayout'
import DinsosBeranda   from './pages/dinasSosial/DinsosBeranda'
import DinsosPeta      from './pages/dinasSosial/DinsosPeta'
import DinsosStatistik from './pages/dinasSosial/DinsosStatistik'
import DinsosExport    from './pages/dinasSosial/DinsosExport'
import DinsosKasus     from './pages/dinasSosial/DinsosKasus'

// Satpol PP
import SatpolLayout  from './pages/satpolpp/SatpolLayout'
import SatpolBeranda from './pages/satpolpp/SatpolBeranda'
import SatpolTugas   from './pages/satpolpp/SatpolTugas'
import SatpolInput   from './pages/satpolpp/SatpolInput'
import SatpolRiwayat from './pages/satpolpp/SatpolRiwayat'

// Public pages
import PubBeranda from './pages/public/Beranda'
import PubLaporan from './pages/public/BuatLaporan'
import PubRiwayat from './pages/public/Riwayat'
import PubPeta    from './pages/public/Peta'
import PubTentang from './pages/public/Tentang'

import './styles/globals.css'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"      element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* ── Admin ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index               element={<AdminBeranda />} />
          <Route path="cctv"         element={<AdminCCTV />} />
          <Route path="peta"         element={<AdminPeta />} />
          <Route path="notifikasi"   element={<AdminNotifikasi />} />
          <Route path="laporan"      element={<AdminLaporan />} />
          <Route path="laporan/:id"  element={<LaporanDetail />} />
          <Route path="statistik"    element={<AdminStatistik />} />
          <Route path="kelola-akun"  element={<AdminKelolaAkun />} />
          <Route path="petugas"      element={<Petugas />} />
        </Route>

        {/* ── Dinas Sosial ── */}
        <Route
          path="/dinsos"
          element={
            <ProtectedRoute requiredRole="dinsos">
              <DinsosLayout />
            </ProtectedRoute>
          }
        >
          <Route index               element={<Navigate to="beranda" replace />} />
          <Route path="beranda"      element={<DinsosBeranda />} />
          <Route path="peta"         element={<DinsosPeta />} />
          <Route path="statistik"    element={<DinsosStatistik />} />
          <Route path="export"       element={<DinsosExport />} />
          <Route path="kasus"        element={<DinsosKasus />} />
        </Route>

        {/* ── Satpol PP ── */}
        <Route
          path="/satpolpp"
          element={
            <ProtectedRoute requiredRole="satpol">
              <SatpolLayout />
            </ProtectedRoute>
          }
        >
          <Route index          element={<SatpolBeranda />} />
          <Route path="tugas"   element={<SatpolTugas />} />
          <Route path="input"   element={<SatpolInput />} />
          <Route path="riwayat" element={<SatpolRiwayat />} />
        </Route>

        {/* ── Public ── */}
        <Route
          path="/public"
          element={
            <ProtectedRoute requiredRole="public">
              <PublicLayout />
            </ProtectedRoute>
          }
        >
          <Route index           element={<PubBeranda />} />
          <Route path="laporan"  element={<PubLaporan />} />
          <Route path="riwayat"  element={<PubRiwayat />} />
          <Route path="peta"     element={<PubPeta />} />
          <Route path="tentang"  element={<PubTentang />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toast />
      <Modal />
    </HashRouter>
  )
}