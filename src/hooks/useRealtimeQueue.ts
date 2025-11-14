'use client';

import { useState, useEffect, useCallback } from 'react';
// Zustand direto - sem provider!
import { 
  useIgniterConnection, 
  useQueueUpdates,
  useIgniterStore
} from '@/stores/igniter';
import { useIgniterSession } from '@/lib/igniter-session';
import { Queue, Ticket } from '@/types';

interface RealtimeQueueData {
  queue?: Queue;
  tickets?: Ticket[];
  currentTicket?: string;
  nextTickets?: string[];
  waitingCount?: number;
  completedCount?: number;
  lastUpdated?: string;
}

interface UseRealtimeQueueReturn {
  data: RealtimeQueueData;
  isConnected: boolean;
  lastUpdate: string | null;
  connectionError: string | null;
  forceRefresh: () => void;
}

/**
 * Hook para ouvir atualizações em tempo real de uma fila específica
 */
export function useRealtimeQueue(queueId: string): UseRealtimeQueueReturn {
  // Integração automática com sessão - sem provider!
  useIgniterSession();
  
  const { isConnected, error: connectionError } = useIgniterConnection();
  const { subscribe } = useIgniterStore();
  const { queueNotifications, hasNewQueueUpdates } = useQueueUpdates(queueId);
  
  const [data, setData] = useState<RealtimeQueueData>({});
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Processar notificações de atualização da fila
  useEffect(() => {
    if (queueNotifications.length > 0) {
      const latestNotification = queueNotifications[0];
      const eventData = latestNotification.data;

      if (eventData) {
        setData(prev => ({
          ...prev,
          currentTicket: eventData.currentTicket || eventData.callingNumber,
          lastUpdated: eventData.timestamp,
          // Atualizar outros campos baseados no evento
          ...(eventData.queueName && { 
            queue: { 
              ...prev.queue, 
              name: eventData.queueName 
            } as Queue 
          }),
          ...(eventData.position && { waitingCount: eventData.position }),
          ...(eventData.estimatedWait && { 
            // Converter tempo estimado de segundos para minutos se necessário
            estimatedWait: typeof eventData.estimatedWait === 'number' 
              ? Math.round(eventData.estimatedWait / 60) 
              : eventData.estimatedWait 
          }),
        }));

        setLastUpdate(eventData.timestamp || new Date().toISOString());

        console.log(`🔄 Dados da fila ${queueId} atualizados via tempo real:`, eventData);
      }
    }
  }, [queueNotifications, queueId]);

  // Subscrever a eventos específicos da fila
  useEffect(() => {
    const unsubscribeQueueUpdate = subscribe('queue-update', (eventData) => {
      if (eventData.queueId === queueId) {
        console.log(`📊 Atualização da fila ${queueId} recebida:`, eventData);
        
        // Atualizar estado local com dados do evento
        setData(prev => ({
          ...prev,
          currentTicket: eventData.currentTicket || eventData.callingNumber,
          nextTickets: eventData.nextTickets || prev.nextTickets,
          waitingCount: eventData.waitingCount || prev.waitingCount,
          completedCount: eventData.completedCount || prev.completedCount,
          lastUpdated: eventData.timestamp,
        }));

        setLastUpdate(eventData.timestamp || new Date().toISOString());
      }
    });

    const unsubscribeTicketCall = subscribe('ticket-called', (eventData) => {
      if (eventData.queueId === queueId) {
        console.log(`📢 Ticket chamado na fila ${queueId}:`, eventData);
        
        setData(prev => ({
          ...prev,
          currentTicket: eventData.ticketNumber || eventData.callingNumber,
          lastUpdated: eventData.timestamp,
        }));

        setLastUpdate(eventData.timestamp || new Date().toISOString());
      }
    });

    const unsubscribeTicketComplete = subscribe('ticket-completed', (eventData) => {
      if (eventData.queueId === queueId) {
        console.log(`✅ Ticket completado na fila ${queueId}:`, eventData);
        
        setData(prev => ({
          ...prev,
          completedCount: (prev.completedCount || 0) + 1,
          waitingCount: Math.max((prev.waitingCount || 1) - 1, 0),
          lastUpdated: eventData.timestamp,
        }));

        setLastUpdate(eventData.timestamp || new Date().toISOString());
      }
    });

    return () => {
      unsubscribeQueueUpdate();
      unsubscribeTicketCall();
      unsubscribeTicketComplete();
    };
  }, [queueId, subscribe]);

  // Função para forçar atualização
  const forceRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    console.log(`🔄 Forçando atualização da fila ${queueId}`);
  }, [queueId]);

  // Effect para indicar que há novos dados quando há notificações não lidas
  useEffect(() => {
    if (hasNewQueueUpdates) {
      console.log(`🆕 Novas atualizações disponíveis para a fila ${queueId}`);
    }
  }, [hasNewQueueUpdates, queueId]);

  return {
    data,
    isConnected,
    lastUpdate,
    connectionError,
    forceRefresh,
  };
}

/**
 * Hook para ouvir mudanças específicas de tickets em tempo real
 */
