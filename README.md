# CS360 1/2567 Term Project: Food Advisor
## Group Information
- **Group Name:** QWERTYUIOP
## Members
| Name | Student ID |
|------------------------------- ---|-----------------|

| Kanchanop Buarod | 6509650229 |

| Thantawan Chitsan | 6509650427 |

| Haritch Utchavanich | 6509650757 |

| Waradis Kamolwach | 6509650088 |

| Primchawat Areerat | 6309651039 |

## Project Goal
[Briefly describe the purpose and concept of your web application. What problem does it solve or what opportunity does it create?]
### Features
- [Feature 1: e.g., User Registration and Authentication]
- [Feature 2: e.g., CRUD operations for managing products]
- [Feature 3: e.g., Real-time notifications using WebSocket]
- [Feature 4: e.g., Integration with third-party APIs]
- [Feature 5: e.g., Responsive design for mobile and desktop users]
### Technologies Used
- **Backend:** Strapi V4
- **Frontend:** React.js 
- **Hosting/Deployment:** AWS EC2
- **Database:** SQLite
## How to deploy and run the project manually
### Prerequisites

- **AWS EC2 Instance**: Launch an Amazon Linux instance.
- **Security Group Settings**:
  - Allow inbound traffic on ports `3000` and `1337` from your public IP address.
- **SSH Access**: Ensure you can connect to your EC2 instance via SSH.

### Steps

#### 1. Update the System

Connect to your EC2 instance via SSH and run:

```bash
sudo yum update -y
```

#### 2. Install Node.js using Fast Node Manager (fnm)

Install `fnm`:

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

Activate `fnm`:

```bash
source ~/.bashrc
```

Install Node.js version 16:

```bash
fnm use --install-if-missing 16
```

Verify the installation:

```bash
node -v  # Should output v16.20.2
npm -v   # Should output 8.19.4
```

#### 3. Install Git

```bash
sudo yum install git -y
```

#### 4. Install Yarn

```bash
npm install -g yarn
```

#### 5. Clone the Repository

```bash
git clone https://github.com/Kanchanop6509650229/CS360-QWERTYUIOP.git
```

#### 6. Set Up the API

Navigate to the API directory:

```bash
cd CS360-QWERTYUIOP/api
```

Install dependencies, seed the database, and start the development server:

```bash
yarn && yarn seed && yarn develop
```

#### 7. Configure Environment Variables for the API

Create or edit the `.env` file:

```bash
nano .env
```

Add the following configurations:

```env
ADMIN_JWT_SECRET=Your_Admin_JWT_Secret
JWT_SECRET=Your_JWT_Secret
STRAPI_ADMIN_CLIENT_URL=http://Your_Public_IP:3000
STRAPI_ADMIN_CLIENT_PREVIEW_SECRET=Your_Preview_Secret
```

- Replace `Your_Admin_JWT_Secret` and `Your_JWT_Secret` with secure, randomly generated strings.
- Replace `Your_Public_IP` with your EC2 instance's public IP address.
- Replace `Your_Preview_Secret` with another secure, randomly generated string.

#### 8. Access the Strapi Admin Panel

Open your web browser and navigate to:

```
http://Your_Public_IP:1337/admin
```
##### Credentials
###### Super Admin:
- **Email**: `admin@strapidemo.com`
- **Password**: `welcomeToStrapi123`

###### Editor:
- **Email**: `editor@strapidemo.com`
- **Password**: `welcomeToStrapi123`

###### Author:
- **Email**: `author@strapidemo.com`
- **Password**: `welcomeToStrapi123


#### 9. Set Up the Client

Open a new SSH session to your EC2 instance (keep the previous one running).

Navigate to the client directory:

```bash
cd CS360-QWERTYUIOP/client
```

Install dependencies and start the development server:

```bash
yarn && yarn dev
```

#### 10. Configure Environment Variables for the Client

Edit the `.env.development` file:

```bash
nano .env.development
```

Add the following configurations:

```env
NEXT_PUBLIC_API_URL=http://Your_Public_IP:1337
PREVIEW_SECRET=Your_Preview_Secret
```

- Ensure `Your_Public_IP` matches the one used earlier.
- Use the same `Your_Preview_Secret` as set in the API configuration.

#### 11. Install PM2 Process Manager

Navigate back to your home directory:

```bash
cd ~
```

Install PM2 globally:

```bash
npm install pm2@latest -g
```

Initialize PM2:

```bash
pm2 init
```

#### 12. Configure PM2

Edit the `ecosystem.config.js` file:

```bash
nano ecosystem.config.js
```

Modify the file with the following content:

```javascript
module.exports = {
  apps: [
    {
      name: 'api',
      cwd: '/home/ec2-user/CS360-QWERTYUIOP/api',
      script: 'yarn',
      args: 'develop',
      env: {
        ADMIN_JWT_SECRET: 'Your_Admin_JWT_Secret',
        JWT_SECRET: 'Your_JWT_Secret',
        STRAPI_ADMIN_CLIENT_URL: 'http://Your_Public_IP:3000',
        STRAPI_ADMIN_CLIENT_PREVIEW_SECRET: 'Your_Preview_Secret',
      },
    },
    {
      name: 'client',
      cwd: '/home/ec2-user/CS360-QWERTYUIOP/client',
      script: 'yarn',
      args: 'dev',
      env: {
        NEXT_PUBLIC_API_URL: 'http://Your_Public_IP:1337',
        PREVIEW_SECRET: 'Your_Preview_Secret',
      },
    },
  ],
};
```

- Ensure the `cwd` paths point to the correct directories.
- Replace all placeholders with the same values as before.

#### 13. Start the Applications with PM2

```bash
pm2 start ecosystem.config.js
```

#### 14. Verify the Applications are Running

Check the status of your applications:

```bash
pm2 status
```

#### 15. Access the Client Application

Open your web browser and navigate to:

```
http://Your_Public_IP:3000
```


## How to deploy and run the project using the provided bash script [Specify the bash script path in the repo]
#### 1.Locate to bash script file
```
cd /CS360-QWERTYUIOP/script
```

#### 2.Change the file permissions to make it executable as a program.
```
chmod +x deploy.sh
```

#### 3.Run bash script file
```
./deploy.sh
```

### If you don't have bash script file
#### 1. Create bash script file
```
touch deploy.sh
```

#### 2. Put the code into the bash script file
```
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
```
#### 3.Save and exit bash script file
```
ctrl o to save the bash script file
ctrl x to exit the bash script file
```
#### 4.Change the file permissions to make it executable as a program.
```
chmod +x YOUR_BASH_SCRIPT_FILE
```
#### 5.Run your bash script file
```
./YOUR_BASH_SCRIPT_FILE
```