import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { usePaymentPreference } from '@/hooks/usePaymentPreference'
import {
  buildDeepLink,
  buildQrImageUrl,
  buildUpiQrData,
  UPI_APP_META,
  type PaymentApp,
  type UpiPaymentParams,
} from '@/lib/upi'
import { formatINR } from '@/lib/format'
import { QrCode, ExternalLink, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentSheetProps {
  open: boolean
  onClose: () => void
  params: UpiPaymentParams
  contactName: string
}

// ── Inline SVG brand icons ────────────────────────────────────────────────────

function GPay({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#fff" />
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1A73E8">G</text>
    </svg>
  )
}

function PhonePe({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#fff" />
      <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#5F259F">Pe</text>
    </svg>
  )
}

function Paytm({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#fff" />
      <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#00BAF2">Pay</text>
    </svg>
  )
}

const APP_ICONS: Record<PaymentApp, ({ size }: { size?: number }) => React.ReactElement> = {
  gpay: GPay,
  phonepe: PhonePe,
  paytm: Paytm,
}

// ─────────────────────────────────────────────────────────────────────────────

type ViewMode = 'apps' | 'qr'

export function PaymentSheet({ open, onClose, params, contactName }: PaymentSheetProps) {
  const { preferred, savePreference } = usePaymentPreference()
  const [view, setView] = useState<ViewMode>('apps')
  const [qrLoaded, setQrLoaded] = useState(false)

  const qrData = buildUpiQrData(params)
  const qrUrl = buildQrImageUrl(qrData, 220)

  const handleAppPay = (app: PaymentApp) => {
    savePreference(app)
    const link = buildDeepLink(app, params)
    window.open(link, '_blank', 'noreferrer')
  }

  const apps = Object.entries(UPI_APP_META) as [PaymentApp, typeof UPI_APP_META[PaymentApp]][]
  // Put the preferred app first
  const sortedApps = preferred
    ? [
        [preferred, UPI_APP_META[preferred]] as [PaymentApp, typeof UPI_APP_META[PaymentApp]],
        ...apps.filter(([key]) => key !== preferred),
      ]
    : apps

  return (
    <Modal open={open} onClose={onClose} title="Pay Now">
      <div className="flex flex-col gap-5">
        {/* Amount summary */}
        <div
          className="rounded-xl p-4 flex flex-col items-center gap-1"
          style={{ backgroundColor: 'var(--accent-emerald-soft)' }}
        >
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--accent-emerald)' }}>
            Paying to
          </p>
          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {contactName}
          </p>
          <p className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--accent-emerald)' }}>
            {formatINR(params.amount)}
          </p>
          <p className="text-xs font-mono mt-1 px-2 py-0.5 rounded-md" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--border-subtle)' }}>
            {params.upiId}
          </p>
        </div>

        {/* View Toggle */}
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ backgroundColor: 'var(--border-subtle)' }}
        >
          {(['apps', 'qr'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200"
              style={{
                backgroundColor: view === v ? 'var(--bg-glass)' : 'transparent',
                color: view === v ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: view === v ? 'var(--glass-shadow)' : undefined,
              }}
            >
              {v === 'qr' && <QrCode className="w-3.5 h-3.5" />}
              {v === 'apps' ? 'Open App' : 'QR Code'}
            </button>
          ))}
        </div>

        {/* Apps View */}
        {view === 'apps' && (
          <div className="flex flex-col gap-2">
            {sortedApps.map(([app, meta]) => {
              const Icon = APP_ICONS[app]
              const isPreferred = app === preferred
              return (
                <button
                  key={app}
                  onClick={() => handleAppPay(app)}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-150',
                    'hover:scale-[1.01] active:scale-[0.99]',
                    isPreferred
                      ? 'border-[var(--accent-primary)]/25 bg-[var(--accent-primary-soft)]'
                      : 'border-[var(--border-glass)] hover:bg-[var(--bg-glass-hover)]'
                  )}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                    style={{ backgroundColor: meta.color }}
                  >
                    <Icon size={28} />
                  </div>

                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {meta.label}
                    </p>
                    {isPreferred && (
                      <p className="text-[10px] font-medium" style={{ color: 'var(--accent-primary)' }}>
                        Preferred
                      </p>
                    )}
                  </div>

                  <ExternalLink className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                </button>
              )
            })}

            <p className="text-[11px] text-center mt-1" style={{ color: 'var(--text-muted)' }}>
              Your preferred app is saved automatically
            </p>
          </div>
        )}

        {/* QR View */}
        {view === 'qr' && (
          <div className="flex flex-col items-center gap-3">
            <div
              className="p-3 rounded-2xl border"
              style={{ backgroundColor: '#ffffff', borderColor: 'var(--border-subtle)' }}
            >
              {!qrLoaded && (
                <div className="w-[220px] h-[220px] flex items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--border-subtle)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading QR…</p>
                </div>
              )}
              <img
                src={qrUrl}
                alt="UPI QR Code"
                width={220}
                height={220}
                className={cn('rounded-xl block', !qrLoaded && 'hidden')}
                onLoad={() => setQrLoaded(true)}
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--accent-emerald)' }}>
              <CheckCircle className="w-3.5 h-3.5" />
              Scan with any UPI app
            </div>

            <p className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
              Works with GPay, PhonePe, Paytm and all UPI apps
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}
