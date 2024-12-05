const jwt = require('jsonwebtoken');

describe('Auth Unit Tests', () => {
  describe('Login Function', () => {
    it('should successfully login with valid credentials', async () => {
      // กรณีทดสอบการเข้าสู่ระบบด้วยข้อมูลประจำตัวที่ถูกต้อง

      // สร้าง mock response จำลองการตอบกลับจากเซิร์ฟเวอร์ที่มี JWT และข้อมูลผู้ใช้
      const mockResponse = {
        jwt: 'mock-token',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com'
        }
      };

      // จัดการ mock สำหรับ global.fetch โดยใช้ jest.fn() เพื่อจำลองการเรียก API
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true, // แสดงว่า HTTP response status เป็น 2xx (สำเร็จ)
          json: () => Promise.resolve(mockResponse) // จำลองการแปลง response เป็น JSON
        })
      );

      //ฟังก์ชัน login ที่ใช้ในการทดสอบ โดยส่ง identifier และ password ไปยัง API
      const login = async (identifier, password) => {
        // ส่งคำขอ POST ไปยัง endpoint '/api/auth/local' พร้อมกับข้อมูลประจำตัว
        const res = await fetch('/api/auth/local', {
          method: 'POST', // ระบุวิธีการส่งข้อมูลเป็น POST
          headers: { 'Content-Type': 'application/json' }, // กำหนดประเภทของข้อมูลเป็น JSON
          body: JSON.stringify({ identifier, password }) // แปลงข้อมูลเป็นสตริง JSON
        });
        const data = await res.json(); // แปลงคำตอบจากเซิร์ฟเวอร์เป็น JSON
        return data; // ส่งคืนข้อมูลที่ได้รับ
      };

      // เรียกใช้ฟังก์ชัน login ด้วยข้อมูลประจำตัวที่ถูกต้อง
      const result = await login('testuser', 'password123');

      // ตรวจสอบว่า JWT ที่ได้รับตรงกับที่คาดหวัง
      expect(result.jwt).toBe('mock-token');
      // ตรวจสอบว่า username ของผู้ใช้ตรงกับที่คาดหวัง
      expect(result.user.username).toBe('testuser');
    });

    it('should handle login failure with invalid credentials', async () => {
      // กรณีทดสอบการจัดการเมื่อเข้าสู่ระบบด้วยข้อมูลประจำตัวที่ไม่ถูกต้อง

      // จัดการ mock สำหรับ global.fetch ให้ตอบกลับด้วยสถานะไม่สำเร็จและข้อความแสดงข้อผิดพลาด
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false, // แสดงว่า HTTP response status ไม่ใช่ 2xx (ล้มเหลว)
          json: () => Promise.resolve({
            error: {
              message: 'Invalid identifier or password' // ข้อความข้อผิดพลาดที่ส่งกลับจากเซิร์ฟเวอร์
            }
          })
        })
      );

      //ฟังก์ชัน login ที่ใช้ในการทดสอบ โดยส่ง identifier และ password ไปยัง API
      const login = async (identifier, password) => {
        // ส่งคำขอ POST ไปยัง endpoint '/api/auth/local' พร้อมกับข้อมูลประจำตัว
        const res = await fetch('/api/auth/local', {
          method: 'POST', // ระบุวิธีการส่งข้อมูลเป็น POST
          headers: { 'Content-Type': 'application/json' }, // กำหนดประเภทของข้อมูลเป็น JSON
          body: JSON.stringify({ identifier, password }) // แปลงข้อมูลเป็นสตริง JSON
        });
        const data = await res.json(); // แปลงคำตอบจากเซิร์ฟเวอร์เป็น JSON
        if (!res.ok) throw new Error(data.error.message); // ถ้า response ไม่สำเร็จ ให้โยนข้อผิดพลาด
        return data; // ส่งคืนข้อมูลที่ได้รับ
      };

      // เรียกใช้ฟังก์ชัน login ด้วยข้อมูลประจำตัวที่ไม่ถูกต้อง และตรวจสอบว่ามีการโยนข้อผิดพลาดที่ถูกต้อง
      await expect(login('invalid', 'wrong')).rejects.toThrow('Invalid identifier or password');
    });
  });

  describe('Register Function', () => {
    let mockUser;
    
    beforeEach(() => {
      // ตั้งค่าผู้ใช้จำลองก่อนการทดสอบแต่ละกรณี

      // กำหนดข้อมูลผู้ใช้ที่ใช้ในการทดสอบการลงทะเบียน
      mockUser = {
        jwt: 'new-user-token',
        user: {
          id: 2,
          username: 'newuser',
          email: 'newuser@example.com'
        }
      };

      // จัดการ mock สำหรับ global.fetch ให้ตอบกลับด้วยข้อมูลผู้ใช้ใหม่ที่ถูกสร้าง
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true, // แสดงว่า HTTP response status เป็น 2xx (สำเร็จ)
          json: () => Promise.resolve(mockUser) // จำลองการแปลง response เป็น JSON
        })
      );
    });

    afterEach(() => {
      // ล้าง mock หลังการทดสอบแต่ละกรณี เพื่อไม่ให้มีผลกับการทดสอบถัดไป
      jest.clearAllMocks(); // ล้างการเรียกใช้ mock functions ทั้งหมด
    });

    afterAll(() => {
      // กู้คืน mock หลังการทดสอบทั้งหมดเสร็จสิ้น
      jest.restoreAllMocks(); // คืนค่าฟังก์ชันต้นฉบับทั้งหมดที่ถูก mock
    });

    it('should successfully register a new user within timeout', async () => {
      // กรณีทดสอบการลงทะเบียนผู้ใช้ใหม่ภายในเวลาที่กำหนด

      const startTime = Date.now(); // บันทึกเวลาที่เริ่มต้นการทดสอบ
      const timeout = 5000; // เวลาจำกัด 5 วินาที

      //ฟังก์ชัน register ที่ใช้ในการทดสอบ โดยส่งข้อมูลผู้ใช้ใหม่ไปยัง API
      const register = async (username, email, password) => {
        // ส่งคำขอ POST ไปยัง endpoint '/api/auth/local/register' พร้อมกับข้อมูลผู้ใช้ใหม่
        const res = await fetch('/api/auth/local/register', {
          method: 'POST', // ระบุวิธีการส่งข้อมูลเป็น POST
          headers: { 'Content-Type': 'application/json' }, // กำหนดประเภทของข้อมูลเป็น JSON
          body: JSON.stringify({ username, email, password, job: 'Customer' }) // แปลงข้อมูลเป็นสตริง JSON พร้อมกับเพิ่มฟิลด์ 'job'
        });
        const data = await res.json(); // แปลงคำตอบจากเซิร์ฟเวอร์เป็น JSON
        return data; // ส่งคืนข้อมูลที่ได้รับ
      };

      // เรียกใช้ฟังก์ชัน register ด้วยข้อมูลผู้ใช้ใหม่
      const result = await register('newuser', 'newuser@example.com', 'password123');
      const endTime = Date.now(); // บันทึกเวลาที่สิ้นสุดการทดสอบ
      const executionTime = endTime - startTime; // คำนวณเวลาที่ใช้ในการทดสอบ

      // ตรวจสอบว่าเวลาที่ใช้ในการลงทะเบียนไม่เกินเวลาจำกัด
      expect(executionTime).toBeLessThan(timeout);
      // ตรวจสอบว่า JWT ที่ได้รับตรงกับที่คาดหวัง
      expect(result.jwt).toBe('new-user-token');
      // ตรวจสอบว่า username ของผู้ใช้ตรงกับที่คาดหวัง
      expect(result.user.username).toBe('newuser');
    });

    it('should handle registration failure with duplicate email', async () => {
      // กรณีทดสอบการลงทะเบียนที่ล้มเหลวเนื่องจากอีเมลซ้ำกัน

      // จัดการ mock สำหรับ global.fetch ให้ตอบกลับด้วยสถานะไม่สำเร็จและข้อความแสดงข้อผิดพลาด
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false, // แสดงว่า HTTP response status ไม่ใช่ 2xx (ล้มเหลว)
          json: () => Promise.resolve({
            error: {
              message: 'Email is already taken' // ข้อความข้อผิดพลาดที่ส่งกลับจากเซิร์ฟเวอร์
            }
          })
        })
      );

      //ฟังก์ชัน register ที่ใช้ในการทดสอบ โดยส่งข้อมูลผู้ใช้ใหม่ไปยัง API
      const register = async (username, email, password) => {
        // ส่งคำขอ POST ไปยัง endpoint '/api/auth/local/register' พร้อมกับข้อมูลผู้ใช้ใหม่
        const res = await fetch('/api/auth/local/register', {
          method: 'POST', // ระบุวิธีการส่งข้อมูลเป็น POST
          headers: { 'Content-Type': 'application/json' }, // กำหนดประเภทของข้อมูลเป็น JSON
          body: JSON.stringify({ username, email, password, job: 'Customer' }) // แปลงข้อมูลเป็นสตริง JSON พร้อมกับเพิ่มฟิลด์ 'job'
        });
        const data = await res.json(); // แปลงคำตอบจากเซิร์ฟเวอร์เป็น JSON
        if (!res.ok) throw new Error(data.error.message); // ถ้า response ไม่สำเร็จ ให้โยนข้อผิดพลาด
        return data; // ส่งคืนข้อมูลที่ได้รับ
      };

      // เรียกใช้ฟังก์ชัน register ด้วยอีเมลที่มีอยู่แล้ว และตรวจสอบว่ามีการโยนข้อผิดพลาดที่ถูกต้อง
      await expect(register('newuser', 'existing@example.com', 'password123'))
        .rejects.toThrow('Email is already taken');
    });
  });
});
