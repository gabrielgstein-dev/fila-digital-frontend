'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Users, 
  Clock, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { apiClient } from '@/lib/api'
import { Queue, QueueType } from '@/types'

export default function QueuesPage() {
  const [queues, setQueues] = useState<Queue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<QueueType | 'ALL'>('ALL')
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session?.user?.tenantId) {
      loadQueues()
    }
  }, [session])

  const loadQueues = async () => {
    if (!session?.user?.tenantId) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await apiClient.getQueues(session.user.tenantId)
      setQueues(data)
    } catch (err) {
      console.error('Erro ao carregar filas:', err)
      setError('Erro ao carregar filas. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (queueId: string) => {
    if (!session?.user?.tenantId) return
    
    if (!confirm('Tem certeza que deseja excluir esta fila?')) return

    try {
      await apiClient.deleteQueue(session.user.tenantId, queueId)
      await loadQueues()
    } catch (err) {
      console.error('Erro ao excluir fila:', err)
      setError('Erro ao excluir fila. Tente novamente.')
    }
  }

  const getQueueTypeLabel = (type: QueueType) => {
    switch (type) {
      case QueueType.GENERAL:
        return 'Geral'
      case QueueType.PRIORITY:
        return 'Prioritária'
      case QueueType.VIP:
        return 'VIP'
      default:
        return type
    }
  }

  const getQueueTypeColor = (type: QueueType) => {
    switch (type) {
      case QueueType.GENERAL:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case QueueType.PRIORITY:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case QueueType.VIP:
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const filteredQueues = queues.filter(queue => {
    const matchesSearch = queue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         queue.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'ALL' || queue.queueType === filterType
    return matchesSearch && matchesType
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Filas de Atendimento
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Gerencie suas filas digitais
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard/queues/new')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center group"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
              Nova Fila
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar filas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as QueueType | 'ALL')}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="ALL">Todos os tipos</option>
                <option value={QueueType.GENERAL}>Geral</option>
                <option value={QueueType.PRIORITY}>Prioritária</option>
                <option value={QueueType.VIP}>VIP</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total de Filas</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{queues.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Filas Ativas</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {queues.filter(q => q.isActive).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Tempo Médio</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {queues.length > 0 
                    ? Math.round(queues.reduce((acc, q) => acc + q.avgServiceTime, 0) / queues.length)
                    : 0} min
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Capacidade Total</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {queues.reduce((acc, q) => acc + q.capacity, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Carregando filas..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredQueues.length === 0 && (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {searchTerm || filterType !== 'ALL' 
                ? 'Nenhuma fila encontrada' 
                : 'Nenhuma fila cadastrada'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchTerm || filterType !== 'ALL'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando sua primeira fila de atendimento'}
            </p>
            {!searchTerm && filterType === 'ALL' && (
              <button
                onClick={() => router.push('/dashboard/queues/new')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl inline-flex items-center group"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                Criar Primeira Fila
              </button>
            )}
          </div>
        )}

        {/* Queues Grid */}
        {!isLoading && filteredQueues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQueues.map((queue) => (
              <div
                key={queue.id}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 hover:shadow-2xl transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {queue.name}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getQueueTypeColor(queue.queueType)}`}>
                        {getQueueTypeLabel(queue.queueType)}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                </div>

                {queue.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {queue.description}
                  </p>
                )}

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Tempo médio
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {queue.avgServiceTime} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Capacidade
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {queue.capacity} pessoas
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Status
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      queue.isActive 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {queue.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => router.push(`/dashboard/queues/${queue.id}`)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/queues/${queue.id}/edit`)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors text-sm font-medium text-blue-700 dark:text-blue-400"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(queue.id)}
                    className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}