import { env } from '@/config/env';

export interface IgniterTokenInfo {
  token: string;
  expiresAt: string;
  expiresIn: number;
  shouldRefresh: boolean;
  timeToExpire: string;
}

export interface IgniterSessionInfo {
  userId: string;
  tenantId: string;
  role: string;
  tokenInfo: IgniterTokenInfo;
  sessionStart: string;
  lastActivity: string;
  warnings: {
    tokenExpiring: boolean;
    timeRemaining: string;
  };
}

export interface DashboardMetrics {
  userMetrics: {
    userId: string;
    tenantId: string;
    lastLogin: string;
  };
  tenantMetrics: {
    totalTickets: number;
    activeAgents: number;
    avgWaitTime: string;
    queueLength: number;
  };
}

export interface ChartData {
  tenantId: string;
  chartData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }>;
  };
  metadata: {
    generatedAt: string;
    requestedBy: string;
    period: string;
    type: string;
  };
}

class IgniterClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
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
      console.error('❌ Igniter Client Error:', error);
      throw error;
    }
  }

  // ==================== DASHBOARD ENDPOINTS ====================

  async getPublicMetrics() {
    return this.request('/dashboard/public-metrics');
  }

  async getPrivateMetrics(): Promise<DashboardMetrics> {
    return this.request<DashboardMetrics>('/dashboard/private-metrics');
  }

  async getAdminMetrics() {
    return this.request('/dashboard/admin-metrics');
  }

  async getTenantMetrics() {
    return this.request('/dashboard/tenant-metrics');
  }

  async updateMetrics(data: {
    metricType: 'users' | 'tickets' | 'revenue' | 'performance';
    value: number;
    description?: string;
  }) {
    return this.request('/dashboard/update-metrics', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getChartData(params: {
    type?: string;
    period?: string;
    tenantId?: string;
  } = {}): Promise<ChartData> {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== undefined) as [string, string][]
    ).toString();
    
    return this.request<ChartData>(`/dashboard/chart-data${queryString ? `?${queryString}` : ''}`);
  }

  async getConnectionStatus() {
    return this.request('/dashboard/connection-status');
  }

  // ==================== SESSION MANAGEMENT ====================

  async getSessionInfo(): Promise<IgniterSessionInfo> {
    return this.request<IgniterSessionInfo>('/dashboard/session-info');
  }

  async refreshToken(): Promise<{ access_token: string; expires_in: number; message: string; refreshed_at: string }> {
    return this.request('/dashboard/refresh-token', {
      method: 'POST',
    });
  }

  async getTokenStatus(): Promise<{
    status: 'valid' | 'expiring_soon';
    token: string;
    expiresAt: string;
    expiresIn: number;
    shouldRefresh: boolean;
    timeToExpire: string;
    recommendations: {
      should_refresh: boolean;
      action: string;
    };
  }> {
    return this.request('/dashboard/token-status');
  }
}

// Instância singleton
export const igniterClient = new IgniterClient(env.API_URL);
