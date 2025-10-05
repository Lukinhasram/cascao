#!/bin/bash
# Deployment script for Google Cloud Run

set -e

echo "Climate Analysis Deployment Script"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check gcloud CLI
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Google Cloud CLI not installed${NC}"
    echo "Install: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}No project set${NC}"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

REGION="${REGION:-us-central1}"

echo -e "${GREEN}Project: $PROJECT_ID${NC}"
echo -e "${GREEN}Region: $REGION${NC}"
echo ""

# Deploy backend
echo -e "${YELLOW}Deploying backend...${NC}"
cd backend
gcloud run deploy cascao-backend \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --memory 512Mi \
  --timeout 60s \
  --set-env-vars "START_YEAR=1981,CORS_ORIGINS=http://localhost:5173;http://localhost:5174;https://cascao-frontend-880627998185.us-central1.run.app" \
  --quiet

BACKEND_URL=$(gcloud run services describe cascao-backend --region $REGION --format='value(status.url)')
echo -e "${GREEN}Backend: $BACKEND_URL${NC}"
echo ""

# Deploy frontend  
cd ../frontend
echo -e "${YELLOW}Deploying frontend...${NC}"
gcloud run deploy cascao-frontend \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --memory 256Mi \
  --quiet

FRONTEND_URL=$(gcloud run services describe cascao-frontend --region $REGION --format='value(status.url)')
echo -e "${GREEN}Frontend: $FRONTEND_URL${NC}"

cd ..

# Summary
echo ""
echo -e "${GREEN}Deployment Complete!${NC}"
echo "================================"
echo -e "Backend:  ${GREEN}$BACKEND_URL${NC}"
echo -e "Frontend: ${GREEN}$FRONTEND_URL${NC}"
echo ""
echo -e "${YELLOW}Important Next Steps:${NC}"
echo "1. Update backend/config.py CORS_ORIGINS with: $FRONTEND_URL"
echo "2. Update frontend/src/services/climateService.ts API_BASE_URL with: $BACKEND_URL"
echo "3. Redeploy both services"
echo ""
echo -e "${GREEN}Share: $FRONTEND_URL${NC}"
