# 🔧 Troubleshooting do Deploy - Problema de Autenticação

## 🚨 Problema Atual

O workflow está falhando com o erro:
```
No credentialed accounts.
To login, run:
  $ gcloud auth login `ACCOUNT`

ERROR: (gcloud.artifacts.repositories.list) 'NoActiveAccountException' object has no attribute 'content'
```

## ✅ Solução Imediata

### 1. Atualizar o Workflow Principal

O arquivo `.github/workflows/cloudrun-deploy-stage.yml` já foi corrigido para usar:
- `google-github-actions/auth@v2` (versão mais recente)
- `google-github-actions/setup-gcloud@v3` (versão mais recente)
- Autenticação correta antes do setup do gcloud

### 2. Verificar Secrets no GitHub

Certifique-se de que o secret `GCP_SA_KEY_STAGE` está configurado corretamente:

1. Vá para `Settings > Secrets and variables > Actions`
2. Verifique se `GCP_SA_KEY_STAGE` existe
3. O valor deve ser o conteúdo completo do arquivo JSON da Service Account

### 3. Verificar Variáveis no GitHub

Configure as seguintes variáveis:
- `GCP_PROJECT_ID_STAGE`: `fila-digital-qa`
- `GCP_REGION_STAGE`: `us-central1`
- `FRONTEND_SERVICE_NAME_STAGE`: `fila-frontend`

## 🛠️ Configuração da Service Account

### Opção 1: Script Automatizado (Recomendado)

Execute o script de configuração:

```bash
# Navegar para o projeto
cd /caminho/para/fila-backoffice

# Executar script de configuração
./scripts/setup-gcp-service-account.sh fila-digital-qa github-actions
```

### Opção 2: Configuração Manual

#### 1. Criar Service Account
```bash
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account" \
  --project=fila-digital-qa
```

#### 2. Conceder Permissões
```bash
# Cloud Run Admin
gcloud projects add-iam-policy-binding fila-digital-qa \
  --member="serviceAccount:github-actions@fila-digital-qa.iam.gserviceaccount.com" \
  --role="roles/run.admin"

# Storage Admin
gcloud projects add-iam-policy-binding fila-digital-qa \
  --member="serviceAccount:github-actions@fila-digital-qa.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

# Service Account User
gcloud projects add-iam-policy-binding fila-digital-qa \
  --member="serviceAccount:github-actions@fila-digital-qa.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

#### 3. Criar Chave JSON
```bash
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@fila-digital-qa.iam.gserviceaccount.com
```

## 🔍 Verificação da Configuração

### 1. Testar Autenticação Localmente
```bash
# Configurar projeto
gcloud config set project fila-digital-qa

# Verificar se consegue listar repositórios
gcloud artifacts repositories list --location=us

# Verificar se consegue listar serviços Cloud Run
gcloud run services list --region=us-central1
```

### 2. Verificar Permissões da Service Account
```bash
# Listar permissões da Service Account
gcloud projects get-iam-policy fila-digital-qa \
  --flatten="bindings[].members" \
  --filter="bindings.members:github-actions@fila-digital-qa.iam.gserviceaccount.com" \
  --format="table(bindings.role)"
```

## 🚀 Testando o Deploy

### 1. Criar Tag de Teste
```bash
# Criar tag para staging
git tag 1.0.0-stage
git push origin 1.0.0-stage
```

### 2. Verificar Workflow
1. Vá para a aba `Actions` no GitHub
2. Verifique se o workflow foi disparado
3. Monitore a execução
4. Verifique os logs em caso de erro

## 🔒 Alternativa: Workload Identity Federation

Se preferir usar a abordagem mais moderna e segura:

### 1. Usar Workflow Alternativo
O arquivo `.github/workflows/cloudrun-deploy-stage-wif.yml` está configurado para usar Workload Identity Federation.

### 2. Configurar no GCP
```bash
# Criar Workload Identity Pool
gcloud iam workload-identity-pool create "github-actions-pool" \
  --project="fila-digital-qa" \
  --location="global" \
  --display-name="GitHub Actions Pool"

# Criar Provider
gcloud iam workload-identity-pool-provider create "github-actions-provider" \
  --project="fila-digital-qa" \
  --location="global" \
  --workload-identity-pool="github-actions-pool" \
  --display-name="GitHub Actions Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

### 3. Configurar Secrets no GitHub
- `WIF_PROVIDER`: `projects/fila-digital-qa/locations/global/workloadIdentityPools/github-actions-pool/providers/github-actions-provider`
- `WIF_SERVICE_ACCOUNT`: `github-actions@fila-digital-qa.iam.gserviceaccount.com`

## 🚨 Problemas Comuns

### Erro: "Permission denied"
- Verificar se a Service Account tem todas as permissões necessárias
- Verificar se o projeto está correto
- Verificar se a região está correta

### Erro: "Repository not found"
- Verificar se o repositório Artifact Registry existe
- Verificar se a Service Account tem permissão de Storage Admin

### Erro: "Service not found"
- Verificar se o serviço Cloud Run existe
- Verificar se a Service Account tem permissão de Cloud Run Admin

## 📞 Suporte

Se o problema persistir:

1. Verificar logs completos do workflow
2. Verificar permissões da Service Account
3. Testar comandos gcloud localmente
4. Verificar se o projeto GCP está ativo
5. Verificar se as APIs necessárias estão habilitadas

## 🔗 Links Úteis

- [Documentação oficial do setup-gcloud](https://github.com/google-github-actions/setup-gcloud)
- [Troubleshooting do Google Cloud](https://cloud.google.com/docs/troubleshooting)
- [IAM Best Practices](https://cloud.google.com/iam/docs/best-practices)
