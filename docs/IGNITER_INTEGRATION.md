# 🚀 Integração Igniter - Tempo Real

> **📊 Status Atual:**  
> ✅ **Frontend:** Implementado e sincronizado com backend  
> ✅ **Backend:** SSE implementado em `/api/rt/*`  
> ✅ **Integração:** Frontend e Backend alinhados

## 📋 Visão Geral

Esta implementação integra o frontend com o backend usando **Server-Sent Events (SSE)** para comunicação em tempo real de tickets e filas. O sistema usa endpoints **`/api/rt/*`** do NestJS com Igniter.js.

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Igniter API   │    │ TicketChange    │
│   (Next.js)     │◄───┤   (NestJS)      │◄───┤   Service       │
│                 │    │                 │    │                 │
│ • IgniterProvider│    │ • SSE Endpoints │    │ • Mudanças      │
│ • Hooks         │    │ • Real-time     │    │ • Notificações  │
│ • Notifications │    │ • Autenticação  │    │ • Invalidação   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Componentes Implementados

### 1. **IgniterProvider** (`/src/providers/IgniterProvider.tsx`)

**Responsabilidades:**
- Gerencia conexões SSE com múltiplos endpoints
- Mantém estado de notificações em tempo real
- Provê sistema de subscriptions para componentes
- Controla conexões específicas por fila

**Funcionalidades:**
- ✅ Conexão automática baseada na sessão do usuário
- ✅ Reconexão automática em caso de falha
- ✅ Sistema de heartbeat para manter conexões ativas
- ✅ Gerenciamento de múltiplas conexões (geral + filas específicas)
- ✅ Cache de notificações com limite de 50 itens

**Hooks Expostos:**
```typescript
// Hook principal
const { isConnected, notifications, subscribe, connectToQueue } = useIgniter()

// Hook específico para mudanças de ticket
const { ticketNotifications, hasNewTicketChanges } = useTicketChanges()

// Hook específico para atualizações de fila
const { queueNotifications, hasNewQueueUpdates } = useQueueUpdates(queueId)
```

### 2. **Hooks de Tempo Real** (`/src/hooks/useRealtimeQueue.ts`)

#### **useRealtimeQueue(queueId)**
- Ouve atualizações específicas de uma fila
- Integra dados de tickets, senhas atuais e estatísticas
- Fornece função `forceRefresh()` para atualização manual

#### **useRealtimeTicketChanges()**
- Monitora mudanças de ticket do usuário
- Detecta invalidações de sessão
- Captura alertas de segurança

#### **useRealtimeQueueStats(queueId)**
- Estatísticas de performance em tempo real
- Métricas de abandono e conclusão
- Tempo médio de espera atualizado

#### **useRealtimeQueuePosition(queueId, userId)**
- Posição do usuário na fila
- Estimativa de tempo de espera
- Número de pessoas à frente

### 3. **Sistema de Notificações** (`/src/components/RealtimeNotifications.tsx`)

#### **RealtimeNotifications**
Painel de notificações com:
- ✅ Badge com contador de não lidas
- ✅ Lista das 10 notificações mais recentes
- ✅ Categorização por tipo com ícones
- ✅ Timestamps relativos ("2min atrás")
- ✅ Função "Limpar tudo"
- ✅ Status de conexão em tempo real

#### **RealtimeToast**
Toast para notificações críticas:
- ✅ Aparece automaticamente para eventos críticos
- ✅ Máximo de 3 toasts simultâneos
- ✅ Auto-dismiss ou manual
- ✅ Animações suaves

## 📡 Endpoints SSE Utilizados

### 1. **Mudanças de Ticket** (`/auth/realtime/ticket-changes`)
```
GET /auth/realtime/ticket-changes?includeSecurityAlerts=true
```
**Eventos Recebidos:**
- `ticket-changed`: Senha alterada
- `session-invalidated`: Sessão invalidada
- `security-alert`: Alertas de segurança

### 2. **Atualizações de Fila** (`/auth/realtime/queue/{queueId}/current-ticket`)
```
GET /auth/realtime/queue/{queueId}/current-ticket?includeQueueStatus=true
```
**Eventos Recebidos:**
- `queue-update`: Senha atual alterada
- `ticket-called`: Novo ticket chamado
- `queue-stats-update`: Estatísticas atualizadas