export function useRealtimeTicketChanges() {
  // Usar hook de migração otimizado
  const { subscribe } = useIgniterStore();
  const [ticketChanges, setTicketChanges] = useState<unknown[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<unknown[]>([]);

  useEffect(() => {
    const unsubscribeTicketChanged = subscribe('ticket-changed', (eventData) => {
      console.log('🎫 Mudança de ticket detectada:', eventData);
      
      setTicketChanges(prev => [{
        id: `ticket-change-${Date.now()}`,
        userId: eventData.userId,
        userType: eventData.userType,
        message: eventData.message,
        timestamp: eventData.timestamp,
        requiresReauth: eventData.requiresReauth,
        sessionId: eventData.sessionId,
      }, ...prev].slice(0, 10)); // Manter apenas as 10 mais recentes
    });

    const unsubscribeSessionInvalidated = subscribe('session-invalidated', (eventData) => {
      console.log('🚨 Sessão invalidada:', eventData);
      
      // Aqui você pode implementar lógica para logout automático
      if (eventData.requiresReauth) {
        console.warn('⚠️ Reautenticação necessária devido à mudança de ticket');
        // Implementar logout/redirect para login se necessário
      }
    });

    const unsubscribeSecurityAlert = subscribe('security-alert', (eventData) => {
      console.log('🔐 Alerta de segurança:', eventData);
      
      setSecurityAlerts(prev => [{
        id: `security-${Date.now()}`,
        type: eventData.type,
        message: eventData.message,
        timestamp: eventData.timestamp,
        severity: eventData.severity || 'info',
        userId: eventData.userId,
        tenantId: eventData.tenantId,
      }, ...prev].slice(0, 5)); // Manter apenas os 5 mais recentes
    });

    return () => {
      unsubscribeTicketChanged();
      unsubscribeSessionInvalidated();
      unsubscribeSecurityAlert();
    };
  }, [subscribe]);

  // Usar hooks otimizados para notificações
  const { notifications } = useIgniterStore();
  const ticketNotifications = notifications.filter(n => 
    ['ticket-changed', 'session-invalidated'].includes(n.type)
  );

  const securityNotifications = notifications.filter(n => 
    n.type === 'security-alert'
  );

  return {
    ticketChanges,
    securityAlerts,
    ticketNotifications,
    securityNotifications,
    hasUnreadTicketChanges: ticketNotifications.some(n => !n.read),
    hasUnreadSecurityAlerts: securityNotifications.some(n => !n.read),
  };
}

/**
 * Hook para gerenciar posição do usuário em uma fila específica
 */
export function useRealtimeQueuePosition(queueId: string, userId?: string) {
  const { subscribe } = useIgniterStore();
  const [position, setPosition] = useState<{
    currentPosition: number | null;
    estimatedWait: number | null;
    peopleAhead: number | null;
    ticketNumber: string | null;
    lastUpdated: string | null;
  }>({
    currentPosition: null,
    estimatedWait: null,
    peopleAhead: null,
    ticketNumber: null,
    lastUpdated: null,
  });

  useEffect(() => {
    if (!userId) return;

    const unsubscribePositionUpdate = subscribe('position-update', (eventData) => {
      if (eventData.queueId === queueId && eventData.userId === userId) {
        console.log(`📍 Posição atualizada na fila ${queueId} para usuário ${userId}:`, eventData);
        
        setPosition({
          currentPosition: eventData.currentPosition,
          estimatedWait: eventData.estimatedWait,
          peopleAhead: eventData.peopleAhead,
          ticketNumber: eventData.ticketNumber,
          lastUpdated: eventData.timestamp,
        });
      }
    });

    return unsubscribePositionUpdate;
  }, [queueId, userId, subscribe]);

  return position;
}

/**
 * Hook para estatísticas de performance em tempo real
 */
export function useRealtimeQueueStats(queueId: string) {
  const { subscribe } = useIgniterStore();
  const [stats, setStats] = useState<{
    averageWaitTime: number | null;
    completionRate: number | null;
    abandonmentRate: number | null;
    totalProcessedToday: number | null;
    activeTickets: number | null;
    lastUpdated: string | null;
  }>({
    averageWaitTime: null,
    completionRate: null,
    abandonmentRate: null,
    totalProcessedToday: null,
    activeTickets: null,
    lastUpdated: null,
  });

  useEffect(() => {
    const unsubscribeStatsUpdate = subscribe('queue-stats-update', (eventData) => {
      if (eventData.queueId === queueId) {
        console.log(`📈 Estatísticas atualizadas da fila ${queueId}:`, eventData);
        
        setStats({
          averageWaitTime: eventData.averageWaitTime,
          completionRate: eventData.completionRate,
          abandonmentRate: eventData.abandonmentRate,
          totalProcessedToday: eventData.totalProcessedToday,
          activeTickets: eventData.activeTickets,
          lastUpdated: eventData.timestamp,
        });
      }
    });

    return unsubscribeStatsUpdate;
  }, [queueId, subscribe]);

  return stats;
}


