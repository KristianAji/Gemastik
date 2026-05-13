import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
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
    <div style={{
      minHeight: '100vh',
      background: '#0B1F3A',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '40px',
      fontWeight: 'bold'
    }}>
      DELCION BERHASIL
    </div>
  )
}