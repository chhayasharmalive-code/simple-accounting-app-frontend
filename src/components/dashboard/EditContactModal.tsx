import { useState, useRef, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { Avatar } from '@/components/ui/Avatar'
import { CameraCapture } from '@/components/ui/CameraCapture'
import { ImageCropper } from '@/components/ui/ImageCropper'
import { QrScanner } from '@/components/ui/QrScanner'
import { Camera, QrCode } from 'lucide-react'
import type { Contact, UpdateContactParams } from '@/types'

interface EditContactModalProps {
  open: boolean
  contact: Contact | null
  onClose: () => void
  onSave: (id: string, params: UpdateContactParams) => Promise<boolean>
}

export function EditContactModal({ open, contact, onClose, onSave }: EditContactModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [upiId, setUpiId] = useState('')
  const [avatarBase64, setAvatarBase64] = useState<string | undefined>()
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null)
  const [isTakingPhoto, setIsTakingPhoto] = useState(false)
  const [isScanningQr, setIsScanningQr] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Populate fields when contact changes or modal opens
  useEffect(() => {
    if (contact && open) {
      setName(contact.name)
      setPhone(contact.phone ?? '')
      setUpiId(contact.upiId ?? '')
      setAvatarBase64(contact.avatar ?? undefined)
      setPendingImageSrc(null)
      setIsTakingPhoto(false)
    }
  }, [contact, open])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPendingImageSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleCameraCapture = (imageSrc: string) => {
    setPendingImageSrc(imageSrc)
    setIsTakingPhoto(false)
  }

  const parseUpiQrCode = (qrData: string) => {
    try {
      const decoded = decodeURIComponent(qrData).trim()
      if (decoded.startsWith('upi://pay')) {
        const url = new URL(decoded)
        const pa = url.searchParams.get('pa') || ''
        const pn = url.searchParams.get('pn') || ''
        return { upiId: pa, name: pn }
      }
      if (decoded.includes('@')) {
        const parts = decoded.split('@')
        if (parts.length === 2 && parts[0].length > 0 && parts[1].length > 0) {
          return { upiId: decoded, name: '' }
        }
      }
    } catch (err) {
      console.error('Failed to parse UPI QR:', err)
    }
    return null
  }

  const handleQrScan = (decodedText: string) => {
    const result = parseUpiQrCode(decodedText)
    if (result) {
      setUpiId(result.upiId)
      if (result.name && !name) {
        setName(result.name)
      }
      toast('UPI QR scanned successfully!', 'success')
    } else {
      toast('Invalid UPI QR code format.', 'error')
    }
    setIsScanningQr(false)
  }

  const handleCropComplete = (croppedBase64: string) => {
    setAvatarBase64(croppedBase64)
    setPendingImageSrc(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contact) return

    setLoading(true)
    const success = await onSave(contact.id, {
      name: name.trim(),
      phone: phone.trim() || undefined,
      upiId: upiId.trim() || undefined,
      avatar: avatarBase64,
    })
    setLoading(false)

    if (success) {
      toast(`${name.trim()} updated!`, 'success')
      handleClose()
    } else {
      toast('Failed to update contact.', 'error')
    }
  }

  const handleClose = () => {
    setName('')
    setPhone('')
    setUpiId('')
    setAvatarBase64(undefined)
    setPendingImageSrc(null)
    setIsTakingPhoto(false)
    setIsScanningQr(false)
    onClose()
  }

  const getTitle = () => {
    if (pendingImageSrc) return 'Crop Avatar'
    if (isTakingPhoto) return 'Take Photo'
    if (isScanningQr) return 'Scan UPI QR Code'
    return 'Edit Contact'
  }

  return (
    <Modal open={open} onClose={handleClose} title={getTitle()}>
      {pendingImageSrc ? (
        <ImageCropper
          imageSrc={pendingImageSrc}
          onCrop={handleCropComplete}
          onCancel={() => setPendingImageSrc(null)}
        />
      ) : isTakingPhoto ? (
        <CameraCapture
          onCapture={handleCameraCapture}
          onCancel={() => setIsTakingPhoto(false)}
        />
      ) : isScanningQr ? (
        <QrScanner
          onScan={handleQrScan}
          onCancel={() => setIsScanningQr(false)}
        />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Avatar — tap to take photo */}
          <div className="flex flex-col items-center gap-3 py-2">
            <button
              type="button"
              onClick={() => setIsTakingPhoto(true)}
              className="group relative"
              aria-label="Take photo for avatar"
            >
              <Avatar name={name || 'Contact'} src={avatarBase64} size="lg" className="!w-20 !h-20 !text-2xl ring-2 ring-[var(--border-glass)] ring-offset-2 ring-offset-[var(--bg-primary)] transition-transform group-hover:scale-105 group-active:scale-95" />
              {/* Camera overlay */}
              <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center shadow-lg border-2 border-[var(--bg-primary)] transition-transform group-hover:scale-110">
                <Camera className="w-4 h-4" />
              </span>
            </button>

            <div className="flex flex-col items-center gap-0.5">
              <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Tap to change photo
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-medium transition-colors hover:underline"
                style={{ color: 'var(--accent-primary)' }}
              >
                or upload from gallery
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <Input
            label="Name"
            type="text"
            placeholder="Contact name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="UPI ID"
            type="text"
            placeholder="name@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            rightElement={
              <button
                type="button"
                onClick={() => setIsScanningQr(true)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-glass-hover)] active:scale-95 text-[var(--accent-primary)]"
                title="Scan UPI QR Code"
              >
                <QrCode className="w-4.5 h-4.5" />
              </button>
            }
          />

          <Button type="submit" loading={loading} className="w-full mt-2">
            Save Changes
          </Button>
        </form>
      )}
    </Modal>
  )
}
