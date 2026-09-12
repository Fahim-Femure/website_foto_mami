import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Uti & Iam — Wedding Photo Gallery | #mengikUTIlangkahIAM',
  description:
    'Abadikan momen indah pernikahan Uti & Iam pada 12 Desember 2026. Ambil foto langsung dari browser dan lihat galeri real-time bersama tamu lainnya. #mengikUTIlangkahIAM',
  keywords: ['pernikahan', 'wedding', 'foto', 'gallery', 'Uti', 'Iam', 'mengikUTIlangkahIAM'],
  openGraph: {
    title: 'Uti & Iam — Wedding Photo Gallery',
    description: 'Abadikan momen pernikahan Uti & Iam bersama-sama. #mengikUTIlangkahIAM',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
