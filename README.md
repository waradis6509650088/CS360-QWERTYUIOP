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
Foodadvisor is a web application designed to simplify the process of discovering food-related content, such as blog posts, based on the user’s specific preferences. By allowing users to select their favorite food categories, it ensures personalized recommendations, thus enhancing user engagement and satisfaction.

The application addresses the challenge of information overload, particularly in the food industry where users often struggle to find relevant, high-quality content that fits their tastes. By offering a tailored approach, Foodadvisor solves the problem of inefficient food content discovery and creates an opportunity for food bloggers, restaurants, and food enthusiasts to connect in a more meaningful, user-centric way. This results in a better browsing experience, helping users find food inspiration more quickly and easily.

### Features
- **Feature 1**: user is able to choose food categories and location
- **Feature 2**: the application shows relevant blog post according to the user's chosen food categories
- **Feature 3**: the application have a subscription service
- **Feature 4**: the application can show blog post that user choose
- **Feature 5**: the application use CRUD service through Strapi API
### Technologies Used
- **Backend:** Strapi V4
- **Frontend:** NextJS + Tailwind
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


#### 1. Locate to bash script file

```
cd /CS360-QWERTYUIOP/script
```

#### 2. Change the file permissions to make it executable as a program.
```
chmod +x deploy.sh
```

#### 3. Run bash script file
```
./deploy.sh
```

### If you don't have bash script file
#### 1. Create bash script file
```
touch deploy.sh
```

#### 2. Put the code into the bash script file
```bash
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
    yarn --force && yarn seed
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
JWT_SECRET=$JWT_SECRET
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
    yarn --force
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
#### 3. Save and exit bash script file
```
ctrl o to save the bash script file
ctrl x to exit the bash script file
```
#### 4. Change the file permissions to make it executable as a program.
```
chmod +x YOUR_BASH_SCRIPT_FILE
```
#### 5.Run your bash script file
```
./YOUR_BASH_SCRIPT_FILE
```

![Screenshot 2024-09-24 163409](https://github.com/user-attachments/assets/b17ef25c-fe2f-4094-85b5-000cce77acc2)


## Unit and Integration Testing Overview

In this project, we use the following testing tools:

- **Jest**: Primary Testing Framework for Unit Tests
- **Supertest**: For testing HTTP endpoints in Integration Tests
- **Strapi Testing Utils**: For simulating Strapi instance in tests

## Setting Up Tests

Run these commands to set up the testing environment:

```bash
# Install Yarn globally
npm install -g yarn
```

```bash
# Setup API tests
cd /CS360-QWERTYUIOP/api
yarn global add jest
yarn add @babel/runtime
yarn && yarn seed
```

```bash
# Setup Client tests
cd /CS360-QWERTYUIOP/client
yarn
```

## Running Tests

Execute the following commands to run tests:

```bash
cd /CS360-QWERTYUIOP/api
```

```bash
# Run all tests
yarn test

# Run only unit tests
yarn test:unit

# Run only integration tests
yarn test:integration

# Run tests in watch mode
yarn test:watch

