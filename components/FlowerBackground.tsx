'use client'

import Image from 'next/image'

interface FlowerItem {
  id: number
  src: string
  size: number
  top: string
  left: string
  rotation: number
  blur: number
  opacity: number
  flipX: boolean
}

const FLOWERS: FlowerItem[] = [
  // Header area
  { id: 1,  src: '/flower-small.png', size: 70,  top: '2%',   left: '-3%',  rotation: -20, blur: 6,   opacity: 0.55, flipX: false },
  { id: 2,  src: '/flower-large.png', size: 100, top: '4%',   left: '82%',  rotation: 25,  blur: 7,   opacity: 0.50, flipX: true  },
  { id: 3,  src: '/flower-small.png', size: 55,  top: '10%',  left: '5%',   rotation: 10,  blur: 8,   opacity: 0.40, flipX: true  },
  { id: 4,  src: '/flower-large.png', size: 130, top: '15%',  left: '88%',  rotation: -30, blur: 3,   opacity: 0.60, flipX: false },
  
  // Camera Section area
  { id: 5,  src: '/flower-small.png', size: 48,  top: '25%',  left: '2%',   rotation: -5,  blur: 9,   opacity: 0.30, flipX: true  },
  { id: 6,  src: '/flower-small.png', size: 65,  top: '30%',  left: '45%',  rotation: 5,   blur: 8,   opacity: 0.38, flipX: false },
  { id: 7,  src: '/flower-large.png', size: 140, top: '35%',  left: '-5%',  rotation: 15,  blur: 2.5, opacity: 0.65, flipX: false },
  { id: 8,  src: '/flower-large.png', size: 90,  top: '40%',  left: '91%',  rotation: -15, blur: 5,   opacity: 0.45, flipX: true  },
  { id: 9,  src: '/flower-small.png', size: 42,  top: '45%',  left: '-2%',  rotation: 30,  blur: 10,  opacity: 0.35, flipX: false },
  
  // Gallery Section area
  { id: 10, src: '/flower-large.png', size: 110, top: '55%',  left: '85%',  rotation: -20, blur: 3.5, opacity: 0.55, flipX: true  },
  { id: 11, src: '/flower-small.png', size: 60,  top: '60%',  left: '5%',   rotation: 12,  blur: 7,   opacity: 0.45, flipX: false },
  { id: 12, src: '/flower-large.png', size: 150, top: '68%',  left: '88%',  rotation: 20,  blur: 2,   opacity: 0.60, flipX: true  },
  { id: 13, src: '/flower-small.png', size: 50,  top: '75%',  left: '12%',  rotation: -8,  blur: 8,   opacity: 0.40, flipX: true  },
  { id: 14, src: '/flower-large.png', size: 130, top: '82%',  left: '-4%',  rotation: 25,  blur: 3,   opacity: 0.58, flipX: false },
  { id: 15, src: '/flower-small.png', size: 75,  top: '88%',  left: '92%',  rotation: -18, blur: 6,   opacity: 0.50, flipX: true  },
  
  // Footer area
  { id: 16, src: '/flower-small.png', size: 45,  top: '95%',  left: '8%',   rotation: 15,  blur: 9,   opacity: 0.35, flipX: false },
  { id: 17, src: '/flower-large.png', size: 95,  top: '96%',  left: '85%',  rotation: -10, blur: 5,   opacity: 0.48, flipX: true  },
]

export default function FlowerBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {FLOWERS.map((f) => {
        const xform = 'rotate(' + f.rotation + 'deg) scaleX(' + (f.flipX ? -1 : 1) + ')'
        const filt = 'blur(' + f.blur + 'px)'
        return (<div
          key={f.id}
          className="absolute"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size,
            transform: xform,
            filter: filt,
            opacity: f.opacity,
            willChange: 'filter',
          }}
        >
          <Image
            src={f.src}
            alt=""
            fill
            style={{ objectFit: 'contain' }}
            sizes={f.size + 'px'}
          />
        </div>)
      })}
    </div>
  )
}
