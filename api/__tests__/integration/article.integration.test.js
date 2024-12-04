const supertest = require('supertest');
const Strapi = require('@strapi/strapi');
const fs = require('fs').promises;
const path = require('path');

describe('Article Integration Tests', () => {
  let strapi;
  let request;
  let testUser;
  let testToken;
  let testCategory;
  let authRole;

  beforeAll(async () => {
    try {
      // Setup database
      const tmpPath = path.join(process.cwd(), '.tmp');
      await fs.mkdir(tmpPath).catch(() => null);
      const dbPath = path.join(tmpPath, 'test.db');
      await fs.unlink(dbPath).catch(() => null);
      
      process.env.DATABASE_FILENAME = 'test.db';
      
      strapi = await Strapi().load();
      await strapi.start();
      request = supertest(strapi.server.httpServer);

      // Get authenticated role
      authRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' }
      });

      // Update role permissions
      await strapi.query('plugin::users-permissions.permission').createMany({
        data: [
          {
            action: 'api::article.article.create',
            role: authRole.id,
            enabled: true
          },
          {
            action: 'api::article.article.update',
            role: authRole.id,
            enabled: true
          },
          {
            action: 'api::article.article.delete',
            role: authRole.id,
            enabled: true
          }
        ]
      });

      // Create test category
      testCategory = await strapi.entityService.create('api::category.category', {
        data: {
          name: 'Test Category',
          slug: 'test-category'
        }
      });

      // Create test user
      testUser = await strapi.db.query('plugin::users-permissions.user').create({
        data: {
          username: 'testuser',
          email: 'test@example.com',
          password: '$2a$10$ynEI1GiprRpJtiBpmq8xU.h5PaVM7nSp6JFKxvjf/VNDnP3LGhvTK',
          provider: 'local',
          confirmed: true,
          blocked: false,
          role: authRole.id
        }
      });

      testToken = strapi.plugins['users-permissions'].services.jwt.issue({
        id: testUser.id
      });

    } catch (error) {
      console.error('Setup error:', error);
      throw error;
    }
  }, 30000);

  afterAll(async () => {
    try {
      if (strapi) {
        // Clean up in correct order to avoid foreign key constraints
        await strapi.db.query('api::article.article').deleteMany({
          where: { title: { $contains: 'Test' } }
        });

        if (testUser?.id) {
          await strapi.db.query('plugin::users-permissions.user').delete({
            where: { id: testUser.id }
          });
        }

        if (testCategory?.id) {
          await strapi.entityService.delete('api::category.category', testCategory.id);
        }

        // Clean up permissions last
        await strapi.db.query('plugin::users-permissions.permission').deleteMany({
          where: {
            action: { $startsWith: 'api::article.article.' }
          }
        });

        await strapi.destroy();
      }
    } catch (error) {
      console.error('Teardown error:', error);
    } finally {
      // Always try to remove the test database
      const dbPath = path.join(process.cwd(), '.tmp', 'test.db');
      await fs.unlink(dbPath).catch(() => null);
    }
  }, 30000);

  describe('Article Management', () => {
    const mockArticle = {
      data: {
        title: "Test Integration Article",
        slug: "test-integration-article",
        locale: 'en',
        seo: {
          metaTitle: "Test Integration Article",
          metaDescription: "This is a test article for integration testing"
        },
        ckeditor_content: "This is test content for the integration testing article. It needs to be long enough to pass validation requirements.",
        publishedAt: null,
        category: null
      }
    };

    beforeEach(() => {
      mockArticle.data.category = testCategory.id;
    });

    let createdArticleId;

    afterEach(async () => {
      if (createdArticleId) {
        await strapi.db.query('api::article.article').delete({
          where: { id: createdArticleId }
        }).catch(() => null);
        createdArticleId = null;
      }
    });

    it('should successfully create an article with valid data', async () => {
      const response = await request
        .post('/api/articles')
        .set('Authorization', `Bearer ${testToken}`)
        .send(mockArticle);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeTruthy();
      expect(response.body.data.attributes.title).toBe(mockArticle.data.title);
      
      createdArticleId = response.body.data.id;
    });

    it('should fail to create article without required fields', async () => {
      const invalidArticle = {
        data: {
          title: "Test Article"
        }
      };

      const response = await request
        .post('/api/articles')
        .set('Authorization', `Bearer ${testToken}`)
        .send(invalidArticle);

      expect(response.status).toBe(400);
    });

    it('should fail to create article without authentication', async () => {
      const response = await request
        .post('/api/articles')
        .send(mockArticle);

      expect(response.status).toBe(403);
    });

    describe('Article Updates', () => {
      beforeEach(async () => {
        const createResponse = await request
          .post('/api/articles')
          .set('Authorization', `Bearer ${testToken}`)
          .send(mockArticle);

        createdArticleId = createResponse.body.data.id;
      });

      it('should successfully update an existing article', async () => {
        const updateData = {
          data: {
            title: "Updated Test Article",
            ckeditor_content: mockArticle.data.ckeditor_content, // Keep the valid content
            locale: 'en',
            category: testCategory.id
          }
        };

        const response = await request
          .put(`/api/articles/${createdArticleId}`)
          .set('Authorization', `Bearer ${testToken}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.data.attributes.title).toBe(updateData.data.title);
      });
    });
  });
});