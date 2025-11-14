export interface IgniterNotification {
  id: string;
  type: 'ticket-changed' | 'session-invalidated' | 'security-alert' | 'queue-update' | 'position-update';
  message: string;
  timestamp: string;
  data?: unknown;
  read: boolean;
}

export interface QueueConnection {
  eventSource: EventSource;
  queueId: string;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  reconnectTimer?: ReturnType<typeof setTimeout>;
  isReconnecting: boolean;
}

export interface UserWithToken {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  accessToken?: string;
  token?: string;
}

export interface SSEConnectionConfig {
  maxConnections: number;
  maxReconnectAttempts: number;
  reconnectDelayBase: number;
  maxReconnectDelay: number;
  notificationLimit: number;
}

export interface IgniterEventData {
  eventType?: string;
  queueId?: string;
  queueName?: string;
  currentTicket?: string;
  callingNumber?: string;
  nextTickets?: string[];
  waitingCount?: number;
  completedCount?: number;
  timestamp?: string;
  message?: string;
  userId?: string;
  userType?: string;
  tenantId?: string;
  requiresReauth?: boolean;
  sessionId?: string;
  severity?: 'info' | 'warning' | 'error';
  type?: string;
  ticketNumber?: string;
  position?: number;
  estimatedWait?: number;
  peopleAhead?: number;
  averageWaitTime?: number;
  completionRate?: number;
  abandonmentRate?: number;
  totalProcessedToday?: number;
  activeTickets?: number;
}

