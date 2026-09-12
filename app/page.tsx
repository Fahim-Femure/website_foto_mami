import Header from '@/components/Header'
import CameraSection from '@/components/CameraSection'
import GallerySection from '@/components/GallerySection'
import FlowerBackground from '@/components/FlowerBackground'

export default function Home() {
  return (
    <main
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #F7D76F 0%, #F7EFC7 20%, #FFF2BA 100%)' }}
    >
      {/* Background Bunga Global */}
      <FlowerBackground />

      {/* Konten Utama */}
      <div className="relative z-10">
        {/* 1. Header identitas halaman */}
        <Header />

        {/* 2. Kamera live capture */}
        <CameraSection />

        {/* Separator dekoratif */}
        <div
          style={{
            background: 'linear-gradient(to right, transparent, #8A6A1F40, transparent)',
            height: '1px',
            margin: '0 2rem',
          }}
          aria-hidden="true"
        />

        {/* 3. Galeri real-time */}
        <GallerySection />

        {/* Footer minimal */}
        <footer
          className="text-center py-6 px-4 mt-auto"
          style={{
            borderTop: '1px solid rgba(138, 106, 31, 0.2)',
          }}
        >
          <p
            className="font-serif-italic text-sm"
            style={{ color: '#8A6A1F' }}
          >
            #mengikUTIlangkahIAM
          </p>
          <p
            className="mt-1 text-xs"
            style={{ color: '#A89060', fontFamily: 'Poppins, sans-serif' }}
          >
            12 Desember 2026 · Uti &amp; Iam
          </p>
        </footer>
      </div>
    </main>
  )
}
