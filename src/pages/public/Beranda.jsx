import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import FooterPublic from '../../components/FooterPublic'

// ─── Warna & token desain ───────────────────────────────────────────────────
// Palette: #022B3A (navy), #1F7A8C (teal), #BFDBF7 (biru muda), #E1E5F2 (abu kebiruan), #FFFFFF
// Font: Plus Jakarta Sans (heading), Inter (body)
// ──────────────────────────────────────────────────────────────────────────────

export default function PubBeranda() {
  const navigate = useNavigate()
  const laporan  = useStore(s => s.laporan)
  const baru     = laporan.filter(l => l.status === 'baru').length
  const selesai  = laporan.filter(l => l.status === 'selesai').length
  const [deskripsiTerbuka, setDeskripsiTerbuka] = useState(false)

  return (
    <>
      {/* ── Import font dari Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Google+Sans+Flex:opsz,wght@8..144,400..700&display=swap');

        .beranda-root {
          font-family: 'Google Sans Flex', sans-serif;
          background: #E1E5F2;
          color: #022B3A;
          min-height: 100vh;
        }

        /* ── HERO ── */
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding-top: 0
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          /* 👉 GANTI URL FOTO DI SINI — ganti teks di dalam url('...') */
          background-image: url('https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTJqjIGGSyZvFaKVjFTnSNvV3q1dY-QjE56URLbEYYVAxnH1D2ywAucmObu9jClPOivyidKziRycmroR1joas7BO1Yx&s=19');
          background-size: cover;
          background-position: center;
          /* Opasitas foto ~40% lewat overlay di bawahnya */
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          /* Overlay navy gelap, membuat foto tampak ~40% */
          background: linear-gradient(
            135deg,
            rgba(2, 43, 58, 0.82) 0%,
            rgba(2, 43, 58, 0.70) 50%,
            rgba(31, 122, 140, 0.55) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 80px 40px 60px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          gap: 60px;
        }

        .hero-left {
          flex: 1;
          min-width: 0;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(191, 219, 247, 0.15);
          border: 1px solid rgba(191, 219, 247, 0.35);
          border-radius: 999px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #BFDBF7;
          letter-spacing: 0.04em;
          margin-bottom: 20px;
        }

        .hero-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 800;
          line-height: 1.0;
          color: #FFFFFF;
          margin: 0 0 4px 0;
          letter-spacing: -0.02em;
        }

        .hero-title-accent {
          color: #BFDBF7;
        }

        .hero-subtitle {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(14px, 2vw, 17px);
          font-weight: 500;
          color: rgba(191, 219, 247, 0.85);
          line-height: 1.6;
          margin: 16px 0 0 0;
          max-width: 520px;
        }

        /* Expand deskripsi */
        .deskripsi-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 16px;
          background: none;
          border: none;
          color: #BFDBF7;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          padding: 0;
          opacity: 0.85;
          transition: opacity 0.15s;
        }
        .deskripsi-toggle:hover { opacity: 1; }

        .deskripsi-chevron {
          display: inline-block;
          transition: transform 0.25s ease;
        }
        .deskripsi-chevron.terbuka {
          transform: rotate(180deg);
        }

        .deskripsi-wrapper {
  max-height: 0;
  opacity: 0;
  overflow: hidden;

  transition:
    max-height 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.35s ease;
}

.deskripsi-wrapper.open {
  max-height: 300px;
  opacity: 1;
}

.deskripsi-box {
  margin-top: 12px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(191, 219, 247, 0.2);
  border-radius: 12px;
  padding: 16px 18px;

  max-width: 520px;

  font-size: 13px;
  color: rgba(225,229,242,0.9);
  line-height: 1.75;

  backdrop-filter: blur(8px);
}

        /* Tombol CTA di hero */
        .hero-right {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 220px;
        }

        .btn-cta-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 28px;
          background: #1F7A8C;
          color: #FFFFFF;
          border: none;
          border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .btn-cta-primary:hover {
          background: #176878;
          transform: translateY(-1px);
        }

        .btn-cta-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 28px;
          background: rgba(255,255,255,0.08);
          color: #FFFFFF;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .btn-cta-secondary:hover { background: rgba(255,255,255,0.14); }

        /* Panah scroll */
        .scroll-hint {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          padding-bottom: 32px;
          animation: bobbing 2s ease-in-out infinite;
        }
        @keyframes bobbing {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }

        /* ── SECTION STATISTIK ── */
        .statistik-section {
          background: #FFFFFF;
          padding: 72px 40px;
        }

        .section-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1F7A8C;
          margin-bottom: 8px;
        }

        .section-heading {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(24px, 3vw, 34px);
          font-weight: 800;
          color: #022B3A;
          margin: 0 0 40px 0;
          line-height: 1.2;
        }

  .stats-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 48px;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 32px;
}

.stat-item:not(:last-child) {
  border-right: 1px solid #D6DCE4;
}

.stat-number {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(56px, 6vw, 80px);
  font-weight: 800;
  color: #022B3A;
  line-height: 1;
  margin-bottom: 12px;
}

.stat-label {
  font-family: 'Google Sans Flex', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #5A7080;
  line-height: 1.5;
}

        /* ── SECTION CARA LAPORAN ── */
        .cara-section {
          background: #E1E5F2;
          padding: 72px 40px;
        }

        .langkah-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }

        .langkah-card {
          background: #FFFFFF;
          border-radius: 14px;
          padding: 24px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .langkah-nomor {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 800;
          color: #FFFFFF;
          background: #1F7A8C;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .langkah-judul {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #022B3A;
          margin-bottom: 4px;
        }

        .langkah-desc {
          font-size: 13px;
          color: #4a6070;
          line-height: 1.65;
        }

        .btn-laporan-besar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          padding: 18px 32px;
          background: #022B3A;
          color: #FFFFFF;
          border: none;
          border-radius: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-laporan-besar:hover {
          background: #1F7A8C;
          transform: translateY(-1px);
        }

        /* ── FOOTER ── */
        /* Styling footer sudah dipindah sepenuhnya ke komponen FooterPublic.jsx,
           supaya tidak ada class CSS duplikat/bentrok antar halaman. */

        /* ── Responsif ── */
        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
            padding: 80px 24px 40px;
            gap: 32px;
          }
          .hero-right {
            width: 100%;
          }
          .stats-grid {
  flex-direction: column;
}

