'use client'

import React from 'react'
import { Users, CheckCircle2, Timer, TrendingUp } from 'lucide-react'
import { Queue } from '@/types'

interface QueueFlow {
  totalProcessed: number
  averageWaitTime: number
  completionRate: number
}

interface QueueStatsProps {
  queue: Queue
  queueFlow: QueueFlow
}

export function QueueStats({ queue, queueFlow }: QueueStatsProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {queue.totalWaiting || 0}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center">
            <Users className="w-4 h-4 mr-1" />
            Aguardando
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
            {queueFlow.totalProcessed}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Atendidos hoje
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {queueFlow.averageWaitTime}min
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center">
            <Timer className="w-4 h-4 mr-1" />
            Espera média
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {queueFlow.completionRate}%
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            Taxa conclusão
          </div>
        </div>
      </div>
    </div>
  )
}
