import { useState, useRef, useEffect } from 'react'
import { Button } from './Button'
import { Move } from 'lucide-react'

interface ImageCropperProps {
  imageSrc: string
  onCrop: (croppedBase64: string) => void
  onCancel: () => void
}

interface ImageDimensions {
  width: number
  height: number
  fitWidth: number
  fitHeight: number
}

const VIEWPORT_SIZE = 260

export function ImageCropper({ imageSrc, onCrop, onCancel }: ImageCropperProps) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [imgDims, setImgDims] = useState<ImageDimensions | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const dragStart = useRef({ x: 0, y: 0 })
  const offsetStart = useRef({ x: 0, y: 0 })
  const imgRef = useRef<HTMLImageElement | null>(null)

  // Initialize dimensions when image loads
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      let fitWidth = VIEWPORT_SIZE
      let fitHeight = VIEWPORT_SIZE

      const ratio = img.width / img.height
      if (ratio > 1) {
        // Landscape: match height to viewport, scale width
        fitWidth = VIEWPORT_SIZE * ratio
      } else {
        // Portrait/Square: match width to viewport, scale height
        fitHeight = VIEWPORT_SIZE / ratio
      }

      setImgDims({
        width: img.width,
        height: img.height,
        fitWidth,
        fitHeight,
      })

      // Center initial offsets
      setOffset({
        x: (VIEWPORT_SIZE - fitWidth) / 2,
        y: (VIEWPORT_SIZE - fitHeight) / 2,
      })
    };
    img.src = imageSrc
  }, [imageSrc])

  const getBoundedOffset = (x: number, y: number, currentScale: number) => {
    if (!imgDims) return { x: 0, y: 0 }

    const w = imgDims.fitWidth * currentScale
    const h = imgDims.fitHeight * currentScale

    const minX = VIEWPORT_SIZE - w
    const minY = VIEWPORT_SIZE - h

    // Clamp offsets so the image always covers the viewport
    const clampedX = Math.min(0, Math.max(minX, x))
    const clampedY = Math.min(0, Math.max(minY, y))

    return { x: clampedX, y: clampedY }
  }

  // Handle Zoom Slider Change
  const handleZoomChange = (newScale: number) => {
    setScale(newScale)
    setOffset((prev) => {
      // Scale offsets relative to the new zoom center
      const currentScale = scale
      const zoomRatio = newScale / currentScale
      
      // Calculate center coordinates relative to image top-left
      const centerX = VIEWPORT_SIZE / 2 - prev.x
      const centerY = VIEWPORT_SIZE / 2 - prev.y

      // Adjust offsets
      const newX = VIEWPORT_SIZE / 2 - centerX * zoomRatio
      const newY = VIEWPORT_SIZE / 2 - centerY * zoomRatio

      return getBoundedOffset(newX, newY, newScale)
    })
  }

  // Pointer Down
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true)
    dragStart.current = { x: clientX, y: clientY }
    offsetStart.current = { ...offset }
  }

  // Pointer Move
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return
    const dx = clientX - dragStart.current.x
    const dy = clientY - dragStart.current.y
    const newX = offsetStart.current.x + dx
    const newY = offsetStart.current.y + dy
    setOffset(getBoundedOffset(newX, newY, scale))
  }

  // Generate Cropped Image Base64
  const handleSave = () => {
    if (!imgDims || !imgRef.current) return

    const img = imgRef.current
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = imgDims.fitWidth * scale
    const h = imgDims.fitHeight * scale

    // Determine the crop bounds relative to the source image dimensions
    const srcX = (-offset.x / w) * imgDims.width
    const srcY = (-offset.y / h) * imgDims.height
    const srcSize = (VIEWPORT_SIZE / w) * imgDims.width

    canvas.width = 400
    canvas.height = 400

    ctx.drawImage(
      img,
      srcX,
      srcY,
      srcSize,
      srcSize,
      0,
      0,
      400,
      400
    )

    // Ensure size remains under 500KB
    let quality = 0.85
    let base64 = canvas.toDataURL('image/jpeg', quality)
    while (base64.length * 0.75 > 500 * 1024 && quality > 0.1) {
      quality -= 0.1
      base64 = canvas.toDataURL('image/jpeg', quality)
    }

    onCrop(base64)
  }

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      {/* Viewport container */}
      <div 
        className="relative overflow-hidden border border-[var(--border-glass)] shadow-inner select-none touch-none cursor-move"
        style={{
          width: VIEWPORT_SIZE,
          height: VIEWPORT_SIZE,
          borderRadius: 'var(--radius)',
        }}
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={() => setIsDragging(false)}
      >
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Source avatar"
          className="absolute max-w-none origin-top-left pointer-events-none select-none"
          style={{
            width: imgDims ? imgDims.fitWidth * scale : 'auto',
            height: imgDims ? imgDims.fitHeight * scale : 'auto',
            left: offset.x,
            top: offset.y,
          }}
        />
        
        {/* Overlay target indicator */}
        <div className="absolute inset-0 border border-white/40 pointer-events-none rounded-full flex items-center justify-center">
          <div className="text-white/30 flex flex-col items-center gap-1">
            <Move className="w-5 h-5 drop-shadow" />
            <span className="text-[10px] uppercase tracking-wider drop-shadow font-semibold">Drag to Pan</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex justify-between">
          <span>Zoom</span>
          <span>{Math.round(scale * 100)}%</span>
        </label>
        <input
          type="range"
          min="1"
          max="3"
          step="0.01"
          value={scale}
          onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-[var(--border-subtle)] accent-[var(--accent-primary)] focus:outline-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 w-full mt-2">
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1">
          Crop & Apply
        </Button>
      </div>
    </div>
  )
}
