import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { useSignIn } from '@clerk/clerk-react'
import { Shield, ArrowLeftRight, Users } from 'lucide-react'
import { useState } from 'react'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export function AuthPage() {
  const { signIn, isLoaded } = useSignIn()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleSignIn = async () => {
    if (!isLoaded || !signIn) return

    setLoading(true)
    setError('')

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      })
    } catch (err: unknown) {
      setLoading(false)
      if (err && typeof err === 'object' && 'errors' in err) {
        const clerkErr = err as { errors: { message: string }[] }
        setError(clerkErr.errors?.[0]?.message || 'Sign in failed.')
      } else {
        setError('An unexpected error occurred.')
      }
    }
  }

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] flex flex-col items-center justify-center px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-8 animate-slide-up max-w-md">
        <span className="text-5xl mb-4 block">💰</span>
        <h2
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Track every rupee,
          <br />
          <span style={{ color: 'var(--accent-primary)' }}>lent or borrowed.</span>
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Simple, beautiful debt tracking. Know who owes you and who you owe — always.
        </p>
      </div>

      {/* Auth Card */}
      <GlassCard className="w-full max-w-sm p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Get started
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Sign in with your Google account to continue.
          </p>
        </div>

        {error && (
          <p className="text-xs text-center mb-4 px-1" style={{ color: 'var(--accent-rose)' }}>
            {error}
          </p>
        )}

        <Button
          variant="secondary"
          size="lg"
          onClick={handleGoogleSignIn}
          loading={loading}
          className="w-full"
        >
          <GoogleIcon className="w-5 h-5" />
          Continue with Google
        </Button>

        <p className="text-xs text-center mt-4" style={{ color: 'var(--text-muted)' }}>
          By continuing, you agree to our terms of service.
        </p>
      </GlassCard>

      {/* Feature Pills */}
      <div className="flex flex-wrap justify-center gap-3 mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {[
          { icon: Shield, label: 'Secure & Private' },
          { icon: ArrowLeftRight, label: 'Track Lent & Borrowed' },
          { icon: Users, label: 'Unlimited Contacts' },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="glass flex items-center gap-2 px-4 py-2"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <Icon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