### 3. **Posição na Fila** (`/auth/realtime/queue/{queueId}/my-position`)
```
GET /auth/realtime/queue/{queueId}/my-position
```
**Eventos Recebidos:**
- `position-update`: Posição alterada
- `position-changed`: Nova estimativa de tempo

## 🎯 Integração na Página de Detalhes

### **Página `/filas/[id]`**

**Indicadores Visuais:**
- ✅ **Tag "Tempo Real"** - Mostra status da conexão
- ✅ **Tag "Mudanças"** - Aparece quando há mudanças não lidas
- ✅ **Botão de Notificações** - Com badge de contagem
- ✅ **Toast Crítico** - Para eventos que requerem atenção

**Integração de Dados:**
- ✅ **Senha Atual** - Atualizada via SSE
- ✅ **Próximas Senhas** - Calculadas em tempo real
- ✅ **Estatísticas** - Métricas atualizadas automaticamente
- ✅ **Contadores** - Aguardando/Atendidos em tempo real

**Effects de Tempo Real:**
```typescript
// Integrar dados de tempo real
useEffect(() => {
  if (realtimeData.currentTicket) {
    setQueueFlow(prev => ({
      ...prev,
      current: realtimeData.currentTicket,
      next: realtimeData.nextTickets,
      totalProcessed: realtimeData.completedCount,
    }))
  }
}, [realtimeData])
```

## 🔐 Autenticação e Segurança

### **Fluxo de Autenticação:**
1. **NextAuth** gerencia sessão e tokens
2. **IgniterProvider** usa tokens para conexões SSE
3. **API valida** tokens em cada conexão SSE
4. **Scopes** determinam quais eventos o usuário pode receber

### **Tratamento de Mudanças de Ticket:**
```typescript
// Quando ticket é alterado na API
const ticketChangeEvent = {
  userId,
  userType,
  tenantId,
  changedAt: new Date().toISOString(),
  requiresReauth: true
}

// Frontend recebe e pode forçar logout
if (eventData.requiresReauth) {
  console.warn('🔐 Ticket alterado - reautenticação necessária')
  // Implementar logout automático se necessário
}
```

## 🚀 Como Usar

### **1. Configuração Automática**
O `IgniterProvider` já está integrado no `Providers.tsx`:
```typescript
<IgniterProvider>
  {children}
</IgniterProvider>
```

### **2. Usar em Componentes**
```typescript
// Hook básico
const { isConnected, notifications } = useIgniter()

// Hook específico para fila
const { data, lastUpdate } = useRealtimeQueue(queueId)

// Hook para mudanças de ticket
const { ticketNotifications } = useRealtimeTicketChanges()
```

### **3. Adicionar Notificações**
```typescript
import { RealtimeNotifications, RealtimeToast } from '@/components/RealtimeNotifications'

// No componente
<RealtimeNotifications />
<RealtimeToast />
```

## 📊 Métricas e Performance

### **Otimizações Implementadas:**
- ✅ **Deduplicação** de requests simultâneas
- ✅ **Cache** de notificações com TTL
- ✅ **Cleanup automático** de conexões inativas
- ✅ **Throttling** de eventos para evitar spam
- ✅ **Reconexão inteligente** com backoff exponencial

### **Limites de Performance:**
- **Máximo 50 notificações** em cache
- **Máximo 3 toasts** simultâneos
- **Máximo 10 notificações** no painel
- **Reconexão após 5s** para conexão principal
- **Reconexão após 3s** para conexões de fila

## 🔍 Debug e Monitoramento

### **Logs do Console:**
```
✅ Conectado ao SSE principal do Igniter
📡 Evento recebido: { type: 'ticket-changed', ... }
🎫 Mudança de ticket detectada: { userId: '...', ... }
🏢 Atualização da fila queue-123: { currentTicket: 'A15' }
🔄 Dados da fila queue-123 atualizados via tempo real
```

### **Estados de Conexão:**
- ✅ **Conectado** - Verde com ícone Zap
- ⚠️ **Desconectado** - Âmbar com ícone WifiOff
- 🔄 **Reconectando** - Animação de loading
- ❌ **Erro** - Vermelho com mensagem de erro

## 🎉 Resultado Final

