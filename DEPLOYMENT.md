# Deployment Guide - Google Cloud Run

This guide will help you deploy the Cascão application to Google Cloud Run.

## Prerequisites

1. **Google Cloud Account**: Create one at [cloud.google.com](https://cloud.google.com)
2. **Google Cloud CLI**: Install it:
   ```bash
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```
3. **Enable Billing**: Make sure billing is enabled (free tier available)

## Step 1: Initial Setup

1. **Login to Google Cloud**:
   ```bash
   gcloud auth login
   ```

2. **Create a new project** (or use existing):
   ```bash
   gcloud projects create cascao-app --name="Cascão"
   gcloud config set project cascao-app
   ```

3. **Enable required APIs**:
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

## Step 2: Deploy Backend

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy cascao-backend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 512Mi \
     --timeout 60s
   ```

3. **Note the backend URL** displayed after deployment:
   ```
   Service URL: https://cascao-backend-xxxxx-uc.a.run.app
   ```

## Step 3: Update Frontend Configuration

1. **Update the API URL** in `frontend/src/services/climateService.ts`:
   
   Replace:
   ```typescript
   const API_BASE_URL = 'http://localhost:8000';
   ```
   
   With your backend URL:
   ```typescript
   const API_BASE_URL = 'https://cascao-backend-xxxxx-uc.a.run.app';
   ```

2. **Update CORS in backend** (`backend/main.py`):
   
   Add your frontend URL to allowed origins:
   ```python
   origins = [
       "https://cascao-frontend-xxxxx-uc.a.run.app",  # Add this after frontend deployment
       "http://localhost:5173",
   ]
   ```

## Step 4: Deploy Frontend

1. **Navigate to frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy cascao-frontend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 256Mi
   ```

3. **Note the frontend URL** displayed after deployment:
   ```
   Service URL: https://cascao-frontend-xxxxx-uc.a.run.app
   ```

## Step 5: Final CORS Configuration

1. **Update backend CORS** with the actual frontend URL from Step 4
2. **Redeploy backend**:
   ```bash
   cd ../backend
   gcloud run deploy cascao-backend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

## Step 6: Test Your Application

Visit your frontend URL:
```
https://cascao-frontend-xxxxx-uc.a.run.app
```

Share this URL with anyone to give them access! 🎉

## Updating Your Application

Whenever you make changes:

**Backend changes**:
```bash
cd backend
gcloud run deploy cascao-backend --source .
```

**Frontend changes**:
```bash
cd frontend
gcloud run deploy cascao-frontend --source .
```

## Monitoring and Logs

**View logs**:
```bash
gcloud run logs read cascao-backend --limit 50
gcloud run logs read cascao-frontend --limit 50
```

**View in browser**:
Visit [Google Cloud Console](https://console.cloud.google.com/run)

## Cost Estimate

Google Cloud Run Free Tier includes:
- 2 million requests per month
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds

Your application will likely stay in the free tier with low-medium traffic! 💰

## Troubleshooting

**Issue: CORS errors**
- Make sure frontend URL is in backend CORS origins
- Redeploy backend after updating CORS

**Issue: Build failures**
- Check logs: `gcloud run logs read cascao-backend`
- Verify all dependencies are in requirements.txt

**Issue: Application not responding**
- Check if services are running in Cloud Console
- Verify memory/timeout settings are adequate

## Custom Domain (Optional)

To use your own domain:

1. **Map domain**:
   ```bash
   gcloud run domain-mappings create \
     --service cascao-frontend \
     --domain your-domain.com \
     --region us-central1
   ```

2. **Update DNS** records as instructed

3. **HTTPS is automatic** - Google provides free SSL certificates!

## Support

For issues or questions:
- Google Cloud Run Docs: https://cloud.google.com/run/docs
- Stack Overflow: Tag with `google-cloud-run`
