// ─── UPI Payment Utilities ────────────────────────────────────────────────────
// Generates deep links for major Indian UPI apps.
// On mobile: opens the respective app directly.
// For QR: standard upi:// URI scanned by any UPI app.

export type PaymentApp = 'gpay' | 'phonepe' | 'paytm'

export interface UpiPaymentParams {
  upiId: string
  payeeName: string
  amount: number
  note?: string
}

const encodeUpiParams = (params: UpiPaymentParams): string => {
  const p = new URLSearchParams({
    pa: params.upiId,
    pn: params.payeeName,
    am: params.amount.toFixed(2),
    cu: 'INR',
    ...(params.note ? { tn: params.note } : {}),
  })
  return p.toString()
}

export const UPI_APP_META: Record<PaymentApp, { label: string; color: string; scheme: string }> = {
  gpay: {
    label: 'GPay',
    color: '#1A73E8',
    scheme: 'tez',
  },
  phonepe: {
    label: 'PhonePe',
    color: '#5F259F',
    scheme: 'phonepe',
  },
  paytm: {
    label: 'Paytm',
    color: '#00BAF2',
    scheme: 'paytmmp',
  },
}

/** Returns the deep link URI for a given UPI app */
export function buildDeepLink(app: PaymentApp, params: UpiPaymentParams): string {
  const query = encodeUpiParams(params)
  switch (app) {
    case 'gpay':
      return `tez://upi/pay?${query}`
    case 'phonepe':
      return `phonepe://pay?${query}`
    case 'paytm':
      return `paytmmp://upi/pay?${query}`
  }
}

/** Standard upi:// URI used as QR code payload */
export function buildUpiQrData(params: UpiPaymentParams): string {
  return `upi://pay?${encodeUpiParams(params)}`
}

/** QR image URL via the free qrserver.com API (no npm dependency) */
export function buildQrImageUrl(data: string, size = 220): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&bgcolor=ffffff&color=000000&margin=12&format=png&ecc=M`
}
