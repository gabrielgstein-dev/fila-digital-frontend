# 🌍 Configuração de Variáveis de Ambiente - Fila Backoffice

## 📋 Visão Geral

Este projeto utiliza diferentes arquivos de configuração de ambiente para cada tipo de deploy:

- **`.env.development`** - Desenvolvimento local
- **`.env.staging`** - Ambiente de testes/QA
- **`.env.production`** - Ambiente de produção

## 🚀 Como Usar

### 1. Desenvolvimento Local

Para desenvolvimento local, o Next.js automaticamente carregará o arquivo `.env.development`:

```bash
# O arquivo .env.development já está configurado para:
NEXT_PUBLIC_API_URL=http://192.168.1.111:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://192.168.1.111:3001
```

### 2. Staging/QA

Para deploy em staging, configure as variáveis no Cloud Run:

```bash
# URL da API de staging
NEXT_PUBLIC_API_URL=https://fila-api-stage.cloudrun.app/api/v1
NEXT_PUBLIC_WS_URL=wss://fila-api-stage.cloudrun.app
```

### 3. Produção

Para produção, configure as variáveis no Cloud Run:

```bash
# URL da API de produção
NEXT_PUBLIC_API_URL=https://fila-api-397713505626.us-central1.run.app/api/v1
NEXT_PUBLIC_WS_URL=wss://fila-api-397713505626.us-central1.run.app
```

## 🔧 Variáveis Disponíveis

### 🔐 Autenticação (NextAuth)
```env
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 🌐 API e WebSocket
```env
NEXT_PUBLIC_API_URL="http://192.168.1.111:3001/api/v1"
NEXT_PUBLIC_WS_URL="ws://192.168.1.111:3001"
```

### 📱 Aplicação
```env
NEXT_PUBLIC_APP_NAME="Fila Digital"
NEXT_PUBLIC_VERSION="1.0.0"
```

### 🚫 Sistema
```env
NODE_ENV="development"
NEXT_TELEMETRY_DISABLED=1
```

### 📝 Logs
```env
LOG_LEVEL="debug"
ENABLE_NETWORK_LOGS=true
```

## 🔄 Mudança de Ambiente

### Para Desenvolvimento
```bash
# O Next.js automaticamente carrega .env.development
pnpm dev
```

### Para Staging
```bash
# Configure as variáveis no Cloud Run ou use:
NODE_ENV=staging pnpm dev
```

### Para Produção
```bash
# Configure as variáveis no Cloud Run ou use:
NODE_ENV=production pnpm dev
```

## 🚨 Variáveis Críticas

### ⚠️ NEXTAUTH_SECRET
- **NUNCA** use a mesma chave em todos os ambientes
- Gere uma chave única para cada ambiente
- Use pelo menos 32 caracteres aleatórios

### ⚠️ NEXTAUTH_URL
- Deve corresponder exatamente à URL da aplicação
- Para desenvolvimento: `http://localhost:3000`
- Para produção: URL completa do Cloud Run

### ⚠️ NEXT_PUBLIC_API_URL
- Deve apontar para a API correta de cada ambiente
- Verifique se a API está rodando e acessível
- Teste a conectividade antes do deploy

## 🔍 Verificação de Configuração

### 1. Verificar Variáveis Carregadas
```typescript
import { env } from '@/config/env'

console.log('API URL:', env.API_URL)
console.log('App Name:', env.APP_NAME)
```

### 2. Verificar no Browser
```javascript
// No console do browser
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
```

### 3. Verificar Build
```bash
pnpm build
# Verificar se não há erros de variáveis não definidas
```

## 🛠️ Troubleshooting

### Erro: "API_URL is not defined"
- Verifique se a variável está no arquivo `.env` correto
- Confirme se o arquivo está sendo carregado
- Verifique se não há espaços extras ou aspas incorretas

### Erro: "NEXTAUTH_SECRET is not defined"
- Configure a variável `NEXTAUTH_SECRET` em todos os ambientes
- Gere uma nova chave secreta se necessário

### Erro de CORS
- Verifique se `CORS_ORIGIN` está configurado corretamente na API
- Confirme se as URLs estão corretas

### Erro de Conectividade
- Teste se a API está acessível: `curl NEXT_PUBLIC_API_URL/health`
- Verifique firewall e configurações de rede
- Confirme se a API está rodando

## 📚 Referências

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [Google Cloud Run Environment Variables](https://cloud.google.com/run/docs/configuring/environment-variables)

## 🔐 Segurança

### ✅ Boas Práticas
- Use variáveis diferentes para cada ambiente
- Nunca commite arquivos `.env*` no Git
- Use secrets do GitHub Actions para produção
- Rotacione chaves secretas regularmente

### ❌ O que NÃO fazer
- Usar a mesma chave secreta em todos os ambientes
- Commitar arquivos `.env*` no repositório
- Usar URLs hardcoded no código
- Deixar chaves secretas em logs ou console

