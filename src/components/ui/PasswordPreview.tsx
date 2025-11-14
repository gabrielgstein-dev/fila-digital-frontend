import React from 'react'
import { ServiceType, QueueType } from '@/types'

interface PasswordPreviewProps {
  serviceType: ServiceType
  queueType: QueueType
}

export function PasswordPreview({ serviceType, queueType }: PasswordPreviewProps) {
  const getPasswordPrefix = (serviceType: ServiceType, queueType: QueueType) => {
    const prefixMap = {
      [ServiceType.CONSULTA]: 'C',
      [ServiceType.EXAMES]: 'E',
      [ServiceType.BALCAO]: 'B',
      [ServiceType.TRIAGEM]: 'T',
      [ServiceType.CAIXA]: 'X',
      [ServiceType.PEDIATRIA]: 'P',
      [ServiceType.URGENCIA]: 'U',
      [ServiceType.GENERAL]: 'G'
    }
    
    let prefix = prefixMap[serviceType] || 'G'
    
    // Adicionar P para prioritárias (exceto urgência que já é prioritária)
    if (queueType === QueueType.PRIORITY && serviceType !== ServiceType.URGENCIA) {
      prefix += 'P'
    }
    
    return prefix
  }

  const prefix = getPasswordPrefix(serviceType, queueType)
  
  return (
    <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Exemplo de senha:
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {prefix}1
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {prefix}2
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {prefix}3
          </span>
          <span className="text-slate-400">...</span>
        </div>
      </div>
    </div>
  )
}
