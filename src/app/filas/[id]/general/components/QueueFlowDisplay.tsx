'use client'

import { useTicketStream } from '@/hooks/useTicketStream'
import { Queue } from '@/types'
import { ArrowRight, Clock } from 'lucide-react'

interface QueueFlowDisplayProps {
  queue: Queue
}

export function QueueFlowDisplay({ queue }: QueueFlowDisplayProps) {
  const { isConnected, queueState } = useTicketStream(queue.id)

  const currentTicket = queueState?.currentTicket?.myCallingToken || null
  const previousTicket = queueState?.previousTicket?.myCallingToken || null
  const nextTickets = queueState?.nextTickets || []

  const displayCurrent = currentTicket || '---'
  const displayPrevious = previousTicket || '---'

  const displayNextTickets = currentTicket
    ? nextTickets
    : nextTickets

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Fluxo de Atendimento
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Senha atual e próximas na fila
        </p>
        {!isConnected && (
          <p className="text-xs text-amber-500 mt-2">Conectando...</p>
        )}
      </div>

      {/* Trem de Senhas */}
      <div className="w-full flex justify-center mb-8 px-4">
        <div className="flex items-end space-x-3 md:space-x-4">
          {/* Senha Anterior (Última chamada) - Só mostra se houver senha anterior */}
          {previousTicket && previousTicket !== '---' && (
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg opacity-60">
                  <span className="text-white font-bold text-sm md:text-lg">{displayPrevious}</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 whitespace-nowrap">Concluída</span>
              </div>

              {/* Seta */}
              <div className="mb-12">
                <ArrowRight className="w-4 h-4 md:w-6 md:h-6 text-slate-400" />
              </div>
            </>
          )}

          {/* Senha Atual (Grande destaque) - Só mostra se houver ticket atual */}
          {currentTicket && currentTicket !== '---' && (
            <>
              <div className="flex flex-col items-center">
                <div className={`w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse`}>
                  <span className="text-white font-black text-2xl md:text-4xl">{displayCurrent}</span>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400">ATUAL</span>
                  <div className="flex items-center justify-center mt-1">
                    <Clock className="w-3 h-3 text-slate-500 mr-1" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      Em atendimento
                    </span>
                  </div>
                </div>
              </div>

              {/* Seta */}
              <div className="mb-12">
                <ArrowRight className="w-4 h-4 md:w-6 md:h-6 text-slate-400" />
              </div>
            </>
          )}

          {/* Próximas Senhas */}
          <div className="flex space-x-2 md:space-x-3">
            {displayNextTickets.length > 0 ? displayNextTickets.slice(0, 3).map((ticket, index) => (
              <div key={ticket.id} className="flex flex-col items-center mb-8">
                <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${
                  index === 0
                    ? 'from-green-500 to-emerald-600'
                    : 'from-amber-500 to-orange-600'
                } rounded-2xl flex items-center justify-center shadow-lg ${
                  index === 0 ? 'animate-bounce' : ''
                }`}>
                  <span className="text-white font-bold text-lg md:text-xl">{ticket.myCallingToken}</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 whitespace-nowrap">
                  {index === 0 ? 'Próxima' : `+${index + 1}`}
                </span>
              </div>
            )) : (
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg opacity-60">
                  <span className="text-white font-bold text-lg md:text-xl">---</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 whitespace-nowrap">
                  Aguardando
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
