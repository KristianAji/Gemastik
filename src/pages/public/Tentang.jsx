import { useState } from 'react'

const REGULASI = [
  {
    id: 'uu13',
    icon: '👷',
    kode: 'UU No. 13 Tahun 2003',
    judul: 'Undang-Undang Ketenagakerjaan',
    tahun: '2003',
    kategori: 'Undang-Undang',
    warna: '#E8401C',
    ringkasan: 'Regulasi utama yang melarang mempekerjakan anak pada pekerjaan-pekerjaan berbahaya serta mengatur syarat ketat jika anak diperbolehkan bekerja ringan.',
    konteks: 'Dirujuk langsung dalam proposal Delcion sebagai dasar hukum larangan pekerja anak jalanan di Kota Manado.',
    pasal: [
      {
        nomor: 'Pasal 74',
        isi: 'Siapapun dilarang mempekerjakan dan melibatkan anak pada pekerjaan-pekerjaan yang terburuk yang membahayakan fisik, mental, dan moral anak.',
        catatan: 'Pasal ini secara tegas melarang individu maupun organisasi mana pun mempekerjakan anak pada pekerjaan terburuk — termasuk aktivitas di jalanan seperti mengamen, mengemis, dan berjualan yang membahayakan anak.',
      },
      {
        nomor: 'Pasal 69 Ayat (2)',
        isi: 'Apabila anak usia 13–15 tahun diperbolehkan bekerja untuk pekerjaan ringan, maka harus dipenuhi persyaratan ketat: ada izin tertulis orang tua atau wali, perjanjian kerja yang jelas, waktu kerja maksimal 3 jam sehari, dan tidak boleh mengganggu waktu sekolah.',
        catatan: 'Ketentuan ini menunjukkan bahwa bahkan untuk pekerjaan "ringan" sekalipun, ada syarat ketat yang harus dipenuhi. Kenyataan di lapangan menunjukkan ketentuan-ketentuan ini masih sering tidak dipatuhi.',
      },
    ],
  },
  {
    id: 'uu35',
    icon: '⚖️',
    kode: 'UU No. 35 Tahun 2014',
    judul: 'Perubahan atas UU No. 23 Tahun 2002 tentang Perlindungan Anak',
    tahun: '2014',
    kategori: 'Undang-Undang',
    warna: '#F5A623',
    ringkasan: 'Regulasi perlindungan anak yang mengatur larangan eksploitasi ekonomi terhadap anak beserta ancaman pidananya, sekaligus menjadi acuan operasional sistem Delcion.',
    konteks: 'Menjadi salah satu landasan hukum utama yang diacu sistem Delcion dalam pengumpulan dan pengelolaan data laporan.',
    pasal: [
      {
        nomor: 'Pasal 76I',
        isi: 'Setiap orang dilarang menempatkan, membiarkan, melakukan, menyuruh melakukan, atau turut serta melakukan eksploitasi secara ekonomi dan/atau seksual terhadap anak.',
        catatan: 'Pasal ini menjadi dasar hukum bahwa membiarkan anak bekerja di jalanan pun dapat dikategorikan sebagai pelanggaran hukum.',
      },
      {
        nomor: 'Pasal 88',
        isi: 'Setiap orang yang melanggar ketentuan sebagaimana dimaksud dalam Pasal 76I, dipidana dengan pidana penjara paling lama 10 (sepuluh) tahun dan/atau denda paling banyak Rp200.000.000,00 (dua ratus juta rupiah).',
        catatan: 'Sanksi pidana ini menjadi instrumen penegakan hukum yang kuat — sistem Delcion membantu mengumpulkan bukti awal berupa data deteksi dan laporan warga yang dapat digunakan sebagai dasar penindakan.',
      },
    ],
  },
  {
    id: 'uu27',
    icon: '🔐',
    kode: 'UU No. 27 Tahun 2022',
    judul: 'Undang-Undang Perlindungan Data Pribadi',
    tahun: '2022',
    kategori: 'Undang-Undang',
    warna: '#3B8FE8',
    ringkasan: 'Mengatur tata kelola data pribadi secara bertanggung jawab, menjadi landasan hukum perlindungan privasi anak dalam sistem Delcion.',
    konteks: 'Seluruh proses pengumpulan, penyimpanan, dan pengelolaan data dalam sistem Delcion mengacu pada UU ini untuk memastikan operasional berjalan dalam koridor hukum.',
    pasal: [
      {
        nomor: 'Prinsip Umum — Pasal 16',
        isi: 'Pemrosesan data pribadi dilaksanakan secara terbatas dan spesifik, sah secara hukum, patut, dan transparan, serta memastikan keamanan data pribadi dari akses yang tidak sah.',
        catatan: 'Delcion menerapkan prinsip ini dengan hanya mengumpulkan data yang diperlukan (foto, lokasi GPS, waktu, deskripsi) tanpa mewajibkan identitas pelapor, serta mengenkripsi seluruh data yang tersimpan.',
      },
      {
        nomor: 'Perlindungan Data Anak',
        isi: 'Data pribadi anak termasuk dalam kategori data pribadi yang bersifat spesifik dan wajib mendapat perlindungan lebih ketat dalam pemrosesan, penyimpanan, maupun penyebarannya.',
        catatan: 'Sebagai implementasi nyata, Delcion secara otomatis menyamarkan (face blurring) wajah anak yang terekam dalam foto laporan sebelum data disimpan ke basis data, dan menghapus data tangkapan layar untuk laporan yang dinyatakan tidak valid oleh admin.',
      },
    ],
  },
  {
    id: 'smartcity',
    icon: '🏙️',
    kode: 'Kebijakan Smart City — Kominfo',
    judul: 'Kerangka Kota Cerdas Kementerian Komunikasi dan Informatika',
    tahun: '2017–kini',
    kategori: 'Kebijakan Pemerintah',
    warna: '#2ECC71',
    ringkasan: 'Konsep Smart City Kominfo mendefinisikan kota cerdas sebagai kota yang memanfaatkan TIK untuk meningkatkan efisiensi layanan dan kesejahteraan seluruh warganya — termasuk warga paling rentan.',
    konteks: 'Delcion dibangun tepat di atas dua pilar utama Smart City yang relevan langsung dengan perlindungan anak jalanan.',
    pasal: [
      {
        nomor: 'Pilar Smart Living',
        isi: 'Kota cerdas menjamin keamanan dan perlindungan seluruh warga kota melalui pemanfaatan teknologi, termasuk kelompok yang paling rentan seperti anak-anak.',
        catatan: 'Delcion mewujudkan pilar ini melalui sistem deteksi AI berbasis CCTV yang bekerja proaktif 24 jam — tidak lagi mengandalkan patroli manual yang terjadwal dan mudah dihindari.',
      },
      {
        nomor: 'Pilar Smart Governance',
        isi: 'Tata kelola pemerintahan yang responsif, berbasis data, dan lintas-instansi memanfaatkan TIK untuk mempercepat pengambilan keputusan dan layanan kepada masyarakat.',
        catatan: 'Dashboard admin Delcion mengintegrasikan DP3A, Dinas Sosial, dan petugas lapangan dalam satu platform — mengubah penanganan yang sebelumnya parsial dan tidak terkoordinasi menjadi sistem yang terpadu dan terukur.',
      },
    ],
  },
  {
    id: 'uu1-2000',
    icon: '🤝',
    kode: 'UU No. 1 Tahun 2000',
    judul: 'Pengesahan Konvensi ILO No. 182 — Pelarangan dan Tindakan Segera Penghapusan Bentuk-Bentuk Pekerjaan Terburuk untuk Anak',
    tahun: '2000',
    kategori: 'Undang-Undang / Ratifikasi Konvensi Internasional',
    warna: '#9B59B6',
    ringkasan: 'Indonesia secara resmi meratifikasi Konvensi ILO No. 182 melalui UU ini, mewajibkan negara mengambil tindakan segera untuk menghapus pekerjaan terburuk bagi anak.',
    konteks: 'Konvensi ini memperkuat posisi regulasi nasional dan menjadi referensi internasional bagi Delcion dalam mendefinisikan kategori aktivitas pekerja anak yang dipantau.',
    pasal: [
      {
        nomor: 'Pasal 1 Konvensi ILO No. 182',
        isi: 'Setiap anggota yang meratifikasi konvensi ini harus mengambil tindakan segera dan efektif untuk menjamin pelarangan dan penghapusan bentuk-bentuk pekerjaan terburuk untuk anak sebagai hal yang mendesak.',
        catatan: 'Kata "segera" di sini mencerminkan urgensi yang sama dengan filosofi Delcion: deteksi yang cepat dan respons petugas yang terkoordinasi — bukan lagi menunggu jadwal patroli.',
      },
      {
        nomor: 'Pasal 3 Konvensi ILO No. 182',
        isi: 'Bentuk-bentuk pekerjaan terburuk untuk anak mencakup: semua bentuk perbudakan atau praktik serupa perbudakan; penggunaan, penawaran atau pemberian anak untuk kegiatan tidak sah; pekerjaan yang sifatnya atau kondisi pelaksanaannya membahayakan kesehatan, keselamatan, atau moral anak.',
        catatan: 'Klasifikasi aktivitas yang dideteksi sistem Delcion (berjualan, mengamen, mengemis, figuran berbayar) langsung merujuk pada definisi "pekerjaan yang membahayakan" dalam pasal ini.',
      },
    ],
  },
]

