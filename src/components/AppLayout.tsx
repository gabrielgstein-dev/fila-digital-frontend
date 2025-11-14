'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Sidebar } from '@/components/Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // Páginas que não precisam de autenticação
  const publicPages = useMemo(() => ['/login', '/'], [])

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated' && !publicPages.includes(pathname)) {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && publicPages.includes(pathname)) {
      router.push('/dashboard')
      return
    }
  }, [status, pathname, router, publicPages])

  // Mostrar loading durante verificação de autenticação
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    )
  }

  // Se não está autenticado e está em página pública, mostrar sem sidebar
  if (status === 'unauthenticated' && publicPages.includes(pathname)) {
    return <>{children}</>
  }

  // Se está autenticado, mostrar com sidebar
  if (status === 'authenticated') {
    return (
      <Sidebar>
        {children}
      </Sidebar>
    )
  }

  // Fallback
  return <>{children}</>
}
