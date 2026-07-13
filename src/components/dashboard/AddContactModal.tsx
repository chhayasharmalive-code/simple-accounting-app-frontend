import { useState, useRef } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import type { CreateContactParams } from '@/types'
import { CameraCapture } from '@/components/ui/CameraCapture'
import { ImageCropper } from '@/components/ui/ImageCropper'
import { Avatar } from '@/components/ui/Avatar'
import { Upload, Camera } from 'lucide-react'

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
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
    onClose()
  }

  const getModalTitle = () => {
    if (pendingImageSrc) return "Crop Avatar"
    if (isTakingPhoto) return "Take Photo"
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
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Avatar Option on Top */}
          <div className="flex flex-col gap-2 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass-hover)]">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Avatar Image
            </label>
            <div className="flex items-center gap-4">
              <Avatar name={name || 'New'} src={avatarBase64} size="lg" className="border border-[var(--border-glass)]" />
              
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsTakingPhoto(true)}
                    className="flex-1 gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Camera
                  </Button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <p className="text-[10px] text-[var(--text-muted)] text-center leading-normal">
                  Square cropping will be applied
                </p>
              </div>
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
          />

          <Button type="submit" loading={loading} className="w-full mt-2">
            Add Contact
          </Button>
        </form>
      )}
    </Modal>
  )
}
