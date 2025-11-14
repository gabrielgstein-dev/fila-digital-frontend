'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { TokenStatusWarning } from '@/components/TokenStatusWarning'
import { useTokenRefresh } from '@/stores/token-manager'
import { Toaster } from 'sonner'

interface ProvidersProps {
  children: React.ReactNode
}

function TokenComponents() {
  const { refreshToken, isRefreshing } = useTokenRefresh()
  
  return (
    <>
      {/* Aviso de token expirando */}
      <TokenStatusWarning 
        onRefresh={refreshToken}
        isRefreshing={isRefreshing}
      />
      
      {/* Toaster para notificações */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </>
  )
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <TokenComponents />
        {children}
        {/* Zustand não precisa de provider! 🚀 */}
      </ThemeProvider>
    </SessionProvider>
  )
}
