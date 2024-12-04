const supertest = require('supertest');
const Strapi = require('@strapi/strapi');

describe('Article Integration Tests', () => {
  let strapi;
  let request;
  let authRole;
  let testUser;
  let testToken;

  const mockArticle = {
    data: {
      title: 'Test Article',
      slug: 'test-article',
      category: '1',
      seo: {
        metaTitle: 'Test Article',
        metaDescription: 'Test article description',
      },
      locale: 'en',
      ckeditor_content: 'This is test content for the article.',
      author: {
        connect: [{ id: 1 }],
      },
    },
  };

  beforeAll(async () => {
    try {
      strapi = await Strapi().load();
      await strapi.start();
      request = supertest(strapi.server.httpServer);

      // Get authenticated role with error handling
      authRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' },
      });

      if (!authRole) {
        throw new Error('Authenticated role not found');
      }

      // Create test user with error handling
      testUser = await strapi.plugins['users-permissions'].services.user.add({
        username: 'testarticleauthor',
        email: 'testarticle@example.com',
        password: 'TestArticle123!',
        job: 'Author',
        role: authRole.id,
        confirmed: true,
        provider: 'local',
        blocked: false,
      });

      // Get authentication token
      const authResponse = await request.post('/api/auth/local').send({
        identifier: 'testarticle@example.com',
        password: 'TestArticle123!',
      });
      testToken = authResponse.body.jwt;
    } catch (error) {
      console.error('Setup error:', error);
      throw error;
    }
  }, 30000);

  afterAll(async () => {
    try {
      if (strapi && strapi.db) {
        await strapi.db.query('plugin::users-permissions.user').delete({
          where: { id: testUser?.id },
        });
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    } finally {
      if (strapi) {
        await strapi.destroy();
      }
    }
  }, 30000);

  describe('POST /api/articles', () => {
    it('should successfully create an article with valid data', async () => {
      const response = await request
        .post('/api/articles')
        .set('Authorization', `Bearer ${testToken}`)
        .send(mockArticle);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty(
        'attributes.title',
        mockArticle.data.title
      );
    });

    it('should fail to create article without required fields', async () => {
      const invalidArticle = {
        data: {
          title: 'Test Article', // Missing required fields
        },
      };

      const response = await request
        .post('/api/articles')
        .set('Authorization', `Bearer ${testToken}`)
        .send(invalidArticle);

      expect(response.status).toBe(400);
    });

    it('should fail to create article without authentication', async () => {
      const response = await request.post('/api/articles').send(mockArticle);
      expect(response.status).toBe(403);
    });

    it('should validate article content length', async () => {
      const shortArticle = {
        ...mockArticle,
        data: {
          ...mockArticle.data,
          ckeditor_content: 'Too short', // Assuming minimum content length requirement
        },
      };

      const response = await request
        .post('/api/articles')
        .set('Authorization', `Bearer ${testToken}`)
        .send(shortArticle);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/articles/:id', () => {
    let articleId;

    beforeEach(async () => {
      // Create a test article for updating
      const createResponse = await request
        .post('/api/articles')
        .set('Authorization', `Bearer ${testToken}`)
        .send(mockArticle);

      articleId = createResponse.body.data.id;
    });

    it('should successfully update an existing article', async () => {
      const updateData = {
        data: {
          title: 'Updated Test Article',
        },
      };

      const response = await request
        .put(`/api/articles/${articleId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.attributes.title).toBe(updateData.data.title);
    });
  });
});
