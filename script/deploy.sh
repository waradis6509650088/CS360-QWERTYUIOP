#!/bin/bash

PUBLIC_IP=$(curl -s ifconfig.me) # Public ipv4 address

GITHUB_REPO_URL="https://github.com/Kanchanop6509650229/CS360-QWERTYUIOP.git" # Github Repository

BASE_DIR="/home/ec2-user/CS360-QWERTYUIOP" # Repository directory
API_DIR="$BASE_DIR/api" # Api directory
CLIENT_DIR="$BASE_DIR/client" # Client directory
STRAPI_ADMIN_CLIENT_PREVIEW_SECRET=$(openssl rand -hex 32) # Generate strapi admin client preview secrect token
STRAPI_ADMIN_CLIENT_URL="http://$PUBLIC_IP:3000" # Public IPv4 address and port
JWT_SECRET=$(openssl rand -hex 32) # Generate jwt secret token
NEXT_PUBLIC_API_URL="http://$PUBLIC_IP:1337" # Public IPv4 and port

# Check if the command is already exists
function check_command() {
    command -v "$1" >/dev/null 2>&1
}

# Updatig the system
echo "Updating the system..."
sudo yum update -y

# Installing Node
echo "Installing Node..."
if check_command node; then
    echo "Node is already installed."
else
    cd ~
    echo "Setting up Node.js repository..."
    curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
    echo "Installing Node.js..."
    sudo yum install -y nodejs
    echo "Node.js version: $(node -v)"
    echo "npm version: $(npm -v)"
fi

# Installing Git
echo "Installing Git..."
if check_command git; then
    echo "Git is already installed."
else
    cd ~
    sudo yum install git -y
    echo "Git version: $(git -v)"
fi

# Installing Yarn
echo "Installing Yarn..."
if check_command yarn; then
    echo "Yarn is already installed."
else
    cd ~
    sudo npm install -g yarn
    echo "Yarn version: $(yarn -v)"
fi

# Check if the project repository is already exists
if [ -d "$BASE_DIR" ]; then
    echo "Project directory already exists at $BASE_DIR."
else
    echo "Cloning repository..."
    git clone $GITHUB_REPO_URL
fi

# Setting up the API
echo "Setting up the API..."
cd $API_DIR
if [ -d "node_modules" ]; then #Check if node_modules is already exists
    echo "API dependencies are already installed."
else
    echo "Installing API dependencies..."
    yarn && yarn seed
fi

# Check if .env file is already exists
if [ -f ".env" ]; then
    ADMIN_JWT_SECRET=$(grep '^ADMIN_JWT_SECRET=' .env | cut -d '=' -f2-) # Retrive the value of ADMIN_JWT_SECRET .env to ADMIN_JWT_SECRECT variable

    if [ -z "$ADMIN_JWT_SECRET" ]; then # Check ADMIN_JWT_SECRET is it null
        echo "Error: ADMIN_JWT_SECRET not found in .env file."
        exit 1
    fi

# Add variable to .env file
cat <<EOF >> ".env"
STRAPI_ADMIN_CLIENT_URL=$STRAPI_ADMIN_CLIENT_URL
STRAPI_ADMIN_CLIENT_PREVIEW_SECRET=$STRAPI_ADMIN_CLIENT_PREVIEW_SECRET
EOF

else
    echo "Installation Error. .env file not found. Please install module again."
    exit 1
fi

echo "Setting up the Client..."
# Change directory to /home/ec2-user/CS360-QWERTYUIOP/client
cd $CLIENT_DIR

# Check if node_modules already exists in current directory
if [ -d "node_modules" ]; then
    echo "Client dependencies are already installed."
else
    echo "Installing Client dependencies..."
    yarn
fi

# Check if .env.development is already in client directory
if [ -f ".env.development" ]; then
    PREVIEW_SECRET=$(grep '^PREVIEW_SECRET=' .env.development | cut -d '=' -f2-) # Store variable from PREVIEW_SECRET to PREVIEW_SECRET variable

    if [ -z "$PREVIEW_SECRET" ] ; then # Check is PREVIEW_SECRET is null
        echo "Error: PREVIEW_SECRET not found in .env.development file."
        exit 1
    fi

    sed -i "s|NEXT_PUBLIC_API_URL=http://127.0.0.1:1337|NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" .env.development # Replace NEXT_PUBLIC_API_URL value with the value in the NEXT_PUBLIC_API_URL
else
    echo "Installation Error. .env.development file not found. Please install module again."
    exit 1
fi

# add missing dep
echo 'install missing dependencies'
npm install slugify
npm install kleur


# Installing PM2
echo "Installing PM2..."

# Change directory to base directory
cd ~

# Check is pm2 are already install
if check_command pm2; then
    echo "PM2 is already installed."
else
    sudo npm install pm2@latest -g
fi
pm2 init

# Modify ecosystem.config.js file
if [ -f "ecosystem.config.js" ]; then
cat > "ecosystem.config.js" <<EOL
module.exports = {
  apps: [
    {
      name: 'api',
      cwd: '$API_DIR',
      script: 'yarn',
      args: 'develop',
      env: {
        ADMIN_JWT_SECRET: '$ADMIN_JWT_SECRET',
        JWT_SECRET: '$JWT_SECRET',
        STRAPI_ADMIN_CLIENT_URL: '$STRAPI_ADMIN_CLIENT_URL',
        STRAPI_ADMIN_CLIENT_PREVIEW_SECRET: '$STRAPI_ADMIN_CLIENT_PREVIEW_SECRET',
      },
    },
    {
      name: 'client',
      cwd: '$CLIENT_DIR',
      script: 'yarn',
      args: 'dev',
      env: {
        NEXT_PUBLIC_API_URL: '$NEXT_PUBLIC_API_URL',
        PREVIEW_SECRET: '$PREVIEW_SECRET',
      },
    },
  ],
};
EOL
else
    echo "PM2 Installation Error. ecosystem.config.js file not found. Please install PM2 again."
    exit 1
fi

# Starting applications with PM2
echo "Starting applications with PM2..."

# Verify API and Client functionality
pm2 describe api >/dev/null 2>&1
API_RUNNING=$?
pm2 describe client >/dev/null 2>&1
CLIENT_RUNNING=$?

# Check working status
if [ $API_RUNNING -eq 0 ] && [ $CLIENT_RUNNING -eq 0 ]; then
  echo "Both API and Client applications are already running."
else
    cd ~
    pm2 start ecosystem.config.js
fi

echo "Saving PM2 process list..."
pm2 save

echo "Setup completed successfully!"
echo "You can access the Strapi Admin Panel at http://$PUBLIC_IP:1337/admin"
echo "You can access the Client Application at http://$PUBLIC_IP:3000"
echo "Use 'pm2 status' to check the status of your applications."
