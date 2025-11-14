# 🧪 Teste Completo - Eventos SSE com Estado da Fila

## ✅ **O que foi Implementado**

Agora, quando você se conecta ao stream SSE, o backend envia **automaticamente o estado completo da fila**:

### **Eventos que você receberá:**

1. **`stream_opened`** - Confirmação de conexão
2. **`queue_state`** - **NOVO!** Estado completo da fila ✨

### **Dados no evento `queue_state`:**

```json
{
  "event": "queue_state",
  "queueId": "cmf4dcuhg0007ax3ng8yk62y2",
  "data": {
    "queueId": "cmf4dcuhg0007ax3ng8yk62y2",
    "queueName": "Nome da Fila",
    "currentTicket": {
      "id": "...",
      "myCallingToken": "A001",
      "status": "CALLED",
      "calledAt": "2025-01-11T...",
      "clientName": "João Silva",
      "clientPhone": "...",
      "priority": 1
    },
    "previousTicket": {
      "id": "...",
      "myCallingToken": "A000",
      "status": "COMPLETED",
      "calledAt": "2025-01-11T...",
      "clientName": "Maria Santos",
      "priority": 1
    },
    "nextTickets": [
      {
        "id": "...",
        "myCallingToken": "A002",
        "status": "WAITING",
        "createdAt": "2025-01-11T...",
        "clientName": "Pedro Oliveira",
        "priority": 1,
        "estimatedTime": 300
      }
    ],
    "lastCalledTickets": [
      // Últimos 5 tickets chamados
    ],
    "statistics": {
      "totalWaiting": 5,
      "totalCalled": 1,
      "totalCompleted": 10,
      "totalTickets": 16
    }
  },
  "timestamp": "2025-01-11T15:35:30.191Z"
}
```

---

## 🚀 **PASSO A PASSO PARA TESTAR**

### **1. Reiniciar Backend**

```bash
cd /home/gabrielstein/projects/private/fila/fila-api
npm run start:dev
```

**Aguarde até ver:**
```
[Nest] LOG [TicketRealtimeOptimizedController] ...
✅ PostgreSQL LISTEN ativo no canal ticket_updates
```

### **2. Reiniciar Frontend**

```bash
cd /home/gabrielstein/projects/private/fila/fila-backoffice
# Ctrl+C para parar
npm run dev
```

### **3. Limpar Cache do Navegador**

```
Ctrl + Shift + R  (hard refresh)
```

### **4. Abrir Console do Navegador**

1. Abrir DevTools (F12)
2. Ir para aba "Console"
3. Navegar para uma página de fila: `/filas/[id]`

### **5. Verificar Eventos Recebidos**

**Você deve ver:**

```javascript
// Evento 1: Conexão estabelecida
🎫 Evento do stream de tickets: {
  "event": "stream_opened",
  "watchId": "stream_1762875330189_apbcb23s3",
  "query": { "queueId": "cmf4dcuhg0007ax3ng8yk62y2", ... },
  "timestamp": "2025-01-11T15:35:30.191Z"
}

// Evento 2: Estado completo da fila (NOVO!)
🎫 Evento do stream de tickets: {
  "event": "queue_state",
  "queueId": "cmf4dcuhg0007ax3ng8yk62y2",
  "data": {
    "queueId": "...",
    "queueName": "Balcão de Atendimento",
    "currentTicket": { "myCallingToken": "A015", ... },
    "previousTicket": { "myCallingToken": "A014", ... },
    "nextTickets": [...],
    "statistics": { ... }
  },
  "timestamp": "..."
}
```

---

## 📊 **Exemplo de Dados Completos**

### **Cenário: Fila com tickets**

