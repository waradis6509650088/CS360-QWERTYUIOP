const supertest = require('supertest');
const Strapi = require('@strapi/strapi');

describe('Auth Integration Tests', () => {
  let strapi;
  let request;
  let authRole;

  beforeAll(async () => {
    strapi = await Strapi().load();
    await strapi.start();
    request = supertest(strapi.server.httpServer);
    
    // Get the authenticated role
    authRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'authenticated' }
    });

    // Enable registration and email confirmation settings
    await strapi.plugins['users-permissions'].services.userspermissions.updateProviderSettings({
      email_confirmation: false,
      unique_email: true,
      allow_register: true,
      default_role: authRole.id
    });

    // Create initial test user
    await strapi.plugins['users-permissions'].services.user.add({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
      role: authRole.id,
      confirmed: true,
      blocked: false,
      provider: 'local'
    });
  }, 30000);

  afterAll(async () => {
    // Clean up test users
    await strapi.db.query('plugin::users-permissions.user').deleteMany({
      where: {
        email: {
          $in: ['test@example.com', 'newuser@example.com', 'existing@example.com']
        }
      }
    });
    await strapi.destroy();
  }, 30000);

  describe('POST /api/auth/local', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request
        .post('/api/auth/local')
        .send({
          identifier: 'test@example.com',
          password: 'Password123!'
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
    beforeEach(async () => {
      // Create existing user before each registration test
      await strapi.plugins['users-permissions'].services.user.add({
        username: 'existing',
        email: 'existing@example.com',
        password: 'Password123!',
        role: authRole.id,
        confirmed: true,
        blocked: false,
        provider: 'local'
      });
    });

    afterEach(async () => {
      // Clean up the existing user after each test
      await strapi.db.query('plugin::users-permissions.user').deleteMany({
        where: { email: 'existing@example.com' }
      });
    });

    it('should successfully register a new user', async () => {
      const newUser = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'Password123!',
        job: 'Customer'
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
        username: 'newuser',
        email: 'existing@example.com', // Using email that already exists
        password: 'Password123!',
        job: 'Customer'
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
        // Missing required fields
      };

      const response = await request
        .post('/api/auth/local/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });
});
