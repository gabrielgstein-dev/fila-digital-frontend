# Correções de Loops e Reconexões Desnecessárias

## Problemas Identificados e Corrigidos

### 1. ✅ Código Morto no Token Manager
**Problema**: Função `startPeriodicCheck` tinha `if (true) return;` que desabilitava completamente a funcionalidade, mas o código ainda estava presente.

**Correção**: Removido código desnecessário, mantendo apenas a assinatura da função vazia.

**Arquivo**: `src/stores/token-manager.ts`

---

### 2. ✅ Memory Leak no IgniterClient
**Problema**: `setInterval` no constructor do `IgniterClient` nunca era limpo, causando memory leak.

**Correção**: 
- Adicionado `cleanupInterval` como propriedade da classe
- Criado método `cleanup()` para limpar o interval quando necessário
- Interval agora pode ser gerenciado e limpo

**Arquivo**: `src/lib/igniter-client.ts`

---

### 3. ✅ Reconexões Desnecessárias no useIgniterSession
**Problema**: `useEffect` tinha muitas dependências (`connectToMainSSE`, `disconnectFromMainSSE`, `clearAllConnections`, `isConnecting`, `mainEventSource`) que causavam reconexões desnecessárias sempre que essas funções mudavam.

**Correção**:
- Reduzido array de dependências para apenas `[status, session?.user, sseEnabled]`
- Adicionada verificação explícita de conexão ativa antes de tentar conectar
- Separado cleanup em useEffect próprio com dependências mínimas

**Arquivo**: `src/lib/igniter-session.ts`

**Impacto**: Reduz significativamente tentativas de reconexão desnecessárias.

---

### 4. ✅ connectionTimeout Não Utilizado
**Problema**: `connectionTimeout` estava definido no estado do `igniter-store` mas nunca era usado para criar um timeout.

**Correção**: Removido completamente do estado e de todas as referências.

**Arquivo**: `src/stores/igniter-store.ts`

---

### 5. ⚠️ Stores Duplicados (Documentado)
**Observação**: Existem dois stores diferentes:
- `@/stores/igniter` (igniter.ts) - usado em 4 lugares
- `@/stores/igniter-store` (igniter-store.ts) - usado em 2 lugares

**Status**: Ambos estão funcionando, mas pode causar confusão. Considerar consolidar no futuro.

**Locais de uso**:
- `igniter.ts`: `igniter-session.ts`, `RealtimeNotifications.tsx`, `useRealtimeQueue.ts`, `IgniterDevControls.tsx`
- `igniter-store.ts`: `IgniterProviderZustand.tsx`, `useIgniterMigration.ts`

---

## Melhorias de Performance

### Antes:
- Múltiplas tentativas de reconexão quando funções mudavam
- Interval de limpeza de cache nunca limpo (memory leak)
- Código morto ocupando espaço
- Estados não utilizados

### Depois:
- Reconexões apenas quando status/sessão/sseEnabled mudam
- Interval pode ser limpo quando necessário
- Código limpo e otimizado
- Estados mínimos necessários

---

## Recomendações Futuras

1. **Consolidar Stores**: Considerar unificar `igniter.ts` e `igniter-store.ts` em um único store
2. **Monitoramento**: Adicionar logs para monitorar reconexões e identificar padrões
3. **Testes**: Adicionar testes para garantir que reconexões não aconteçam desnecessariamente

