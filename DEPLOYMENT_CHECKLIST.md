# 🚀 Deployment Checklist

Use this checklist to ensure smooth deployment!

## Pre-Deployment Checklist

### ☐ Google Cloud Setup
- [ ] Google Cloud account created ([cloud.google.com](https://cloud.google.com))
- [ ] Billing enabled (free tier available)
- [ ] Google Cloud CLI installed
- [ ] Logged in: `gcloud auth login`
- [ ] Project created/selected: `gcloud config set project YOUR_PROJECT`

### ☐ Enable Services
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

## Deployment Steps

### Option A: Automated (Easiest!)
- [ ] Run: `./deploy.sh`
- [ ] Wait for completion (5-10 minutes)
- [ ] Note the frontend URL
- [ ] Note the backend URL
- [ ] Follow the CORS update instructions shown
- [ ] Test the app!

### Option B: Manual

#### Backend Deployment
- [ ] Navigate to backend: `cd backend`
- [ ] Deploy: `gcloud run deploy cascao-backend --source . --region us-central1 --allow-unauthenticated`
- [ ] Copy the backend URL shown
- [ ] Return to root: `cd ..`

#### Frontend Configuration
- [ ] Update `frontend/.env.production`:
  ```
  VITE_API_BASE_URL=YOUR_BACKEND_URL_HERE
  ```

#### Frontend Deployment
- [ ] Navigate to frontend: `cd frontend`
- [ ] Deploy: `gcloud run deploy cascao-frontend --source . --region us-central1 --allow-unauthenticated`
- [ ] Copy the frontend URL shown
- [ ] Return to root: `cd ..`

#### CORS Update
- [ ] Update `backend/.env` or create it:
  ```
  CORS_ORIGINS=http://localhost:5173,YOUR_FRONTEND_URL_HERE
  ```
- [ ] Redeploy backend: `cd backend && gcloud run deploy cascao-backend --source .`

## Post-Deployment Verification

### ☐ Test Backend
- [ ] Visit: `https://YOUR_BACKEND_URL/health`
- [ ] Should return: `{"status": "healthy"}`

### ☐ Test Frontend
- [ ] Visit: `https://YOUR_FRONTEND_URL`
- [ ] UI loads correctly
- [ ] Map is visible
- [ ] Can select location
- [ ] Can select date

### ☐ Test Full Integration
- [ ] Select a location on the map
- [ ] Select a date
- [ ] Set ideal preferences
- [ ] Click "Analyze Climate"
- [ ] Results display correctly
- [ ] No CORS errors in browser console (F12)

## Troubleshooting

### If Backend Doesn't Deploy
- [ ] Check `backend/requirements.txt` exists
- [ ] Check `backend/Dockerfile` exists
- [ ] View logs: `gcloud run logs read cascao-backend`

### If Frontend Doesn't Deploy
- [ ] Check `frontend/package.json` exists
- [ ] Check `frontend/Dockerfile` exists
- [ ] Check `frontend/nginx.conf` exists
- [ ] View logs: `gcloud run logs read cascao-frontend`

### If CORS Errors Occur
- [ ] Verify frontend URL is in `backend/.env` CORS_ORIGINS
- [ ] Verify backend was redeployed after CORS update
- [ ] Check browser console (F12) for exact error
- [ ] Backend logs: `gcloud run logs read cascao-backend`

### If API Calls Fail
- [ ] Check frontend is using correct backend URL
- [ ] Check `frontend/.env.production` has correct URL
- [ ] Verify backend health: `curl https://YOUR_BACKEND_URL/health`
- [ ] Check network tab in browser (F12)

## Success Indicators

✅ Backend health check returns healthy  
✅ Frontend loads without errors  
✅ Map displays correctly  
✅ Climate analysis returns data  
✅ No console errors  
✅ App is accessible from any device  

## Share Your App

Once all checks pass:
- 🌐 Share URL: `https://YOUR_FRONTEND_URL`
- 📱 Works on mobile devices
- 🖥️ Works on desktop browsers
- 🌍 Accessible worldwide

## URLs to Save

```
Backend:  https://cascao-backend-xxxxx-uc.a.run.app
Frontend: https://cascao-frontend-xxxxx-uc.a.run.app
Console:  https://console.cloud.google.com/run
```

## Need Help?

- [ ] Checked `QUICKSTART.md`
- [ ] Checked `DEPLOYMENT.md`
- [ ] Viewed logs with `gcloud run logs read`
- [ ] Checked [Cloud Run documentation](https://cloud.google.com/run/docs)

---

**Congratulations!** 🎉 Once all items are checked, your app is live!
