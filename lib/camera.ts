/**
 * Mendapatkan stream kamera dari browser
 */
export async function getUserCamera(facingMode: 'user' | 'environment' = 'environment'): Promise<MediaStream> {
  const constraints: MediaStreamConstraints = {
    video: {
      facingMode,
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
    audio: false,
  }
  return navigator.mediaDevices.getUserMedia(constraints)
}

/**
 * Mengambil frame dari video element ke canvas, return sebagai Blob JPEG
 */
/**
 * Mengambil frame dari video element ke canvas, return sebagai Blob JPEG
 * @param mirror - jika true, hasil foto akan di-flip horizontal (sesuai preview mirror)
 */
/**
 * Mengambil frame dari video element ke canvas dengan crop rasio 3:4 (portrait),
 * return sebagai Blob JPEG
 * @param zoom - jika true, hasil foto akan di-flip horizontal (sesuai preview mirror)
 */
/**
 * Mengambil frame dari video element ke canvas dengan crop rasio 3:4 (portrait)
 * dan zoom digital, return sebagai Blob JPEG
 * @param mirror - jika true, hasil foto akan di-flip horizontal
 * @param zoom - level zoom digital (1 = tidak zoom, sampai 6 = 6x)
 */
export function captureFrame(
  videoEl: HTMLVideoElement,
  canvasEl: HTMLCanvasElement,
  mirror = false,
  zoom = 1,
  quality = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const { videoWidth, videoHeight } = videoEl
    const ctx = canvasEl.getContext('2d')
    if (!ctx) {
      reject(new Error('Canvas 2D context tidak tersedia'))
      return
    }

    // Crop area sesuai zoom level dulu (ambil bagian tengah)
    const zoomedWidth = videoWidth / zoom
    const zoomedHeight = videoHeight / zoom
    const zoomedX = (videoWidth - zoomedWidth) / 2
    const zoomedY = (videoHeight - zoomedHeight) / 2

    // Lalu crop lagi ke rasio 3:4 dari area yang sudah di-zoom
    const targetRatio = 3 / 4
    const sourceRatio = zoomedWidth / zoomedHeight

    let sx = zoomedX, sy = zoomedY, sWidth = zoomedWidth, sHeight = zoomedHeight

    if (sourceRatio > targetRatio) {
      sWidth = zoomedHeight * targetRatio
      sx = zoomedX + (zoomedWidth - sWidth) / 2
    } else {
      sHeight = zoomedWidth / targetRatio
      sy = zoomedY + (zoomedHeight - sHeight) / 2
    }

    const outputHeight = 1600
    const outputWidth = outputHeight * targetRatio

    canvasEl.width = outputWidth
    canvasEl.height = outputHeight

    if (mirror) {
      ctx.translate(outputWidth, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(videoEl, sx, sy, sWidth, sHeight, 0, 0, outputWidth, outputHeight)

    canvasEl.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Gagal membuat blob dari canvas'))
      },
      'image/jpeg',
      quality
    )
  })
}

/**
 * Cek apakah device memiliki lebih dari satu kamera (untuk tombol switch)
 */
export async function hasMultipleCameras(): Promise<boolean> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter((d) => d.kind === 'videoinput')
    return videoDevices.length > 1
  } catch {
    return false
  }
}
