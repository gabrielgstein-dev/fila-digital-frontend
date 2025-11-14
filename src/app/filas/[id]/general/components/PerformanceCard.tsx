'use client'

import { Tag } from '@/components/ui'
import { Queue, QueueStats } from '@/types'
import { AlertCircle, BarChart3, CheckCircle2, Clock, Timer, TrendingUp } from 'lucide-react'

interface QueueFlow {
  peakTime: string
  estimatedTimeToNext: number
}

interface PerformanceCardProps {
  queue: Queue
  queueFlow: QueueFlow
  queueStats: QueueStats | null
}

export function PerformanceCard({ queue, queueFlow, queueStats }: PerformanceCardProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg mr-3">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Desempenho Hoje
        </h3>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Horário de Pico</span>
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {queueFlow.peakTime || '--:--'}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-orange-500 mr-2" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
              </div>
              <Tag variant={queue.isActive ? 'green' : 'red'}>
                {queue.isActive ? 'Ativa' : 'Inativa'}
              </Tag>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Timer className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Próxima estimativa</span>
              </div>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                {queueFlow.estimatedTimeToNext > 0 ? `${queueFlow.estimatedTimeToNext} min` : 'Calculando...'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Baseado em tempo médio real dos últimos atendimentos
            </p>
          </div>

          {/* Taxa de Abandono */}
          {queueStats?.performance && (
            <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Taxa de abandono</span>
                </div>
                <Tag variant={queueStats.performance.abandonmentRate > 15 ? 'red' : queueStats.performance.abandonmentRate > 10 ? 'amber' : 'green'}>
                  {queueStats.performance.abandonmentRate}%
                </Tag>
              </div>
            </div>
          )}

          {/* Total processado hoje */}
          {queueStats?.performance && (
            <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total processado</span>
                </div>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  {queueStats.performance.totalProcessedToday}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
