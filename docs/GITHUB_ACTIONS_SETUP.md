# Configuração dos GitHub Actions para Deploy no Google Cloud

Este documento explica como configurar os GitHub Actions para fazer deploy da aplicação no Google Cloud Run.

## 🔐 Métodos de Autenticação

Existem duas abordagens principais para autenticação no Google Cloud:

### 1. Service Account Key JSON (Atual - Corrigido)

**Vantagens:**
- Mais simples de configurar
- Funciona imediatamente
- Não requer configuração adicional no GCP

**Desvantagens:**
- Menos seguro (chave JSON armazenada como secret)
- Requer rotação manual das chaves

**Configuração necessária:**
1. Criar uma Service Account no Google Cloud
2. Baixar a chave JSON
3. Adicionar como secret `GCP_SA_KEY_STAGE` no GitHub

### 2. Workload Identity Federation (Recomendado)

**Vantagens:**
- Mais seguro (sem chaves persistentes)
- Autenticação baseada em tokens temporários
- Integração nativa com GitHub Actions

**Desvantagens:**
- Requer configuração adicional no GCP
- Mais complexo de configurar inicialmente

**Configuração necessária:**
1. Configurar Workload Identity Pool no GCP
2. Configurar Workload Identity Provider
3. Configurar Service Account com IAM
4. Adicionar secrets no GitHub

## 🚀 Workflow Principal (Service Account Key)

O arquivo `.github/workflows/cloudrun-deploy-stage.yml` foi corrigido para usar:

- `google-github-actions/auth@v2` para autenticação
- `google-github-actions/setup-gcloud@v3` para instalação do CLI
- Versão mínima do gcloud >= 363.0.0

### Secrets necessários:
- `GCP_SA_KEY_STAGE`: Chave JSON da Service Account

### Variáveis necessárias:
- `GCP_PROJECT_ID_STAGE`: ID do projeto GCP
- `GCP_REGION_STAGE`: Região do GCP
- `FRONTEND_SERVICE_NAME_STAGE`: Nome do serviço Cloud Run

## 🔒 Workflow Alternativo (Workload Identity Federation)

O arquivo `.github/workflows/cloudrun-deploy-stage-wif.yml` usa a abordagem mais moderna:

### Secrets necessários:
- `WIF_PROVIDER`: Provider do Workload Identity
- `WIF_SERVICE_ACCOUNT`: Email da Service Account

### Permissões necessárias:
```yaml
permissions:
  contents: 'read'
  id-token: 'write'
```

## 🛠️ Configuração da Service Account

### Permissões mínimas necessárias:
- `Cloud Run Admin` (para deploy)
- `Storage Admin` (para Artifact Registry)
- `Service Account User` (para execução)

### Comandos para criar:
```bash
# Criar Service Account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account"

# Conceder permissões
gcloud projects add-iam-policy-binding fila-digital-qa \
  --member="serviceAccount:github-actions@fila-digital-qa.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding fila-digital-qa \
  --member="serviceAccount:github-actions@fila-digital-qa.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding fila-digital-qa \
  --member="serviceAccount:github-actions@fila-digital-qa.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Criar e baixar chave
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@fila-digital-qa.iam.gserviceaccount.com
```

## 🔧 Configuração do Workload Identity Federation

### 1. Criar Workload Identity Pool:
```bash
gcloud iam workload-identity-pool create "github-actions-pool" \
  --project="fila-digital-qa" \
  --location="global" \
  --display-name="GitHub Actions Pool"
```

### 2. Criar Workload Identity Provider:
```bash
gcloud iam workload-identity-pool-provider create "github-actions-provider" \
  --project="fila-digital-qa" \
  --location="global" \
  --workload-identity-pool="github-actions-pool" \
  --display-name="GitHub Actions Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

### 3. Configurar Service Account:
```bash
gcloud iam service-accounts add-iam-policy-binding "github-actions@fila-digital-qa.iam.gserviceaccount.com" \
  --project="fila-digital-qa" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/123456789/locations/global/workloadIdentityPools/github-actions-pool/attribute.repository/SEU_USUARIO/SEU_REPO"
```

## 📋 Checklist de Configuração

### Para Service Account Key:
- [ ] Service Account criada no GCP
- [ ] Permissões configuradas
- [ ] Chave JSON baixada
- [ ] Secret `GCP_SA_KEY_STAGE` adicionado no GitHub
- [ ] Variáveis configuradas no GitHub

### Para Workload Identity Federation:
- [ ] Workload Identity Pool criado
- [ ] Workload Identity Provider configurado
- [ ] Service Account com permissões de Workload Identity
- [ ] Secrets `WIF_PROVIDER` e `WIF_SERVICE_ACCOUNT` adicionados
- [ ] Permissões `id-token: 'write'` configuradas

## 🚨 Troubleshooting

### Erro "NoActiveAccountException":
- Verificar se a autenticação foi feita antes do setup-gcloud
- Verificar se as credenciais estão corretas
- Verificar se a Service Account tem permissões adequadas

### Erro de permissões:
- Verificar se a Service Account tem todas as permissões necessárias
- Verificar se o projeto está configurado corretamente
- Verificar se a região está correta

### Erro de Docker:
- Verificar se o gcloud auth configure-docker foi executado
- Verificar se o repositório Artifact Registry existe
- Verificar permissões de Storage

## 📚 Recursos Adicionais

- [Documentação oficial do setup-gcloud](https://github.com/google-github-actions/setup-gcloud)
- [Documentação do Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation)
- [Melhores práticas de segurança](https://cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys)
