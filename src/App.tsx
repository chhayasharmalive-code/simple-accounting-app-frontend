import { Suspense, lazy } from 'react'
import { SignedIn, SignedOut, AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { ToastContainer } from '@/components/ui/Toast'
import { DataProvider } from '@/context/DataContext'
import { FAB } from '@/components/ui/FAB'
import { GlobalModals } from '@/components/dashboard/GlobalModals'
import { Spinner } from '@/components/ui/Spinner'

// Lazy-loaded pages for code-splitting (faster bundle load)
const AuthPage = lazy(() => import('@/components/auth/AuthPage').then(m => ({ default: m.AuthPage })))
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const ContactsPage = lazy(() => import('@/pages/ContactsPage').then(m => ({ default: m.ContactsPage })))
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage').then(m => ({ default: m.TransactionsPage })))

function App() {
  const location = useLocation()

  // Handle Clerk OAuth SSO callback route
  if (location.pathname === '/sso-callback') {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-[var(--bg-primary)] gap-4 text-center">
        <Spinner />
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Completing sign in...
        </p>
        <AuthenticateWithRedirectCallback />
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Ambient glassmorphism blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-pink-500/10 dark:bg-pink-500/5 blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-dvh">
        <Header />

        <main className="flex-1 pb-20 md:pb-6">
          <Suspense fallback={<div className="py-20 flex justify-center"><Spinner /></div>}>
            <SignedOut>
              <AuthPage />
            </SignedOut>

            <SignedIn>
              <DataProvider>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/contacts" element={<ContactsPage />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                </Routes>
                <FAB />
                <BottomNav />
                <GlobalModals />
              </DataProvider>
            </SignedIn>
          </Suspense>
        </main>

        <Footer />
        <ToastContainer />
      </div>
    </div>
  )
}

export default App
