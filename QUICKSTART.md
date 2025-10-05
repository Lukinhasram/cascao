# 🚀 Quick Deployment Guide

## What You Need

1. **Google Cloud Account** - Sign up at [cloud.google.com](https://cloud.google.com) (free tier available)
2. **Google Cloud CLI** - Install instructions below
3. **5-10 minutes** - That's it!

## Step-by-Step Deployment

### 1. Install Google Cloud CLI

```bash
# Install
curl https://sdk.cloud.google.com | bash

# Restart your terminal, then initialize
gcloud init
```

Follow the prompts to:
- Login to your Google account
- Create or select a project
- Choose a default region (e.g., `us-central1`)

### 2. Enable Required Services

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 3. Deploy Everything (Automated)

From the project root directory:

```bash
./deploy.sh
```

This script will:
- ✅ Deploy the backend
- ✅ Deploy the frontend
- ✅ Configure the API URL automatically
- ✅ Give you the public URLs

### 4. Update CORS (Final Step)

After deployment, you'll get instructions like:

```bash
# The script will tell you to add this to backend/.env:
CORS_ORIGINS=http://localhost:5173,https://cascao-frontend-xxxxx-uc.a.run.app

# Then redeploy backend:
cd backend
gcloud run deploy cascao-backend --source . --region us-central1
```

### 5. Share Your App! 🎉

Your frontend URL will be something like:
```
https://cascao-frontend-xxxxx-uc.a.run.app
```

Share it with anyone - no domain needed!

---

## Manual Deployment (Alternative)

If you prefer to deploy manually:

### Backend Only:
```bash
cd backend
gcloud run deploy cascao-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

### Frontend Only:
```bash
# First, update frontend/.env.production with your backend URL
echo "VITE_API_BASE_URL=https://your-backend-url" > frontend/.env.production

cd frontend
gcloud run deploy cascao-frontend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Updating Your App

Made changes? Just redeploy:

```bash
# Backend changes
cd backend
gcloud run deploy cascao-backend --source .

# Frontend changes
cd frontend
gcloud run deploy cascao-frontend --source .
```

---

## Cost 💰

**Google Cloud Run Free Tier:**
- 2 million requests/month FREE
- 360,000 GB-seconds memory FREE
- 180,000 vCPU-seconds FREE

Your app will likely stay in the free tier! Beyond that, it's ~$0.40 per million requests.

---

## View Logs

```bash
# Backend logs
gcloud run logs read cascao-backend --limit 50

# Frontend logs
gcloud run logs read cascao-frontend --limit 50

# Or visit: https://console.cloud.google.com/run
```

---

## Troubleshooting

**Problem: "Project not found"**
```bash
gcloud config set project YOUR_PROJECT_ID
```

**Problem: CORS errors**
- Make sure frontend URL is in `backend/.env` CORS_ORIGINS
- Redeploy backend after updating

**Problem: Build fails**
- Check logs with `gcloud run logs read`
- Verify all files are present (Dockerfile, requirements.txt, etc.)

**Problem: Can't install gcloud CLI**
- Visit: https://cloud.google.com/sdk/docs/install
- Choose installation method for your OS

---

## Support

For detailed information, see [DEPLOYMENT.md](./DEPLOYMENT.md)

**Need Help?**
- Google Cloud Run Docs: https://cloud.google.com/run/docs
- Stack Overflow: Tag with `google-cloud-run`

---

## What Happens During Deployment?

1. **Build**: Google Cloud Build creates a Docker container from your code
2. **Deploy**: Container is deployed to Cloud Run
3. **URL**: You get a public HTTPS URL instantly
4. **Scale**: Automatically scales from 0 to 1000+ instances based on traffic
5. **Sleep**: When not in use, scales to 0 (no cost!)

That's it! Your app is now live and accessible worldwide! 🌍✨
