import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FooterPublic from '../../components/FooterPublic'


const REGULASI = [
  {
    id: 'uu13',
    kode: 'UU No. 13 Tahun 2003',
    judul: 'Undang-Undang Ketenagakerjaan',
    tahun: '2003',
    kategori: 'Undang-Undang',
    warna: '#E8401C',
    ringkasan: 'Regulasi utama yang melarang mempekerjakan anak pada pekerjaan-pekerjaan berbahaya serta mengatur syarat ketat jika anak diperbolehkan bekerja ringan.',
    konteks: 'Dirujuk langsung dalam proposal Delcion sebagai dasar hukum larangan pekerja anak jalanan di Kota Manado.',
    pasal: [
      { nomor:'Pasal 74', isi:'Siapapun dilarang mempekerjakan dan melibatkan anak pada pekerjaan-pekerjaan yang terburuk yang membahayakan fisik, mental, dan moral anak.', catatan:'Pasal ini secara tegas melarang individu maupun organisasi mana pun mempekerjakan anak pada pekerjaan terburuk — termasuk aktivitas di jalanan seperti mengamen, mengemis, dan berjualan yang membahayakan anak.' },
      { nomor:'Pasal 69 Ayat (2)', isi:'Apabila anak usia 13–15 tahun diperbolehkan bekerja untuk pekerjaan ringan, maka harus dipenuhi persyaratan ketat: ada izin tertulis orang tua atau wali, perjanjian kerja yang jelas, waktu kerja maksimal 3 jam sehari, dan tidak boleh mengganggu waktu sekolah.', catatan:'Ketentuan ini menunjukkan bahwa bahkan untuk pekerjaan "ringan" sekalipun, ada syarat ketat yang harus dipenuhi.' },
    ],
  },
  {
    id: 'uu35',
    kode: 'UU No. 35 Tahun 2014',
    judul: 'Perubahan atas UU No. 23 Tahun 2002 tentang Perlindungan Anak',
    tahun: '2014',
    kategori: 'Undang-Undang',
    warna: '#F5A623',
    ringkasan: 'Regulasi perlindungan anak yang mengatur larangan eksploitasi ekonomi terhadap anak beserta ancaman pidananya.',
    konteks: 'Menjadi salah satu landasan hukum utama yang diacu sistem Delcion dalam pengumpulan dan pengelolaan data laporan.',
    pasal: [
      { nomor:'Pasal 76I', isi:'Setiap orang dilarang menempatkan, membiarkan, melakukan, menyuruh melakukan, atau turut serta melakukan eksploitasi secara ekonomi dan/atau seksual terhadap anak.', catatan:'Pasal ini menjadi dasar hukum bahwa membiarkan anak bekerja di jalanan pun dapat dikategorikan sebagai pelanggaran hukum.' },
      { nomor:'Pasal 88', isi:'Setiap orang yang melanggar ketentuan sebagaimana dimaksud dalam Pasal 76I, dipidana dengan pidana penjara paling lama 10 (sepuluh) tahun dan/atau denda paling banyak Rp200.000.000,00.', catatan:'Sanksi pidana ini menjadi instrumen penegakan hukum yang kuat.' },
    ],
  },
  {
    id: 'uu27',
    kode: 'UU No. 27 Tahun 2022',
    judul: 'Undang-Undang Perlindungan Data Pribadi',
    tahun: '2022',
    kategori: 'Undang-Undang',
    warna: '#3B8FE8',
    ringkasan: 'Mengatur tata kelola data pribadi secara bertanggung jawab, menjadi landasan hukum perlindungan privasi anak dalam sistem Delcion.',
    konteks: 'Seluruh proses pengumpulan, penyimpanan, dan pengelolaan data dalam sistem Delcion mengacu pada UU ini.',
    pasal: [
      { nomor:'Prinsip Umum — Pasal 16', isi:'Pemrosesan data pribadi dilaksanakan secara terbatas dan spesifik, sah secara hukum, patut, dan transparan, serta memastikan keamanan data pribadi dari akses yang tidak sah.', catatan:'Delcion menerapkan prinsip ini dengan hanya mengumpulkan data yang diperlukan tanpa mewajibkan identitas pelapor.' },
      { nomor:'Perlindungan Data Anak', isi:'Data pribadi anak termasuk dalam kategori data pribadi yang bersifat spesifik dan wajib mendapat perlindungan lebih ketat dalam pemrosesan, penyimpanan, maupun penyebarannya.', catatan:'Delcion secara otomatis menyamarkan wajah anak yang terekam dalam foto laporan sebelum data disimpan.' },
    ],
  },
  {
    id: 'smartcity',
    kode: 'Kebijakan Smart City — Kominfo',
    judul: 'Kerangka Kota Cerdas Kementerian Komunikasi dan Informatika',
    tahun: '2017–kini',
    kategori: 'Kebijakan Pemerintah',
    warna: '#2ECC71',
    ringkasan: 'Smart City Kominfo mendefinisikan kota cerdas sebagai kota yang memanfaatkan TIK untuk meningkatkan efisiensi layanan dan kesejahteraan seluruh warganya.',
    konteks: 'Delcion dibangun di atas dua pilar utama Smart City yang relevan langsung dengan perlindungan anak jalanan.',
    pasal: [
      { nomor:'Pilar Smart Living', isi:'Kota cerdas menjamin keamanan dan perlindungan seluruh warga kota melalui pemanfaatan teknologi, termasuk kelompok yang paling rentan seperti anak-anak.', catatan:'Delcion mewujudkan pilar ini melalui sistem deteksi AI berbasis CCTV yang bekerja proaktif 24 jam.' },
      { nomor:'Pilar Smart Governance', isi:'Tata kelola pemerintahan yang responsif, berbasis data, dan lintas-instansi memanfaatkan TIK untuk mempercepat pengambilan keputusan dan layanan kepada masyarakat.', catatan:'Dashboard admin Delcion mengintegrasikan DP3A, Dinas Sosial, dan petugas lapangan dalam satu platform.' },
    ],
  },
  {
    id: 'uu1-2000',
    kode: 'UU No. 1 Tahun 2000',
    judul: 'Pengesahan Konvensi ILO No. 182 — Pelarangan Bentuk-Bentuk Pekerjaan Terburuk untuk Anak',
    tahun: '2000',
    kategori: 'UU / Ratifikasi Konvensi Internasional',
    warna: '#9B59B6',
    ringkasan: 'Indonesia secara resmi meratifikasi Konvensi ILO No. 182, mewajibkan negara mengambil tindakan segera untuk menghapus pekerjaan terburuk bagi anak.',
    konteks: 'Konvensi ini memperkuat posisi regulasi nasional dan menjadi referensi internasional bagi Delcion.',
    pasal: [
      { nomor:'Pasal 1 Konvensi ILO No. 182', isi:'Setiap anggota yang meratifikasi konvensi ini harus mengambil tindakan segera dan efektif untuk menjamin pelarangan dan penghapusan bentuk-bentuk pekerjaan terburuk untuk anak sebagai hal yang mendesak.', catatan:'Kata "segera" mencerminkan urgensi yang sama dengan filosofi Delcion: deteksi yang cepat dan respons petugas yang terkoordinasi.' },
      { nomor:'Pasal 3 Konvensi ILO No. 182', isi:'Bentuk-bentuk pekerjaan terburuk untuk anak mencakup: semua bentuk perbudakan atau praktik serupa; penggunaan anak untuk kegiatan tidak sah; pekerjaan yang membahayakan kesehatan, keselamatan, atau moral anak.', catatan:'Klasifikasi aktivitas yang dideteksi sistem Delcion langsung merujuk pada definisi "pekerjaan yang membahayakan" dalam pasal ini.' },
    ],
  },
]

