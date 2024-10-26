const supertest = require('supertest');
const Strapi = require('@strapi/strapi');

describe('Auth Integration Tests', () => {
  let strapi;
  let request;
  let authRole;

  beforeAll(async () => {
    // เริ่มต้น Strapi และเซิร์ฟเวอร์สำหรับการทดสอบ
    strapi = await Strapi().load();
    await strapi.start();
    request = supertest(strapi.server.httpServer);

    // ดึงข้อมูล Role 'Authenticated'
    authRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'authenticated' },
    });

    // สร้าง public test user
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

  afterAll(async () => {
    // ลบผู้ใช้ที่สร้างขึ้น
    await strapi.db.query('plugin::users-permissions.user').deleteMany({
      where: {
        email: {
          $in: ['test@example.com', 'newuser@example.com', 'existing@example.com'],
        },
      },
    });
    await strapi.destroy();
  }, 30000);

  describe('POST /api/auth/local', () => {
    it('should login successfully with valid credentials', async () => {
      // ทดสอบการเข้าสู่ระบบด้วยข้อมูลที่ถูกต้อง
      const response = await request.post('/api/auth/local').send({
        identifier: 'test@example.com',
        password: 'Password123!',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('jwt');
      expect(response.body).toHaveProperty('user');
    });

    it('should fail login with invalid credentials', async () => {
      // ทดสอบการเข้าสู่ระบบด้วยข้อมูลที่ไม่ถูกต้อง
      const response = await request.post('/api/auth/local').send({
        identifier: 'wrong@email.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/local/register', () => {
    beforeEach(async () => {
      // สร้างผู้ใช้ที่มีอยู่แล้วสำหรับการทดสอบการลงทะเบียนซ้ำ
      await strapi.plugins['users-permissions'].services.user.add({
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'Password123!',
        job: 'Customer',
        role: authRole.id,
        confirmed: true,
        provider: 'local',
        blocked: false,
      });
    });

    afterEach(async () => {
      // ลบผู้ใช้ที่สร้างใน beforeEach และผู้ใช้ที่ลงทะเบียนใหม่
      await strapi.db.query('plugin::users-permissions.user').deleteMany({
        where: { email: 'existing@example.com' },
      });

      await strapi.db.query('plugin::users-permissions.user').deleteMany({
        where: {
          email: {
            $in: ['newuser@example.com'],
          },
        },
      });
    });

    it('should successfully register a new user', async () => {
      // ทดสอบการลงทะเบียนผู้ใช้ใหม่
      const newUser = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'Password123!',
        job: 'Customer',
      };

      const response = await request.post('/api/auth/local/register').send(newUser);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('jwt');
      expect(response.body.user).toHaveProperty('username', newUser.username);
    });

    it('should fail registration with existing email', async () => {
      // ทดสอบการลงทะเบียนด้วยอีเมลที่มีอยู่แล้ว
      const existingUser = {
        username: 'anotheruser',
        email: 'existing@example.com', // ใช้อีเมลที่สร้างใน beforeEach
        password: 'Password123!',
        job: 'Customer',
      };

      const response = await request.post('/api/auth/local/register').send(existingUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate required fields', async () => {
      // ทดสอบการตรวจสอบข้อมูลที่จำเป็น (เช่น email และ password ขาดหาย)
      const invalidUser = {
        username: 'testuser',
        // ขาดข้อมูลที่จำเป็น เช่น email และ password
      };

      const response = await request.post('/api/auth/local/register').send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });
});