.stat-item:not(:last-child) {
  border-right: none;
  border-bottom: 1px solid #D6DCE4;
}
          .langkah-grid {
            grid-template-columns: 1fr;
          }
          .statistik-section,
          .cara-section {
            padding-left: 24px;
            padding-right: 24px;
          }
        }
      `}</style>

      <div className="beranda-root">

        {/* ══════════════════════════════════════
            SECTION 1 — HERO FULLSCREEN
        ══════════════════════════════════════ */}
        <section className="hero-section">
          <div className="hero-bg" />
          <div className="hero-overlay" />

          <div className="hero-content">
            {/* Kiri: heading & teks */}
            <div className="hero-left">
              <div className="hero-badge">
                Setiap anak berhak mendapatkan perlindungan & hak tumbuh kembang yang layak
              </div>

              <h1 className="hero-title">
                Del<span className="hero-title-accent">cion</span>
              </h1>

              <p className="hero-subtitle">
                Sistem pemantauan dan perlindungan pekerja anak di bawah umur Kota Manado
              </p>

              {/* Tombol expand deskripsi */}
              <button
                className="deskripsi-toggle"
                onClick={() => setDeskripsiTerbuka(v => !v)}
              >
                Tentang sistem ini
                <span className={`deskripsi-chevron${deskripsiTerbuka ? ' terbuka' : ''}`}>▾</span>
              </button>

              <div className={`deskripsi-wrapper ${deskripsiTerbuka ? 'open' : ''}`}>
  <div className="deskripsi-box">
    Delcion adalah platform terintegrasi yang menghubungkan laporan masyarakat,
    pemantauan kamera CCTV berbasis kecerdasan buatan, dan koordinasi petugas
    lapangan Dinas Pemberdayaan Perempuan & Perlindungan Anak (DP3A) Kota Manado.
    Bersama-sama, kita dapat memastikan setiap anak mendapatkan perlindungan
    dan hak tumbuh kembang yang layak.
  </div>
</div>
            </div>

            {/* Kanan: tombol aksi */}
            <div className="hero-right">
              <button
                className="btn-cta-primary"
                onClick={() => navigate('/public/laporan')}
              >
                Buat Laporan Sekarang
              </button>
              <button
                className="btn-cta-secondary"
                onClick={() => navigate('/public/peta')}
              >
                Lihat Peta Laporan
              </button>
              <button
                className="btn-cta-secondary"
                onClick={() => navigate('/public/tentang')}
              >
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>

          {/* Panah scroll ke bawah */}
          <div className="scroll-hint">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(191,219,247,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 2 — STATUS PELAPORAN
        ══════════════════════════════════════ */}
        <section className="statistik-section">
          <div className="section-inner">
            <p className="section-eyebrow">Transparansi Data</p>
            <h2 className="section-heading">Status Pelaporan Hari Ini</h2>

            <div className="stats-grid">

  <div className="stat-item">
    <div className="stat-number">
      {laporan.length}
    </div>
    <div className="stat-label">
      Total Laporan
    </div>
  </div>

  <div className="stat-item">
    <div className="stat-number">
      {selesai}
    </div>
    <div className="stat-label">
      Berhasil Ditangani
    </div>
  </div>

  <div className="stat-item">
    <div className="stat-number">
      {baru}
    </div>
    <div className="stat-label">
      Menunggu Tindak Lanjut
    </div>
  </div>

</div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 3 — CARA LAPORAN
        ══════════════════════════════════════ */}
        <section className="cara-section">
          <div className="section-inner">
            <p className="section-eyebrow">Panduan Pelaporan</p>
            <h2 className="section-heading">Bagaimana Cara Melaporkan?</h2>

            <div className="langkah-grid">
              {[
                { n:'01', judul:'Temukan & Amati', desc:'Perhatikan anak yang bekerja di jalanan — berjualan, mengamen, mengemis, atau menjadi figuran berbayar.' },
                { n:'02', judul:'Isi Formulir Laporan', desc:'Klik tombol "Buat Laporan", pilih lokasi, jenis aktivitas, dan tambahkan foto bukti bila ada.' },
                { n:'03', judul:'Kirim & Tunggu', desc:'Tim DP3A akan memproses laporan dan mengirim petugas ke lokasi sesegera mungkin.' },
                { n:'04', judul:'Pantau Status', desc:'Cek perkembangan laporan Anda di menu Riwayat menggunakan nomor laporan yang Anda terima.' },
              ].map(s => (
                <div key={s.n} className="langkah-card">
                  <div className="langkah-nomor">{s.n}</div>
                  <div>
                    <div className="langkah-judul">{s.judul}</div>
                    <div className="langkah-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                className="btn-laporan-besar"
                onClick={() => navigate('/public/laporan')}
              >
                Buat Laporan Sekarang
              </button>
              <p style={{ marginTop: 12, fontSize: 12, color: '#5a7080' }}>
                Identitas Anda sepenuhnya opsional, laporan bisa dikirim secara anonim
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 4 — FOOTER
        ══════════════════════════════════════ */}
        
        <FooterPublic />
        
      </div>
    </>
  )
}