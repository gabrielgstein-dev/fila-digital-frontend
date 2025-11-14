# 🧪 Guia de Teste Completo - Sistema SSE

## ✅ **Arquivos Corrigidos**

1. ✅ `/src/lib/sse-utils.ts` - Função `createSSEUrl()`
2. ✅ `/src/providers/IgniterProvider.tsx` - Conexão SSE principal (linha 89)
3. ✅ `/src/providers/IgniterProvider.tsx` - Conexão SSE por fila (linha 186)
4. ✅ `/src/hooks/useTicketStream.ts` - Hook de stream de tickets (linha 27)

## 🔍 **URLs Corretas Esperadas**

### ❌ **URL Errada (antes):**
```
http://localhost:3001/api/v1/api/rt/tickets/stream
```

### ✅ **URL Correta (agora):**
```
http://localhost:3001/api/rt/tickets/stream
http://localhost:3001/api/rt/tickets/stream?queueId={id}
```

## 📋 **PASSO A PASSO PARA TESTAR**

### **1. Reiniciar o Frontend**

```bash
# Parar o servidor (Ctrl+C)
# Depois reiniciar:
cd /home/gabrielstein/projects/private/fila/fila-backoffice
npm run dev
```

### **2. Limpar Cache do Navegador**

**Importante:** Next.js faz cache agressivo em desenvolvimento!

1. Abrir DevTools (F12)
2. Clicar com botão direito no ícone de refresh
3. Selecionar "Limpar cache e recarregar forçado"

OU:

```
Ctrl + Shift + R  (Linux/Windows)
Cmd + Shift + R   (Mac)
```

### **3. Verificar Conexão SSE no Console**

Abra o console do navegador (F12) e procure por:

✅ **Logs Esperados:**
```
🔐 Conectando ao stream de tickets...
🌐 Conectando ao SSE: http://localhost:3001/api/rt/tickets/stream
✅ Conectado ao SSE principal do Igniter
✅ Conectado ao stream de tickets
```

❌ **Logs de Erro (não deve aparecer):**
```
❌ Erro no stream: ...
GET http://localhost:3001/api/v1/api/rt/tickets/stream 404
```

### **4. Verificar Rede (Network Tab)**

1. Abra DevTools (F12)
2. Vá para aba "Network"
3. Filtre por "EventSource" ou "stream"
4. Navegue para uma página de fila
5. Verifique a URL da conexão SSE

**URL esperada:**
```
http://localhost:3001/api/rt/tickets/stream?queueId=cmf4dcuhg0007ax3ng8yk62y2
```

**Status esperado:** `200 OK` ou `Pending` (conexão mantida aberta)

### **5. Testar Funcionalidade**

1. Navegue para uma fila específica: `/filas/[id]`
2. Verifique se a senha atual é exibida
3. Chame uma nova senha (se houver tickets)
4. A tela deve atualizar automaticamente SEM refresh manual

## 🐛 **Script de Debug no Console**

Cole este código no console do navegador para verificar as URLs:

```javascript
// Verificar variável de ambiente
console.log('📌 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

// Simular criação de URL SSE
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const baseUrl = apiUrl.replace('/api/v1', '');
const sseUrl = `${baseUrl}/api/rt/tickets/stream`;

console.log('✅ URL SSE correta:', sseUrl);
console.log('✅ URL SSE com queueId:', `${sseUrl}?queueId=test-123`);

// Verificar se há duplicação
if (sseUrl.includes('/api/v1/api/rt')) {
  console.error('❌ ERRO: URL duplicada detectada!', sseUrl);
} else {
  console.log('✅ URL está correta (sem duplicação)');
}
```

**Resultado Esperado:**
```
📌 NEXT_PUBLIC_API_URL: http://localhost:3001/api/v1
✅ URL SSE correta: http://localhost:3001/api/rt/tickets/stream
✅ URL SSE com queueId: http://localhost:3001/api/rt/tickets/stream?queueId=test-123
✅ URL está correta (sem duplicação)
```

## 🔥 **Verificar Backend SSE**

Teste se o endpoint SSE está funcionando no backend:

```bash
# Testar conexão SSE manualmente
curl -N http://localhost:3001/api/rt/tickets/stream

# Testar com queueId
curl -N "http://localhost:3001/api/rt/tickets/stream?queueId=cmf4dcuhg0007ax3ng8yk62y2"
```

**Resposta Esperada:**
- Conexão mantém-se aberta
- Recebe eventos heartbeat periodicamente
- Formato: `data: {"type":"heartbeat","timestamp":"..."}`

## ✅ **Checklist de Validação**

- [ ] Frontend reiniciado
- [ ] Cache do navegador limpo
- [ ] Console mostra `✅ Conectado ao SSE`
- [ ] Network tab mostra URL sem duplicação (`/api/rt/`, não `/api/v1/api/rt/`)
- [ ] Status da conexão é `200 OK` ou `Pending`
- [ ] Não há erros `404 Not Found`
- [ ] Backend está rodando na porta 3001
- [ ] Endpoint `/api/rt/tickets/stream` responde

## 🆘 **Se Ainda Houver Erro**

### **Erro: URL ainda duplicada**

1. **Verificar arquivo `.env`:**
```bash
cat .env.development
# Deve ter: NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

2. **Reiniciar servidor Next.js:**
```bash
# Matar processo
pkill -f next
# Reiniciar
npm run dev
```

3. **Hard refresh no navegador:**
```
Ctrl + Shift + Delete → Limpar cache de imagens e arquivos
```

### **Erro: Backend não responde**

1. **Verificar se backend está rodando:**
```bash
curl http://localhost:3001/api/v1/health
```

2. **Verificar logs do backend:**
```bash
# No terminal do backend
# Deve mostrar: [Nest] LOG [TicketRealtimeOptimizedController] ...
```

3. **Verificar se endpoint SSE existe:**
```bash
# Ver rotas registradas
# Procurar por: GET /api/rt/tickets/stream
```

## 📊 **Monitoramento em Tempo Real**

Para monitorar eventos SSE em tempo real, use este código no console:

```javascript
// Conectar manualmente ao SSE para debug
const testSSE = new EventSource('http://localhost:3001/api/rt/tickets/stream?queueId=cmf4dcuhg0007ax3ng8yk62y2');

testSSE.onopen = () => console.log('✅ Teste: Conectado');
testSSE.onmessage = (e) => console.log('📡 Teste: Evento recebido:', JSON.parse(e.data));
testSSE.onerror = (e) => console.error('❌ Teste: Erro:', e);

// Para parar o teste:
// testSSE.close();
```

## 🎯 **Resultado Esperado Final**

✅ Console limpo, sem erros 404  
✅ Conexão SSE estabelecida com sucesso  
✅ Tela atualiza automaticamente quando senha muda  
✅ Sistema de tempo real funcionando perfeitamente  

---

**🚀 Sistema pronto para produção após validação completa!**



