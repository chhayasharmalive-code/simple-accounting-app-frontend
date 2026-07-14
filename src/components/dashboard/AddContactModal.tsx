import { useState, useRef, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import type { CreateContactParams } from '@/types'
import { CameraCapture } from '@/components/ui/CameraCapture'
import { ImageCropper } from '@/components/ui/ImageCropper'
import { Avatar } from '@/components/ui/Avatar'
import { QrScanner } from '@/components/ui/QrScanner'
import { Camera, UserPlus, QrCode } from 'lucide-react'

interface AddContactModalProps {
  open: boolean
  onClose: () => void
  onAdd: (params: CreateContactParams) => Promise<boolean>
}

export function AddContactModal({ open, onClose, onAdd }: AddContactModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [upiId, setUpiId] = useState('')
  const [avatarBase64, setAvatarBase64] = useState<string | undefined>()
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null)
  const [isTakingPhoto, setIsTakingPhoto] = useState(false)
  const [isScanningQr, setIsScanningQr] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isPickerSupported, setIsPickerSupported] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'contacts' in navigator && 'ContactsManager' in window) {
      setIsPickerSupported(true)
    }
  }, [])

  const handleImportContact = async () => {
    try {
      // @ts-ignore
      const supported = await navigator.contacts.getProperties()
      const props = []
      if (supported.includes('name')) props.push('name')
      if (supported.includes('tel')) props.push('tel')
      if (supported.includes('icon')) props.push('icon')

      // @ts-ignore
      const selected = await navigator.contacts.select(props, { multiple: false })
      if (selected && selected.length > 0) {
        const contact = selected[0]
        
        // Extract Name
        if (contact.name && contact.name.length > 0) {
          setName(contact.name[0])
        }
        
        // Extract Phone
        if (contact.tel && contact.tel.length > 0) {
          setPhone(contact.tel[0].trim())
        }
        
        // Extract Avatar Icon
        if (contact.icon && contact.icon.length > 0) {
          const iconBlob = contact.icon[0]
          const reader = new FileReader()
          reader.onload = () => {
            setAvatarBase64(reader.result as string)
          }
          reader.readAsDataURL(iconBlob)
        }
        
        toast('Contact imported successfully!', 'success')
      }
    } catch (err) {
      console.error('Contact picker error:', err)
      if (err instanceof Error && err.name !== 'AbortError') {
        toast('Failed to import contact.', 'error')
      }
    }
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setPendingImageSrc(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCameraCapture = (imageSrc: string) => {
    setPendingImageSrc(imageSrc)
    setIsTakingPhoto(false)
  }

  const handleCropComplete = (croppedBase64: string) => {
    setAvatarBase64(croppedBase64)
    setPendingImageSrc(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const success = await onAdd({
      name: name.trim(),
      phone: phone.trim() || undefined,
      upiId: upiId.trim() || undefined,
      avatar: avatarBase64,
    })

    setLoading(false)

    if (success) {
      toast(`${name.trim()} added!`, 'success')
      setName('')
      setPhone('')
      setUpiId('')
      setAvatarBase64(undefined)
      setPendingImageSrc(null)
      setIsTakingPhoto(false)
      onClose()
    } else {
      toast('Failed to add contact.', 'error')
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

  const getModalTitle = () => {
    if (pendingImageSrc) return "Crop Avatar"
    if (isTakingPhoto) return "Take Photo"
    if (isScanningQr) return "Scan UPI QR Code"
    return "Add Contact"
  }

  return (
    <Modal open={open} onClose={handleClose} title={getModalTitle()}>
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
              <Avatar name={name || 'New'} src={avatarBase64} size="lg" className="!w-20 !h-20 !text-2xl ring-2 ring-[var(--border-glass)] ring-offset-2 ring-offset-[var(--bg-primary)] transition-transform group-hover:scale-105 group-active:scale-95" />
              {/* Camera overlay */}
              <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center shadow-lg border-2 border-[var(--bg-primary)] transition-transform group-hover:scale-110">
                <Camera className="w-4 h-4" />
              </span>
            </button>

            <div className="flex flex-col items-center gap-0.5">
              <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Tap to take photo
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
            rightElement={
              isPickerSupported ? (
                <button
                  type="button"
                  onClick={handleImportContact}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-glass-hover)] active:scale-95 text-[var(--accent-primary)]"
                  title="Import from phone contacts"
                >
                  <UserPlus className="w-4.5 h-4.5" />
                </button>
              ) : undefined
            }
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
            Add Contact
          </Button>
        </form>
      )}
    </Modal>
  )
}
