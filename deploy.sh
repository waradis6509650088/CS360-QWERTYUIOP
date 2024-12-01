#!/bin/bash

# Get public IP address for configuration
PUBLIC_IP=$(curl -s ifconfig.me)

# Core configuration
REPO_URL="https://github.com/Kanchanop6509650229/CS360-QWERTYUIOP.git"
BASE_DIR="/home/ec2-user/CS360-QWERTYUIOP"
API_DIR="$BASE_DIR/api"
CLIENT_DIR="$BASE_DIR/client"

# Generate security tokens
PREVIEW_SECRET=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)

# Environment configuration
STRAPI_URL="http://$PUBLIC_IP:3000"
API_URL="http://$PUBLIC_IP:1337"

function check_command() {
    command -v "$1" >/dev/null 2>&1
}

echo "Starting system update..."
sudo yum update -y

# Node.js setup
if ! check_command node; then
    cd ~
    curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
    sudo yum install -y nodejs
    echo "Node.js $(node -v) installed"
fi

# Git setup
if ! check_command git; then
    sudo yum install git -y
fi

# Yarn setup
if ! check_command yarn; then
    sudo npm install -g yarn
fi

# Project setup
if [ ! -d "$BASE_DIR" ]; then
    git clone $REPO_URL
fi

# API configuration
cd $API_DIR
if [ ! -d "node_modules" ]; then
    yarn --force && yarn seed
fi

if [ ! -f ".env" ]; then
    echo "Error: Missing .env file in API directory"
    exit 1
fi

# Load API environment configuration
ADMIN_JWT_SECRET=$(grep '^ADMIN_JWT_SECRET=' .env | cut -d '=' -f2-)
if [ -z "$ADMIN_JWT_SECRET" ]; then
    echo "Error: Missing ADMIN_JWT_SECRET in .env"
    exit 1
fi

# Update API environment
cat > ".env" <<EOF
ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET
JWT_SECRET=$JWT_SECRET
STRAPI_ADMIN_CLIENT_URL=$STRAPI_URL
STRAPI_ADMIN_CLIENT_PREVIEW_SECRET=$PREVIEW_SECRET
EOF

# Client configuration
cd $CLIENT_DIR
if [ ! -d "node_modules" ]; then
    yarn --force
fi

if [ ! -f ".env.development" ]; then
    echo "Error: Missing .env.development file in client directory"
    exit 1
fi

# Update client environment configuration
sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=$API_URL|" .env.development

# PM2 process manager setup
cd ~
if ! check_command pm2; then
    sudo npm install pm2@latest -g
fi

# Create PM2 ecosystem configuration
cat > "ecosystem.config.js" <<EOF
module.exports = {
  apps: [{
    name: 'api',
    cwd: '${API_DIR}',
    script: 'yarn',
    args: 'develop',
    env: {
      ADMIN_JWT_SECRET: '${ADMIN_JWT_SECRET}',
      JWT_SECRET: '${JWT_SECRET}',
      STRAPI_ADMIN_CLIENT_URL: '${STRAPI_URL}',
      STRAPI_ADMIN_CLIENT_PREVIEW_SECRET: '${PREVIEW_SECRET}'
    }
  }, {
    name: 'client',
    cwd: '${CLIENT_DIR}',
    script: 'yarn',
    args: 'dev',
    env: {
      NEXT_PUBLIC_API_URL: '${API_URL}',
      PREVIEW_SECRET: '${PREVIEW_SECRET}'
    }
  }]
};
EOF

# Application startup
pm2 describe api >/dev/null 2>&1 && pm2 describe client >/dev/null 2>&1
if [ $? -ne 0 ]; then
    pm2 start ecosystem.config.js
fi

pm2 save

echo "
Deployment completed successfully!
Admin panel: http://$PUBLIC_IP:1337/admin
Client application: http://$PUBLIC_IP:3000
Monitor status: pm2 status"