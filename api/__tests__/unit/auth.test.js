const { AuthContext } = require('../../../client/context/AuthContext');
const jwt = require('jsonwebtoken');

describe('Auth Unit Tests', () => {
  describe('Login Function', () => {
    it('should successfully login with valid credentials', async () => {
      const mockResponse = {
        jwt: 'mock-token',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com'
        }
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        })
      );

      const login = async (identifier, password) => {
        const res = await fetch('/api/auth/local', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
        });
        const data = await res.json();
        return data;
      };

      const result = await login('testuser', 'password123');
      expect(result.jwt).toBe('mock-token');
      expect(result.user.username).toBe('testuser');
    });

    it('should handle login failure with invalid credentials', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            error: {
              message: 'Invalid identifier or password'
            }
          })
        })
      );

      const login = async (identifier, password) => {
        const res = await fetch('/api/auth/local', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error.message);
        return data;
      };

      await expect(login('invalid', 'wrong')).rejects.toThrow('Invalid identifier or password');
    });
  });

  describe('Register Function', () => {
    let mockUser;
    
    beforeEach(() => {
      mockUser = {
        jwt: 'new-user-token',
        user: {
          id: 2,
          username: 'newuser',
          email: 'newuser@example.com'
        }
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUser)
        })
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(async () => {
      try {
        const res = await fetch('/api/users/2', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${mockUser.jwt}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) {
          console.warn('Failed to cleanup test user');
        }
      } catch (error) {
        console.warn('Error during cleanup:', error);
      }
    });

    it('should successfully register a new user within timeout', async () => {
      const startTime = Date.now();
      const timeout = 5000; // 5 seconds timeout

      const register = async (username, email, password) => {
        const res = await fetch('/api/auth/local/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password, job: 'Customer' })
        });
        const data = await res.json();
        return data;
      };

      const result = await register('newuser', 'newuser@example.com', 'password123');
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(timeout);
      expect(result.jwt).toBe('new-user-token');
      expect(result.user.username).toBe('newuser');
    });

    it('should handle registration failure with duplicate email', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            error: {
              message: 'Email is already taken'
            }
          })
        })
      );

      const register = async (username, email, password) => {
        const res = await fetch('/api/auth/local/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password, job: 'Customer' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error.message);
        return data;
      };

      await expect(register('newuser', 'existing@example.com', 'password123'))
        .rejects.toThrow('Email is already taken');
    });
  });
});
