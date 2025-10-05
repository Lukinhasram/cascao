#!/bin/bash
# Quick deployment script for Google Cloud Run

set -e

echo "🚀 Cascão Deployment Script"
echo "============================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud CLI is not installed${NC}"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo -e "${GREEN}✅ Google Cloud CLI found${NC}"
echo ""

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No project set${NC}"
    echo "Please run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo -e "📋 Using project: ${GREEN}$PROJECT_ID${NC}"
echo ""

# Choose region
REGION="${REGION:-us-central1}"
echo -e "🌍 Deploying to region: ${GREEN}$REGION${NC}"
echo ""

# Deploy backend
echo -e "${YELLOW}📦 Deploying backend...${NC}"
cd backend

gcloud run deploy cascao-backend \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 512Mi \
  --timeout 60s \
  --quiet

BACKEND_URL=$(gcloud run services describe cascao-backend --region $REGION --format='value(status.url)')
echo -e "${GREEN}✅ Backend deployed at: $BACKEND_URL${NC}"
echo ""

cd ..

# Ask if user wants to update frontend configuration
echo -e "${YELLOW}⚙️  Updating frontend configuration...${NC}"
echo "VITE_API_BASE_URL=$BACKEND_URL" > frontend/.env.production

# Deploy frontend
echo -e "${YELLOW}📦 Deploying frontend...${NC}"
cd frontend

gcloud run deploy cascao-frontend \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 256Mi \
  --quiet

FRONTEND_URL=$(gcloud run services describe cascao-frontend --region $REGION --format='value(status.url)')
echo -e "${GREEN}✅ Frontend deployed at: $FRONTEND_URL${NC}"
echo ""

cd ..

# Summary
echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "================================"
echo -e "Backend URL:  ${GREEN}$BACKEND_URL${NC}"
echo -e "Frontend URL: ${GREEN}$FRONTEND_URL${NC}"
echo ""
echo -e "${YELLOW}⚠️  Important: Update CORS settings${NC}"
echo "Add the following to your backend/.env file:"
echo "CORS_ORIGINS=http://localhost:5173,$FRONTEND_URL"
echo ""
echo "Then redeploy the backend:"
echo "cd backend && gcloud run deploy cascao-backend --source . --region $REGION"
echo ""
echo -e "${GREEN}✨ Share your app: $FRONTEND_URL${NC}"
