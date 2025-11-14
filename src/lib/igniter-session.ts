import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useIgniterStore } from '@/stores/igniter';
import type { UserWithToken } from '@/types/igniter';

/**
 * Hook para integrar Zustand store com NextAuth session
 * Usa diretamente sem provider - essa é a vantagem do Zustand!
 */
export function useIgniterSession() {
  const { data: session, status } = useSession();
  const { 
    sseEnabled, 
    isConnecting, 
    mainEventSource,
    connectToMainSSE, 
    disconnectFromMainSSE,
    clearAllConnections 
  } = useIgniterStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.user && sseEnabled) {
      // Verificar se já existe conexão ativa
      if (isConnecting || (mainEventSource && mainEventSource.readyState === EventSource.OPEN)) {
        return;
      }

      const user = session.user as UserWithToken;
      const token = user.accessToken || user.token;
      
      if (token) {
        console.log('🔐 Iniciando conexão SSE com Zustand (sem provider!)');
        connectToMainSSE(token);
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

  return {
    isAuthenticated: status === 'authenticated',
    user: session?.user as UserWithToken | undefined,
    token: (session?.user as UserWithToken)?.accessToken || (session?.user as UserWithToken)?.token
  };
}

