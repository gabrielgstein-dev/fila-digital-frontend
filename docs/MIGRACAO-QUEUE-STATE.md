# 🚀 Migração para Sistema de Queue State Separado

## 📊 **Visão Geral da Mudança**

O sistema foi migrado de **campos na tabela `queues`** para **tabelas separadas `queue_states` e `queue_ticket_history`**, permitindo:

✅ **Histórico completo** de todas as chamadas de senhas  
✅ **Auditoria detalhada** com metadata  
✅ **Relatórios avançados** (tempo médio, outliers, etc)  
✅ **Separação de responsabilidades** (configuração vs estado operacional)

---

## 📁 **Estrutura Anterior vs Nova**

### ❌ **ANTES** - Campos na tabela `queues`:
```sql
CREATE TABLE queues (
  id TEXT PRIMARY KEY,
  name TEXT,
  -- ... outros campos de configuração
  currentTicketId TEXT,    -- ❌ Misturado com configuração
  previousTicketId TEXT,   -- ❌ Sem histórico
  -- ...
);
```

**Problemas:**
- ❌ Sem histórico de chamadas
- ❌ Sem auditoria
- ❌ Impossível calcular métricas históricas
- ❌ Mistura configuração com estado operacional

### ✅ **DEPOIS** - Tabelas Separadas:

```sql
-- 1️⃣ Configuração da fila (não muda frequentemente)
CREATE TABLE queues (
  id TEXT PRIMARY KEY,
  name TEXT,
  description TEXT,
  capacity INTEGER,
  avgServiceTime INTEGER,
  -- ... apenas configurações
);

-- 2️⃣ Estado operacional em tempo real
CREATE TABLE queue_states (
  id TEXT PRIMARY KEY,
  queueId TEXT UNIQUE,
  currentTicketId TEXT,
  previousTicketId TEXT,
  lastCalledAt TIMESTAMP,
  totalProcessed INTEGER DEFAULT 0,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- 3️⃣ Histórico completo para auditoria e relatórios
CREATE TABLE queue_ticket_history (
  id TEXT PRIMARY KEY,
  queueId TEXT,
  ticketId TEXT,
  action TEXT,              -- CALLED, COMPLETED, NO_SHOW, etc
  callingToken TEXT,
  calledBy TEXT,
  calledAt TIMESTAMP,
  metadata JSONB,           -- Tempo de serviço, prioridade, etc
  createdAt TIMESTAMP
);
```

**Benefícios:**
- ✅ **Histórico completo** de todas as ações
- ✅ **Auditoria** com quem chamou cada senha
- ✅ **Relatórios** de tempo médio, outliers, taxa de conclusão
- ✅ **Performance** - configuração separada de estado operacional
- ✅ **Escalabilidade** - histórico pode crescer sem afetar consultas de configuração

---

## 🔄 **Mudanças no Backend (fila-api)**

### 📦 **1. Schema Prisma Atualizado**

**Arquivo:** `/prisma/schema.prisma`

```prisma
model Queue {
  id           String  @id @default(cuid())
  name         String
  // ... configurações da fila
  
  // ✅ Relacionamento com estado operacional
  state        QueueState?
  ticketHistory QueueTicketHistory[]
}

model QueueState {
  id               String    @id @default(cuid())
  queueId          String    @unique
  currentTicketId  String?
  previousTicketId String?
  lastCalledAt     DateTime?
  totalProcessed   Int       @default(0)
  
  // Relacionamentos
  queue           Queue   @relation(fields: [queueId], references: [id])
  currentTicket   Ticket? @relation("CurrentTicket")
  previousTicket  Ticket? @relation("PreviousTicket")
}

model QueueTicketHistory {
  id            String   @id @default(cuid())
  queueId       String
  ticketId      String
  action        String   // CALLED, COMPLETED, NO_SHOW, CANCELLED
  callingToken  String
  calledBy      String?
  calledAt      DateTime
  metadata      Json?    // Tempo de serviço, prioridade, etc
  
  queue  Queue  @relation(fields: [queueId], references: [id])
  ticket Ticket @relation(fields: [ticketId], references: [id])
}
```

### 📝 **2. Migração SQL Criada**

**Arquivo:** `/prisma/migrations/20250112_migrate_to_queue_state/migration.sql`

**O que a migração faz:**

1. ✅ Cria tabela `queue_states`
2. ✅ Cria tabela `queue_ticket_history`
3. ✅ Migra dados existentes de `queues` para `queue_states`
4. ✅ Remove campos `currentTicketId` e `previousTicketId` de `queues`
5. ✅ Atualiza trigger PostgreSQL para registrar histórico automaticamente
6. ✅ Cria função auxiliar `get_queue_avg_call_time()`

### 🔧 **3. Código Atualizado**

#### **`queues.service.ts`** - Método `callNext()`

```typescript
// ✅ ANTES: Buscava campos diretamente de queue
const queue = await this.prisma.queue.update({
  where: { id },
  data: {
    currentTicketId: newTicketId,
    previousTicketId: oldTicketId
  }
});

// ✅ DEPOIS: Usa queue_state
const queueState = await this.prisma.queueState.update({
  where: { queueId: id },
  data: {
    currentTicketId: newTicketId,
    previousTicketId: queueState.currentTicketId,
    lastCalledAt: new Date(),
    totalProcessed: { increment: 1 }
  }
});
```

