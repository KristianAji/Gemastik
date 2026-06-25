import { useNavigate } from 'react-router-dom'

export default function FooterPublic() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        .footer-section {
          background: #012330;
          color: #BFDBF7;
          padding: 80px 40px 40px;
          position: relative;
        }
        .footer-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: rgba(191,219,247,0.12);
        }
        .footer-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1.2fr;
          gap: 80px;
        }
        .footer-logo {
          font-size: 36px;
          margin-bottom: 18px;
          color: #BFDBF7;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
        }
        .footer-logo span { color: #1F7A8C; }
        .footer-desc {
          font-size: 13px;
          line-height: 1.7;
          color: rgba(191,219,247,0.65);
          max-width: 300px;
        }
        .footer-heading {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(191,219,247,0.5);
          margin-bottom: 14px;
        }
        .footer-link {
          display: block;
          font-size: 13px;
          color: rgba(191,219,247,0.75);
          margin-bottom: 8px;
          cursor: pointer;
          transition: color 0.15s;
          background: none;
          border: none;
          padding: 0;
          text-align: left;
          font-family: 'Inter', sans-serif;
        }
        .footer-link:hover { color: #FFFFFF; }
        .footer-kontak-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: rgba(191,219,247,0.75);
          margin-bottom: 14px;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .footer-section { padding: 48px 24px 32px; }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>

      <footer className="footer-section">
        <div className="footer-grid">

          {/* Kolom 1: Tentang */}
          <div>
            <div className="footer-logo">Del<span>cion</span></div>
            <p className="footer-desc">
              Platform pemantauan dan pelaporan
              pekerja anak berbasis masyarakat,
              CCTV, dan koordinasi lapangan.
            </p>
          </div>

          {/* Kolom 2: Navigasi */}
          <div>
            <div className="footer-heading">Navigasi</div>
            {[
              { label: 'Beranda',          path: '/public' },
              { label: 'Buat Laporan',     path: '/public/laporan' },
              { label: 'Riwayat Laporan',  path: '/public/riwayat' },
              { label: 'Peta Laporan',     path: '/public/peta' },
              { label: 'Tentang & Regulasi', path: '/public/tentang' },
            ].map(l => (
              <button key={l.label} className="footer-link" onClick={() => navigate(l.path)}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <div className="footer-heading">Kontak &amp; Bantuan</div>
            <div className="footer-kontak-item">
              <div>
                <div style={{ fontWeight: 600, color: '#BFDBF7' }}>Hotline DP3A Manado</div>
                <div>(0431) 864-xxx</div>
              </div>
            </div>
            <div className="footer-kontak-item">
              <div>
                <div style={{ fontWeight: 600, color: '#BFDBF7' }}>SAPA Kemsos</div>
                <div>129</div>
              </div>
            </div>
            <div className="footer-kontak-item">
              <div>
                <div style={{ fontWeight: 600, color: '#BFDBF7' }}>Email Pengaduan</div>
                <div>dp3a@manadokota.go.id</div>
              </div>
            </div>
            <div className="footer-kontak-item">
              <div>
                <div style={{ fontWeight: 600, color: '#BFDBF7' }}>Darurat</div>
                <div>112</div>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </>
  )
}