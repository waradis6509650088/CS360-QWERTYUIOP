const supertest = require('supertest');
const Strapi = require('@strapi/strapi');

describe('Auth Integration Tests', () => {
  let strapi;
  let request;

  beforeAll(async () => {
    strapi = await Strapi().load();
    await strapi.start();
    request = supertest(strapi.server.httpServer);
    
    // Create test user
    await strapi.admin.services.user.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
      job: 'Customer'
    });
  }, 30000); 

  afterAll(async () => {
    await strapi.destroy();
  }, 30000);

  describe('POST /api/auth/local', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request
        .post('/api/auth/local')
        .send({
          identifier: 'test@example.com',
          password: 'Password123!', 
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('jwt');
      expect(response.body).toHaveProperty('user');
    });

    it('should fail login with invalid credentials', async () => {
      const response = await request
        .post('/api/auth/local')
        .send({
          identifier: 'wrong@email.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/local/register', () => {
    it('should successfully register a new user', async () => {
      const newUser = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'Password123!',
        job: 'Customer',
      };

      const response = await request
        .post('/api/auth/local/register')
        .send(newUser);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('jwt');
      expect(response.body.user).toHaveProperty('username', newUser.username);
    });

    it('should fail registration with existing email', async () => {
      const existingUser = {
        username: 'existing',
        email: 'test@example.com',
        password: 'Password123!',
        job: 'Customer',
      };

      const response = await request
        .post('/api/auth/local/register')
        .send(existingUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate required fields', async () => {
      const invalidUser = {
        username: 'testuser',
        // Missing other required fields
      };

      const response = await request
        .post('/api/auth/local/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    afterEach(async () => {
      // Clean up any users created during tests
      await strapi.db.query('plugin::users-permissions.user').deleteMany({
        where: {
          email: {
            $in: ['newuser@example.com']
          }
        }
      });
    });
  });
});