const HAK_DASAR = [
  { icon:'🏫', judul:'Hak Pendidikan', deskripsi:'Setiap anak berhak mendapat pendidikan dasar yang layak tanpa biaya. Tidak ada yang boleh menghalangi anak untuk bersekolah.', warna:'#3B8FE8' },
  { icon:'🏥', judul:'Hak Kesehatan', deskripsi:'Anak berhak mendapatkan pelayanan kesehatan dan tumbuh dalam kondisi yang sehat, aman, dan terpenuhi gizinya.', warna:'#2ECC71' },
  { icon:'🛡️', judul:'Hak Perlindungan', deskripsi:'Anak berhak dilindungi dari segala bentuk kekerasan, eksploitasi, pelecehan, dan penelantaran oleh siapa pun.', warna:'#E8401C' },
  { icon:'👨‍👩‍👧', judul:'Hak Keluarga', deskripsi:'Anak berhak mengetahui dan diasuh oleh orang tuanya, hidup bersama keluarga dalam lingkungan yang penuh kasih sayang.', warna:'#F5A623' },
  { icon:'🎮', judul:'Hak Bermain', deskripsi:'Anak berhak untuk bermain, beristirahat, dan menikmati kegiatan seni dan budaya yang sesuai usia mereka.', warna:'#9B59B6' },
  { icon:'🗣️', judul:'Hak Berpendapat', deskripsi:'Anak berhak menyatakan pendapatnya dalam hal-hal yang mempengaruhi kehidupan mereka, dan pendapat itu harus didengar.', warna:'#E67E22' },
]

