# CS360 1/2567 Term Project: Food Advisor

## Table of Contents

- [Project Overview](#project-overview)
- [Group Information](#group-information)
- [Project Features](#project-features)
- [Technologies](#technologies)
- [Deployment Guide](#deployment-guide)
  - [Manual Deployment](#manual-deployment)
  - [Script-based Deployment](#script-based-deployment)
- [Testing Documentation](#testing-documentation)
- [CI/CD Pipeline](#cicd-pipeline)

## Project Overview

FoodAdvisor is a web application designed to simplify the process of discovering food-related content, such as blog posts, based on the user's specific preferences. By allowing users to select their favorite food categories, it ensures personalized recommendations, thus enhancing user engagement and satisfaction.

The application addresses the challenge of information overload, particularly in the food industry where users often struggle to find relevant, high-quality content that fits their tastes. By offering a tailored approach, FoodAdvisor solves the problem of inefficient food content discovery and creates an opportunity for food bloggers, restaurants, and food enthusiasts to connect in a more meaningful, user-centric way.

## Group Information

- **Group Name:** QWERTYUIOP

### Members

| Name                | Student ID |
| ------------------- | ---------- |
| Kanchanop Buarod    | 6509650229 |
| Thantawan Chitsan   | 6509650427 |
| Haritch Utchavanich | 6509650757 |
| Waradis Kamolwach   | 6509650088 |
| Primchawat Areerat  | 6309651039 |

## Project Features

- **Restaurant Discovery:** Users can explore restaurants by filtering through different food categories and locations, making it easy to find dining options that match their preferences
- **User Profile Management:** Users can customize and maintain their personal profiles, including updating their information and managing their account settings
- **Restaurant Management:** Restaurant owners can create and manage their restaurant profiles, including updating menus, hours, locations, and responding to customer reviews
- **Culinary Blog Platform:** Food enthusiasts can explore curated blog posts about restaurants, cuisines, and dining experiences, with content filtered by categories and preferences
- **Content Creation System:** Users can contribute to the platform by writing and publishing their own articles about food-related experiences, cooking tips, and restaurant reviews

## Technologies

- **Backend:** Strapi V4
- **Frontend:** NextJS + Tailwind
- **Infrastructure:** AWS EC2
- **Database:** SQLite

## Deployment Guide

### Manual Deployment

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

## Script-based Deployment

### Prerequisites

#### 1. SSH into your EC2 instance

```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

#### 2. Install Git

```bash
sudo yum install git -y
```

#### 3. Clone the repository

```bash
git clone https://github.com/Kanchanop6509650229/CS360-QWERTYUIOP.git
```

### Deployment Steps

#### 1. Locate to bash script file

```
cd /CS360-QWERTYUIOP
```

#### 2. Change the file permissions to make it executable as a program.

```
chmod +x deploy.sh
```

#### 3. Run bash script file

```
./deploy.sh
```

![Screenshot 2024-09-24 163409](https://github.com/user-attachments/assets/b17ef25c-fe2f-4094-85b5-000cce77acc2)

## Testing Documentation

### Overview

In this project, we use the following testing tools:

- **Jest**: Primary Testing Framework for Unit Tests
- **Supertest**: For testing HTTP endpoints in Integration Tests
- **Strapi Testing Utils**: For simulating Strapi instance in tests

Total Test Cases: 43

- Unit Tests: 25
- Integration Tests: 18

| Component | Feature | Test Type | Cases | Description |
|-----------|---------|-----------|--------|-------------|
| Auth | Login | Unit | 6 | Token validation, response handling, timeout testing |
| Auth | Login | Integration | 2 | API endpoint testing |
| Auth | Register | Unit | 6 | Input validation, error handling, performance testing |
| Auth | Register | Integration | 3 | API endpoint testing |
| Restaurant | Add | Unit | 8 | Image upload, data validation, error handling |
| Restaurant | Add | Integration | 7 | API endpoint testing, integration validation |
| Article | Creation/Update | Unit | 5 | Field validation, SEO validation, content length checks |
| Article | Management | Integration | 6 | CRUD operations, authentication, error handling |

## Detailed Implementation

### Auth Components

#### Login Tests
- **Unit Tests (6 cases)**
  - Token validation
  - Response format verification
  - Error handling scenarios
  - Timeout handling
  
- **Integration Tests (2 cases)**
  - API endpoint validation
  - Authentication workflow

#### Registration Tests
- **Unit Tests (6 cases)**
  - Input validation
  - Error condition handling
  - Performance benchmarking
  
- **Integration Tests (3 cases)**
  - Registration workflow validation
  - User creation verification
  - Database integration

### Restaurant Components

#### Add Restaurant Feature
- **Unit Tests (8 cases)**
  - Image upload validation
  - Data format verification
  - Error state handling
  - Input sanitization
  
- **Integration Tests (7 cases)**
  - API communication
  - Database integration
  - Image storage verification
  - Response validation

### Article Components

#### Article Management Tests
- **Unit Tests (5 cases)**
  - Required field validation
  - Content length validation
  - SEO metadata validation
  - API error handling
  - Successful article creation flow

- **Integration Tests (6 cases)**
  - Article creation with authentication
  - Required field validation
  - Article updates
  - Authentication requirements
  - Category relationships
  - Error handling for invalid data

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

  it('should handle login failure with invalid credentials', async () => {
    const response = await fetch('/api/auth/local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'wrong', password: 'wrong' })
    });
    expect(response.status).toBe(400);
  });
});
```

Coverage includes:
- POST request to `/api/auth/local`
- JWT token validation
- User data validation 
- Error handling for invalid credentials

#### Registration Function 

```javascript
describe('Register Function', () => {
  it('should register within timeout', async () => {
    const startTime = Date.now();
    const result = await register(
      'newuser',
      'newuser@example.com', 
      'password123'
    );
    const endTime = Date.now();
    const executionTime = endTime - startTime;

    expect(executionTime).toBeLessThan(timeout);
    expect(result.jwt).toBe('new-user-token');
    expect(result.user.username).toBe('newuser');
  });

  it('should handle registration failure with duplicate email', async () => {
    const response = await register('newuser', 'existing@example.com', 'password123');
    expect(response.status).toBe(400);
  });
});
```

Coverage includes:
- Registration request validation
- Performance testing
- Token validation
- Error handling for duplicate data

### 2. Unit Tests (addRestaurant.test.js)

#### Image Management

```javascript
describe('function: findImgIdByName', () => {
  it('should return image id when name is found', async () => {
    const name = 'correct_image_name';
    const correctId = 123;
    const imageId = await findImgIdByName(name);
    expect(imageId).toBe(correctId);
  });

  it('should throw error when name not found', async () => {
    const name = 'wrong_image_name';
    await expect(findImgIdByName(name)).rejects.toThrow();
  });
});

describe('function: imageUpload', () => {
  it('should limit image uploads to 5 files', async () => {
    const images = Array.from({ length: 7 }, (_, i) => new File(['content'], `test${i + 1}.jpg`, { type: 'image/jpeg' }));
    const result = await imageUpload(images, 'TestRestaurant');
    expect(result).toHaveLength(5);
  });
});
```

Coverage includes:
- Image ID validation
- Upload size limitations
- File type validation
- Error handling for uploads

### 3. Integration Tests (auth.integration.test.js)

#### Authentication Setup

```javascript
beforeAll(async () => {
  strapi = await Strapi().load();
  await strapi.start();
  request = supertest(strapi.server.httpServer);

  authRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'authenticated' },
  });

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
});
```

#### Login Endpoint Tests

```javascript
describe('POST /api/auth/local', () => {
  it('should login successfully with valid credentials', async () => {
    const response = await request.post('/api/auth/local').send({
      identifier: 'test@example.com',
      password: 'Password123!'
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('jwt');
  });
});
```

### 4. Integration Tests (addRestaurant.integration.test.js)

#### Restaurant Creation Flow

```javascript
describe('Restaurant Creation Integration', () => {
  it('should validate required fields in request payload', async () => {
    const invalidData = { data: { name: 'Test Restaurant' } };

    const response = await fetch('http://localhost:1337/api/restaurants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(invalidData)
    });

    expect(response.ok).toBe(false);
  });
});
```

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

Recent test execution results:

| Component | Test Suites | Tests | Coverage Details |
|-----------|-------------|-------|------------------|
| API | 3 passed | 15 passed | **Statement**: 91.2%<br>**Branch**: 45%<br>**Function**: 88.5%<br>**Line**: 90.8% |
| Client | 2 passed | 23 passed | **Statement**: 91.3%<br>**Branch**: 85%<br>**Function**: 100%<br>**Line**: 90.76% |

### API Coverage Highlights

- Full coverage (100%) on most API endpoints including:

  - Article

  - Blog page

  - Category

  - Global

  - Page

  - Place

  - Restaurant

  - Review

- Areas needing improvement:

  - Policies (auth.js): 11.11% coverage

  - Database config: 50% branch coverage

  - Index.js: 90% coverage with line 40 uncovered

### Client Coverage Highlights

- High overall coverage in submit.js:

  - Statements: 91.3%

  - Branches: 85%

  - Functions: 100%

  - Lines: 90.76%

- Uncovered lines in submit.js: 12, 82, 91, 94, 97, 100

- All test suites passing successfully

### Total Project Statistics

- Total Test Suites: 5 passed (3 API + 2 Client)

- Total Tests: 43 passed (20 API + 23 Client)

- Average Statement Coverage: 91.25%

- Average Line Coverage: 90.78%

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
    const response = await request(app).post('/api/endpoint').send(data);

    expect(response.status).toBe(200);
  });
});
```

## CI/CD Pipeline

### Overview

The project implements an automated continuous integration (CI) workflow using GitHub Actions to ensure code quality and reliability. The pipeline executes comprehensive testing suites for both API and client applications, maintaining high standards of code quality across all changes.

### Pipeline Configuration

#### Workflow Triggers

The CI pipeline activates on:

- **Push Events:**
  - `develop` branch
  - `fix-from-feedback` branch
- **Pull Request Events:**
  - `develop` branch
  - `main` branch

#### Environment Matrix

- **Operating System:** Ubuntu Latest
- **Node.js Version:** 16.x

### Infrastructure Components

#### 1. Environment Setup

- Repository checkout via `actions/checkout@v4`
- Node.js configuration using `actions/setup-node@v4`
- Dependency caching system:
  ```yaml
  - uses: actions/cache@v3
    with:
      path: ${{ steps.yarn-cache-dir-path.outputs.dir }}
      key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
  ```

#### 2. System Dependencies

```bash
# Ubuntu packages
sudo apt-get update
sudo apt-get install -y build-essential

# Database setup
npm rebuild sqlite3 --force
```

#### 3. Development Tools

```bash
# Global installations
npm install -g yarn
yarn global add jest
```

### Testing Infrastructure

#### Project Structure

```
.
├── api/                        # Backend API application
│   ├── __tests__/
│   │   ├── integration/       # API integration tests
│   │   │   ├── auth.integration.test.js
│   │   │   └── ...
│   │   └── unit/             # API unit tests
│   │       ├── auth.test.js
│   │       └── ...
│   └── package.json
│
└── client/                    # Frontend client application
    ├── __tests__/
    │   ├── integration/      # Client integration tests
    │   │   ├── addRestaurant.integration.test.js
    │   │   └── ...
    │   └── unit/            # Client unit tests
    │       ├── addRestaurant.test.js
    │       └── ...
    └── package.json
```

#### Test Configuration Files

- `jest.config.js`: Jest configuration
- `setup.js`: Test environment setup
- `env.js`: Testing environment variables

#### API Testing Suite

```bash
# Directory: ./api
yarn test:unit        # Run unit tests
yarn test:integration # Run integration tests
```

#### Client Testing Suite

```bash
# Directory: ./client
yarn test:unit        # Run unit tests
yarn test:integration # Run integration tests
```

### Security Implementation

- Secure environment variable handling via GitHub Secrets
- JWT token management for authentication tests
- Protected API endpoints testing

### Pipeline Execution

#### 1. Initialization Phase

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

#### 2. Dependency Management

```yaml
- name: Cache API dependencies
  uses: actions/cache@v3
  with:
    path: ${{ steps.api-yarn-cache-dir-path.outputs.dir }}
    key: ${{ runner.os }}-yarn-api-${{ hashFiles('api/yarn.lock') }}
```

#### 3. Environment Configuration

```yaml
env:
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  ADMIN_JWT_SECRET: ${{ secrets.ADMIN_JWT_SECRET }}
```

#### 4. Test Execution

```yaml
- name: Run API tests
  working-directory: ./api
  run: |
    yarn test:unit
    yarn test:integration

- name: Run client tests
  working-directory: ./client
  run: |
    yarn test:unit
    yarn test:integration
```

### Monitoring and Results

#### Pipeline Status Indicators

- ✅ Success: All tests passed
- ❌ Failure: Test failures detected
- 🟡 In Progress: Pipeline executing

#### Accessing Build Results

1. Navigate to GitHub repository
2. Select "Actions" tab
3. Click desired workflow run
4. Review:
   - Test execution logs
   - Build artifacts
   - Error reports
   - Coverage statistics

### Pipeline Maintenance

To modify pipeline configuration:

1. Edit `.github/workflows/node-test.yml`
2. Update test scripts in respective package.json files
3. Modify environment variables in GitHub Secrets
4. Update cache configuration as dependencies change