```json
{
  "event": "queue_state",
  "queueId": "cmf4dcuhg0007ax3ng8yk62y2",
  "data": {
    "queueId": "cmf4dcuhg0007ax3ng8yk62y2",
    "queueName": "Balcão de Atendimento",
    
    // 🎯 Ticket sendo atendido AGORA
    "currentTicket": {
      "id": "ticket-123",
      "myCallingToken": "A015",
      "status": "CALLED",
      "calledAt": "2025-01-11T15:30:00Z",
      "clientName": "João Silva",
      "clientPhone": "11999999999",
      "priority": 1
    },
    
    // 🕐 Ticket que foi atendido ANTES
    "previousTicket": {
      "id": "ticket-122",
      "myCallingToken": "A014",
      "status": "COMPLETED",
      "calledAt": "2025-01-11T15:25:00Z",
      "clientName": "Maria Santos",
      "priority": 1
    },
    
    // 📋 Próximos tickets a serem chamados (ordenados por prioridade)
    "nextTickets": [
      {
        "id": "ticket-124",
        "myCallingToken": "A016",
        "status": "WAITING",
        "createdAt": "2025-01-11T15:20:00Z",
        "clientName": "Pedro Oliveira",
        "priority": 2,
        "estimatedTime": 300
      },
      {
        "id": "ticket-125",
        "myCallingToken": "A017",
        "status": "WAITING",
        "createdAt": "2025-01-11T15:22:00Z",
        "clientName": "Ana Costa",
        "priority": 1,
        "estimatedTime": 300
      }
    ],
    
    // 📊 Estatísticas da fila
    "statistics": {
      "totalWaiting": 5,
      "totalCalled": 1,
      "totalCompleted": 10,
      "totalTickets": 16
    }
  }
}
```

### **Cenário: Fila vazia**

```json
{
  "event": "queue_state",
  "queueId": "cmf4dcuhg0007ax3ng8yk62y2",
  "data": {
    "queueId": "cmf4dcuhg0007ax3ng8yk62y2",
    "queueName": "Balcão de Atendimento",
    "currentTicket": null,
    "previousTicket": null,
    "nextTickets": [],
    "lastCalledTickets": [],
    "statistics": {
      "totalWaiting": 0,
      "totalCalled": 0,
      "totalCompleted": 0,
      "totalTickets": 0
    }
  }
}
```

---

## 🔧 **Como Usar os Dados no Frontend**

No seu componente React, você pode processar o evento `queue_state`:

```typescript
useEffect(() => {
  const eventSource = new EventSource(`${baseUrl}/api/rt/tickets/stream?queueId=${queueId}`);

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.event === 'queue_state') {
      // 🎯 Atualizar estado com os dados da fila
      const queueState = data.data;
      
      setCurrentTicket(queueState.currentTicket);
      setPreviousTicket(queueState.previousTicket);
      setNextTickets(queueState.nextTickets);
      setStatistics(queueState.statistics);
      
      console.log('🎯 Senha atual:', queueState.currentTicket?.myCallingToken);
      console.log('🕐 Senha anterior:', queueState.previousTicket?.myCallingToken);
      console.log('📋 Próximas senhas:', queueState.nextTickets.map(t => t.myCallingToken));
    }
  };

  return () => eventSource.close();
}, [queueId]);
```

---

## ✅ **Checklist de Validação**

- [ ] Backend reiniciado
- [ ] Frontend reiniciado
- [ ] Cache do navegador limpo
- [ ] Console mostra evento `stream_opened`
- [ ] Console mostra evento `queue_state` **logo após `stream_opened`**
- [ ] Evento `queue_state` contém:
  - [ ] `currentTicket` (ou null se não houver)
  - [ ] `previousTicket` (ou null se não houver)
  - [ ] `nextTickets` (array, pode ser vazio)
  - [ ] `statistics` com contadores

---

## 🐛 **Troubleshooting**

### **Problema: Só recebo `stream_opened`, não recebo `queue_state`**

**Verificações:**

1. **Backend está rodando e compilado?**
```bash
cd /home/gabrielstein/projects/private/fila/fila-api
npm run build
npm run start:dev
```

2. **Logs do backend mostram envio do estado?**
Procure por:
```
🎯 [TICKET CONTROLLER] Enviando estado inicial da fila: { ... }
```

3. **queueId é válido?**
```bash
# Verificar no banco se a fila existe
# A URL do stream deve ter: ?queueId=cmf4dcuhg0007ax3ng8yk62y2
```

### **Problema: `currentTicket` é null mas existe ticket chamado**

**Causa:** Os campos `currentTicketId` e `previousTicketId` ainda não foram populados na fila.

**Solução:** Chame uma nova senha para que o sistema atualize os campos:

1. Use o endpoint `/api/v1/tenants/{tenantId}/queues/{queueId}/call-next`
2. Isso atualiza `currentTicketId` e `previousTicketId` automaticamente
3. Reconecte ao stream SSE

---

## 🎯 **Resultado Esperado**

✅ Stream conecta e **imediatamente** envia o estado da fila  
✅ Você recebe `currentTicket`, `previousTicket` e `nextTickets`  
✅ Frontend pode exibir a senha atual sem fazer request adicional  
✅ Frontend sabe qual foi a senha anterior  
✅ Frontend sabe quais são as próximas senhas  

**🚀 Sistema de tempo real 100% funcional com estado completo!**



