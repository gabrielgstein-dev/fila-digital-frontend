'use client'

import React from 'react'
import { Queue, QueueStats } from '@/types'
import { QueueFlowDisplay, QueueStats as QueueStatsComponent, QueueConfigCard, PerformanceCard } from './components'

interface QueueFlow {
  current: string
  next: string[]
  lastCalled: string
  totalProcessed: number
  estimatedTimeToNext: number
  peakTime: string
  averageWaitTime: number
  completionRate: number
}

interface GeneralTabProps {
  queue: Queue
  queueFlow: QueueFlow
  queueStats: QueueStats | null
}


export function GeneralTab({ queue, queueFlow, queueStats }: GeneralTabProps) {
  return (
    <div className="space-y-6">
      {/* Fluxo de Atendimento */}
      <div className="space-y-6">
        <QueueFlowDisplay queue={queue} />
        <QueueStatsComponent queue={queue} queueFlow={queueFlow} />
      </div>

      {/* Informações Detalhadas e Configurações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QueueConfigCard queue={queue} />
        <PerformanceCard queue={queue} queueFlow={queueFlow} queueStats={queueStats} />
      </div>
    </div>
  )
}
