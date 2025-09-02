import { useEffect, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { igniterClient } from '@/lib/igniter-client';
import { toast } from 'sonner';
import type { NextAuthSession } from '@/types';

export type TokenStatus = 'valid' | 'expiring' | 'expired' | 'loading';

export interface TokenManagerState {
  status: TokenStatus;
  timeRemaining: string;
  shouldRefresh: boolean;
  sessionInfo: unknown;
}

export function useTokenManager() {
  const { data: session, status: sessionStatus } = useSession();
  const [tokenState, setTokenState] = useState<TokenManagerState>({
    status: 'loading',
    timeRemaining: '',
    shouldRefresh: false,
    sessionInfo: null,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [warningShown, setWarningShown] = useState(false);

  // Configurar token no cliente Igniter quando a sessão estiver disponível
  useEffect(() => {
    const customSession = session as NextAuthSession | null;
    if (customSession?.user?.accessToken) {
      igniterClient.setToken(customSession.user.accessToken);
    }
  }, [session]);

  // Lidar com token expirado
  const handleTokenExpired = useCallback(() => {
    toast.error('Sessão Expirada', {
      description: 'Sua sessão expirou. Você será redirecionado para o login.',
    });
    
    signOut({ 
      callbackUrl: '/login?reason=token_expired',
      redirect: true 
    });
  }, []);

  // Verificar status do token
  const checkTokenStatus = useCallback(async () => {
    const customSession = session as NextAuthSession | null;
    if (sessionStatus !== 'authenticated' || !customSession?.user?.accessToken) {
      setTokenState(prev => ({ ...prev, status: 'expired' }));
      return;
    }

    try {
      const tokenStatus = await igniterClient.getTokenStatus();
      const sessionInfo = await igniterClient.getSessionInfo();

      setTokenState({
        status: tokenStatus.shouldRefresh ? 'expiring' : 'valid',
        timeRemaining: tokenStatus.timeToExpire,
        shouldRefresh: tokenStatus.shouldRefresh,
        sessionInfo,
      });

      // Mostrar aviso se está expirando e ainda não foi mostrado
      if (tokenStatus.shouldRefresh && !warningShown) {
        setWarningShown(true);
        toast.warning('Sessão Expirando', {
          description: `Sua sessão expirará em ${tokenStatus.timeToExpire}. Clique para renovar.`,
          action: {
            label: 'Renovar',
            onClick: () => refreshToken(),
          },
          duration: 30000, // 30 segundos
        });
      }

      // Reset warning se não está mais expirando
      if (!tokenStatus.shouldRefresh && warningShown) {
        setWarningShown(false);
      }

    } catch (error) {
      console.error('❌ Erro ao verificar status do token:', error);
      setTokenState(prev => ({ ...prev, status: 'expired' }));
      handleTokenExpired();
    }
  }, [session, sessionStatus, warningShown, handleTokenExpired]); // eslint-disable-line react-hooks/exhaustive-deps

  // Renovar token
  const refreshToken = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      const result = await igniterClient.refreshToken();
      
      // Atualizar token no cliente
      igniterClient.setToken(result.access_token);
      
      // Resetar estado de aviso
      setWarningShown(false);
      
      toast.success('Token Renovado', {
        description: 'Sua sessão foi renovada com sucesso!',
      });

      // Verificar status novamente
      await checkTokenStatus();

    } catch (error) {
      console.error('❌ Erro ao renovar token:', error);
      toast.error('Erro ao Renovar', {
        description: 'Não foi possível renovar sua sessão. Você será redirecionado para o login.',
      });
      handleTokenExpired();
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, checkTokenStatus, handleTokenExpired]);

  // Verificação periódica do token
  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      // Verificar imediatamente
      checkTokenStatus();

      // Verificar a cada minuto
      const interval = setInterval(checkTokenStatus, 60000);

      return () => clearInterval(interval);
    }
  }, [sessionStatus, checkTokenStatus]);

  // Auto-refresh quando necessário (opcional)
  useEffect(() => {
    if (tokenState.shouldRefresh && !isRefreshing && !warningShown) {
      // Auto-refresh silencioso após 2 minutos de aviso
      const autoRefreshTimer = setTimeout(() => {
        refreshToken();
      }, 2 * 60 * 1000); // 2 minutos

      return () => clearTimeout(autoRefreshTimer);
    }
  }, [tokenState.shouldRefresh, isRefreshing, warningShown]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    tokenState,
    isRefreshing,
    refreshToken,
    handleTokenExpired,
    checkTokenStatus,
  };
}

// Hook simplificado para componentes que só precisam do status
export function useTokenStatus() {
  const { tokenState } = useTokenManager();
  return {
    status: tokenState.status,
    timeRemaining: tokenState.timeRemaining,
    shouldRefresh: tokenState.shouldRefresh,
  };
}
