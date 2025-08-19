#!/bin/bash

# Script de deploy para frontend Next.js no Cloud Run
# Uso: ./scripts/deploy-prod.sh [PROJECT_ID] [REGION]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações padrão
DEFAULT_PROJECT_ID="fila-digital-qa"
DEFAULT_REGION="us-central1"
SERVICE_NAME="fila-frontend"

# Parâmetros
PROJECT_ID=${1:-$DEFAULT_PROJECT_ID}
REGION=${2:-$DEFAULT_REGION}

echo -e "${BLUE}🚀 Iniciando deploy do Frontend Fila para Cloud Run${NC}"
echo -e "${BLUE}===================================================${NC}"

echo -e "${YELLOW}📋 Configurações:${NC}"
echo -e "  Project ID: ${PROJECT_ID}"
echo -e "  Região: ${REGION}"
echo -e "  Serviço: ${SERVICE_NAME}"
echo ""

# Verificar se gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI não encontrado. Instale o Google Cloud SDK.${NC}"
    exit 1
fi

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não encontrado. Instale o Docker.${NC}"
    exit 1
fi

# Configurar projeto
echo -e "${BLUE}🔧 Configurando projeto...${NC}"
gcloud config set project $PROJECT_ID

# Verificar se as APIs necessárias estão habilitadas
echo -e "${BLUE}🔍 Verificando APIs necessárias...${NC}"
REQUIRED_APIS=(
    "run.googleapis.com"
    "cloudbuild.googleapis.com"
    "containerregistry.googleapis.com"
)

for api in "${REQUIRED_APIS[@]}"; do
    if ! gcloud services list --enabled --filter="name:$api" --format="value(name)" | grep -q "$api"; then
        echo -e "${YELLOW}⚡ Habilitando API: $api${NC}"
        gcloud services enable $api
    else
        echo -e "${GREEN}✅ API já habilitada: $api${NC}"
    fi
done

# Build e push da imagem
echo -e "${BLUE}🏗️ Fazendo build da imagem...${NC}"
IMAGE_TAG="gcr.io/$PROJECT_ID/$SERVICE_NAME:$(date +%Y%m%d-%H%M%S)"
LATEST_TAG="gcr.io/$PROJECT_ID/$SERVICE_NAME:latest"

docker build -t $IMAGE_TAG -t $LATEST_TAG .

echo -e "${BLUE}📤 Fazendo push da imagem...${NC}"
docker push $IMAGE_TAG
docker push $LATEST_TAG

# Deploy no Cloud Run
echo -e "${BLUE}🚀 Fazendo deploy no Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_TAG \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1,NEXT_PUBLIC_API_URL=https://fila-api-397713505626.us-central1.run.app,NEXT_PUBLIC_WS_URL=wss://fila-api-397713505626.us-central1.run.app,NEXT_PUBLIC_APP_NAME="Fila Digital"

# Obter URL do serviço
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)")

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo -e "${GREEN}🌐 URL do frontend: $SERVICE_URL${NC}"
echo -e "${GREEN}🏥 Health check: $SERVICE_URL${NC}"

echo -e "${YELLOW}📝 Configuração:${NC}"
echo -e "  Frontend: $SERVICE_URL"
echo -e "  API: https://fila-api-397713505626.us-central1.run.app"

echo -e "${BLUE}🎉 Frontend da Fila Digital deployado com sucesso!${NC}" 