const FAQ = [
  {
    q: 'Apa yang dimaksud dengan pekerja anak?',
    a: 'Pekerja anak adalah anak di bawah usia 18 tahun yang terlibat dalam kegiatan ekonomi secara rutin, baik dibayar maupun tidak, yang mengganggu pendidikan, kesehatan, dan tumbuh kembang mereka. Termasuk di dalamnya: berjualan di jalanan, mengamen, mengemis, menjadi figuran berbayar, dan pekerjaan informal lainnya.',
  },
  {
    q: 'Mengapa anak bekerja di jalanan berbahaya?',
    a: 'Anak yang bekerja di jalanan rentan terhadap kecelakaan lalu lintas, eksploitasi oleh orang dewasa, paparan cuaca ekstrem, gangguan tumbuh kembang fisik dan psikologis, putus sekolah, serta menjadi korban perdagangan orang (trafficking).',
  },
  {
    q: 'Apa yang harus dilakukan jika melihat anak bekerja?',
    a: 'Jangan mengabaikan. Laporkan melalui aplikasi Delcion dengan mengisi formulir laporan, atau hubungi langsung Dinas Pemberdayaan Perempuan dan Perlindungan Anak (DP3A) Kota Manado. Jangan mencoba menangani sendiri karena bisa berbahaya.',
  },
  {
    q: 'Apakah memberikan uang kepada anak yang mengemis membantu mereka?',
    a: 'Tidak. Memberikan uang justru dapat melanggengkan siklus eksploitasi karena mendorong orang dewasa untuk terus mempekerjakan anak. Cara terbaik adalah melaporkan kepada pihak berwenang agar anak mendapat bantuan yang tepat dan berkelanjutan.',
  },
  {
    q: 'Apa sanksi bagi yang mempekerjakan anak?',
    a: 'Berdasarkan UU No. 35/2014 tentang Perlindungan Anak Pasal 88, setiap orang yang mengeksploitasi anak secara ekonomi dapat dipidana penjara paling lama 10 tahun dan/atau denda paling banyak Rp200.000.000.',
  },
]

