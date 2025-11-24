# Deployment Guide

This document provides instructions for deploying the Project Management application to production.

## Prerequisites

- GitHub account (for CI/CD)
- Deployment platform account (Railway, Vercel, AWS, etc.)
- Production database (MySQL)

## CI/CD Pipeline

The project includes a GitHub Actions workflow that automatically:

1. **Runs tests** on every push and pull request
2. **Builds** both backend and frontend
3. **Deploys** to production on main branch

### Pipeline Stages

```
┌─────────────┐
│ Code Push   │
└──────┬──────┘
       │
       ├─────────────────┬─────────────────┐
       ▼                 ▼                 ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Lint Check  │  │Backend Tests│  │Frontend Tests│
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                 │
       └────────────────┴─────────────────┘
                        │
                        ▼
                ┌─────────────┐
                │    Build    │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │   Deploy    │
                └─────────────┘
```

## Deployment Options

### Option 1: Railway (Recommended for Full-Stack)

**Advantages:**

- Automatic MySQL database provisioning
- Simple GitHub integration
- Environment variable management
- Free tier available

**Steps:**

1. **Create Railway Account**: https://railway.app/

2. **Deploy Backend:**

   ```bash
   # Install Railway CLI
   npm i -g @railway/cli

   # Login
   railway login

   # Link project
   cd backend
   railway init

   # Add MySQL database
   railway add
   # Select MySQL from the list

   # Set environment variables
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your-production-secret
   railway variables set CORS_ORIGIN=https://your-frontend.vercel.app

   # Deploy
   railway up
   ```

3. **Configure GitHub Action:**
   - Add `RAILWAY_TOKEN` to GitHub Secrets
   - Uncomment Railway deployment step in `.github/workflows/ci.yml`

### Option 2: Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**

1. **Install Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend:**

   ```bash
   cd frontend
   vercel --prod
   ```

3. **Environment Variables in Vercel:**
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```

**Backend on Railway:** (Follow Option 1 steps)

### Option 3: AWS (Advanced)

**Services Required:**

- EC2 for backend
- RDS for MySQL
- S3 + CloudFront for frontend
- Route53 for DNS

**Steps:**

1. **Database (RDS):**

   - Create MySQL instance
   - Configure security groups
   - Note connection details

2. **Backend (EC2):**

   ```bash
   # SSH to EC2 instance
   ssh -i your-key.pem ubuntu@your-ec2-ip

   # Install Node.js 22
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Clone repository
   git clone your-repo-url
   cd backend

   # Install dependencies
   npm ci --production

   # Build
   npm run build

   # Install PM2
   sudo npm i -g pm2

   # Start with PM2
   pm2 start dist/index.js --name api
   pm2 startup
   pm2 save
   ```

3. **Frontend (S3 + CloudFront):**

   ```bash
   # Build frontend
   cd frontend
   npm run build

   # Upload to S3
   aws s3 sync dist/ s3://your-bucket-name/

   # Invalidate CloudFront cache
   aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
   ```

## Environment Variables

### Backend Production Variables

```env
# Server
PORT=3000
NODE_ENV=production

# Database
DB_HOST=your-production-db-host
DB_PORT=3306
DB_NAME=project_management
DB_USER=your-db-user
DB_PASSWORD=your-secure-db-password

# Security
JWT_SECRET=your-very-secure-random-secret-key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Production Variables

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_NODE_ENV=production
```

## Database Migration

Before deploying, ensure database is migrated:

```bash
cd backend
npm run migrate
```

For production, you can run migrations as part of deployment:

```bash
# In your deployment script
npm run build
npm run migrate
npm start
```

## Health Checks

The backend includes a health check endpoint:

```
GET /api/health
```

Use this for:

- Load balancer health checks
- Monitoring services
- Deployment verification

## Monitoring

### Recommended Tools

1. **Application Performance:**

   - New Relic
   - Datadog
   - PM2 Plus

2. **Error Tracking:**

   - Sentry
   - Rollbar

3. **Logs:**
   - Papertrail
   - LogDNA
   - CloudWatch

### Basic Monitoring Setup

```javascript
// Add to backend/src/index.ts
import * as Sentry from "@sentry/node";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });
}
```

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use HTTPS in production
- [ ] Enable CORS only for your frontend domain
- [ ] Set secure database credentials
- [ ] Enable database SSL connection
- [ ] Configure rate limiting
- [ ] Set up firewall rules
- [ ] Enable automatic security updates
- [ ] Regular dependency updates
- [ ] Database backups configured

## Quick Deploy Commands

```bash
# Build everything locally
npm run build --workspaces

# Test before deploying
npm test --workspaces

# Deploy with Railway CLI
railway up

# Deploy with Vercel CLI
vercel --prod

# Check deployment status
railway status
vercel ls
```

## Rollback Procedure

If deployment fails:

```bash
# Railway
railway rollback

# Vercel
vercel rollback

# Manual rollback
git revert HEAD
git push origin main
```

## Post-Deployment Verification

1. **Check Backend Health:**

   ```bash
   curl https://your-backend.com/api/health
   ```

2. **Test Authentication:**

   ```bash
   curl -X POST https://your-backend.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

3. **Check Frontend:**

   - Open browser to frontend URL
   - Test login flow
   - Verify API connectivity

4. **Monitor Logs:**
   ```bash
   railway logs
   # or
   pm2 logs api
   ```

## Continuous Deployment

The CI/CD pipeline automatically deploys when:

- Tests pass ✅
- Code is pushed to `main` branch
- Build succeeds

To manually trigger deployment:

```bash
# Push to main
git push origin main

# Or create a release tag
git tag v1.0.0
git push origin v1.0.0
```

## Cost Estimation

### Railway (Hobby Plan)

- Database: $5/month
- Backend: $5/month
- **Total: ~$10/month**

### Vercel + Railway

- Vercel: Free
- Railway Backend + DB: $10/month
- **Total: ~$10/month**

### AWS (Basic Setup)

- EC2 t3.micro: $10/month
- RDS db.t3.micro: $15/month
- S3 + CloudFront: $1-5/month
- **Total: ~$26-30/month**

## Support

For deployment issues:

- Check GitHub Actions logs
- Review platform-specific documentation
- Check application logs
- Verify environment variables
