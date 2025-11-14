'use client';

import React from 'react';
import { useIgniterControl, useIgniterConnection } from '@/stores/igniter';
import { useIgniterSession } from '@/lib/igniter-session';

/**
 * Componente de controle para desenvolvimento
 * Usa Zustand diretamente - SEM provider!
 */
export function IgniterDevControls() {
  const { 
    sseEnabled, 
    setSseEnabled, 
    activeConnections,
    clearAllConnections,
    connectToMainSSE
  } = useIgniterControl();
  
  const { isConnected, error: connectionError } = useIgniterConnection();
  const { isAuthenticated, token } = useIgniterSession();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleReconnect = () => {
    if (isAuthenticated && token) {
      connectToMainSSE(token);
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

      {/* Indicador Zustand */}
      <div style={{
        background: '#8b5cf6',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        textAlign: 'center',
        fontSize: '10px'
      }}>
        🚀 Zustand (sem provider!)
      </div>

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

