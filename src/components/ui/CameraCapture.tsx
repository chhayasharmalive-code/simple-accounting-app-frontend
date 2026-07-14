import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from './Button'
import { Camera, AlertCircle, FlipHorizontal } from 'lucide-react'

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void
  onCancel: () => void
}

type FacingMode = 'environment' | 'user'

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [facingMode, setFacingMode] = useState<FacingMode>('environment')
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)

  // Check how many video input devices are available
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoInputs = devices.filter((d) => d.kind === 'videoinput')
      setHasMultipleCameras(videoInputs.length > 1)
    }).catch(() => {})
  }, [])

  const startCamera = useCallback(async (mode: FacingMode) => {
    // Stop any existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }

    setError(null)
    setLoading(true)

    // Try preferred facing mode, fall back to other
    const attempts: FacingMode[] = mode === 'environment'
      ? ['environment', 'user']
      : ['user', 'environment']

    let stream: MediaStream | null = null

    for (const attempt of attempts) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: attempt }, width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        })
        // Update facingMode to reflect which camera actually started
        setFacingMode(attempt)
        break
      } catch {
        // try next
      }
    }

    if (!stream) {
      setError('Could not access camera. Please check permissions.')
      setLoading(false)
      return
    }

    streamRef.current = stream
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    startCamera('environment')
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFlip = () => {
    const next: FacingMode = facingMode === 'environment' ? 'user' : 'environment'
    startCamera(next)
  }

  const handleCapture = () => {
    const video = videoRef.current
    if (!video || !streamRef.current) return

    const canvas = document.createElement('canvas')
    const size = Math.min(video.videoWidth || 640, video.videoHeight || 640)
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const sx = (video.videoWidth - size) / 2
    const sy = (video.videoHeight - size) / 2

    // Mirror front camera output to feel natural
    if (facingMode === 'user') {
      ctx.translate(size, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size)
    const base64 = canvas.toDataURL('image/jpeg', 0.9)
    onCapture(base64)
  }

  const isFront = facingMode === 'user'

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      {/* Video Viewport */}
      <div
        className="relative overflow-hidden border border-[var(--border-glass)] bg-black flex items-center justify-center"
        style={{ width: 260, height: 260, borderRadius: 'var(--radius)' }}
      >
        {loading && !error && (
          <p className="text-xs text-[var(--text-muted)]">Starting camera...</p>
        )}

        {error && (
          <div className="text-center p-4 flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 text-[var(--accent-rose)]" />
            <p className="text-xs text-[var(--accent-rose)] font-medium leading-relaxed">{error}</p>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isFront ? '-scale-x-100' : ''} ${loading || error ? 'hidden' : 'block'}`}
        />

        {/* Flip camera button — always visible if device has multiple cameras */}
        {!error && hasMultipleCameras && (
          <button
            onClick={handleFlip}
            disabled={loading}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white transition hover:bg-black/70 disabled:opacity-40"
            aria-label="Switch camera"
            title={isFront ? 'Switch to back camera' : 'Switch to front camera'}
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>
        )}

        {/* Camera mode indicator */}
        {!error && !loading && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-widest bg-black/50 text-white">
              {isFront ? 'Front' : 'Back'}
            </span>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2 w-full">
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleCapture}
          disabled={!!error || loading}
          className="flex-1 gap-1.5"
        >
          <Camera className="w-4 h-4" />
          Capture
        </Button>
      </div>
    </div>
  )
}
