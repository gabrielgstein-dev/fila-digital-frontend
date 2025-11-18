'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useIgniterStore } from '@/stores/igniter-store';
import type { UserWithToken } from '@/types/igniter';

interface IgniterProviderProps {
  children: React.ReactNode;
}

/**
 * Provider wrapper que integra o Zustand store com NextAuth
 * Mantém compatibilidade com a implementação anterior
 */
export function IgniterProvider({ children }: IgniterProviderProps) {
  const { data: session, status } = useSession();
  const { 
    sseEnabled, 
    isConnecting, 
    mainEventSource,
    connectToMainSSE, 
    disconnectFromMainSSE,
    clearAllConnections 
  } = useIgniterStore();

  // Conectar/desconectar baseado na sessão
  useEffect(() => {
    if (status === 'authenticated' && session?.user && sseEnabled) {
      // Verificar se já existe conexão ativa
      if (isConnecting || (mainEventSource && mainEventSource.readyState === EventSource.OPEN)) {
        return;
      }

      const user = session.user as UserWithToken;
      const token = user.accessToken || user.token;
      
      if (token) {
        console.log('🔐 Iniciando conexão SSE com Zustand');
        connectToMainSSE();
      } else {
        console.warn('⚠️ Token não disponível para conexão SSE');
      }
    } else if (status === 'unauthenticated') {
      console.log('🚪 Usuário deslogado, limpando conexões SSE');
      clearAllConnections();
    }

    return () => {
      if (status === 'unauthenticated') {
        disconnectFromMainSSE();
      }
    };
  }, [status, session?.user, sseEnabled, connectToMainSSE, disconnectFromMainSSE, clearAllConnections, isConnecting, mainEventSource]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      clearAllConnections();
    };
  }, [clearAllConnections]);

  return (
    <>
      {children}
      {/* Componente de controle para desenvolvimento */}
      <IgniterDevControls />
    </>
  );
}

/**
 * Componente de controle para desenvolvimento
 * Substitui o botão inline do provider anterior
 */
function IgniterDevControls() {
  const { 
    sseEnabled, 
    setSseEnabled, 
    isConnected, 
    connectionError, 
    getActiveConnectionsCount,
    clearAllConnections,
    connectToMainSSE
  } = useIgniterStore();
  
  const activeConnections = getActiveConnectionsCount();
  
  const { data: session, status } = useSession();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleReconnect = () => {
    if (status === 'authenticated' && session?.user) {
      connectToMainSSE();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      {/* Toggle SSE */}
      <button
        style={{
          background: sseEnabled ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={() => setSseEnabled(!sseEnabled)}
      >
        SSE: {sseEnabled ? 'ON' : 'OFF'}
      </button>

      {/* Status de conexão */}
      {sseEnabled && (
        <div style={{
          background: isConnected ? '#10b981' : '#f59e0b',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          {isConnected ? '✅ Conectado' : '⚠️ Desconectado'}
        </div>
      )}

      {/* Contador de conexões */}
      {sseEnabled && activeConnections > 0 && (
        <div style={{
          background: '#3b82f6',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          🔗 {activeConnections} conexões
        </div>
      )}

      {/* Botão limpar conexões */}
      <button
        style={{
          background: '#f59e0b',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={clearAllConnections}
      >
        🧹 Limpar
      </button>

      {/* Botão reconectar */}
      {sseEnabled && connectionError && (
        <button
          style={{
            background: '#8b5cf6',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          onClick={handleReconnect}
        >
          🔄 Reconectar
        </button>
      )}

      {/* Erro de conexão */}
      {sseEnabled && connectionError && (
        <div style={{
          background: '#ef4444',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '6px',
          fontSize: '10px',
          maxWidth: '200px',
          wordWrap: 'break-word'
        }}>
          {connectionError}
        </div>
      )}
    </div>
  );
}

