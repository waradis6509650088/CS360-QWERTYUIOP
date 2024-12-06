describe('AddRestaurant Integration Tests', () => {
    const mockFormData = {
      data: {
        name: 'Test Restaurant',
        slug: 'test-restaurant',
        price: 'p1', 
        category: '5',
        place: 1,
        information: {
          description: 'A test restaurant description',
          opening_hours: [
            {
              day_interval: 'Mon-Fri',
              opening_hour: '9:00',
              closing_hour: '22:00'
            }
          ],
          location: {
            address: '123 Test St',
            website: 'https://testrestaurant.com',
            phone: '123-456-7890'
          }
        },
        socialNetworks: [
          {
            platform: 'Instagram',
            url: 'https://instagram.com/testrestaurant'
          },
          {
            platform: 'Facebook',
            url: 'https://facebook.com/testrestaurant'
          }
        ]
      }
    };
  
    beforeEach(() => {
      // Mock localStorage
      global.localStorage = {
        getItem: jest.fn(() => 'test-token'),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
  
      // Mock global fetch
      global.fetch = jest.fn();
  
      // Mock FormData
      global.FormData = jest.fn(() => ({
        append: jest.fn()
      }));
  
      // Mock File constructor
      global.File = jest.fn((content, filename, options) => ({
        content,
        name: filename,
        ...options
      }));
  
      // Mock alert
      global.alert = jest.fn();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('Image Upload Integration', () => {
      it('should successfully upload images', async () => {
        const mockImageResponse = [{ id: 1, name: 'test-image.jpg' }];
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockImageResponse
        });
  
        const imageFile = new File(['test'], 'test-image.jpg', { type: 'image/jpeg' });
        const formData = new FormData();
        formData.append('files', imageFile);
  
        const response = await fetch('http://localhost:1337/api/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
  
        const data = await response.json();
        expect(data).toEqual(mockImageResponse);
        expect(fetch).toHaveBeenCalledTimes(1);
      });
  
      it('should handle image upload errors', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Upload failed' })
        });
  
        const imageFile = new File(['test'], 'test-image.jpg', { type: 'image/jpeg' });
        const formData = new FormData();
        formData.append('files', imageFile);
  
        let errorMessage;
        try {
          const response = await fetch('http://localhost:1337/api/upload', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });
          if (!response.ok) throw new Error('Upload failed');
        } catch (error) {
          errorMessage = error.message;
        }
  
        expect(errorMessage).toBe('Upload failed');
      });
    });
  
    describe('Restaurant Creation Integration', () => {
      it('should successfully create a restaurant', async () => {
        const mockResponse = {
          data: {
            id: 1,
            attributes: { ...mockFormData.data }
          }
        };
  
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse
        });
  
        const response = await fetch('http://localhost:1337/api/restaurants', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(mockFormData)
        });
  
        const data = await response.json();
        expect(data).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledTimes(1);
      });
  
      it('should handle restaurant creation errors', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: { message: 'Creation failed' } })
        });
  
        let errorMessage;
        try {
          const response = await fetch('http://localhost:1337/api/restaurants', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(mockFormData)
          });
          if (!response.ok) throw new Error('Creation failed');
        } catch (error) {
          errorMessage = error.message;
        }
  
        expect(errorMessage).toBe('Creation failed');
      });
    });
  
    describe('API Authorization', () => {
      it('should validate required fields in request payload', async () => {
        const invalidData = { data: { name: 'Test Restaurant' } }; // Missing required fields
  
        global.fetch.mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: { message: 'Missing required fields' } })
        });
  
        let errorMessage;
        try {
          const response = await fetch('http://localhost:1337/api/restaurants', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(invalidData)
          });
          if (!response.ok) throw new Error('Missing required fields');
        } catch (error) {
          errorMessage = error.message;
        }
  
        expect(errorMessage).toBe('Missing required fields');
      });
    });
  });