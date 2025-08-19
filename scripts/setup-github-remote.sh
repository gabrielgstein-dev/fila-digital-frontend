#!/bin/bash

# Script para configurar o remote do GitHub com a configuração SSH correta

echo "🔧 Configurando remote do GitHub para fila-digital-frontend..."

# Verificar se estamos em um repositório git
if [ ! -d ".git" ]; then
    echo "❌ Erro: Este não é um repositório git. Execute 'git init' primeiro."
    exit 1
fi

# Remover remote origin se existir
if git remote get-url origin &>/dev/null; then
    echo "📝 Removendo remote origin existente..."
    git remote remove origin
fi

# Adicionar o novo remote usando a configuração SSH
echo "🔗 Adicionando remote origin com configuração SSH..."
git remote add origin fila-frontend:gabrielgstein-dev/fila-digital-frontend.git

# Verificar se o remote foi adicionado corretamente
if git remote get-url origin &>/dev/null; then
    echo "✅ Remote configurado com sucesso!"
    echo "📍 Remote URL: $(git remote get-url origin)"
    
    # Testar conexão SSH
    echo "🧪 Testando conexão SSH..."
    if ssh -T fila-frontend &>/dev/null; then
        echo "✅ Conexão SSH funcionando!"
    else
        echo "⚠️  Aviso: Não foi possível testar a conexão SSH"
        echo "    Certifique-se de que a chave SSH está configurada corretamente"
    fi
    
    echo ""
    echo "🚀 Agora você pode fazer push para o GitHub:"
    echo "   git add ."
    echo "   git commit -m 'Configurar GitHub Actions para deploy'"
    echo "   git push -u origin main"
    
else
    echo "❌ Erro: Falha ao configurar o remote"
    exit 1
fi 