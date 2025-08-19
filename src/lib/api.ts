import {
  Queue,
  Ticket,
  CreateQueueDto,
  CreateTicketDto,
  QueueStats,
  LoginDto,
  AuthResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.setToken(response.access_token);
    return response;
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  async getQueues(tenantId: string): Promise<Queue[]> {
    return this.request<Queue[]>(`/tenants/${tenantId}/queues`);
  }

  async getQueue(tenantId: string, queueId: string): Promise<Queue> {
    return this.request<Queue>(`/tenants/${tenantId}/queues/${queueId}`);
  }

  async createQueue(tenantId: string, queue: CreateQueueDto): Promise<Queue> {
    return this.request<Queue>(`/tenants/${tenantId}/queues`, {
      method: 'POST',
      body: JSON.stringify(queue),
    });
  }

  async updateQueue(
    tenantId: string,
    queueId: string,
    queue: Partial<CreateQueueDto>
  ): Promise<Queue> {
    return this.request<Queue>(`/tenants/${tenantId}/queues/${queueId}`, {
      method: 'PUT',
      body: JSON.stringify(queue),
    });
  }

  async deleteQueue(tenantId: string, queueId: string): Promise<void> {
    return this.request<void>(`/tenants/${tenantId}/queues/${queueId}`, {
      method: 'DELETE',
    });
  }

  async callNext(tenantId: string, queueId: string): Promise<Ticket> {
    return this.request<Ticket>(`/tenants/${tenantId}/queues/${queueId}/call-next`, {
      method: 'POST',
    });
  }

  async createTicket(queueId: string, ticket: CreateTicketDto): Promise<Ticket> {
    return this.request<Ticket>(`/queues/${queueId}/tickets`, {
      method: 'POST',
      body: JSON.stringify(ticket),
    });
  }

  async getTicket(ticketId: string): Promise<Ticket> {
    return this.request<Ticket>(`/tickets/${ticketId}`);
  }

  async recallTicket(ticketId: string): Promise<Ticket> {
    return this.request<Ticket>(`/tickets/${ticketId}/recall`, {
      method: 'PUT',
    });
  }

  async skipTicket(ticketId: string): Promise<Ticket> {
    return this.request<Ticket>(`/tickets/${ticketId}/skip`, {
      method: 'PUT',
    });
  }

  async completeTicket(ticketId: string): Promise<Ticket> {
    return this.request<Ticket>(`/tickets/${ticketId}/complete`, {
      method: 'PUT',
    });
  }

  async getQueueStats(tenantId: string, queueId: string): Promise<QueueStats> {
    return this.request<QueueStats>(`/tenants/${tenantId}/queues/${queueId}/stats`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL); 