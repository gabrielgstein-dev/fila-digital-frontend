# Configuração do GitHub Actions para Deploy

Este documento explica como configurar as variáveis necessárias no GitHub Actions para fazer o deploy automático do projeto.

## Variáveis Necessárias

### Secrets (Configurações Sensíveis)

Configure os seguintes secrets no repositório GitHub (`Settings > Secrets and variables > Actions`):

#### Para Staging:
- `GCP_PROJECT_ID_STAGE`: ID do projeto GCP para staging
- `GCP_SA_KEY_STAGE`: Chave JSON da Service Account do GCP para staging

#### Para Produção:
- `GCP_PROJECT_ID_PROD`: ID do projeto GCP para produção
- `GCP_SA_KEY_PROD`: Chave JSON da Service Account do GCP para produção

### Variables (Configurações Públicas)

Configure as seguintes variables no repositório GitHub (`Settings > Secrets and variables > Actions`):

#### Para Staging:
- `GCP_REGION_STAGE`: Região do GCP para staging (ex: us-central1)
- `FRONTEND_SERVICE_NAME_STAGE`: Nome do serviço Cloud Run para staging (ex: fila-backoffice)
- `NODE_ENV_STAGE`: Ambiente Node.js para staging (ex: staging)
- `NEXT_PUBLIC_API_URL_STAGE`: URL da API para staging
- `NEXT_PUBLIC_WS_URL_STAGE`: URL do WebSocket para staging
- `NEXT_PUBLIC_APP_NAME_STAGE`: Nome da aplicação para staging

#### Para Produção:
- `GCP_REGION_PROD`: Região do GCP para produção (ex: us-central1)
- `FRONTEND_SERVICE_NAME_PROD`: Nome do serviço Cloud Run para produção (ex: fila-backoffice)
- `NEXT_PUBLIC_API_URL_PROD`: URL da API para produção
- `NEXT_PUBLIC_WS_URL_PROD`: URL do WebSocket para produção
- `NEXT_PUBLIC_APP_NAME_PROD`: Nome da aplicação para produção

#### Comuns:
- `NEXT_TELEMETRY_DISABLED`: Desabilitar telemetria do Next.js (ex: 1)

## Como Configurar

### 1. Acesse as Configurações do Repositório
- Vá para o repositório no GitHub
- Clique em `Settings`
- No menu lateral, clique em `Secrets and variables > Actions`

### 2. Configure os Secrets
- Clique na aba `Secrets`
- Clique em `New repository secret`
- Adicione cada secret necessário

### 3. Configure as Variables
- Clique na aba `Variables`
- Clique em `New repository variable`
- Adicione cada variable necessária

## Exemplo de Configuração

### Secrets:
```
GCP_PROJECT_ID_STAGE: fila-backoffice-stage
GCP_SA_KEY_STAGE: {"type":"service_account","project_id":"..."}
GCP_PROJECT_ID_PROD: fila-backoffice-prod
GCP_SA_KEY_PROD: {"type":"service_account","project_id":"..."}
```

### Variables:
```
GCP_REGION_STAGE: us-central1
FRONTEND_SERVICE_NAME_STAGE: fila-backoffice
NODE_ENV_STAGE: staging
NEXT_PUBLIC_API_URL_STAGE: https://fila-api-stage.example.com
NEXT_PUBLIC_WS_URL_STAGE: wss://fila-api-stage.example.com
NEXT_PUBLIC_APP_NAME_STAGE: Fila Digital (Staging)

GCP_REGION_PROD: us-central1
FRONTEND_SERVICE_NAME_PROD: fila-backoffice
NEXT_PUBLIC_API_URL_PROD: https://fila-api.example.com
NEXT_PUBLIC_WS_URL_PROD: wss://fila-api.example.com
NEXT_PUBLIC_APP_NAME_PROD: Fila Digital

NEXT_TELEMETRY_DISABLED: 1
```

## Como Obter a Service Account Key

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione o projeto desejado
3. Vá para `IAM & Admin > Service Accounts`
4. Clique em `Create Service Account`
5. Atribua as seguintes roles:
   - Cloud Run Admin
   - Storage Admin
   - Cloud Build Editor
   - Service Account User
6. Crie uma chave JSON
7. Copie o conteúdo da chave para o secret `GCP_SA_KEY_*`

## Testando o Deploy

### Para Staging:
```bash
pnpm run version:patch
```

### Para Produção:
```bash
pnpm run version:prod-patch
```

## Troubleshooting

### Erro: "invalid tag gcr.io//:version"
- Verifique se `GCP_PROJECT_ID` está configurado
- Verifique se `SERVICE_NAME` está configurado

### Erro: "authentication failed"
- Verifique se `GCP_SA_KEY` está configurado corretamente
- Verifique se a Service Account tem as permissões necessárias

### Erro: "region not found"
- Verifique se `GCP_REGION` está configurado corretamente
- Verifique se a região existe no projeto GCP
