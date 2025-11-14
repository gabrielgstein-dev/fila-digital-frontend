import { useEffect, useRef, useState } from 'react';

interface TicketNotification {
  id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  queueId: string;
  timestamp: string;
  myCallingToken?: string;
  status?: string;
  clientName?: string;
  clientPhone?: string;
  priority?: number;
}

interface QueueState {
  queueId: string;
  queueName: string;
  currentTicket: {
    id: string;
    myCallingToken: string;
    status: string;
    calledAt: string | null;
    clientName: string | null;
    clientPhone: string | null;
    priority: number;
  } | null;
  previousTicket: {
    id: string;
    myCallingToken: string;
    status: string;
    calledAt: string | null;
    clientName: string | null;
    clientPhone: string | null;
    priority: number;
  } | null;
  nextTicket: {
    id: string;
    myCallingToken: string;
    status: string;
    createdAt: string;
    clientName: string | null;
    clientPhone: string | null;
    priority: number;
    estimatedTime: number;
  } | null;
  nextTickets: Array<{
    id: string;
    myCallingToken: string;
    status: string;
    createdAt: string;
    clientName: string | null;
    clientPhone: string | null;
    priority: number;
    estimatedTime: number;
  }>;
  lastCalledTickets: Array<{
    id: string;
    myCallingToken: string;
    status: string;
    calledAt: string;
    clientName: string | null;
    clientPhone: string | null;
    priority: number;
  }>;
  statistics: {
    totalWaiting: number;
    totalCalled: number;
    totalCompleted: number;
    totalTickets: number;
    completedToday: number;
    noShowToday: number;
    totalProcessedToday: number;
    avgWaitTime: number;
    avgWaitTimeMinutes: number;
    nextEstimatedTime: number;
    nextEstimatedTimeMinutes: number;
    completionRate: number;
    abandonmentRate: number;
  };
}

export function useTicketStream(queueId?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [tickets, setTickets] = useState<TicketNotification[]>([]);
  const [queueState, setQueueState] = useState<QueueState | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    if (!queueId) return;

    // Remover /api/v1 da URL base, pois SSE não usa /api/v1
    const baseUrl = apiUrl.replace('/api/v1', '');
    const eventSource = new EventSource(`${baseUrl}/api/rt/tickets/stream?queueId=${queueId}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('✅ Conectado ao stream de tickets');
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      console.log('🎫 Evento do stream de tickets:', event.data);
      try {
        const data = JSON.parse(event.data);

        if (data.event === 'queue_state') {
          console.log('📊 Estado da fila recebido:', data.data);
          setQueueState(data.data);
          setLastUpdate(new Date());
        } else if (data.event === 'ticket_notification' || data.event === 'queue_ticket_notification') {
          const ticketData = data.data || data;
          console.log('🎫 Nova notificação:', ticketData);
          setLastUpdate(new Date());

          const action = ticketData.action?.toUpperCase();
          if (action === 'INSERT' || action === 'created') {
            setTickets(prev => [...prev, ticketData]);
          } else if (action === 'UPDATE' || action === 'updated') {
            setTickets(prev => prev.map(ticket =>
              ticket.id === ticketData.id ? { ...ticket, ...ticketData } : ticket
            ));
          } else if (action === 'DELETE' || action === 'deleted') {
            setTickets(prev => prev.filter(ticket => ticket.id !== ticketData.id));
          }
        } else if (data.event === 'stream_opened') {
          console.log('🔌 Stream aberto:', data);
        }
      } catch (error) {
        console.error('❌ Erro ao processar evento:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ Erro no stream:', error);
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, [queueId]);

  return {
    isConnected,
    tickets,
    queueState,
    lastUpdate,
  };
}