#### **`postgres-listener.service.ts`** - Método `getQueueById()`

```typescript
// ✅ DEPOIS: Busca configuração + estado separadamente
const queue = await this.prisma.queue.findUnique({ where: { id } });
const queueState = await this.prisma.queueState.findUnique({ where: { queueId: id } });

return {
  ...queue,
  currentTicketId: queueState?.currentTicketId,
  previousTicketId: queueState?.previousTicketId,
  totalProcessed: queueState?.totalProcessed || 0,
};
```

### 📊 **4. Novos Endpoints de Relatórios**

**Arquivo Criado:** `/src/queues/queue-reports.service.ts`  
**Arquivo Criado:** `/src/queues/queue-reports.controller.ts`

**Novos endpoints disponíveis:**

```typescript
// 1️⃣ Histórico completo de chamadas
GET /api/v1/queues/:queueId/reports/history?startDate=2025-01-01&endDate=2025-01-12&limit=100&offset=0

// 2️⃣ Estatísticas consolidadas
GET /api/v1/queues/:queueId/reports/statistics?days=7

// 3️⃣ Tempo médio de atendimento
GET /api/v1/queues/:queueId/reports/avg-service-time?days=7

// 4️⃣ Tempo médio entre chamadas
GET /api/v1/queues/:queueId/reports/avg-call-interval?days=7

// 5️⃣ Tempo médio de espera
GET /api/v1/queues/:queueId/reports/avg-wait-time?days=7

// 6️⃣ Tickets mais demorados (outliers)
GET /api/v1/queues/:queueId/reports/slowest-tickets?limit=10&days=7

// 7️⃣ Exportar histórico para CSV
GET /api/v1/queues/:queueId/reports/export?startDate=2025-01-01&endDate=2025-01-12
```

**Exemplo de resposta - Estatísticas:**

```json
{
  "totalProcessed": 1523,
  "avgServiceTime": 245,
  "avgCallInterval": 180,
  "avgWaitTime": 420,
  "callsByHour": [
    { "hour": 8, "count": 45 },
    { "hour": 9, "count": 89 },
    { "hour": 10, "count": 112 }
  ],
  "completionRate": 94.5
}
```

---

## 🎨 **Mudanças no Frontend (fila-backoffice)**

### 🔷 **1. Tipos TypeScript Atualizados**

**Arquivo:** `/src/types/index.ts`

```typescript
// ✅ Interface Queue atualizada
export interface Queue {
  id: string;
  name: string;
  // ...
  
  // ✅ Novos campos
  currentNumber?: string;
  previousNumber?: string;
  totalProcessed?: number;
  lastCalledAt?: string;
}

// ✅ Novo tipo QueueState
export interface QueueState {
  id: string;
  queueId: string;
  currentTicketId?: string;
  previousTicketId?: string;
  lastCalledAt?: string;
  totalProcessed: number;
  currentTicket?: { myCallingToken: string };
  previousTicket?: { myCallingToken: string };
}

// ✅ Novo tipo QueueTicketHistory
export interface QueueTicketHistory {
  id: string;
  queueId: string;
  ticketId: string;
  action: string;
  callingToken: string;
  calledBy?: string;
  calledAt: string;
  metadata?: Record<string, unknown>;
}

// ✅ Tipos de relatórios
export interface QueueReportStatistics {
  totalProcessed: number;
  avgServiceTime: number;
  avgCallInterval: number;
  avgWaitTime: number;
  callsByHour: Array<{ hour: number; count: number }>;
  completionRate: number;
}
```

### 📊 **2. Componentes NÃO Precisam Mudar**

✅ **ÓTIMA NOTÍCIA:** Os componentes do frontend **NÃO precisam** de mudanças significativas!

**Motivo:** A API continua retornando os mesmos campos (`currentNumber`, `previousNumber`), apenas buscando de outro local (queue_state ao invés de queues).

**Componentes que continuam funcionando:**
- ✅ `/src/app/filas/page.tsx` - Lista de filas
- ✅ `/src/app/filas/[id]/page.tsx` - Detalhes da fila
- ✅ `/src/hooks/useQueues.ts` - Hook de filas
- ✅ `/src/hooks/useRealtimeQueue.ts` - Tempo real

---

## 📈 **Novos Recursos Disponíveis**

### 🎯 **1. Dashboard de Relatórios**

Agora é possível criar dashboards com:

✅ **Gráfico de chamadas por hora**
```typescript
const stats = await api.get(`/queues/${queueId}/reports/statistics?days=7`);
// stats.callsByHour = [{ hour: 8, count: 45 }, ...]
```

✅ **Tempo médio de atendimento**
```typescript
const avgTime = await api.get(`/queues/${queueId}/reports/avg-service-time?days=30`);
// avgTime.avgServiceTimeMinutes = 4.08
```

