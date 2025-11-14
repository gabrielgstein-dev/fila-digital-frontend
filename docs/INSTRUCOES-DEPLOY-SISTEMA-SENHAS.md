# 🚀 Instruções para Deploy do Sistema de Controle de Senhas

## 📋 **Resumo das Mudanças**

### **Backend (fila-api):**
1. ✅ Schema Prisma atualizado com campos `currentTicketId` e `previousTicketId` em `Queue`
2. ✅ Migração SQL criada com trigger PostgreSQL para notificações automáticas
3. ✅ Serviço de filas atualizado para gerenciar senhas atual/anterior
4. ✅ Sistema SSE já implementado e funcionando

### **Frontend (fila-backoffice):**
1. ✅ Hooks de tempo real já implementados (`useRealtimeQueue`, `useTicketStream`)
2. ✅ Providers SSE já configurados (`IgniterProvider`)
3. ✅ Componentes de notificação já criados
4. ⚠️ Precisa garantir que a interface exibe senha atual e escuta mudanças

---

## 🔧 **PASSO A PASSO PARA IMPLEMENTAR**

### **Etapa 1: Aplicar Migração no Backend**

```bash
# 1. Navegar para o projeto da API
cd /home/gabrielstein/projects/private/fila/fila-api

# 2. Gerar o cliente Prisma com novos campos
npx prisma generate

# 3. Aplicar migração no banco de dados
npx prisma migrate dev --name add_queue_ticket_control

# 4. Verificar se migração foi aplicada
npx prisma migrate status
```

**Nota:** Se houver erro de relacionamento circular no Prisma, pode ser necessário ajustar manualmente.

### **Etapa 2: Reiniciar Backend**

```bash
# Se estiver rodando localmente
npm run start:dev

# Se estiver em produção/staging, fazer deploy
git add .
git commit -m "feat: adiciona controle de senha atual e anterior na fila"
git push
```

### **Etapa 3: Testar Trigger PostgreSQL**

```bash
# Conectar ao banco de dados PostgreSQL
psql $DATABASE_URL

# Verificar se trigger foi criado
\df notify_ticket_change

# Verificar se trigger está ativo
SELECT tgname, tgenabled FROM pg_trigger WHERE tgname = 'ticket_status_change';

# Testar manualmente
SELECT pg_notify('ticket_updates', '{"test": true}');
```

### **Etapa 4: Verificar Integração SSE**

```bash
# Terminal 1: Rodar backend
cd /home/gabrielstein/projects/private/fila/fila-api
npm run start:dev

# Terminal 2: Testar SSE endpoint
curl -N http://localhost:3001/api/rt/tickets/stream?queueId=sua-fila-id

# Deve manter conexão aberta e receber eventos quando tickets mudarem
```

### **Etapa 5: Testar Frontend**

```bash
# 1. Rodar frontend
cd /home/gabrielstein/projects/private/fila/fila-backoffice
npm run dev

# 2. Abrir navegador em http://localhost:3000
# 3. Abrir console do navegador (F12)
# 4. Navegar para uma página de fila
# 5. Verificar logs:
#    - "✅ Conectado ao SSE principal do Igniter"
#    - "🔄 Dados da fila X atualizados via tempo real"
```

---

## 🧪 **TESTES MANUAIS**

### **Teste 1: Chamar Próxima Senha**

1. Acessar `/filas` no frontend
2. Clicar em "Chamar Próxima Senha"
3. **Verificar:**
   - ✅ Senha atual muda na tela
   - ✅ Senha anterior é exibida
   - ✅ Notificação SSE aparece no console
   - ✅ Backend loga: "✅ Fila X atualizada: senha atual = ABC"

### **Teste 2: Múltiplos Clientes**

1. Abrir 2 abas do navegador
2. Ambas navegando para `/filas/:id`
3. Chamar próxima senha em uma aba
4. **Verificar:**
   - ✅ Ambas as abas atualizam simultaneamente
   - ✅ Senha atual sincronizada em ambas

### **Teste 3: Reconexão SSE**

1. Abrir `/filas/:id` no navegador
2. Parar backend (Ctrl+C)
3. Reiniciar backend
4. **Verificar:**
   - ✅ Frontend tenta reconectar automaticamente
   - ✅ Após reconexão, senhas sincronizam