const HAK_DASAR = [
  { judul:'Hak Pendidikan',   deskripsi:'Setiap anak berhak mendapat pendidikan dasar yang layak tanpa biaya. Tidak ada yang boleh menghalangi anak untuk bersekolah.', warna:'#3B8FE8' },
  { judul:'Hak Kesehatan',    deskripsi:'Anak berhak mendapatkan pelayanan kesehatan dan tumbuh dalam kondisi yang sehat, aman, dan terpenuhi gizinya.', warna:'#2ECC71' },
  { judul:'Hak Perlindungan', deskripsi:'Anak berhak dilindungi dari segala bentuk kekerasan, eksploitasi, pelecehan, dan penelantaran oleh siapa pun.', warna:'#E8401C' },
  { judul:'Hak Keluarga',     deskripsi:'Anak berhak mengetahui dan diasuh oleh orang tuanya, hidup bersama keluarga dalam lingkungan yang penuh kasih sayang.', warna:'#F5A623' },
  { judul:'Hak Bermain',      deskripsi:'Anak berhak untuk bermain, beristirahat, dan menikmati kegiatan seni dan budaya yang sesuai usia mereka.', warna:'#9B59B6' },
  { judul:'Hak Berpendapat',  deskripsi:'Anak berhak menyatakan pendapatnya dalam hal-hal yang mempengaruhi kehidupan mereka, dan pendapat itu harus didengar.', warna:'#E67E22' },
]

const FAQ = [
  { q:'Apa yang dimaksud dengan pekerja anak?', a:'Pekerja anak adalah anak di bawah usia 18 tahun yang terlibat dalam kegiatan ekonomi secara rutin, baik dibayar maupun tidak, yang mengganggu pendidikan, kesehatan, dan tumbuh kembang mereka. Termasuk: berjualan di jalanan, mengamen, mengemis, menjadi figuran berbayar, dan pekerjaan informal lainnya.' },
  { q:'Mengapa anak bekerja di jalanan berbahaya?', a:'Anak yang bekerja di jalanan rentan terhadap kecelakaan lalu lintas, eksploitasi oleh orang dewasa, paparan cuaca ekstrem, gangguan tumbuh kembang fisik dan psikologis, putus sekolah, serta menjadi korban perdagangan orang (trafficking).' },
  { q:'Apa yang harus dilakukan jika melihat anak bekerja?', a:'Jangan mengabaikan. Laporkan melalui aplikasi Delcion dengan mengisi formulir laporan, atau hubungi langsung Dinas Pemberdayaan Perempuan dan Perlindungan Anak (DP3A) Kota Manado. Jangan mencoba menangani sendiri karena bisa berbahaya.' },
  { q:'Apakah memberikan uang kepada anak yang mengemis membantu mereka?', a:'Tidak. Memberikan uang justru dapat melanggengkan siklus eksploitasi karena mendorong orang dewasa untuk terus mempekerjakan anak. Cara terbaik adalah melaporkan kepada pihak berwenang agar anak mendapat bantuan yang tepat dan berkelanjutan.' },
  { q:'Apa sanksi bagi yang mempekerjakan anak?', a:'Berdasarkan UU No. 35/2014 tentang Perlindungan Anak Pasal 88, setiap orang yang mengeksploitasi anak secara ekonomi dapat dipidana penjara paling lama 10 tahun dan/atau denda paling banyak Rp200.000.000.' },
]

