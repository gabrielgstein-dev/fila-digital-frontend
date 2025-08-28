# 📋 **VERSIONAMENTO AUTOMÁTICO - AMBIENTE QA**

## 🎯 **COMO FUNCIONA**

O sistema de versionamento automático garante que **apenas novas versões** sejam deployadas no ambiente de QA (staging).

### **Formato das Versões QA:**
```
X.Y.Z-stage
```
- `X` = Versão Major (quebra compatibilidade)
- `Y` = Versão Minor (nova funcionalidade)  
- `Z` = Versão Patch (correção de bug)
- `-stage` = Sufixo obrigatório para QA

## 🚀 **COMANDOS PARA DEPLOY**

### **1. Para Correções (Patch):**
```bash
pnpm run version:patch
# 0.0.1 → 0.0.2-stage
```

### **2. Para Novas Funcionalidades (Minor):**
```bash
pnpm run version:minor  
# 0.0.1 → 0.1.0-stage
```

### **3. Para Mudanças Importantes (Major):**
```bash
pnpm run version:major
# 0.0.1 → 1.0.0-stage
```

## 🔄 **FLUXO DE DEPLOY SIMPLIFICADO**

### **1. Desenvolver & Testar Localmente**
```bash
# Desenvolver sua feature...
git add .
git commit -m "feat: nova funcionalidade"
```

### **2. Deploy Automático com UM COMANDO**
```bash
# Escolha o tipo apropriado:
pnpm run version:patch   # Para bugs
pnpm run version:minor   # Para features  
pnpm run version:major   # Para breaking changes
```

### **3. ✨ O que acontece automaticamente:**
- ✅ Incrementa a versão
- ✅ Adiciona sufixo `-stage`
- ✅ Faz commit da mudança
- ✅ Cria tag git (ex: `0.1.0-stage`)
- ✅ Push do commit e da tag
- ✅ GitHub Actions detecta a tag e faz deploy
- ✅ Aplicação atualizada no Cloud Run!

## ⚡ **DEPLOY INTELIGENTE**

### **✅ Deploy Acontece Quando:**
- Tag git é criada
- Tag contém sufixo `-stage`
- Push da tag para o repositório

### **⏭️ Deploy é Pulado Quando:**
- Tag não contém sufixo `-stage`
- Push de commits sem tags
- Tags que não seguem o padrão `X.Y.Z-stage`

## 📊 **EXEMPLO PRÁTICO**

```bash
# Estado inicial
current: 0.1.0-stage

# Fazer correção de bug com UM COMANDO
pnpm run version:patch

# ✨ O comando automaticamente:
# 1. Incrementa: 0.1.0 → 0.1.1
# 2. Adiciona sufixo: 0.1.1-stage  
# 3. Commit: "chore: bump version to 0.1.1-stage"
# 4. Cria tag: git tag 0.1.1-stage
# 5. Push: commit + tag para repositório

# GitHub Actions automaticamente:
# 6. Detecta tag 0.1.1-stage
# 7. Builda imagem Docker: gcr.io/fila-digital-qa/fila-api:0.1.1-stage
# 8. Deploy no Cloud Run
# 9. Logs mostram: "📦 Version: 0.1.1-stage"

# 🎉 Deploy completo com 1 comando!
```

## 🎛️ **TAGS DOCKER GERADAS**

Para cada deploy, são criadas 3 tags:
```bash
gcr.io/fila-digital-qa/SERVICE_NAME:0.1.1-stage  # Versão específica
gcr.io/fila-digital-qa/SERVICE_NAME:abc123       # SHA do commit
gcr.io/fila-digital-qa/SERVICE_NAME:latest       # Última versão
```

## 🔍 **VERIFICAR VERSÃO ATUAL**

```bash
# Local
node -p "require('./package.json').version"

# Cloud Run (via logs do GitHub Actions)
# Ou inspecionar o serviço no GCP Console
```

## 💡 **DICAS**

1. **Sempre use os comandos `version:*`** - eles fazem tudo automaticamente
2. **Certifique-se de estar na branch correta** antes de executar
3. **Use semantic versioning** para facilitar o rastreamento
4. **Verifique os logs** do GitHub Actions para confirmar o deploy
5. **Os comandos fazem commit e push automaticamente** - não precisa fazer manualmente!

---

**🎉 Sistema configurado e pronto para uso!**