---

## 🐛 **TROUBLESHOOTING**

### **Problema: Migração falha com erro de relacionamento circular**

**Solução:**
```bash
# Remover migrations pendentes
rm -rf prisma/migrations/20250111_add_queue_ticket_control

# Re-gerar
npx prisma migrate dev --create-only --name add_queue_ticket_control

# Editar migration manual se necessário
# Aplicar
npx prisma migrate deploy
```

### **Problema: Trigger não está disparando**

**Solução:**
```sql
-- Verificar se função existe
SELECT proname FROM pg_proc WHERE proname = 'notify_ticket_change';

-- Recriar trigger
DROP TRIGGER IF EXISTS ticket_status_change ON tickets;
CREATE TRIGGER ticket_status_change
AFTER INSERT OR UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION notify_ticket_change();
```

### **Problema: Frontend não recebe notificações SSE**

**Diagnóstico:**
```javascript
// No console do navegador
// Verificar se EventSource está conectado
console.log('SSE ReadyState:', eventSource.readyState);
// 0 = CONNECTING, 1 = OPEN, 2 = CLOSED
```

**Solução:**
1. Verificar se backend está rodando em `http://localhost:3001`
2. Verificar CORS configurado corretamente
3. Verificar se `NEXT_PUBLIC_API_URL` está correto no `.env`

### **Problema: Senha atual não atualiza na tela**

**Verificar:**
1. `useRealtimeQueue` está sendo chamado com `queueId` correto
2. Componente está escutando o evento `ticket-called`
3. Estado local está sendo atualizado no `useEffect`

**Debug:**
```typescript
// Adicionar logs no hook useRealtimeQueue
useEffect(() => {
  if (queueNotifications.length > 0) {
    console.log('🔍 Notificações recebidas:', queueNotifications);
    const latestNotification = queueNotifications[0];
    console.log('🔍 Última notificação:', latestNotification);
    // ... resto do código
  }
}, [queueNotifications]);
```

---

## ✅ **CHECKLIST FINAL**

### **Backend:**
- [ ] Migração aplicada com sucesso
- [ ] Campos `currentTicketId` e `previousTicketId` existem em `queues`
- [ ] Trigger `ticket_status_change` ativo
- [ ] Função `notify_ticket_change` criada
- [ ] Backend loga notificações SSE quando ticket muda
- [ ] Endpoint `/api/rt/queues/:id/state` retorna `currentTicket`

### **Frontend:**
- [ ] Hooks `useRealtimeQueue` funcionando
- [ ] SSE conectado (verificar console)
- [ ] Senha atual exibida na tela
- [ ] Senha anterior exibida na tela
- [ ] Tela atualiza automaticamente quando senha muda
- [ ] Múltiplos clientes sincronizam corretamente

### **Integração:**
- [ ] Chamar próxima senha funciona
- [ ] Notificação SSE dispara automaticamente
- [ ] Frontend recebe e processa notificação
- [ ] Tela atualiza sem refresh manual
- [ ] Histórico de senhas mantido

---

## 📊 **MONITORAMENTO**

### **Logs Importantes:**

**Backend:**
```
✅ Fila {queueId} atualizada: senha atual = {token}
📡 Notificação SSE disparada automaticamente via trigger para fila {queueId}
```

**Frontend:**
```
✅ Conectado ao SSE principal do Igniter
📡 Evento recebido: { type: 'ticket-called', ... }
🔄 Dados da fila {queueId} atualizados via tempo real
```

### **Métricas:**
- Latência de notificação (backend → frontend): < 500ms
- Taxa de reconexão SSE: > 99%
- Sincronização multi-cliente: 100%

---

## 🎯 **PRÓXIMOS PASSOS APÓS DEPLOY**

1. **Monitorar logs** por 24h para detectar problemas
2. **Coletar feedback** dos usuários
3. **Ajustar performance** se necessário
4. **Documentar APIs** se houver novos endpoints
5. **Criar testes automatizados** para regressão

---

**✅ Sistema pronto para produção após completar todos os checkpoints!**

