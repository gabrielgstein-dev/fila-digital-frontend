'use client'

import { Users, BarChart3, Settings, User, Shield, Building2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-0 max-w-7xl mx-auto py-8 px-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Bem-vindo ao Backoffice
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Gerencie suas filas digitais de forma inteligente
          </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center">
                    <User className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        Usuário
                      </p>
                      <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                        {user?.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center">
                    <Shield className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        Função
                      </p>
                      <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                        {user?.role === 'ADMIN' ? 'Administrador' : 
                         user?.role === 'MANAGER' ? 'Gerente' : 'Atendente'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center">
                    <Building2 className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        Empresa
                      </p>
                      <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                        {user?.tenant?.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

          <div className="bg-gradient-to-br from-slate-50/50 to-indigo-50/50 dark:from-slate-800/50 dark:to-indigo-900/20 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Acesso Rápido
            </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <button
                    onClick={() => router.push('/filas')}
                    className="flex flex-col items-center p-6 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] border border-white/20 dark:border-slate-600/50 hover:border-blue-300 dark:hover:border-blue-400 group"
                  >
                    <Users className="w-10 h-10 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="text-base font-semibold text-slate-700 dark:text-slate-300 text-center mb-1">
                      Gerenciar Filas
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      Visualize e gerencie todas as suas filas
                    </span>
                  </button>

                  <button
                    onClick={() => router.push('/backend-integration')}
                    className="flex flex-col items-center p-6 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] border border-white/20 dark:border-slate-600/50 hover:border-purple-300 dark:hover:border-purple-400 group"
                  >
                    <BarChart3 className="w-10 h-10 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="text-base font-semibold text-slate-700 dark:text-slate-300 text-center mb-1">
                      Integração
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      Configure integrações e relatórios
                    </span>
                  </button>

                  <button
                    className="flex flex-col items-center p-6 bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-slate-600/50 opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <Settings className="w-10 h-10 text-orange-500 mb-3" />
                    <span className="text-base font-semibold text-slate-700 dark:text-slate-300 text-center mb-1">
                      Configurações
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      Em breve - Configurações do sistema
                    </span>
                  </button>
                </div>
          </div>
        </div>
      </div>
    </div>
  )
}
