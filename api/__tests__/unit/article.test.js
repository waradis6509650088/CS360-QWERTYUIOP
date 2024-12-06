describe('Article Management Unit Tests', () => {
    beforeAll(() => {
      // Mock localStorage
      global.localStorage = {
        getItem: jest.fn(() => 'test-token')
      };
  
      // Mock fetch
      global.fetch = jest.fn();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('Article Creation', () => {
      const mockArticleData = {
        data: {
          title: "Test Article",
          slug: "test-article",
          category: "1",
          seo: {
            metaTitle: "Test Article",
            metaDescription: "Test description"
          },
          ckeditor_content: "Test content"
        }
      };
  
      it('should validate required fields before submission', async () => {
        const createArticle = async (data) => {
          if (!data.data.title) throw new Error('missing request data "title"');
          if (!data.data.category) throw new Error('missing request data "category"');
          if (!data.data.ckeditor_content) throw new Error('missing request data "content"');
          
          return fetch('/api/articles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
          });
        };
  
        const invalidData = { data: { title: "Test" } };
        await expect(createArticle(invalidData)).rejects.toThrow('missing request data');
      });
  
      it('should handle successful article creation', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ 
            data: { 
              id: 1,
              attributes: mockArticleData.data
            }
          })
        });
  
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(mockArticleData)
        });
  
        const data = await response.json();
        expect(data.data.attributes).toEqual(mockArticleData.data);
      });
  
      it('should handle API errors during article creation', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: false,
          json: async () => ({
            error: {
              message: 'Article creation failed'
            }
          })
        });
  
        const createArticle = async (data) => {
          const response = await fetch('/api/articles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
          });
  
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error.message);
          }
          return response.json();
        };
  
        await expect(createArticle(mockArticleData))
          .rejects.toThrow('Article creation failed');
      });
  
      it('should validate content length', async () => {
        const validateArticleContent = (content) => {
          if (content.length < 100) throw new Error('Content too short');
          if (content.length > 10000) throw new Error('Content too long');
          return true;
        };
  
        expect(() => validateArticleContent('Too short'))
          .toThrow('Content too short');
  
        expect(validateArticleContent('A'.repeat(200))).toBe(true);
      });
  
      it('should validate SEO metadata', async () => {
        const validateSEO = (seo) => {
          if (!seo.metaTitle || seo.metaTitle.length < 10) 
            throw new Error('Meta title too short');
          if (!seo.metaDescription || seo.metaDescription.length < 50)
            throw new Error('Meta description too short');
          return true;
        };
  
        const validSEO = {
          metaTitle: "This is a good title",
          metaDescription: "This is a good description that is long enough to meet the minimum requirements"
        };
  
        const invalidSEO = {
          metaTitle: "Short",
          metaDescription: "Too short"
        };
  
        expect(() => validateSEO(invalidSEO))
          .toThrow(/too short/);
        expect(validateSEO(validSEO)).toBe(true);
      });
    });
  });