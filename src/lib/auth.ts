import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { apiClient } from './api'
import { env } from '@/config/env'
import { NextAuthUser, NextAuthSession, NextAuthJWT } from '@/types'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        cpf: { label: 'CPF', type: 'text' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.cpf || !credentials?.password) {
          console.log('🔐 NextAuth: Credenciais ausentes')
          return null
        }

        console.log('🔐 NextAuth: Tentativa de login para CPF:', credentials.cpf)
        console.log('🔐 NextAuth: URL da API:', env.API_URL)

        try {
          console.log('🔐 NextAuth: Chamando API de login...')
          const response = await apiClient.login({
            cpf: credentials.cpf,
            password: credentials.password
          })

          console.log('🔐 NextAuth: Login bem-sucedido:', {
            userId: response.user.id,
            userName: response.user.name,
            userRole: response.user.role
          })

          return {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            role: response.user.role,
            tenantId: response.user.tenantId,
            tenant: response.user.tenant,
            accessToken: response.access_token,
            userType: 'agent'
          }
        } catch (error) {
          console.error('❌ NextAuth: Erro na autenticação:', error)
          console.error('❌ NextAuth: Detalhes do erro:', {
            message: error instanceof Error ? error.message : 'Erro desconhecido',
            stack: error instanceof Error ? error.stack : undefined
          })
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as NextAuthUser
        const customToken = token as unknown as NextAuthJWT
        customToken.role = customUser.role
        customToken.tenantId = customUser.tenantId
        customToken.tenant = customUser.tenant
        customToken.accessToken = customUser.accessToken
        customToken.userType = customUser.userType
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        const customSession = session as unknown as NextAuthSession
        const customToken = token as unknown as NextAuthJWT
        customSession.user.id = customToken.id
        customSession.user.role = customToken.role
        customSession.user.tenantId = customToken.tenantId
        customSession.user.tenant = customToken.tenant
        customSession.user.accessToken = customToken.accessToken
        customSession.user.userType = customToken.userType
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas
  },
  secret: env.NEXTAUTH_SECRET
}
