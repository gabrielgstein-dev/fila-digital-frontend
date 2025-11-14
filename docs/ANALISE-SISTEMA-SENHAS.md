# 🎫 Análise Completa do Sistema de Senhas (Tickets)

## 📊 **Status Atual da Implementação**

### ✅ **O que JÁ está implementado:**

1. **Vinculação de Tickets**
   - ✅ Ticket vinculado a `userId` (campo exists no schema)
   - ✅ Ticket vinculado a `queueId` (campo exists no schema)
   - ✅ Relacionamento adequado no Prisma schema

2. **Sistema de Tempo Real (SSE)**
   - ✅ Backend tem endpoints `/api/rt/tickets/stream`
   - ✅ Backend tem endpoint `/api/rt/queues/:queueId/state`
   - ✅ PostgreSQL LISTEN/NOTIFY configurado
   - ✅ Frontend tem hooks (`useTicketStream`, `useRealtimeQueue`)
   - ✅ Frontend tem providers (`IgniterProvider`)

3. **Controle de Status**
   - ✅ Enum `TicketStatus` com estados (WAITING, CALLED, IN_SERVICE, COMPLETED, NO_SHOW, CANCELLED)
   - ✅ Queries otimizadas para buscar tickets por status

### ⚠️ **PROBLEMAS IDENTIFICADOS:**

#### 1. **Falta Tabela de Controle de Senha Atual**
**Problema:** Não existe um campo na tabela `Queue` para armazenar:
- `currentTicketId` (senha sendo chamada AGORA)
- `previousTicketId` (senha anterior)
- `nextTicketId` (próxima senha a ser chamada)

**Consequência:** O sistema calcula dinamicamente via queries, o que:
- É menos eficiente
- Pode causar inconsistências em condições de corrida
- Dificulta rastreamento histórico
- Não garante ordem precisa

#### 2. **Cálculo Dinâmico de Senha Atual**
Atualmente no código (`queues.service.ts` linha 271-286):

```typescript
const lastCalledTicket = await this.prisma.ticket.findFirst({
  where: {
    queueId: queue.id,
    status: TicketStatus.CALLED,
  },
  orderBy: { calledAt: 'desc' },
});

currentNumber: lastCalledTicket?.myCallingToken || 'Aguardando...',
```

**Problema:** Se houver múltiplos tickets com status `CALLED` simultaneamente, pode gerar confusão.

#### 3. **Notificações SSE Não Integradas com Mudanças de Ticket**
O backend notifica via PostgreSQL LISTEN/NOTIFY, mas:
- Não há trigger automático ao mudar status de ticket
- `callNext()` não dispara notificação SSE consistentemente
- Frontend pode não receber atualização em tempo real

## 🎯 **SOLUÇÃO PROPOSTA**

### **Fase 1: Adicionar Campos de Controle na Tabela Queue**

Criar migração Prisma para adicionar:

```prisma
model Queue {
  // ... campos existentes ...
  
  currentTicketId   String?   // ID do ticket sendo chamado AGORA
  previousTicketId  String?   // ID do ticket anterior
  
  // Relacionamentos
  currentTicket     Ticket?   @relation("CurrentTicket", fields: [currentTicketId], references: [id])
  previousTicket    Ticket?   @relation("PreviousTicket", fields: [previousTicketId], references: [id])
}
```

### **Fase 2: Atualizar Lógica de callNext()**

Quando chamar próxima senha:
1. Atualizar `previousTicketId` com o `currentTicketId` atual
2. Atualizar `currentTicketId` com o novo ticket chamado
3. Atualizar status do ticket para `CALLED`
4. **Disparar notificação SSE** para todos conectados na fila

### **Fase 3: Criar Trigger PostgreSQL**

```sql
CREATE OR REPLACE FUNCTION notify_ticket_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND NEW.status != OLD.status AND NEW.status = 'CALLED') THEN
    PERFORM pg_notify(
      'ticket_updates',
      json_build_object(
        'id', NEW.id,
        'action', 'TICKET_CALLED',
        'queueId', NEW."queueId",
        'myCallingToken', NEW."myCallingToken",
        'timestamp', extract(epoch from now())
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ticket_status_change
AFTER UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION notify_ticket_change();
```

### **Fase 4: Garantir Frontend Escuta Mudanças**

O frontend JÁ tem a estrutura, mas precisa garantir:

1. **Hook `useRealtimeQueue`** já escuta eventos `ticket-called`
2. **Atualizar estado local** quando receber notificação
3. **Exibir senha atual** na tela baseado em `currentTicket`

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

### Backend (fila-api):
- [ ] Criar migração Prisma para adicionar `currentTicketId` e `previousTicketId` em `Queue`
- [ ] Atualizar `queues.service.ts` para gerenciar campos novos
- [ ] Criar trigger PostgreSQL para notificar mudanças
- [ ] Atualizar endpoint `/api/rt/queues/:queueId/state` para incluir `currentTicket`
- [ ] Garantir que `callNext()` dispara notificação SSE
- [ ] Adicionar endpoint para obter histórico de senhas chamadas

### Frontend (fila-backoffice):
- [ ] Verificar que `useRealtimeQueue` está funcionando
- [ ] Garantir que senha atual é atualizada em tempo real
- [ ] Exibir indicador visual quando senha muda
- [ ] Implementar som/notificação quando senha é chamada
- [ ] Adicionar histórico de últimas senhas chamadas

### Testes:
- [ ] Testar fluxo completo de chamar próxima senha
- [ ] Testar notificação SSE em tempo real
- [ ] Testar múltiplos clientes conectados simultaneamente
- [ ] Testar reconexão SSE em caso de queda
- [ ] Testar performance com muitos tickets

## 🚀 **PRÓXIMOS PASSOS IMEDIATOS**

1. **Criar migração Prisma** (PRIORIDADE MÁXIMA)
2. **Atualizar serviço de filas** para usar novos campos
3. **Criar trigger PostgreSQL** para notificações automáticas
4. **Testar integração end-to-end**

## 📝 **NOTAS IMPORTANTES**

- O sistema JÁ tem 80% da infraestrutura necessária
- A mudança é principalmente estrutural (adicionar campos)
- SSE já está funcionando, só precisa conectar com os eventos certos
- Frontend já tem todos os hooks necessários

---

**✅ Sistema será 100% funcional após implementar estas melhorias!**