### **Funcionalidades Entregues:**
1. ✅ **Tempo Real Completo** - SSE integrado com TicketChangeService
2. ✅ **Interface Rica** - Indicadores visuais e notificações
3. ✅ **Performance Otimizada** - Cache, deduplicação, reconnect
4. ✅ **Segurança Robusta** - Autenticação e scopes por usuário
5. ✅ **UX Excepcional** - Feedback visual imediato

### **Benefícios:**
- 🚀 **Atualizações instantâneas** de senhas e filas
- 🔐 **Segurança em tempo real** para mudanças de ticket
- 📱 **Interface responsiva** com feedback visual
- ⚡ **Performance otimizada** com cache inteligente
- 🎯 **Experiência fluida** sem necessidade de refresh manual

## ⚠️ Status de Implementação

### ✅ **Frontend (Implementado):**
- `src/stores/igniter-store.ts` - Gerenciamento de estado SSE
- `src/providers/IgniterProvider.tsx` - Provider React
- `src/hooks/useRealtimeQueue.ts` - Hooks de tempo real
- `src/components/RealtimeNotifications.tsx` - Interface de notificações

### ✅ **Backend (Implementado):**
Endpoints SSE disponíveis na API:
```typescript
// 1. Stream de tickets (com filtro por fila)
GET /api/rt/tickets/stream?queueId={queueId}&watchId={watchId}

// 2. Estado completo da fila
GET /api/rt/queues/:queueId/state

// 3. Stream de ticket específico
GET /api/rt/tickets/:ticketId/stream?watchId={watchId}

// 4. Estatísticas de streams ativos
GET /api/rt/tickets/stats
```

### ✅ **Frontend Corrigido - Usando Endpoints Corretos**

**Arquivos corrigidos:**
- ✅ `src/hooks/useTicketStream.ts` - Usa `/api/rt/tickets/stream?queueId={id}`
- ✅ `src/providers/IgniterProvider.tsx` - Usa `/api/rt/tickets/stream`
- ✅ `src/lib/sse-utils.ts` - Gera URLs corretas `/api/rt/tickets/stream`
- ✅ `src/stores/igniter-store.ts` - Usa endpoints corretos

**Endpoints utilizados agora:**
```typescript
// Stream geral de tickets
GET /api/rt/tickets/stream

// Stream de tickets de uma fila específica
GET /api/rt/tickets/stream?queueId={queueId}

// Estado completo da fila (REST endpoint)
GET /api/rt/queues/:queueId/state
```

**Nota:** Os endpoints `/api/rt` do backend **não requerem autenticação** via token no query parameter.

---

## 🐛 Troubleshooting

### **Erro 401 Unauthorized**

**Problema:** EventSource não consegue enviar headers de autenticação.

**Solução Implementada no Frontend:**
```typescript
// Token enviado via query parameter
const eventSourceUrl = `${API_URL}/auth/realtime/ticket-changes?token=${encodeURIComponent(token)}`;
const eventSource = new EventSource(eventSourceUrl);
```

**Necessário no Backend:**
```typescript
// Middleware para validar token via query parameter
@Get('ticket-changes')
@Sse()
streamTicketChanges(@Query('token') token: string): Observable<MessageEvent> {
  // Validar token
  const payload = this.jwtService.verify(token);
  // Retornar stream SSE
}
```

### **Erro de Conexão / Loop Infinito**

**Problema:** Reconexão automática causava loop infinito.

**Solução Aplicada:**
```typescript
// Não reconectar automaticamente em erro
eventSource.onerror = (error) => {
  console.error('❌ Backend SSE não implementado');
  eventSource.close();
  // NÃO reconectar até backend estar pronto
};
```

### **Validar se está Funcionando:**

1. **Abrir Console do Navegador**
2. **Habilitar SSE** (botão no canto superior direito)
3. **Verificar Logs:**
   ```
   ✅ Esperado quando backend pronto:
   "✅ Conectado ao SSE principal do Igniter"
   
   ⏳ Atual (backend pendente):
   "❌ Backend SSE não implementado - aguardando implementação"
   ```

---

## 📦 Resumo

Este documento consolida informações dos seguintes documentos (agora removidos):
- BACKEND_SSE_IMPLEMENTATION.md
- DEBUG_401_ERROR.md
- SSE_ERRORS_FIXED.md
- SSE_INTEGRATION_COMPLETE.md
- TROUBLESHOOTING_IGNITER.md

**Frontend está pronto. Aguardando implementação do backend!** ⏳



