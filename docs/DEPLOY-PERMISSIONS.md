# 🔒 **SISTEMA DE PERMISSÕES - DEPLOY**

## 🎯 **VISÃO GERAL**

O sistema possui **dois ambientes** com níveis diferentes de permissão:

### **🟡 STAGING** - Acesso Livre
- **Quem**: Qualquer desenvolvedor
- **Como**: Comandos `version:patch/minor/major`
- **Tags**: `X.Y.Z-stage`
- **Deploy**: Automático via GitHub Actions

### **🔴 PRODUÇÃO** - Acesso Restrito
- **Quem**: Apenas pessoas com permissão
- **Como**: Comandos `version:prod-patch/minor/major`
- **Tags**: `X.Y.Z` (sem sufixo)
- **Deploy**: Requer aprovação no GitHub

---

## 📋 **COMANDOS DISPONÍVEIS**

### **🟡 Para STAGING (Qualquer Dev):**
```bash
# Deploy automático para staging
pnpm run version:patch   # 0.0.X-stage
pnpm run version:minor   # 0.X.0-stage  
pnpm run version:major   # X.0.0-stage
```

### **🔴 Para PRODUÇÃO (Só com Permissão):**
```bash
# Deploy para produção (requer aprovação)
pnpm run version:prod-patch   # 0.0.X
pnpm run version:prod-minor   # 0.X.0
pnpm run version:prod-major   # X.0.0
```

---

## 🔧 **CONFIGURAÇÃO DE PERMISSÕES NO GITHUB**

### **1. Criar Environment "production"**

1. Acesse: **Settings** → **Environments** → **New environment**
2. Nome: `production`
3. Configure:
   - ✅ **Required reviewers**: Adicione usuários autorizados
   - ✅ **Wait timer**: 0 minutos (opcional)
   - ✅ **Deployment branches**: `main` (ou específicas)

### **2. Configurar Required Reviewers**

```
👤 Pessoas autorizadas para produção:
   - @admin-user-1
   - @admin-user-2  
   - @lead-developer
```

### **3. Secrets de Produção**

Configure secrets específicos para produção:

```
🔐 SECRETS:
   - GCP_PROJECT_ID_PROD
   - GCP_SA_KEY_PROD
   - DATABASE_URL_PROD
   - JWT_SECRET_PROD

🔧 VARIABLES:
   - GCP_REGION_PROD
   - BACKEND_SERVICE_NAME_PROD
   - FRONTEND_SERVICE_NAME_PROD
   - NEXT_PUBLIC_API_URL_PROD
   - NEXT_PUBLIC_WS_URL_PROD
   - NEXT_PUBLIC_APP_NAME_PROD
```

---

## 🔄 **FLUXOS DE DEPLOY**

### **🟡 STAGING (Automático)**

```bash
# 1. Desenvolvedor faz mudanças
git add .
git commit -m "feat: nova funcionalidade"

# 2. Cria versão staging  
pnpm run version:patch

# 3. Resultado automático:
# ✅ Tag: 0.1.1-stage
# ✅ Deploy imediato
# ✅ Staging atualizado
```

### **🔴 PRODUÇÃO (Com Aprovação)**

```bash
# 1. Admin/Lead executa comando
pnpm run version:prod-patch

# 2. GitHub Actions:
# ⏸️ Aguarda aprovação
# 📧 Notifica reviewers
# 
# 3. Reviewer aprova:
# ✅ Deploy executado
# ✅ Produção atualizada
```

---

## ⚡ **TRIGGERS DOS WORKFLOWS**

### **Staging (deploy.yml)**
```yaml
on:
  push:
    tags:
      - '*-stage'  # Qualquer tag terminada em -stage
```

### **Produção (deploy-prod.yml)**
```yaml
on:
  push:
    tags:
      - '[0-9]+.[0-9]+.[0-9]+'  # Apenas X.Y.Z (sem sufixo)

jobs:
  deploy:
    environment: production  # Requer aprovação
```

---

## 🛡️ **PROTEÇÕES DE SEGURANÇA**

### **1. Ambiente Production**
- ✅ **Required reviewers**: Impede deploy sem aprovação
- ✅ **Wait timer**: Tempo de reflexão (opcional)
- ✅ **Secrets isolados**: Produção usa secrets separados

### **2. Validação de Tags**
- ✅ **Staging**: Aceita apenas `*-stage`
- ✅ **Produção**: Aceita apenas `X.Y.Z` (regex validation)

### **3. Branch Protection (Opcional)**
- ✅ **Main branch**: Proteger contra push direto
- ✅ **Require PRs**: Force uso de Pull Requests
- ✅ **Status checks**: Testes obrigatórios

---

## 📊 **EXEMPLO PRÁTICO**

### **Cenário: Nova Feature**

```bash
# 1. Dev trabalha na feature
git checkout -b feature/nova-funcionalidade
# ... desenvolvimento ...
git push origin feature/nova-funcionalidade

# 2. PR aprovado e merged para main

# 3. Dev testa em staging
pnpm run version:patch
# ✅ Deploy automático: 1.2.3-stage

# 4. Testes OK, admin promove para produção
pnpm run version:prod-patch
# ⏸️ Aguarda aprovação no GitHub
# 👤 Admin aprova
# ✅ Deploy: 1.2.3 (produção)
```

---

## 🎯 **VANTAGENS DO SISTEMA**

### **✅ Para Desenvolvedores:**
- Deploy rápido em staging
- Testes imediatos
- Autonomia para iteração

### **✅ Para Admins:**
- Controle total sobre produção
- Aprovação obrigatória
- Histórico de deployments

### **✅ Para o Time:**
- Processo claro e documentado
- Separação de responsabilidades
- Rastreabilidade completa

---

## 🔧 **PRÓXIMOS PASSOS**

### **1. Configurar GitHub Environment**
```bash
# Acesse repositório → Settings → Environments
# Crie environment "production"
# Adicione required reviewers
```

### **2. Configurar Secrets de Produção**
```bash
# Configure GCP_PROJECT_ID_PROD, etc.
```

### **3. Testar Sistema**
```bash
# Teste staging: pnpm run version:patch
# Teste produção: pnpm run version:prod-patch
```

---

**🔒 Sistema configurado para máxima segurança e flexibilidade!**
