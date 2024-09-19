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
1.
2.
3.
