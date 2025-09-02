'use client';

import React, { createContext, useContext } from 'react';
import { useTokenManager } from '@/hooks/useTokenManager';
import { TokenStatusWarning } from '@/components/TokenStatusWarning';
import { Toaster } from 'sonner';

interface TokenManagerContextType {
  tokenState: {
    status: string;
    timeRemaining: string;
    shouldRefresh: boolean;
    sessionInfo: unknown;
  };
  isRefreshing: boolean;
  refreshToken: () => Promise<void>;
  handleTokenExpired: () => void;
  checkTokenStatus: () => Promise<void>;
}

const TokenManagerContext = createContext<TokenManagerContextType | null>(null);

export function useTokenManagerContext() {
  const context = useContext(TokenManagerContext);
  if (!context) {
    throw new Error('useTokenManagerContext must be used within a TokenManagerProvider');
  }
  return context;
}

interface TokenManagerProviderProps {
  children: React.ReactNode;
}

export function TokenManagerProvider({ children }: TokenManagerProviderProps) {
  const tokenManager = useTokenManager();

  return (
    <TokenManagerContext.Provider value={tokenManager}>
      {/* Aviso de token expirando */}
      <TokenStatusWarning 
        onRefresh={tokenManager.refreshToken}
        isRefreshing={tokenManager.isRefreshing}
      />
      
      {/* Toaster para notificações */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
      
      {children}
    </TokenManagerContext.Provider>
  );
}
