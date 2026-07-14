import { useEffect, useRef, useState, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Button } from './Button'
import { AlertCircle, FlipHorizontal, ImagePlus } from 'lucide-react'

interface QrScannerProps {
  onScan: (decodedText: string) => void
  onCancel: () => void
}

export function QrScanner({ onScan, onCancel }: QrScannerProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)
  const qrRef = useRef<Html5Qrcode | null>(null)
  const onScanRef = useRef(onScan)
  const stoppedRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const elementId = 'qr-scanner-viewport'

  onScanRef.current = onScan

  // Detect multiple cameras
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoInputs = devices.filter((d) => d.kind === 'videoinput')
      setHasMultipleCameras(videoInputs.length > 1)
    }).catch(() => {})
  }, [])

  const forceStopAllCameras = useCallback(() => {
    const scanner = qrRef.current
    if (scanner) {
      try {
        if (scanner.isScanning) {
          scanner.stop().catch(() => {})
        }
      } catch {
        // isScanning getter can throw if already cleared
      }
      try {
        scanner.clear()
      } catch {
        // clear can throw if element is already gone
      }
      qrRef.current = null
    }

    // Brute-force: stop all video tracks inside our container
    const videoEl = document.querySelector(`#${elementId} video`) as HTMLVideoElement | null
    if (videoEl?.srcObject) {
      const stream = videoEl.srcObject as MediaStream
      stream.getTracks().forEach((t) => t.stop())
      videoEl.srcObject = null
    }
  }, [])

  const startScanner = useCallback(async (mode: 'environment' | 'user') => {
    // Stop previous instance
    forceStopAllCameras()

    stoppedRef.current = false
    setError(null)
    setLoading(true)

    // Small delay for DOM to settle after clear()
    await new Promise((r) => setTimeout(r, 100))

    const html5Qrcode = new Html5Qrcode(elementId)
    qrRef.current = html5Qrcode

    try {
      await html5Qrcode.start(
        { facingMode: mode },
        {
          fps: 10,
          qrbox: (width, height) => {
            const size = Math.min(width, height) * 0.75
            return { width: size, height: size }
          },
          aspectRatio: 1,
          disableFlip: false,
        },
        (decodedText) => {
          if (!stoppedRef.current) {
            stoppedRef.current = true
            forceStopAllCameras()
            onScanRef.current(decodedText)
          }
        },
        () => {}
      )

      if (stoppedRef.current) {
        forceStopAllCameras()
      } else {
        setLoading(false)
      }
    } catch (err) {
      if (!stoppedRef.current) {
        console.error(err)
        setError('Could not access camera. Please check permissions.')
        setLoading(false)
      }
    }
  }, [forceStopAllCameras])

  useEffect(() => {
    startScanner(facingMode)

    return () => {
      stoppedRef.current = true
      forceStopAllCameras()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFlipCamera = async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(nextMode)
    await startScanner(nextMode)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Stop live scanner first
      forceStopAllCameras()

      // Create a fresh instance for file scanning
      const html5Qrcode = new Html5Qrcode(elementId)
      const result = await html5Qrcode.scanFile(file, true)
      html5Qrcode.clear()
      onScanRef.current(result)
    } catch (err) {
      console.error('File scan error:', err)
      setError('Could not read QR code from image. Try a clearer photo.')
      // Restart live scanner after failed file scan
      setTimeout(() => {
        setError(null)
        startScanner(facingMode)
      }, 2000)
    }

    // Reset file input so same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCancel = () => {
    stoppedRef.current = true
    forceStopAllCameras()
    onCancel()
  }

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      {/* Scanner Viewport */}
      <div
        className="qr-viewport relative overflow-hidden bg-black flex items-center justify-center w-full max-w-[300px] aspect-square"
        style={{ borderRadius: 'var(--radius)' }}
      >
        {/* html5-qrcode rendering target */}
        <div id={elementId} className="w-full h-full" />

        {/* Scanning overlay with corner markers */}
        {!loading && !error && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Scan line animation */}
            <div className="absolute left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent animate-qr-scan opacity-70" />

            {/* Corner brackets */}
            {/* Top-left */}
            <div className="absolute top-[12%] left-[12%] w-6 h-6 border-t-2 border-l-2 border-[var(--accent-primary)] rounded-tl-sm" />
            {/* Top-right */}
            <div className="absolute top-[12%] right-[12%] w-6 h-6 border-t-2 border-r-2 border-[var(--accent-primary)] rounded-tr-sm" />
            {/* Bottom-left */}
            <div className="absolute bottom-[12%] left-[12%] w-6 h-6 border-b-2 border-l-2 border-[var(--accent-primary)] rounded-bl-sm" />
            {/* Bottom-right */}
            <div className="absolute bottom-[12%] right-[12%] w-6 h-6 border-b-2 border-r-2 border-[var(--accent-primary)] rounded-br-sm" />
          </div>
        )}

        {/* Camera controls overlay */}
        {!loading && !error && (
          <div className="absolute top-2 right-2 flex gap-1.5 z-10">
            {hasMultipleCameras && (
              <button
                type="button"
                onClick={handleFlipCamera}
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                title="Switch camera"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              title="Upload QR image"
            >
              <ImagePlus className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {loading && !error && (
          <p className="absolute text-xs text-white/70 animate-pulse">
            Starting camera...
          </p>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/80">
            <AlertCircle className="w-8 h-8 text-[var(--accent-rose)] mb-2" />
            <p className="text-xs text-[var(--accent-rose)] font-medium leading-relaxed">
              {error}
            </p>
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="text-[11px] text-[var(--text-muted)] text-center">
        Point at a UPI QR code to auto-fill
      </p>

      <Button variant="secondary" onClick={handleCancel} className="w-full">
        Cancel Scan
      </Button>

      {/* Scoped CSS to fix html5-qrcode rendering issues */}
      <style>{`
        .qr-viewport #${elementId} {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          border: none !important;
        }
        .qr-viewport #${elementId} video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border: none !important;
          border-radius: 0 !important;
        }
        /* Hide the library's built-in scan region border */
        .qr-viewport #${elementId} > div {
          border: none !important;
        }
        /* Hide library branding text if any */
        .qr-viewport #${elementId} img[alt="Info icon"],
        .qr-viewport #${elementId} span {
          display: none !important;
        }
        /* Scan line animation */
        @keyframes qr-scan {
          0%, 100% { top: 15%; }
          50% { top: 82%; }
        }
        .animate-qr-scan {
          animation: qr-scan 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
