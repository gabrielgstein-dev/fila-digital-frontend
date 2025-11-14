'use client';

import React from 'react';
import { useTokenStatus } from '@/stores/token-manager';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';

interface TokenStatusWarningProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function TokenStatusWarning({ onRefresh, isRefreshing = false }: TokenStatusWarningProps) {
  const { status, timeRemaining, shouldRefresh } = useTokenStatus();

  if (status !== 'expiring' && !shouldRefresh) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              Sua sessão expirará em {timeRemaining}
            </span>
            <div className="flex items-center space-x-1 text-yellow-100">
              <Clock className="h-4 w-4" />
              <span className="text-xs">
                {status === 'expiring' ? 'Expirando em breve' : 'Ação necessária'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            className={`flex items-center space-x-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium disabled:opacity-50 ${
              isRefreshing ? 'cursor-not-allowed' : ''
            }`}
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Renovando...' : 'Renovar Sessão'}</span>
          </button>
          
          <button
            className="text-yellow-100 hover:text-white text-sm px-2 py-1 rounded"
            onClick={() => {
              // Fechar aviso temporariamente (será mostrado novamente na próxima verificação)
              const warning = document.querySelector('[data-token-warning]') as HTMLElement;
              if (warning) warning.style.display = 'none';
            }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente que mostra informações detalhadas da sessão
export function SessionInfo() {
  const { status, timeRemaining } = useTokenStatus();

  if (status === 'loading') {
    return (
      <div className="text-sm text-gray-500 flex items-center space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span>Verificando sessão...</span>
      </div>
    );
  }

  const statusConfig = {
    valid: {
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: '✓',
      text: 'Sessão ativa'
    },
    expiring: {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: '⚠',
      text: `Expira em ${timeRemaining}`
    },
    expired: {
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: '✕',
      text: 'Sessão expirada'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.expired;

  return (
    <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${config.bgColor} ${config.color}`}>
      <span>{config.icon}</span>
      <span>{config.text}</span>
    </div>
  );
}