# Run tests with coverage report
yarn test:coverage
```

## Test File Structure
### api test
```
api/
├── __tests__/
│   ├── unit/
│   │   └── auth.test.js       # Unit tests 
│   └── integration/
│       └── auth.integration.test.js  # Integration tests 
```
### client test
```
client/
├── __tests__/
│   ├── unit/
│   │   └── addRestaurant.test.js              # unit tests
│   └── integration/
│       └── addRestaurant.integration.test.js  # Integration tests 
```

## Test Coverage

### 1. Unit Tests (auth.test.js)

#### Login Function
```javascript
describe('Login Function', () => {
  it('should successfully login with valid credentials', async () => {
    // Mock server response with JWT and user data
    const mockResponse = {
      jwt: 'mock-token',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      }
    };
    // Test implementation
  });
});
```

Coverage includes:
- POST request to `/api/auth/local`
- JWT token validation
- User data validation

#### Registration Function
```javascript
it('should register within timeout', async () => {
  const startTime = Date.now();
  const result = await register('newuser', 'newuser@example.com', 'password123');
  const endTime = Date.now();
  const executionTime = endTime - startTime;

  expect(executionTime).toBeLessThan(timeout);
  expect(result.jwt).toBe('new-user-token');
  expect(result.user.username).toBe('newuser');
});
```

Coverage includes:
- Registration request to `/api/auth/local/register`
- Performance testing of registration process
- Validation of JWT token and new user data

### 2. Integration Tests (auth.integration.test.js)

#### Authentication Setup
```javascript
beforeAll(async () => {
  strapi = await Strapi().load();
  await strapi.start();
  request = supertest(strapi.server.httpServer);
  
  // Get Authenticated role
  authRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'authenticated' },
  });

  // Create test user
  await strapi.plugins['users-permissions'].services.user.add({
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!',
    job: 'Customer',
    role: authRole.id,
    confirmed: true,
    provider: 'local',
    blocked: false,
  });
}, 30000);
```

Coverage includes:
- Strapi server initialization
- Test user creation
- Roles and permissions configuration

#### Login Endpoint Tests
```javascript
describe('POST /api/auth/local', () => {
  it('should login successfully with valid credentials', async () => {
    const response = await request.post('/api/auth/local').send({
      identifier: 'test@example.com',
      password: 'Password123!',
    });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('jwt');
    expect(response.body).toHaveProperty('user');
  });

  it('should fail login with invalid credentials', async () => {
    const response = await request.post('/api/auth/local').send({
      identifier: 'wrong@email.com',
      password: 'wrongpassword',
    });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
```
### 3. Unit Tests (addRestaurant.test.js)
This test will include all the function from file: `<project folder>/client/pages/restaurant/add/submit.js`

Coverage includes:
- initiate api request
- bad request handling
- input error handling

### 4. Unit Tests (userprofile.test.js)
This test will include all the function from file: `<project folder>/client/pages/userprofile/index.js`

Coverage includes:
- 4.1. Rendering User Profile Information:
   - Verifies that the component correctly renders user profile data, including the username and email.
   - It mocks the `axios.get` request to return predefined user data and checks if the name and email appear on the pages.

- 4.2. Updating User Profile Information:
   - Simulates the user interaction to update their profile information
   - It mocks the `axios.put` request and checks if the correct data is sent in the request.
   - After updating, it verifies that a success toast notification is triggered, indicating that the profile was updated successfully.

- 4.3. Handling API Error:
   - Simulates an error from the API (`axios.get` is mocked to reject with an error).
   - The test checks if the error is logged in the console correctly.

Mocked Dependencies:
  - `axios`: Mocks both `axios.get` for fetching user data and `axios.put` for updating user data.
  - `react-toastify`: Mocks the toast notification to verify that the success message is displayed after a successful profile update.

### 5. Integration Tests (userprofile.test.js)
This test will include all the function from file: `<project folder>/client/pages/userprofile/index.js`

Coverages includes:
- 5.1. Fetching and Displaying User Profile Data from the API:
   - Verifies that the API is called to fetch user profile data.
   - Checks that `axios.get` is called with the correct URL and headers
   - Ensures that the user data, such username and email, is displayed correctly on the screen.

- 5.2. Updating User Profile and Handling API Response:
  - Tests updating from fields like first name, last name, and email.
  - Verifies that `axios.put` is called with the updated data and sent to the API correctly.
  - Checks if a success message (toast) is displayed after the profile update is successful.

- 5.3. Handling API Errors During Profile Fetch:
  - Simulates a failed API request (e.g. network error) while fetching user data.
  - Verifies that the error is logged in the console or handled appropriately.

Fetching User Profile Data from the API:
```javascript
it('should fetch and display user profile data from the API', async () => {
    const axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValue({
        data: mockUserData
    });

    render(<UserProfile token={mockToken} />);

    await waitFor(() => {
        expect(axiosGetSpy).toHaveBeenCalledWith(
            'http://localhost:1337/api/users/me?populate=*',
            {
                headers: {
                    Authorization: `bearer ${mockToken}`,
                },
            }
        );
        expect(screen.getByText(/Testuser/i)).toBeInTheDocument();
    });
});

```

Updating User Profile and Displaying Success Message:
```javascript
it('should update user profile and handle successful API response', async () => {
    const axiosPutSpy = jest.spyOn(axios, 'put').mockResolvedValue({});
    const toastSuccessSpy = jest.spyOn(toast, 'success');

    render(<UserProfile token={mockToken} />);

    await waitFor(() => {
        expect(screen.getByDisplayValue('Updatefirstname')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/First Name:/i), { target: { value: 'Updatedfirstname' } });
    fireEvent.click(screen.getByText(/Edit/i));

    await waitFor(() => {
        expect(axiosPutSpy).toHaveBeenCalledWith(
            'http://localhost:1337/api/users/me',
            {
                firstname: 'Updatedfirstname',
                lastname: 'Updatedlastname',
                email: 'updated@gmail.com',
                job: initialUserData.job,
                gender: ''
            },
            expect.objectContaining({ headers: expect.any(Object) })
        );
        expect(toastSuccessSpy).toHaveBeenCalledWith('Profile updated successfully');
    });
});

```

Mocked Dependencies:
  - `axios`: Used to mock API calls (`axios.get` and `axios.put`).
  - `react-toastify`: Used to verify if a success notification is displayed after updating the profile.

## Viewing Test Results

The test results can be viewed in two ways:

1. **Console Output**: When running tests, results appear in the terminal:
   - ✓ for passed tests
   - ✕ for failed tests
   - Detailed error messages for failed tests

2. **Coverage Report**: Run `yarn test:coverage` to view:
   - Statement coverage
   - Branch coverage
   - Function coverage
   - Line coverage

Example test result output:
```
Auth Unit Tests
    Login Function                                                                                                                                            
      √ should successfully login with valid credentials (3 ms)                                                                                               
      √ should handle login failure with invalid credentials (15 ms)                                                                                          
    Register Function                                                                                                                                         
      √ should successfully register a new user within timeout (1 ms)                                                                                         
      √ should handle registration failure with duplicate email (1 ms)

  Auth Integration Tests
    POST /api/auth/local                                                                                                                                      
      √ should login successfully with valid credentials (111 ms)                                                                                             
      √ should fail login with invalid credentials (16 ms)                                                                                                    
    POST /api/auth/local/register                                                                                                                             
      √ should successfully register a new user (170 ms)                                                                                                      
      √ should fail registration with existing email (83 ms)                                                                                                  
      √ should validate required fields (86 ms)      

-------------------------------------|---------|----------|---------|---------|-------------------                                                            
File                                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                                             
-------------------------------------|---------|----------|---------|---------|-------------------                                                            
All files                            |   89.87 |    33.33 |   85.71 |   89.47 |                                                                               
 config                              |     100 |       50 |     100 |     100 |                                                                               
  admin.js                           |     100 |      100 |     100 |     100 |                                                                               
  api.js                             |     100 |      100 |     100 |     100 |                   
  cron-tasks.js                      |     100 |      100 |     100 |     100 | 
  database.js                        |     100 |       50 |     100 |     100 | 15-40
  middlewares.js                     |     100 |      100 |     100 |     100 | 
  plugins.js                         |     100 |      100 |     100 |     100 | 
  server.js                          |     100 |      100 |     100 |     100 | 
 src                                 |     100 |      100 |     100 |     100 | 
  index.js                           |     100 |      100 |     100 |     100 | 
 src/api/article/controllers         |     100 |      100 |     100 |     100 | 
  article.js                         |     100 |      100 |     100 |     100 | 
 src/api/article/routes              |     100 |      100 |     100 |     100 | 
  article.js                         |     100 |      100 |     100 |     100 | 
 src/api/article/services            |     100 |      100 |     100 |     100 | 
  article.js                         |     100 |      100 |     100 |     100 | 
 src/api/blog-page/controllers       |     100 |      100 |     100 |     100 | 
  blog-page.js                       |     100 |      100 |     100 |     100 | 
 src/api/blog-page/routes            |     100 |      100 |     100 |     100 | 
  blog-page.js                       |     100 |      100 |     100 |     100 | 
 src/api/blog-page/services          |     100 |      100 |     100 |     100 | 
  blog-page.js                       |     100 |      100 |     100 |     100 | 
 src/api/category/controllers        |     100 |      100 |     100 |     100 | 
  category.js                        |     100 |      100 |     100 |     100 | 
 src/api/category/routes             |     100 |      100 |     100 |     100 | 
  category.js                        |     100 |      100 |     100 |     100 | 
 src/api/category/services           |     100 |      100 |     100 |     100 | 
  category.js                        |     100 |      100 |     100 |     100 | 
 src/api/global/controllers          |     100 |      100 |     100 |     100 | 
  global.js                          |     100 |      100 |     100 |     100 | 
 src/api/global/routes               |     100 |      100 |     100 |     100 | 
  global.js                          |     100 |      100 |     100 |     100 | 
 src/api/global/services             |     100 |      100 |     100 |     100 | 
  global.js                          |     100 |      100 |     100 |     100 | 
 src/api/page/controllers            |     100 |      100 |     100 |     100 | 
  page.js                            |     100 |      100 |     100 |     100 | 
 src/api/page/routes                 |     100 |      100 |     100 |     100 | 
  page.js                            |     100 |      100 |     100 |     100 | 
 src/api/page/services               |     100 |      100 |     100 |     100 | 
  page.js                            |     100 |      100 |     100 |     100 | 
 src/api/place/controllers           |     100 |      100 |     100 |     100 | 
  place.js                           |     100 |      100 |     100 |     100 | 
 src/api/place/routes                |     100 |      100 |     100 |     100 | 
  place.js                           |     100 |      100 |     100 |     100 | 
 src/api/place/services              |     100 |      100 |     100 |     100 | 
  place.js                           |     100 |      100 |     100 |     100 | 
 src/api/restaurant-page/controllers |     100 |      100 |     100 |     100 | 
  restaurant-page.js                 |     100 |      100 |     100 |     100 | 
 src/api/restaurant-page/routes      |     100 |      100 |     100 |     100 | 
  restaurant-page.js                 |     100 |      100 |     100 |     100 | 
 src/api/restaurant-page/services    |     100 |      100 |     100 |     100 | 
  restaurant-page.js                 |     100 |      100 |     100 |     100 | 
 src/api/restaurant/controllers      |     100 |      100 |     100 |     100 | 
  restaurant.js                      |     100 |      100 |     100 |     100 | 
 src/api/restaurant/routes           |     100 |      100 |     100 |     100 | 
  restaurant.js                      |     100 |      100 |     100 |     100 | 
 src/api/restaurant/services         |     100 |      100 |     100 |     100 | 
  restaurant.js                      |     100 |      100 |     100 |     100 | 
 src/api/review/controllers          |     100 |      100 |     100 |     100 | 
  review.js                          |     100 |      100 |     100 |     100 | 
 src/api/review/routes               |     100 |      100 |     100 |     100 | 
  review.js                          |     100 |      100 |     100 |     100 | 
 src/api/review/services             |     100 |      100 |     100 |     100 | 
  review.js                          |     100 |      100 |     100 |     100 | 
 src/policies                        |   11.11 |        0 |       0 |   11.11 | 
  auth.js                            |   11.11 |        0 |       0 |   11.11 | 2-13
-------------------------------------|---------|----------|---------|---------|-------------------

Test Suites: 2 passed, 2 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        7.714 s, estimated 25 s
Ran all test suites.
Done in 8.40s.          
```

## Adding New Tests

### 1. Unit Tests
Create new files in `<./api or ./client>/__tests__/unit/` following this pattern:

```javascript
// xxxx.test.js
describe('Feature Name', () => {
  it('should do something specific', () => {
    // Test implementation
  });
});
```

### 2. Integration Tests
Create new files in `<./api or ./client>/__tests__/integration/` using Supertest:

```javascript
// xxxx.integration.test.js
describe('API Endpoint', () => {
  it('should handle request correctly', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send(data);
    
    expect(response.status).toBe(200);
  });
});
```

# Node.js CI Workflow

## Overview
This repository contains a Node.js continuous integration (CI) workflow that automates testing for both API and client applications across multiple operating systems and Node.js versions.

## Workflow Triggers
The workflow is triggered on:
- Push events to `test-feature06` and `develop` branches
- Pull request events to `develop-feature06`, `develop`, and `main` branches

## CI Environment Matrix
The workflow runs tests across the following combinations:

### Operating Systems
- `ubuntu:latest`
- `debian:latest` 
- `redhat/ubi8`

### Node.js Versions
- 16.x
- 18.x

## Workflow Steps

### 1. Environment Setup
- Checks out the repository using `actions/checkout@v4`
- Sets up Node.js using `actions/setup-node@v4`
- Installs Yarn package manager globally

### 2. API Setup and Testing
#### Dependencies Installation
```bash
# Working directory: ./api
yarn global add jest
yarn && yarn seed
```

#### Environment Configuration
Creates `.env` file with test secrets:
```env
JWT_SECRET=test-jwt-secret
ADMIN_JWT_SECRET=test-admin-jwt-secret
```

#### Testing
- Runs unit tests: `yarn test:unit`
- Runs integration tests: `yarn test:integration`

### 3. Client Setup and Testing
#### Dependencies Installation
```bash
# Working directory: ./client
yarn
```

#### Testing
- Runs unit tests: `yarn test:unit`
- Runs integration tests: `yarn test:integration`

## Project Structure
```
.
├── api/                # Backend API application
│   ├── __tests__/
│   │   ├── unit/
│   │   └── integration/
│   └── package.json
│
└── client/            # Frontend client application
    ├── __tests__/
    │   ├── unit/
    │   └── integration/
    └── package.json
```

## GitHub Actions Configuration
This workflow uses the following configuration:

```yaml
name: Node.js CI

on:
  push:
    branches: [ test-feature06 , develop ]
  pull_request:
    branches: [ develop-feature06, develop, main ]

jobs:

  tests:
    strategy:
      fail-fast: false
      matrix:
        os: ['ubuntu:latest', 'debian:latest', 'redhat/ubi8'] 
        node-version: [16.x , 18.x]
    
    runs-on: ubuntu-latest
    container: ${{ matrix.os }}

    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
    
    - name: Install Yarn
      run: npm install -g yarn
    
    - name: Install api dependencies
      working-directory: ./api
      run: |
        yarn global add jest
        yarn && yarn seed
        echo "JWT_SECRET=test-jwt-secret" >> .env
        echo "ADMIN_JWT_SECRET=test-admin-jwt-secret" >> .env
    
    - name: Install client dependencies
      working-directory: ./client
      run: |
        yarn
    
    - name: Run api unit tests
      working-directory: ./api
      run: yarn test:unit
    
    - name: Run api integration tests
      working-directory: ./api
      run: yarn test:integration
    
    - name: Run client unit tests
      working-directory: ./client
      run: |
        yarn test:unit
    
    - name: Run client integration tests
      working-directory: ./client
      run: |
        yarn test:integration
```
