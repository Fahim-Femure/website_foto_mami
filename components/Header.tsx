export default function Header() {
  return (
    <header
      className="relative overflow-hidden"
      style={{
        paddingTop: '3rem',
        paddingBottom: '3rem',
      }}
    >

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Garis dekoratif atas */}
        <div
          className="w-16 h-0.5 mb-5"
          style={{ background: 'linear-gradient(to right, transparent, #8A6A1F, transparent)' }}
          aria-hidden="true"
        />

        {/* Label kecil */}
        <p
          className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
          style={{ color: '#6B5118', fontFamily: 'Poppins, sans-serif' }}
        >
          The Wedding of
        </p>

        {/* Nama utama */}
        <h1
          className="font-serif-display"
          style={{
            color: '#4A3010',
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            textShadow: '0 2px 8px rgba(74, 48, 16, 0.12)',
          }}
        >
          Uti &amp; Iam
        </h1>

        {/* Tanggal */}
        <p
          className="mt-3 text-sm tracking-[0.18em] uppercase font-medium"
          style={{ color: '#6B5118', fontFamily: 'Poppins, sans-serif' }}
        >
          12 Desember 2026
        </p>

        {/* Garis tengah */}
        <div
          className="my-5 w-24 h-0.5"
          style={{ background: 'linear-gradient(to right, transparent, #8A6A1F, transparent)' }}
          aria-hidden="true"
        />

        {/* Hashtag */}
        <p
          className="font-serif-italic"
          style={{
            color: '#4A5A3A',
            fontSize: 'clamp(1rem, 3.5vw, 1.5rem)',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          #mengikUTIlangkahIAM
        </p>

        {/* Teks kecil ajakan */}
        {/* <p
          className="mt-4 text-xs tracking-wider uppercase"
          style={{ color: '#6B5118', fontFamily: 'Poppins, sans-serif', opacity: 0.8 }}
        >
          Abadikan Momenmu
        </p> */}

        {/* Garis dekoratif bawah */}
        <div
          className="w-16 h-0.5 mt-5"
          style={{ background: 'linear-gradient(to right, transparent, #8A6A1F, transparent)' }}
          aria-hidden="true"
        />
      </div>
    </header>
  )
}
