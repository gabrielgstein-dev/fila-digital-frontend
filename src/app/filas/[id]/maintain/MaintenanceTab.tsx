'use client'

import React from 'react'
import { QueueMaintenancePanel } from '@/components/ui'

interface MaintenanceTabProps {
  queueId: string
  tenantId: string
  onStatsUpdate: () => void
}

export function MaintenanceTab({ queueId, tenantId, onStatsUpdate }: MaintenanceTabProps) {
  return (
    <div className="max-w-4xl">
      <QueueMaintenancePanel
        queueId={queueId}
        tenantId={tenantId}
        onStatsUpdate={onStatsUpdate}
      />
    </div>
  )
}
