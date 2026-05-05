# 🚀 DEPLOYMENT GUIDE

## Quick Start (Development)

```bash
# 1. Clone & Install
git clone <repository-url>
cd webapp
npm install

# 2. Start Server
npm run clean-port
npm run pm2:start

# 3. Verify
curl http://localhost:3000/api/health
```

Open http://localhost:3000

---

## Production Deployment Options

### Option 1: VPS (DigitalOcean, AWS EC2, Linode)

#### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

#### Step 2: Deploy Application
```bash
# Clone repository
cd /var/www
git clone <repository-url> resumeai
cd resumeai

# Install dependencies
npm install --production

# Start with PM2
pm2 start ecosystem.config.cjs
pm2 startup
pm2 save
```

#### Step 3: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/resumeai
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 10M;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/resumeai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 4: SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

### Option 2: Heroku

#### Step 1: Prepare Application
```bash
# Create Procfile
echo "web: npm start" > Procfile

# Add to git
git add Procfile
git commit -m "Add Procfile for Heroku"
```

#### Step 2: Deploy
```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create resumeai-nlp-parser

# Push
git push heroku main

# Open
heroku open
```

---

### Option 3: Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application
COPY . .

# Create directories
RUN mkdir -p uploads logs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  resumeai:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    restart: unless-stopped
```

#### Deploy
```bash
# Build
docker build -t resumeai .

# Run
docker run -d -p 3000:3000 --name resumeai resumeai

# Or with docker-compose
docker-compose up -d
```

---

### Option 4: AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js resumeai

# Create environment
eb create resumeai-env

# Deploy
eb deploy

# Open
eb open
```

---

## Environment Variables

Create `.env` file (for production):

```env
NODE_ENV=production
PORT=3000
MAX_FILE_SIZE=10485760
ALLOWED_ORIGINS=https://your-domain.com
```

Update `server.js` to use:
```javascript
require('dotenv').config();

const PORT = process.env.PORT || 3000;
```

---

## Monitoring & Maintenance

### PM2 Commands
```bash
# Status
pm2 list
pm2 status resumeai

# Logs
pm2 logs resumeai
pm2 logs resumeai --lines 100

# Restart
pm2 restart resumeai

# Stop
pm2 stop resumeai

# Delete
pm2 delete resumeai

# Monitor
pm2 monit
```

### Performance Monitoring
```bash
# Install PM2 monitoring
pm2 install pm2-server-monit
```

---

## Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Set up firewall (UFW/iptables)
- [ ] Configure rate limiting
- [ ] Add CORS restrictions
- [ ] Set file size limits
- [ ] Enable helmet.js
- [ ] Use environment variables
- [ ] Regular security updates
- [ ] Monitor logs
- [ ] Backup data regularly

---

## Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -i :3000

# Kill process
fuser -k 3000/tcp
```

### PM2 Won't Start
```bash
# Delete all processes
pm2 delete all

# Restart
pm2 start ecosystem.config.cjs

# Check logs
pm2 logs resumeai --err
```

### Nginx 502 Bad Gateway
```bash
# Check if app is running
pm2 status

# Check Nginx config
sudo nginx -t

# Restart services
pm2 restart resumeai
sudo systemctl restart nginx
```

### High Memory Usage
```bash
# Check process
pm2 monit

# Restart if needed
pm2 restart resumeai
```

---

## Backup & Restore

### Backup
```bash
# Backup files
tar -czf resumeai-backup-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=uploads \
  --exclude=logs \
  /var/www/resumeai

# Backup to remote
scp resumeai-backup-*.tar.gz user@backup-server:/backups/
```

### Restore
```bash
# Extract backup
tar -xzf resumeai-backup-20240101.tar.gz

# Install dependencies
cd resumeai
npm install

# Start
pm2 start ecosystem.config.cjs
```

---

## Performance Optimization

### 1. Enable Compression
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Static File Caching
```javascript
app.use(express.static('public', {
  maxAge: '1d',
  etag: true
}));
```

### 3. PM2 Cluster Mode
```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [{
    instances: 'max',
    exec_mode: 'cluster'
  }]
}
```

---

## Support

For deployment issues:
- Check logs: `pm2 logs resumeai`
- Verify server: `curl http://localhost:3000/api/health`
- Review README.md for configuration

---

**Last Updated:** 2026-01-01  
**Version:** 1.0.0
