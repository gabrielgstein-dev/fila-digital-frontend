import { env } from '@/config/env';
import type { IgniterEventData, SSEConnectionConfig } from '@/types/igniter';

export const SSE_CONFIG: SSEConnectionConfig = {
  maxConnections: 3,
  maxReconnectAttempts: 3,
  reconnectDelayBase: 1000,
  maxReconnectDelay: 10000,
  notificationLimit: 50,
};

export const generateNotificationId = (type: string): string => {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const calculateReconnectDelay = (attemptNumber: number): number => {
  return Math.min(
    SSE_CONFIG.reconnectDelayBase * Math.pow(2, attemptNumber - 1),
    SSE_CONFIG.maxReconnectDelay
  );
};

export const createSSEUrl = (endpoint: string, queueId?: string): string => {
  // Remover /api/v1 da URL base para SSE, pois os endpoints SSE não usam /api/v1
  const baseUrl = env.API_URL.replace('/api/v1', '');
  
  if (endpoint.startsWith('queue/')) {
    const params = queueId ? `?queueId=${queueId}` : '';
    return `${baseUrl}/api/rt/tickets/stream${params}`;
  }
  
  return `${baseUrl}/api/rt/tickets/stream`;
};

export const isHeartbeatEvent = (data: IgniterEventData): boolean => {
  return data.type === 'heartbeat' || 
         data.type === 'queue-heartbeat' || 
         data.eventType === 'heartbeat';
};

export const parseSSEData = (eventData: string): IgniterEventData | null => {
  try {
    return JSON.parse(eventData);
  } catch (error) {
    console.error('❌ Erro ao fazer parse dos dados SSE:', error);
    return null;
  }
};

export const validateEventData = (data: IgniterEventData): boolean => {
  return !!(data && (data.eventType || data.type || data.message));
};

export const formatNotificationMessage = (data: IgniterEventData): string => {
  if (data.message) return data.message;
  
  const queueName = data.queueName || data.queueId || 'Fila';
  const currentTicket = data.currentTicket || data.callingNumber;
  
  switch (data.eventType || data.type) {
    case 'queue-update':
      return `${queueName}: ${currentTicket || 'Atualização'}`;
    case 'ticket-changed':
      return `Ticket alterado: ${currentTicket || 'Mudança detectada'}`;
    case 'position-update':
      return `Posição na fila: ${data.position || 'Atualizada'}`;
    case 'security-alert':
      return `Alerta de segurança: ${data.severity || 'Importante'}`;
    case 'session-invalidated':
      return 'Sessão invalidada - reautenticação necessária';
    default:
      return 'Atualização em tempo real';
  }
};

export const shouldReconnect = (
  eventSource: EventSource, 
  reconnectAttempts: number, 
  maxAttempts: number
): boolean => {
  return reconnectAttempts < maxAttempts && 
         eventSource.readyState !== EventSource.CLOSED;
};

export const logSSEEvent = (type: 'connect' | 'disconnect' | 'error' | 'message', context: string, data?: unknown): void => {
  const emoji = {
    connect: '✅',
    disconnect: '🔌',
    error: '❌',
    message: '📡'
  };
  
  const prefix = `${emoji[type]} SSE ${context}:`;
  
  if (data) {
    console.log(prefix, data);
  } else {
    console.log(prefix);
  }
};