const KONTAK = [
  { label:'Hotline DP3A Manado', value:'(0431) 864-xxx', color:'#2ECC71' },
  { label:'SAPA 129 (Kemsos)',   value:'129',             color:'#3B8FE8' },
  { label:'Email Pengaduan',     value:'dp3a@manadokota.go.id', color:'#F5A623' },
  { label:'Kantor DP3A Manado',  value:'Jl. Balaikota No. 1, Manado', color:'#1F7A8C' },
]

/* ── SVG Icons ── */
function IconBase({ size=14, color='currentColor', sw=2.2, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
      {children}
    </svg>
  )
}
function IconShield(p)     { return <IconBase {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></IconBase> }
function IconBook(p)       { return <IconBase {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></IconBase> }
function IconHelpCircle(p) { return <IconBase {...p}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></IconBase> }
function IconPhone(p)      { return <IconBase {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></IconBase> }
function IconGlobe(p)      { return <IconBase {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></IconBase> }
function IconUsers(p)      { return <IconBase {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></IconBase> }
function IconScale(p)      { return <IconBase {...p}><line x1="12" y1="3" x2="12" y2="21"/><path d="M3 6l9-3 9 3"/><path d="M3 18l9 3 9-3"/></IconBase> }
function IconStar(p)       { return <IconBase {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></IconBase> }
function IconAlertTriangle(p) { return <IconBase {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></IconBase> }
function IconChevronDown(p){ return <IconBase {...p}><polyline points="6 9 12 15 18 9"/></IconBase> }
function IconPlus(p)       { return <IconBase {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></IconBase> }
function IconMinus(p)      { return <IconBase {...p}><line x1="5" y1="12" x2="19" y2="12"/></IconBase> }
function IconCpu(p)        { return <IconBase {...p}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></IconBase> }
function IconVideo(p)      { return <IconBase {...p}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></IconBase> }
function IconMessageSquare(p){ return <IconBase {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></IconBase> }
function IconMapPin(p)     { return <IconBase {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></IconBase> }
function IconMail(p)       { return <IconBase {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></IconBase> }

const TABS = [
  { id:'hak',      label:'Hak Dasar Anak',  Icon: IconShield },
  { id:'regulasi', label:'Regulasi & Hukum', Icon: IconBook },
  { id:'faq',      label:'Tanya Jawab',      Icon: IconHelpCircle },
  { id:'kontak',   label:'Kontak & Bantuan', Icon: IconPhone },
]

const HAK_ICONS = [IconBook, IconShield, IconShield, IconUsers, IconStar, IconMessageSquare]

const KONTAK_ICONS = [IconPhone, IconPhone, IconMail, IconMapPin]

export default function PubTentang() {
  const [activeReg, setActiveReg] = useState(null)
  const [activeFaq, setActiveFaq] = useState(null)
  const [activeTab, setActiveTab] = useState('hak')
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .tentang-root {
          font-family: 'Inter', sans-serif;
          background: #E1E5F2;
          color: #022B3A;
          min-height: 100vh;
        }

        /* ── HEADER — identik PubBuatLaporan ── */
        .page-title-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.page-title-logo {
  width: 42px;
  height: 42px;
  object-fit: contain;
  flex-shrink: 0;
}
        .tentang-header {
          background: #022B3A;
          padding: 48px 40px 40px;
          position: relative;
          overflow: hidden;
        }
        .tentang-header::after {
          content: '';
          position: absolute;
          right: -60px; top: -60px;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(31,122,140,0.35) 0%, transparent 70%);
          pointer-events: none;
        }
        .tentang-header-inner {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .tentang-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 500;
          color: rgba(191,219,247,0.55);
          margin-bottom: 16px;
        }
        .tentang-breadcrumb button {
          background: none; border: none; padding: 0; cursor: pointer;
          font-size: 12px; font-family: 'Inter', sans-serif;
          color: rgba(191,219,247,0.55); transition: color 0.15s;
        }
        .tentang-breadcrumb button:hover { color: #BFDBF7; }
        .tentang-breadcrumb span { color: #BFDBF7; }
        .tentang-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(191,219,247,0.12);
          border: 1px solid rgba(191,219,247,0.25);
          border-radius: 999px; padding: 4px 12px;
          font-size: 11px; font-weight: 600;
          color: #BFDBF7; letter-spacing: 0.04em;
          margin-bottom: 14px;
        }
        .tentang-page-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800; color: #FFFFFF;
          margin: 0 0 10px; line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .tentang-page-title span { color: #BFDBF7; }
        .tentang-page-sub {
          font-size: 14px; color: rgba(191,219,247,0.75);
          line-height: 1.6; max-width: 560px; margin: 0;
        }

        /* ── BODY ── */
        .tentang-body {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 40px 80px;
          box-sizing: border-box;
        }

        /* ── STAT BANNER ── */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 12px;
          margin-bottom: 28px;
        }
        .stat-card {
          background: #FFFFFF;
          border: 1px solid #D6DCE4;
          border-radius: 14px;
          padding: 20px 16px;
          text-align: center;
        }
        .stat-icon {
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 10px;
        }
        .stat-num {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 20px; font-weight: 800;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 11px; color: #5A7080; line-height: 1.5;
        }

        /* ── TABS ── */
        .tab-bar {
          display: flex; gap: 4px;
          background: #FFFFFF;
          border: 1px solid #D6DCE4;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
          overflow-x: auto;
        }
        .tab-btn {
          flex: 1; padding: 9px 12px;
          border-radius: 9px; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; font-weight: 700;
          white-space: nowrap;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.2s;
        }
        .tab-btn.active {
          background: #022B3A; color: #FFFFFF;
        }
        .tab-btn:not(.active) {
          background: transparent; color: #5A7080;
        }
        .tab-btn:not(.active):hover {
          background: #E1E5F2; color: #022B3A;
        }

        /* ── SECTION CARD — sama dengan form-card ── */
        .section-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #D6DCE4;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .section-card-header {
          background: #022B3A;
          padding: 16px 24px;
          display: flex; align-items: center; gap: 10px;
        }
        .section-card-icon {
          width: 32px; height: 32px;
          background: rgba(191,219,247,0.15);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .section-card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700; color: #FFFFFF;
        }
        .section-card-sub {
          font-size: 11px; color: rgba(191,219,247,0.6); margin-top: 1px;
        }
        .section-card-body {
          padding: 24px;
        }

        /* ── HAK DASAR ── */
        .hak-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px,1fr));
          gap: 12px;
          margin-bottom: 20px;
        }
        .hak-item {
          background: #F8FAFC;
          border: 1px solid #D6DCE4;
          border-radius: 12px;
          padding: 18px 16px;
          transition: transform 0.15s;
          border-top-width: 3px;
        }
        .hak-item:hover { transform: translateY(-2px); }
        .hak-icon { margin-bottom: 12px; }
        .hak-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700; margin-bottom: 6px;
        }
        .hak-desc { font-size: 12px; color: #5A7080; line-height: 1.7; }

        /* ── 4 PRINSIP ── */
        .prinsip-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px,1fr));
          gap: 10px;
        }
        .prinsip-item {
          background: #F8FAFC;
          border-radius: 10px;
          padding: 14px;
          border-left-width: 3px;
          border-left-style: solid;
        }
        .prinsip-num {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 20px; font-weight: 800; margin-bottom: 6px;
        }
        .prinsip-title { font-size: 12px; font-weight: 700; margin-bottom: 5px; color: #022B3A; }
        .prinsip-desc  { font-size: 11px; color: #5A7080; line-height: 1.6; }

        /* ── REGULASI ── */
        .reg-card {
          background: #FFFFFF;
          border: 1px solid #D6DCE4;
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 0.2s;
          margin-bottom: 10px;
        }
        .reg-header {
          padding: 16px 20px;
          cursor: pointer;
          display: flex; align-items: center; gap: 14px;
          transition: background 0.15s;
        }
        .reg-kode {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 800;
        }
        .reg-kategori-pill {
          font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 999px;
        }
        .reg-tahun { font-size: 10px; color: #94A3B0; }
        .reg-judul { font-size: 13px; font-weight: 600; margin: 3px 0; color: #022B3A; line-height: 1.4; }
        .reg-ringkasan { font-size: 12px; color: #5A7080; }
        .reg-body {
          padding: 16px 20px;
        }
        .reg-pasal-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1px; margin-bottom: 12px;
        }
        .reg-pasal-item {
          background: #F8FAFC;
          border-radius: 10px;
          padding: 14px 16px;
          border-left-width: 3px;
          border-left-style: solid;
          margin-bottom: 10px;
        }
        .reg-pasal-num { font-size: 12px; font-weight: 700; margin-bottom: 6px; }
        .reg-pasal-isi { font-size: 12px; color: #5A7080; line-height: 1.7; font-style: italic; }
        .reg-footer {
          margin-top: 12px; padding: 10px 14px;
          background: rgba(2,43,58,0.03);
          border-radius: 8px;
          font-size: 11px; color: #94A3B0; line-height: 1.6;
        }

        /* ── TIMELINE ── */
        .timeline-wrap {
          position: relative; padding-left: 24px;
        }
        .timeline-line {
          position: absolute; left: 7px; top: 0; bottom: 0;
          width: 2px; background: #D6DCE4;
        }
        .timeline-item {
          display: flex; gap: 14px;
          margin-bottom: 16px;
          position: relative;
        }
        .timeline-dot {
          position: absolute; left: -21px; top: 3px;
          width: 10px; height: 10px; border-radius: 50%;
          border: 2px solid #E1E5F2; flex-shrink: 0;
        }
        .timeline-year {
          font-size: 11px; font-weight: 800;
          font-family: monospace;
        }
        .timeline-event { font-size: 12px; color: #5A7080; margin-left: 10px; }

        /* ── FAQ ── */
        .faq-item {
          background: #FFFFFF;
          border: 1.5px solid #D6DCE4;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 8px;
          transition: border-color 0.2s;
        }
        .faq-q {
          padding: 16px 20px;
          cursor: pointer;
          display: flex; align-items: center;
          justify-content: space-between; gap: 12px;
        }
        .faq-q-text {
          font-size: 13px; font-weight: 600;
          color: #022B3A; line-height: 1.5;
          display: flex; align-items: flex-start; gap: 8px;
        }
        .faq-q-prefix {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800; color: #1F7A8C; flex-shrink: 0;
        }
        .faq-a {
          padding: 0 20px 16px;
          border-top: 1px solid #E1E5F2;
        }
        .faq-a-text {
          padding-top: 14px;
          font-size: 13px; color: #5A7080; line-height: 1.8;
          display: flex; gap: 8px;
        }
        .faq-a-prefix {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800; color: #2ECC71; flex-shrink: 0;
        }

        /* ── PERINGATAN ── */
        .warning-card {
          background: rgba(232,64,28,0.05);
          border: 1px solid rgba(232,64,28,0.2);
          border-radius: 14px;
          padding: 24px;
          margin-top: 20px;
        }
        .warning-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          color: #E8401C; margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .warning-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px,1fr));
          gap: 8px;
        }
        .warning-item {
          display: flex; gap: 8px; align-items: flex-start;
          padding: 10px 12px;
          background: rgba(232,64,28,0.04);
          border-radius: 8px;
          font-size: 12px; color: #5A7080; line-height: 1.5;
        }

        /* ── KONTAK ── */
        .darurat-banner {
          background: rgba(232,64,28,0.06);
          border: 1px solid rgba(232,64,28,0.25);
          border-radius: 14px;
          padding: 20px 24px;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 16px;
        }
        .darurat-icon {
          width: 48px; height: 48px;
          background: rgba(232,64,28,0.1);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .darurat-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 800; color: #E8401C; margin-bottom: 4px;
        }
        .darurat-desc { font-size: 13px; color: #5A7080; line-height: 1.6; }
        .btn-darurat {
          padding: 12px 20px; background: #E8401C; color: #fff;
          border: none; border-radius: 10px; cursor: pointer; flex-shrink: 0;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700;
          display: flex; align-items: center; gap: 6px;
          transition: background 0.2s;
        }
        .btn-darurat:hover { background: #c73217; }

        .kontak-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px,1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        .kontak-card {
          background: #F8FAFC;
          border: 1px solid #D6DCE4;
          border-radius: 12px;
          padding: 20px;
          border-top-width: 3px;
          border-top-style: solid;
          transition: transform 0.15s;
        }
        .kontak-card:hover { transform: translateY(-2px); }
        .kontak-icon { margin-bottom: 10px; }
        .kontak-label { font-size: 11px; color: #94A3B0; margin-bottom: 4px; }
        .kontak-value { font-size: 14px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; }

        /* Lembaga */
        .lembaga-row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #E1E5F2;
          font-size: 13px;
        }
        .lembaga-row:last-child { border-bottom: none; }
        .lembaga-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .lembaga-nama { font-weight: 600; color: #022B3A; }
        .lembaga-peran { font-size: 11px; color: #5A7080; }

        /* About Delcion */
        .delcion-card {
          background: linear-gradient(120deg, #022B3A, #0f3a50);
          border: 1px solid rgba(31,122,140,0.25);
          border-radius: 16px;
          padding: 24px;
          margin-top: 16px;
        }
        .delcion-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 700; color: #FFFFFF; margin-bottom: 12px;
        }
        .delcion-desc {
          font-size: 13px; color: rgba(191,219,247,0.75); line-height: 1.8; margin-bottom: 20px;
        }
        .delcion-feat-grid {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 12px;
        }
        .delcion-feat {
          background: rgba(255,255,255,0.06);
          border-radius: 10px; padding: 14px;
          text-align: center;
        }
        .delcion-feat-icon { margin-bottom: 8px; display: flex; justify-content: center; }
        .delcion-feat-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;
        }
        .delcion-feat-desc { font-size: 10px; color: rgba(191,219,247,0.6); line-height: 1.5; }
        .delcion-footer {
          margin-top: 16px; padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-size: 11px; color: rgba(191,219,247,0.4); line-height: 1.6;
        }

        /* ── Responsif ── */
        @media (max-width: 768px) {
          .tentang-header { padding: 40px 24px 32px; }
          .tentang-body   { padding: 24px 16px 60px; }
          .stat-grid      { grid-template-columns: repeat(3,1fr); }
          .delcion-feat-grid { grid-template-columns: 1fr; }
          .darurat-banner { flex-wrap: wrap; }
        }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="tentang-root">

        {/* ══ HEADER ══ */}
        <div className="tentang-header">
          <div className="tentang-header-inner">
            <div className="tentang-breadcrumb">
              <button onClick={() => navigate('/public')}>Beranda</button>
              <span>›</span>
              <span>Tentang</span>
            </div>
            <div className="tentang-badge">Edukasi & Informasi</div>
            <div className="page-title-row">
              <img
                src={`${import.meta.env.BASE_URL}logowhite.png`}
                alt="Logo Delcion"
                className="page-title-logo"
              />

              <h1 className="laporan-page-title">
                Edukasi <span>Perlindungan Anak</span>
              </h1>
            </div>
            <p className="tentang-page-sub">
              Memahami hak-hak anak dan regulasi yang melindungi mereka adalah langkah pertama
              untuk menciptakan Kota Manado yang aman dan layak bagi setiap anak.
            </p>
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div className="tentang-body">

          {/* Stat banner */}
          <div className="stat-grid">
            {[
              { num:'160 Juta', label:'Anak pekerja di dunia (ILO 2022)', color:'#1F7A8C', Icon: IconGlobe },
              { num:'1,5 Juta', label:'Pekerja anak di Indonesia',         color:'#F5A623', Icon: IconUsers },
              { num:'18 Tahun', label:'Batas usia anak menurut hukum',     color:'#3B8FE8', Icon: IconScale },
            ].map((s,i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon"><s.Icon size={22} color={s.color} /></div>
                <div className="stat-num" style={{color: s.color}}>{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div className="tab-bar">
            {TABS.map(t => (
              <button key={t.id}
                className={`tab-btn ${activeTab===t.id?'active':''}`}
                onClick={() => setActiveTab(t.id)}>
                <t.Icon size={13} color={activeTab===t.id ? '#BFDBF7' : '#5A7080'} />
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Tab: Hak Dasar ── */}
          {activeTab === 'hak' && (
            <>
              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-icon"><IconShield size={16} color="#BFDBF7" /></div>
                  <div>
                    <div className="section-card-title">Hak Dasar Setiap Anak</div>
                    <div className="section-card-sub">Berdasarkan Konvensi Hak Anak PBB dan UU Perlindungan Anak No. 35/2014</div>
                  </div>
                </div>
                <div className="section-card-body">
                  <p style={{fontSize:13, color:'#5A7080', lineHeight:1.7, marginBottom:20, marginTop:0}}>
                    Setiap anak tanpa terkecuali memiliki hak-hak dasar berikut yang wajib dipenuhi dan
                    dilindungi oleh negara, keluarga, dan masyarakat.
                  </p>
                  <div className="hak-grid">
                    {HAK_DASAR.map((h,i) => {
                      const HakIcon = HAK_ICONS[i] || IconShield
                      return (
                        <div key={i} className="hak-item" style={{borderTopColor: h.warna}}>
                          <div className="hak-icon"><HakIcon size={22} color={h.warna} /></div>
                          <div className="hak-title" style={{color: h.warna}}>{h.judul}</div>
                          <div className="hak-desc">{h.deskripsi}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-icon"><IconStar size={16} color="#BFDBF7" /></div>
                  <div>
                    <div className="section-card-title">4 Prinsip Utama Konvensi Hak Anak PBB</div>
                    <div className="section-card-sub">Landasan universal perlindungan anak</div>
                  </div>
                </div>
                <div className="section-card-body">
                  <div className="prinsip-grid">
                    {[
                      { num:'01', judul:'Non-Diskriminasi',          desc:'Semua hak berlaku untuk setiap anak tanpa pengecualian', color:'#E8401C' },
                      { num:'02', judul:'Kepentingan Terbaik Anak',  desc:'Semua tindakan harus mengutamakan kepentingan terbaik anak', color:'#F5A623' },
                      { num:'03', judul:'Hak Hidup & Berkembang',    desc:'Anak berhak hidup dan negara wajib memastikan kelangsungan hidupnya', color:'#2ECC71' },
                      { num:'04', judul:'Penghargaan Pandangan Anak',desc:'Pendapat anak harus didengar dalam semua hal yang menyangkut mereka', color:'#3B8FE8' },
                    ].map(p => (
                      <div key={p.num} className="prinsip-item" style={{borderLeftColor: p.color}}>
                        <div className="prinsip-num" style={{color: p.color}}>{p.num}</div>
                        <div className="prinsip-title">{p.judul}</div>
                        <div className="prinsip-desc">{p.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab: Regulasi ── */}
          {activeTab === 'regulasi' && (
            <>
              <div className="section-card" style={{marginBottom:16}}>
                <div className="section-card-header">
                  <div className="section-card-icon"><IconBook size={16} color="#BFDBF7" /></div>
                  <div>
                    <div className="section-card-title">Regulasi & Dasar Hukum</div>
                    <div className="section-card-sub">Klik setiap kartu untuk membaca pasal-pasal terkait</div>
                  </div>
                </div>
                <div className="section-card-body" style={{paddingBottom:8}}>
                  <p style={{fontSize:13, color:'#5A7080', lineHeight:1.7, marginTop:0, marginBottom:20}}>
                    Perlindungan anak dari eksploitasi ekonomi diatur dalam berbagai peraturan perundang-undangan,
                    mulai dari tingkat konstitusi hingga konvensi internasional yang telah diratifikasi Indonesia.
                  </p>
                  {REGULASI.map(reg => (
                    <div key={reg.id} className="reg-card"
                      style={{borderColor: activeReg===reg.id ? reg.warna : '#D6DCE4'}}>
                      <div className="reg-header"
                        style={{background: activeReg===reg.id ? `${reg.warna}0D` : 'transparent'}}
                        onClick={() => setActiveReg(activeReg===reg.id ? null : reg.id)}>
                        <div style={{flex:1}}>
                          <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap'}}>
                            <span className="reg-kode" style={{color: reg.warna}}>{reg.kode}</span>
                            <span className="reg-kategori-pill"
                              style={{background:`${reg.warna}20`, color: reg.warna}}>{reg.kategori}</span>
                            <span className="reg-tahun">{reg.tahun}</span>
                          </div>
                          <div className="reg-judul">{reg.judul}</div>
                          <div className="reg-ringkasan">{reg.ringkasan}</div>
                        </div>
                        <div style={{flexShrink:0, transform: activeReg===reg.id?'rotate(180deg)':'rotate(0deg)', transition:'transform 0.2s'}}>
                          <IconChevronDown size={18} color="#94A3B0" />
                        </div>
                      </div>
                      {activeReg === reg.id && (
                        <div className="reg-body" style={{borderTop:`1px solid ${reg.warna}30`, background:`${reg.warna}05`}}>
                          <div className="reg-pasal-label" style={{color: reg.warna}}>Pasal-Pasal Terkait</div>
                          {reg.pasal.map((p,i) => (
                            <div key={i} className="reg-pasal-item" style={{borderLeftColor: reg.warna}}>
                              <div className="reg-pasal-num" style={{color: reg.warna}}>{p.nomor}</div>
                              <div className="reg-pasal-isi">"{p.isi}"</div>
                            </div>
                          ))}
                          <div className="reg-footer">
                            Untuk teks resmi dan lengkap, kunjungi{' '}
                            <a href="https://peraturan.bpk.go.id" target="_blank" rel="noopener noreferrer"
                              style={{color:'#3B8FE8'}}>peraturan.bpk.go.id</a>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-icon"><IconScale size={16} color="#BFDBF7" /></div>
                  <div>
                    <div className="section-card-title">Timeline Regulasi Perlindungan Anak</div>
                    <div className="section-card-sub">Perkembangan hukum perlindungan anak di Indonesia</div>
                  </div>
                </div>
                <div className="section-card-body">
                  <div className="timeline-wrap">
                    <div className="timeline-line"/>
                    {[
                      { tahun:'1945', event:'UUD 1945 — Landasan konstitusional perlindungan anak', color:'#E8401C' },
                      { tahun:'1979', event:'UU No. 4/1979 tentang Kesejahteraan Anak', color:'#F5A623' },
                      { tahun:'1990', event:'Indonesia meratifikasi Konvensi Hak Anak PBB', color:'#2ECC71' },
                      { tahun:'2000', event:'UU No. 1/2000 — Ratifikasi Konvensi ILO No. 182', color:'#3B8FE8' },
                      { tahun:'2002', event:'UU No. 23/2002 tentang Perlindungan Anak', color:'#9B59B6' },
                      { tahun:'2014', event:'UU No. 35/2014 — Perubahan & penguatan UU Perlindungan Anak', color:'#E8401C' },
                      { tahun:'2015', event:'Perpres No. 75/2015 — Rencana Aksi Penghapusan Pekerja Anak', color:'#E67E22' },
                      { tahun:'2016', event:'UU No. 17/2016 — Perlindungan Anak (Perpu)', color:'#F5A623' },
                    ].map((t,i) => (
                      <div key={i} className="timeline-item">
                        <div className="timeline-dot" style={{background: t.color}}/>
                        <div>
                          <span className="timeline-year" style={{color: t.color}}>{t.tahun}</span>
                          <span className="timeline-event">{t.event}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab: FAQ ── */}
          {activeTab === 'faq' && (
            <>
              <div className="section-card" style={{marginBottom:16}}>
                <div className="section-card-header">
                  <div className="section-card-icon"><IconHelpCircle size={16} color="#BFDBF7" /></div>
                  <div>
                    <div className="section-card-title">Pertanyaan yang Sering Ditanyakan</div>
                    <div className="section-card-sub">Temukan jawaban seputar perlindungan anak</div>
                  </div>
                </div>
                <div className="section-card-body">
                  {FAQ.map((f,i) => (
                    <div key={i} className="faq-item"
                      style={{borderColor: activeFaq===i ? '#1F7A8C' : '#D6DCE4'}}>
                      <div className="faq-q" onClick={() => setActiveFaq(activeFaq===i ? null : i)}>
                        <div className="faq-q-text">
                          <span className="faq-q-prefix">Q.</span>
                          {f.q}
                        </div>
                        {activeFaq===i
                          ? <IconMinus size={16} color="#1F7A8C" />
                          : <IconPlus  size={16} color="#94A3B0" />}
                      </div>
                      {activeFaq===i && (
                        <div className="faq-a">
                          <div className="faq-a-text">
                            <span className="faq-a-prefix">A.</span>
                            {f.a}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="warning-card">
                <div className="warning-title">
                  <IconAlertTriangle size={16} color="#E8401C" />
                  Tanda-Tanda Anak Membutuhkan Pertolongan
                </div>
                <div className="warning-grid">
                  {[
                    'Anak berusia di bawah 18 tahun berjualan di jalanan',
                    'Anak mengamen sendirian atau dalam kelompok',
                    'Anak mengemis atau meminta-minta kepada orang dewasa',
                    'Anak memakai kostum figuran untuk meminta uang',
                    'Anak tampak kelelahan, kotor, atau tidak terawat',
                    'Anak berada di jalanan pada jam sekolah',
                    'Anak terlihat diawasi atau diperintah orang dewasa',
                    'Anak menolak diajak ke tempat aman / takut',
                  ].map((t,i) => (
                    <div key={i} className="warning-item">
                      <IconAlertTriangle size={12} color="#E8401C" sw={2.5} style={{flexShrink:0, marginTop:1}} />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Tab: Kontak ── */}
          {activeTab === 'kontak' && (
            <>
              <div className="darurat-banner">
                <div className="darurat-icon">
                  <IconPhone size={22} color="#E8401C" />
                </div>
                <div style={{flex:1}}>
                  <div className="darurat-title">Situasi Darurat? Hubungi 112</div>
                  <div className="darurat-desc">
                    Jika anak dalam bahaya langsung atau situasi darurat, segera hubungi 112
                    (nomor darurat nasional) atau 110 (Kepolisian).
                  </div>
                </div>
                <a href="tel:112">
                  <button className="btn-darurat">
                    <IconPhone size={14} color="#fff" />
                    112
                  </button>
                </a>
              </div>

              <div className="kontak-grid">
                {KONTAK.map((k,i) => {
                  const KIcon = KONTAK_ICONS[i]
                  return (
                    <div key={i} className="kontak-card" style={{borderTopColor: k.color}}>
                      <div className="kontak-icon"><KIcon size={22} color={k.color} /></div>
                      <div className="kontak-label">{k.label}</div>
                      <div className="kontak-value" style={{color: k.color}}>{k.value}</div>
                    </div>
                  )
                })}
              </div>

              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-icon"><IconUsers size={16} color="#BFDBF7" /></div>
                  <div>
                    <div className="section-card-title">Lembaga & Organisasi Terkait</div>
                    <div className="section-card-sub">Instansi yang dapat dihubungi untuk bantuan</div>
                  </div>
                </div>
                <div className="section-card-body">
                  {[
                    { nama:'DP3A Kota Manado',       peran:'Dinas Pemberdayaan Perempuan dan Perlindungan Anak', color:'#E8401C' },
                    { nama:'Dinas Sosial Kota Manado',peran:'Penanganan dan rehabilitasi anak terlantar',         color:'#3B8FE8' },
                    { nama:'Komnas Perlindungan Anak',peran:'Advokasi dan perlindungan hak anak nasional',        color:'#2ECC71' },
                    { nama:'KPAI',                    peran:'Komisi Perlindungan Anak Indonesia',                 color:'#F5A623' },
                    { nama:'ILO Indonesia',           peran:'Program penghapusan pekerja anak',                   color:'#9B59B6' },
                    { nama:'UNICEF Indonesia',        peran:'Perlindungan dan advokasi hak anak',                 color:'#3B8FE8' },
                  ].map((l,i) => (
                    <div key={i} className="lembaga-row">
                      <div className="lembaga-dot" style={{background: l.color}}/>
                      <div>
                        <div className="lembaga-nama">{l.nama}</div>
                        <div className="lembaga-peran">{l.peran}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="delcion-card">
                <div className="delcion-title">Tentang Delcion</div>
                <p className="delcion-desc">
                  <strong style={{color:'#FFFFFF'}}>Delcion</strong> adalah sistem monitoring pekerja anak berbasis
                  kecerdasan buatan yang dikembangkan untuk mendukung program perlindungan anak Kota Manado.
                  Sistem ini mengintegrasikan kamera CCTV, deteksi AI (YOLOv8 + MiVolo), pelaporan warga,
                  dan koordinasi petugas lapangan dalam satu platform terpadu.
                </p>
                <div className="delcion-feat-grid">
                  {[
                    { Icon: IconCpu,            label:'AI Detection',      desc:'YOLOv8 + MiVolo untuk deteksi dan estimasi usia' },
                    { Icon: IconVideo,           label:'CCTV Monitoring',   desc:'4 kamera aktif di titik-titik rawan kota' },
                    { Icon: IconMessageSquare,   label:'Partisipasi Warga', desc:'Platform laporan warga yang mudah dan cepat' },
                  ].map((f,i) => (
                    <div key={i} className="delcion-feat">
                      <div className="delcion-feat-icon"><f.Icon size={22} color="#BFDBF7" /></div>
                      <div className="delcion-feat-label">{f.label}</div>
                      <div className="delcion-feat-desc">{f.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="delcion-footer">
                  Dikembangkan bekerja sama dengan Dinas Pemberdayaan Perempuan dan Perlindungan Anak (DP3A)
                  Kota Manado dan Dinas Komunikasi dan Informatika (Kominfo) Kota Manado. • Versi 1.0 — 2026
                </div>
              </div>
            </>
          )}

        </div>
        <FooterPublic />
        
      </div>
    </>
  )
}