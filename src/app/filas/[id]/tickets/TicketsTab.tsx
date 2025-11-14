'use client'

import React from 'react'
import { Users } from 'lucide-react'
import { TicketDisplay, EmptyState } from '@/components/ui'
import { Ticket } from '@/types'

interface TicketsTabProps {
  tickets: Ticket[]
}

export function TicketsTab({ tickets }: TicketsTabProps) {
  return (
    <div className="space-y-6">
      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tickets.map((ticket) => (
            <TicketDisplay key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="Nenhum ticket encontrado"
          description="Esta fila não possui tickets no momento."
        />
      )}
    </div>
  )
}