const KONTAK = [
  { icon:'📞', label:'Hotline DP3A Manado', value:'(0431) 864-xxx', color:'var(--green)' },
  { icon:'📱', label:'SAPA 129 (Kemsos)', value:'129', color:'var(--blue)' },
  { icon:'📧', label:'Email Pengaduan', value:'dp3a@manadokota.go.id', color:'var(--amber)' },
  { icon:'🏢', label:'Kantor DP3A Manado', value:'Jl. Balaikota No. 1, Manado', color:'var(--accent)' },
]

export default function PubTentang() {
  const [activeReg, setActiveReg]   = useState(null)
  const [activeFaq, setActiveFaq]   = useState(null)
  const [activeTab, setActiveTab]   = useState('hak')

  const TABS = [
    { id:'hak',      label:'Hak Dasar Anak' },
    { id:'regulasi', label:'Regulasi & Hukum' },
    { id:'faq',      label:'Tanya Jawab' },
    { id:'kontak',   label:'Kontak & Bantuan' },
  ]

  return (
    <div style={{ maxWidth:780, margin:'0 auto', padding:'32px 20px 60px' }}>

      {/* Hero */}
      <div style={{ textAlign:'center', marginBottom:40 }}>
        <div style={{ fontSize:56, marginBottom:16 }}>🛡️</div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, lineHeight:1.2, marginBottom:12 }}>
          Edukasi Perlindungan Anak
        </h1>
        <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.8, maxWidth:560, margin:'0 auto' }}>
          Memahami hak-hak anak dan regulasi yang melindungi mereka adalah langkah pertama untuk menciptakan
          Kota Manado yang aman dan layak bagi setiap anak.
        </p>
      </div>

      {/* Stat banner */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:36 }}>
        {[
          { num:'160 Juta', label:'Anak pekerja di dunia (ILO 2022)', color:'var(--accent)', icon:'🌍' },
          { num:'1,5 Juta', label:'Pekerja anak di Indonesia', color:'var(--amber)', icon:'🇮🇩' },
          { num:'18 Tahun', label:'Batas usia anak menurut hukum', color:'var(--blue)', icon:'⚖️' },
        ].map((s,i) => (
          <div key={i} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:'18px 16px', textAlign:'center' }}>
            <div style={{ fontSize:22, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:s.color, marginBottom:4 }}>{s.num}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)', lineHeight:1.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, background:'var(--surface)', borderRadius:12, padding:4, marginBottom:28, overflowX:'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ flex:1, padding:'9px 14px', borderRadius:9, border:'none', cursor:'pointer',
              fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, whiteSpace:'nowrap',
              background: activeTab===t.id ? 'var(--accent)' : 'transparent',
              color: activeTab===t.id ? '#fff' : 'var(--text-muted)',
              transition:'all 0.2s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Hak Dasar ── */}
      {activeTab === 'hak' && (
        <div>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, marginBottom:8 }}>
              Hak Dasar Setiap Anak
            </div>
            <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.7 }}>
              Berdasarkan Konvensi Hak Anak PBB dan UU Perlindungan Anak No. 35/2014, setiap anak
              tanpa terkecuali memiliki hak-hak dasar berikut yang wajib dipenuhi dan dilindungi oleh
              negara, keluarga, dan masyarakat.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14, marginBottom:32 }}>
            {HAK_DASAR.map((h,i) => (
              <div key={i} style={{ background:'var(--surface)', border:`1px solid var(--border)`,
                borderTop:`3px solid ${h.warna}`, borderRadius:12, padding:'20px 18px', transition:'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                <div style={{ fontSize:30, marginBottom:12 }}>{h.icon}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, marginBottom:8, color:h.warna }}>{h.judul}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.7 }}>{h.deskripsi}</div>
              </div>
            ))}
          </div>

          {/* 4 prinsip */}
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:24 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, marginBottom:16 }}>
              4 Prinsip Utama Konvensi Hak Anak PBB
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
              {[
                { num:'01', judul:'Non-Diskriminasi', desc:'Semua hak berlaku untuk setiap anak tanpa pengecualian', color:'#E8401C' },
                { num:'02', judul:'Kepentingan Terbaik Anak', desc:'Semua tindakan harus mengutamakan kepentingan terbaik anak', color:'#F5A623' },
                { num:'03', judul:'Hak Hidup & Berkembang', desc:'Anak berhak hidup dan negara wajib memastikan kelangsungan hidupnya', color:'#2ECC71' },
                { num:'04', judul:'Penghargaan Pandangan Anak', desc:'Pendapat anak harus didengar dalam semua hal yang menyangkut mereka', color:'#3B8FE8' },
              ].map(p => (
                <div key={p.num} style={{ background:'var(--surface2)', borderRadius:10, padding:16, borderLeft:`3px solid ${p.color}` }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:p.color, marginBottom:6 }}>{p.num}</div>
                  <div style={{ fontSize:12, fontWeight:700, marginBottom:6 }}>{p.judul}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', lineHeight:1.6 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Regulasi ── */}
      {activeTab === 'regulasi' && (
        <div>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, marginBottom:8 }}>
              Regulasi &amp; Dasar Hukum
            </div>
            <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.7 }}>
              Perlindungan anak dari eksploitasi ekonomi diatur dalam berbagai peraturan perundang-undangan,
              mulai dari tingkat konstitusi hingga konvensi internasional yang telah diratifikasi Indonesia.
              Klik setiap kartu untuk membaca pasal-pasal terkait.
            </p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {REGULASI.map(reg => (
              <div key={reg.id}
                style={{ background:'var(--surface)', border:`1px solid ${activeReg===reg.id?reg.warna:'var(--border)'}`,
                  borderRadius:14, overflow:'hidden', transition:'all 0.2s' }}>

                {/* Header */}
                <div onClick={() => setActiveReg(activeReg===reg.id ? null : reg.id)}
                  style={{ padding:'16px 20px', cursor:'pointer', display:'flex', alignItems:'center', gap:14,
                    background: activeReg===reg.id ? `${reg.warna}10` : 'transparent' }}>
                  <div style={{ fontSize:28, flexShrink:0 }}>{reg.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                      <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:reg.warna }}>{reg.kode}</span>
                      <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99,
                        background:`${reg.warna}20`, color:reg.warna }}>{reg.kategori}</span>
                      <span style={{ fontSize:10, color:'var(--text-dim)' }}>{reg.tahun}</span>
                    </div>
                    <div style={{ fontSize:13, fontWeight:600, marginBottom:4, lineHeight:1.4 }}>{reg.judul}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>{reg.ringkasan}</div>
                  </div>
                  <div style={{ fontSize:18, color:'var(--text-dim)', flexShrink:0, transform: activeReg===reg.id?'rotate(180deg)':'rotate(0deg)', transition:'transform 0.2s' }}>▾</div>
                </div>

                {/* Expanded pasal */}
                {activeReg === reg.id && (
                  <div style={{ borderTop:`1px solid ${reg.warna}30`, padding:'16px 20px', background:`${reg.warna}06` }}>
                    <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color:reg.warna, marginBottom:12 }}>
                      Pasal-Pasal Terkait
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                      {reg.pasal.map((p, i) => (
                        <div key={i} style={{ background:'var(--surface2)', borderRadius:10, padding:'14px 16px', borderLeft:`3px solid ${reg.warna}` }}>
                          <div style={{ fontSize:12, fontWeight:700, color:reg.warna, marginBottom:6 }}>{p.nomor}</div>
                          <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.7, fontStyle:'italic' }}>
                            "{p.isi}"
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop:14, padding:12, background:'rgba(255,255,255,0.03)', borderRadius:8,
                      fontSize:11, color:'var(--text-dim)', lineHeight:1.6 }}>
                      💡 Informasi di atas merupakan ringkasan. Untuk teks resmi dan lengkap, kunjungi{' '}
                      <a href="https://peraturan.bpk.go.id" target="_blank" rel="noopener noreferrer"
                        style={{ color:'var(--blue)', textDecoration:'underline' }}>peraturan.bpk.go.id</a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:24, marginTop:20 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, marginBottom:20 }}>
              📅 Timeline Regulasi Perlindungan Anak di Indonesia
            </div>
            <div style={{ position:'relative', paddingLeft:24 }}>
              <div style={{ position:'absolute', left:7, top:0, bottom:0, width:2, background:'var(--border)' }} />
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
                <div key={i} style={{ display:'flex', gap:14, marginBottom:16, position:'relative' }}>
                  <div style={{ position:'absolute', left:-21, top:3, width:10, height:10, borderRadius:'50%', background:t.color, border:'2px solid var(--bg)', flexShrink:0 }} />
                  <div>
                    <span style={{ fontSize:11, fontWeight:800, color:t.color, fontFamily:'monospace' }}>{t.tahun}</span>
                    <span style={{ fontSize:12, color:'var(--text-muted)', marginLeft:10 }}>{t.event}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: FAQ ── */}
      {activeTab === 'faq' && (
        <div>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, marginBottom:8 }}>
              Pertanyaan yang Sering Ditanyakan
            </div>
            <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.7 }}>
              Temukan jawaban atas pertanyaan umum seputar perlindungan anak dan cara melaporkan.
            </p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:32 }}>
            {FAQ.map((f,i) => (
              <div key={i} style={{ background:'var(--surface)', border:`1px solid ${activeFaq===i?'var(--accent)':'var(--border)'}`,
                borderRadius:12, overflow:'hidden', transition:'border-color 0.2s' }}>
                <div onClick={() => setActiveFaq(activeFaq===i ? null : i)}
                  style={{ padding:'16px 20px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                  <div style={{ fontSize:13, fontWeight:600, lineHeight:1.5 }}>
                    <span style={{ color:'var(--accent)', fontFamily:"'Syne',sans-serif", marginRight:8 }}>Q.</span>
                    {f.q}
                  </div>
                  <div style={{ fontSize:16, color:'var(--text-dim)', flexShrink:0, transform: activeFaq===i?'rotate(45deg)':'rotate(0deg)', transition:'transform 0.2s' }}>+</div>
                </div>
                {activeFaq === i && (
                  <div style={{ padding:'0 20px 16px', borderTop:'1px solid var(--border)' }}>
                    <div style={{ paddingTop:14, fontSize:13, color:'var(--text-muted)', lineHeight:1.8 }}>
                      <span style={{ color:'var(--green)', fontFamily:"'Syne',sans-serif", fontWeight:700, marginRight:8 }}>A.</span>
                      {f.a}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tanda bahaya */}
          <div style={{ background:'rgba(232,64,28,0.06)', border:'1px solid rgba(232,64,28,0.2)', borderRadius:14, padding:24 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:'var(--accent)', marginBottom:16 }}>
              🚨 Tanda-Tanda Anak Membutuhkan Pertolongan
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:10 }}>
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
                <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'10px 12px',
                  background:'rgba(255,255,255,0.03)', borderRadius:8, fontSize:12, color:'var(--text-muted)', lineHeight:1.5 }}>
                  <span style={{ color:'var(--accent)', flexShrink:0, marginTop:1 }}>⚠</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Kontak ── */}
      {activeTab === 'kontak' && (
        <div>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, marginBottom:8 }}>
              Kontak &amp; Layanan Bantuan
            </div>
            <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.7 }}>
              Jika Anda menemukan anak yang membutuhkan pertolongan, segera hubungi salah satu
              layanan di bawah ini. Semua layanan gratis dan tersedia untuk masyarakat umum.
            </p>
          </div>

          {/* Darurat */}
          <div style={{ background:'rgba(232,64,28,0.08)', border:'1px solid rgba(232,64,28,0.3)', borderRadius:14, padding:20, marginBottom:20,
            display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ fontSize:40, flexShrink:0 }}>🚨</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:'var(--accent)', marginBottom:4 }}>
                Situasi Darurat? Hubungi 112
              </div>
              <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.6 }}>
                Jika anak dalam bahaya langsung atau situasi darurat, segera hubungi 112 (nomor darurat nasional) atau 110 (Kepolisian).
              </div>
            </div>
            <a href="tel:112" style={{ flexShrink:0 }}>
              <button className="btn btn-primary" style={{ fontSize:14, padding:'10px 20px' }}>📞 112</button>
            </a>
          </div>

          {/* Contact cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12, marginBottom:28 }}>
            {KONTAK.map((k,i) => (
              <div key={i} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:20,
                borderTop:`3px solid ${k.color}`, transition:'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                <div style={{ fontSize:28, marginBottom:10 }}>{k.icon}</div>
                <div style={{ fontSize:11, color:'var(--text-dim)', marginBottom:4 }}>{k.label}</div>
                <div style={{ fontSize:15, fontWeight:700, color:k.color }}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Lembaga */}
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:24, marginBottom:20 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, marginBottom:16 }}>
              Lembaga &amp; Organisasi Terkait
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {[
                { nama:'DP3A Kota Manado', peran:'Dinas Pemberdayaan Perempuan dan Perlindungan Anak', color:'var(--accent)' },
                { nama:'Dinas Sosial Kota Manado', peran:'Penanganan dan rehabilitasi anak terlantar', color:'var(--blue)' },
                { nama:'Komnas Perlindungan Anak', peran:'Advokasi dan perlindungan hak anak nasional', color:'var(--green)' },
                { nama:'KPAI', peran:'Komisi Perlindungan Anak Indonesia', color:'var(--amber)' },
                { nama:'ILO Indonesia', peran:'Program penghapusan pekerja anak', color:'#9B59B6' },
                { nama:'UNICEF Indonesia', peran:'Perlindungan dan advokasi hak anak', color:'#3B8FE8' },
              ].map((l,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:l.color, flexShrink:0 }} />
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{l.nama}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>{l.peran}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About Delcion */}
          <div style={{ background:'linear-gradient(120deg,#0f2744,#1a3a60)', border:'1px solid rgba(59,143,232,0.2)', borderRadius:14, padding:24 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, marginBottom:12 }}>
              Tentang Delcion
            </div>
            <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.8, marginBottom:16 }}>
              <strong style={{ color:'var(--text)' }}>Delcion</strong> adalah sistem monitoring pekerja anak berbasis kecerdasan buatan
              yang dikembangkan untuk mendukung program perlindungan anak Kota Manado.
              Sistem ini mengintegrasikan kamera CCTV, deteksi AI (YOLOv8 + MiVolo), pelaporan warga,
              dan koordinasi petugas lapangan dalam satu platform terpadu.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {[
                { icon:'🤖', label:'AI Detection', desc:'YOLOv8 + MiVolo untuk deteksi dan estimasi usia' },
                { icon:'📹', label:'CCTV Monitoring', desc:'4 kamera aktif di titik-titik rawan kota' },
                { icon:'👥', label:'Partisipasi Warga', desc:'Platform laporan warga yang mudah dan cepat' },
              ].map((f,i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.05)', borderRadius:10, padding:14, textAlign:'center' }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>{f.icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, marginBottom:4 }}>{f.label}</div>
                  <div style={{ fontSize:10, color:'var(--text-muted)', lineHeight:1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.08)',
              fontSize:11, color:'var(--text-dim)', lineHeight:1.6 }}>
              Dikembangkan bekerja sama dengan Dinas Pemberdayaan Perempuan dan Perlindungan Anak (DP3A) Kota Manado
              dan Dinas Komunikasi dan Informatika (Kominfo) Kota Manado. • Versi 1.0 — 2026
            </div>
          </div>
        </div>
      )}
    </div>
  )
}