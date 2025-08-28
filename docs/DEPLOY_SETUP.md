# Configuração do Deploy via GitHub Actions

Este documento explica como configurar o deploy automático para o Google Cloud Run usando GitHub Actions.

## 📋 Pré-requisitos

1. Conta no Google Cloud Platform com billing habilitado
2. Repositório no GitHub: `git@github.com:gabrielgstein-dev/fila-digital-frontend.git`
3. Projeto criado no Google Cloud Platform

## 🔧 Configuração no Google Cloud

### 1. Habilitar APIs necessárias

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Criar Service Account

```bash
# Criar service account
gcloud iam service-accounts create github-actions \
    --description="Service Account para GitHub Actions" \
    --display-name="GitHub Actions"

# Atribuir roles necessárias
gcloud projects add-iam-policy-binding SEU_PROJECT_ID \
    --member="serviceAccount:github-actions@SEU_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding SEU_PROJECT_ID \
    --member="serviceAccount:github-actions@SEU_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding SEU_PROJECT_ID \
    --member="serviceAccount:github-actions@SEU_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudbuild.builds.editor"

gcloud projects add-iam-policy-binding SEU_PROJECT_ID \
    --member="serviceAccount:github-actions@SEU_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"
```

### 3. Gerar chave JSON

```bash
gcloud iam service-accounts keys create github-actions-key.json \
    --iam-account=github-actions@SEU_PROJECT_ID.iam.gserviceaccount.com
```

## 🔑 Configuração de Secrets no GitHub

Vá até o repositório no GitHub: **Settings > Secrets and variables > Actions**

Adicione os seguintes secrets:

### `GCP_PROJECT_ID`
- Valor: Seu Project ID do Google Cloud

### `GCP_SA_KEY`
- Valor: Conteúdo completo do arquivo `github-actions-key.json` (copie todo o JSON)

## 🚀 Como funciona o Deploy

### Workflow de Deploy (`.github/workflows/deploy.yml`)

O workflow é executado automaticamente quando:
- Há push na branch `main` ou `master`
- É criado um Pull Request

### Etapas do Deploy:

1. **Test Job**: 
   - Instala dependências com pnpm
   - Executa verificação de tipos TypeScript
   - Executa linting
   - Faz build da aplicação

2. **Deploy Job** (apenas em push para main/master):
   - Autentica no Google Cloud
   - Faz build da imagem Docker
   - Envia para Google Container Registry
   - Deploy no Cloud Run

### Configurações do Cloud Run:

- **Região**: us-central1
- **Porta**: 8080
- **Memória**: 512Mi
- **CPU**: 1
- **Instâncias**: 0-10 (auto-scaling)
- **Acesso**: Público (sem autenticação)

## 🔄 Migração do Cloud Build

Para migrar completamente do Cloud Build:

1. Configure os secrets no GitHub (conforme instruções acima)
2. Faça push do código com o novo workflow
3. Verifique se o deploy funciona corretamente
4. Desabilite ou remova os triggers do Cloud Build
5. Opcionalmente, remova o arquivo `cloudbuild.yaml`

## 🛠️ Configuração SSH

Se você estiver usando uma chave SSH específica para este repositório, adicione no `~/.ssh/config`:

```
Host fila-backoffice
  HostName github.com
  User git
  IdentityFile ~/.ssh/sua-chave-privada
  IdentitiesOnly yes
  TCPKeepAlive yes
```

E clone o repositório usando:
```bash
git clone fila-backoffice:gabrielgstein-dev/fila-digital-backoffice.git
```

## 📝 Variáveis de Ambiente

O deploy configurará automaticamente:
- `NODE_ENV=production`
- `NEXT_TELEMETRY_DISABLED=1`

Para adicionar outras variáveis, edite o step "Deploy no Cloud Run" no arquivo `.github/workflows/deploy.yml`.

## 🔍 Troubleshooting

### Erro de permissões
- Verifique se todas as roles foram atribuídas à Service Account
- Confirme se o Project ID está correto nos secrets

### Erro de build
- Verifique se todas as dependências estão no `package.json`
- Confirme se o `Dockerfile` está correto

### Erro de deploy
- Verifique se o serviço Cloud Run foi criado corretamente
- Confirme se a região está configurada corretamente

## 📞 Suporte

Em caso de problemas, verifique:
1. Logs do GitHub Actions na aba "Actions" do repositório
2. Logs do Cloud Run no Google Cloud Console
3. Status dos serviços do Google Cloud 