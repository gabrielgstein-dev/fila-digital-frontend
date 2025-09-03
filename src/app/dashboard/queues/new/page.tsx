'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ArrowLeft, 
  Save, 
  Clock, 
  Users, 
  Hash, 
  FileText,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { apiClient } from '@/lib/api'
import { QueueType } from '@/types'

const createQueueSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  description: z
    .string()
    .max(200, 'Descrição deve ter no máximo 200 caracteres')
    .optional(),
  queueType: z.nativeEnum(QueueType),
  capacity: z
    .number()
    .min(1, 'Capacidade deve ser no mínimo 1')
    .max(1000, 'Capacidade deve ser no máximo 1000'),
  avgServiceTime: z
    .number()
    .min(1, 'Tempo médio deve ser no mínimo 1 minuto')
    .max(480, 'Tempo médio deve ser no máximo 480 minutos'),
})

type CreateQueueFormData = z.infer<typeof createQueueSchema>

export default function NewQueuePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateQueueFormData>({
    resolver: zodResolver(createQueueSchema),
    defaultValues: {
      queueType: QueueType.GENERAL,
      capacity: 50,
      avgServiceTime: 15,
    },
  })

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    )
  }

  if (!session) {
    router.push('/login')
    return null
  }

  const onSubmit = async (data: CreateQueueFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!session.user.tenantId) {
        throw new Error('Tenant ID não encontrado na sessão')
      }

      await apiClient.createQueue(session.user.tenantId, {
        name: data.name,
        description: data.description,
        queueType: data.queueType,
        capacity: data.capacity,
        avgServiceTime: data.avgServiceTime,
      })

      setSuccess(true)
      reset()
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/dashboard/queues')
      }, 2000)
    } catch (err) {
      console.error('Erro ao criar fila:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar fila. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 dark:from-blue-800/20 dark:to-indigo-800/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    Nova Fila
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Configure uma nova fila de atendimento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="w-full max-w-4xl">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
            
            {/* Form Header */}
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Configuração Inteligente</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Criar Nova Fila de Atendimento
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Preencha as informações abaixo para configurar uma nova fila
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <div>
                    <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                      Fila criada com sucesso!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Redirecionando para a lista de filas...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {error}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome da Fila */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3"
                  >
                    Nome da Fila
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Hash className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      {...register('name')}
                      type="text"
                      id="name"
                      placeholder="Ex: Atendimento Geral"
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Tipo de Fila */}
                <div>
                  <label
                    htmlFor="queueType"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3"
                  >
                    Tipo de Fila
                  </label>
                  <select
                    {...register('queueType')}
                    id="queueType"
                    className="block w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500"
                  >
                    <option value={QueueType.GENERAL}>Geral</option>
                    <option value={QueueType.PRIORITY}>Prioritária</option>
                    <option value={QueueType.VIP}>VIP</option>
                  </select>
                  {errors.queueType && (
                    <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {errors.queueType.message}
                    </p>
                  )}
                </div>

                {/* Capacidade */}
                <div>
                  <label
                    htmlFor="capacity"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3"
                  >
                    Capacidade Máxima
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      {...register('capacity', { valueAsNumber: true })}
                      type="number"
                      id="capacity"
                      placeholder="50"
                      min="1"
                      max="1000"
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500"
                    />
                  </div>
                  {errors.capacity && (
                    <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {errors.capacity.message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Número máximo de pessoas na fila
                  </p>
                </div>

                {/* Tempo Médio de Atendimento */}
                <div>
                  <label
                    htmlFor="avgServiceTime"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3"
                  >
                    Tempo Médio de Atendimento (minutos)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      {...register('avgServiceTime', { valueAsNumber: true })}
                      type="number"
                      id="avgServiceTime"
                      placeholder="15"
                      min="1"
                      max="480"
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500"
                    />
                  </div>
                  {errors.avgServiceTime && (
                    <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {errors.avgServiceTime.message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Tempo estimado por atendimento
                  </p>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3"
                >
                  Descrição (opcional)
                </label>
                <div className="relative group">
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <FileText className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <textarea
                    {...register('description')}
                    id="description"
                    rows={3}
                    placeholder="Descreva o propósito desta fila..."
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500 resize-none"
                  />
                </div>
                {errors.description && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center group"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                      Criar Fila
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Tempo Real</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Atualizações instantâneas</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Multi-atendimento</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Suporte a múltiplos guichês</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Inteligente</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Otimização automática</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}