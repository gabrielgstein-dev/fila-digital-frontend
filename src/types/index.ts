export enum QueueType {
  GENERAL = 'GENERAL',
  PRIORITY = 'PRIORITY',
  VIP = 'VIP',
}

export enum TicketStatus {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  IN_SERVICE = 'IN_SERVICE',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
  CANCELLED = 'CANCELLED',
}

export enum AgentRole {
  ATTENDANT = 'ATTENDANT',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

export enum CallAction {
  CALLED = 'CALLED',
  RECALLED = 'RECALLED',
  SKIPPED = 'SKIPPED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Queue {
  id: string;
  name: string;
  description?: string;
  queueType: QueueType;
  isActive: boolean;
  capacity: number;
  avgServiceTime: number;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  tenant?: Tenant;
  tickets?: Ticket[];
  _count?: {
    tickets: number;
  };
}

export interface Ticket {
  id: string;
  number: number;
  priority: number;
  status: TicketStatus;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  estimatedTime?: number;
  calledAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  queueId: string;
  queue?: Queue;
  position?: number;
}

export interface Agent {
  id: string;
  email: string;
  name: string;
  role: AgentRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  tenant?: Tenant;
}

export interface Counter {
  id: string;
  name: string;
  number: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  tenant?: Tenant;
}

export interface CallLog {
  id: string;
  action: CallAction;
  calledAt: string;
  serviceTime?: number;
  ticketId: string;
  ticket?: Ticket;
  queueId: string;
  queue?: Queue;
  agentId: string;
  agent?: Agent;
  counterId: string;
  counter?: Counter;
}

export interface QueueStats {
  waiting: number;
  called: number;
  completed: number;
  avgServiceTime: number;
}

export interface CreateQueueDto {
  name: string;
  description?: string;
  queueType?: QueueType;
  capacity?: number;
  avgServiceTime?: number;
}

export interface CreateTicketDto {
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  priority?: number;
}

export interface LoginDto {
  cpf: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: Agent;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface NextAuthUser {
  id: string;
  email: string;
  name: string;
  role: AgentRole;
  tenantId: string;
  tenant: Tenant;
  accessToken: string;
  userType: string;
}

export interface NextAuthSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: AgentRole;
    tenantId: string;
    tenant: Tenant;
    accessToken: string;
    userType: string;
  };
}

export interface NextAuthJWT {
  id: string;
  role: AgentRole;
  tenantId: string;
  tenant: Tenant;
  accessToken: string;
  userType: string;
}