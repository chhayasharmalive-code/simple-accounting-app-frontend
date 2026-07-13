import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { AuthPage } from '@/components/auth/AuthPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ContactsPage } from '@/pages/ContactsPage'
import { TransactionsPage } from '@/pages/TransactionsPage'
import { ToastContainer } from '@/components/ui/Toast'
import { DataProvider } from '@/context/DataContext'
import { FAB } from '@/components/ui/FAB'
import { GlobalModals } from '@/components/dashboard/GlobalModals'

function App() {
  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Ambient glassmorphism blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-pink-500/10 dark:bg-pink-500/5 blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-dvh">
        <Header />

        <main className="flex-1 pb-20 md:pb-6">
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
        </main>

        <Footer />
        <ToastContainer />
      </div>
    </div>
  )
}

export default App