✅ **Taxa de conclusão**
```typescript
const stats = await api.get(`/queues/${queueId}/reports/statistics`);
// stats.completionRate = 94.5
```

### 📊 **2. Auditoria Completa**

```typescript
const history = await api.get(`/queues/${queueId}/reports/history`, {
  params: {
    startDate: '2025-01-01',
    endDate: '2025-01-12',
    limit: 100
  }
});

// Resultado:
{
  data: [
    {
      callingToken: 'A001',
      action: 'CALLED',
      calledBy: 'user-123',
      calledAt: '2025-01-12T10:30:00Z',
      metadata: { priority: 1, estimatedTime: 300 }
    },
    {
      callingToken: 'A001',
      action: 'COMPLETED',
      calledAt: '2025-01-12T10:34:25Z',
      metadata: { serviceTime: 265 }
    }
  ],
  pagination: { total: 1523, hasMore: true }
}
```

### 📥 **3. Exportação CSV**

```typescript
// Download CSV com histórico completo
const csvUrl = `/queues/${queueId}/reports/export?startDate=2025-01-01&endDate=2025-01-12`;
window.open(csvUrl, '_blank');
```

Arquivo gerado:
```csv
Data/Hora,Ação,Senha,Cliente,Telefone,Prioridade,Chamado Por,Tempo de Serviço (s)
2025-01-12T10:30:00Z,CALLED,A001,João Silva,11999999999,1,user-123,-
2025-01-12T10:34:25Z,COMPLETED,A001,João Silva,11999999999,1,user-123,265
```

---

## ✅ **Checklist de Verificação**

### Backend:
- [x] Schema Prisma atualizado
- [x] Migração SQL criada e aplicada
- [x] `queues.service.ts` atualizado
- [x] `postgres-listener.service.ts` atualizado
- [x] `QueueReportsService` criado
- [x] `QueueReportsController` criado
- [x] Módulo atualizado com novos serviços
- [x] Cliente Prisma regenerado

### Frontend:
- [x] Tipos TypeScript atualizados
- [x] Interfaces de relatórios criadas
- [ ] Componentes de relatórios (a criar conforme necessário)

### Database:
- [x] Tabela `queue_states` criada
- [x] Tabela `queue_ticket_history` criada
- [x] Dados migrados de `queues` para `queue_states`
- [x] Campos antigos removidos de `queues`
- [x] Trigger atualizado para registrar histórico
- [x] Índices criados para performance

---

## 🧪 **Como Testar**

### 1️⃣ **Verificar Migração**

```bash
# Ver status das migrações
cd /home/gabrielstein/projects/private/fila/fila-api
npx prisma migrate status

# Verificar tabelas no banco
psql $DATABASE_URL -c "\d queue_states"
psql $DATABASE_URL -c "\d queue_ticket_history"
```

### 2️⃣ **Testar Endpoints de Relatórios**

```bash
# Estatísticas da fila
curl http://localhost:3001/api/v1/queues/{queueId}/reports/statistics

# Histórico completo
curl http://localhost:3001/api/v1/queues/{queueId}/reports/history?limit=10

# Tempo médio
curl http://localhost:3001/api/v1/queues/{queueId}/reports/avg-service-time?days=7
```

### 3️⃣ **Testar Fluxo Completo**

1. Chamar próxima senha: `POST /api/v1/queues/{queueId}/call-next`
2. Verificar que `queue_states` foi atualizado
3. Verificar que `queue_ticket_history` registrou a ação
4. Buscar estatísticas: `GET /api/v1/queues/{queueId}/reports/statistics`

---

## 📚 **Próximos Passos Recomendados**

### 🎨 **Frontend - Páginas de Relatórios**

Criar componentes para visualizar os dados:

1. **Página de Relatórios da Fila**
   - `/src/app/filas/[id]/relatorios/page.tsx`
   - Gráficos de chamadas por hora
   - Métricas de tempo médio
   - Taxa de conclusão

2. **Componente de Histórico**
   - `/src/components/QueueHistory.tsx`
   - Tabela com histórico paginado
   - Filtros por data
   - Botão de export CSV

3. **Dashboard de Métricas**
   - `/src/app/dashboard/page.tsx`
   - Visão consolidada de todas as filas
   - Comparação entre filas
   - Alertas de performance

---

## 🔗 **Arquivos Modificados/Criados**

### Backend (fila-api):
- ✅ `/prisma/schema.prisma`
- ✅ `/prisma/migrations/20250112_migrate_to_queue_state/migration.sql`
- ✅ `/src/queues/queues.service.ts`
- ✅ `/src/queues/queue-reports.service.ts` *(novo)*
- ✅ `/src/queues/queue-reports.controller.ts` *(novo)*
- ✅ `/src/queues/queues.module.ts`
- ✅ `/src/rt/postgres-listener.service.ts`

### Frontend (fila-backoffice):
- ✅ `/src/types/index.ts`
- ✅ `/docs/MIGRACAO-QUEUE-STATE.md` *(este arquivo)*

---

**🎉 Migração completa! Sistema pronto para histórico, auditoria e relatórios avançados!**



