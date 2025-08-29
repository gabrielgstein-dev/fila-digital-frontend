import { useSession } from 'next-auth/react'

type CustomUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: string
  tenantId: string
  tenant: {
    id: string
    name: string
    [key: string]: unknown
  } | undefined
  accessToken: string
  userType: string
}

type CustomSession = {
  user: CustomUser
}

export function useAuth() {
  const { data: session, status } = useSession()
  
  return {
    session: session as CustomSession | null,
    status,
    user: session?.user as CustomUser | null
  }
}
