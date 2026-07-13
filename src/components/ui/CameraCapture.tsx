import { useEffect, useRef, useState } from 'react'
import { Button } from './Button'
import { Camera, AlertCircle } from 'lucide-react'

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void
  onCancel: () => void
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function startCamera() {
      try {
        setError(null)
        setLoading(true)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
          audio: false,
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err: unknown) {
        console.error(err)
        setError('Could not access camera. Please check permissions.')
      } finally {
        setLoading(false)
      }
    }

    startCamera()

    return () => {
      // Clean up tracks when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleCapture = () => {
    const video = videoRef.current
    if (!video || !streamRef.current) return

    const canvas = document.createElement('canvas')
    // Keep 1:1 ratio based on video stream width or standard size
    const size = Math.min(video.videoWidth || 640, video.videoHeight || 640)
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Center crop capture from video source frame
    const sx = (video.videoWidth - size) / 2
    const sy = (video.videoHeight - size) / 2

    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size)
    const base64 = canvas.toDataURL('image/jpeg', 0.9)
    onCapture(base64)
  }

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      {/* Video Viewport Container */}
      <div
        className="relative overflow-hidden border border-[var(--border-glass)] bg-black flex items-center justify-center"
        style={{
          width: 260,
          height: 260,
          borderRadius: 'var(--radius)',
        }}
      >
        {loading && !error && (
          <p className="text-xs text-[var(--text-muted)]">Starting camera...</p>
        )}
        
        {error && (
          <div className="text-center p-4 flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 text-[var(--accent-rose)]" />
            <p className="text-xs text-[var(--accent-rose)] font-medium leading-relaxed">
              {error}
            </p>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 ${
            loading || error ? 'hidden' : 'block'
          }`}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2 w-full mt-2">
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
