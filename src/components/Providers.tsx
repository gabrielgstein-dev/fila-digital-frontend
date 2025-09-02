'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { TokenManagerProvider } from '@/components/TokenManagerProvider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <TokenManagerProvider>
          {children}
        </TokenManagerProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
