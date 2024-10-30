const supertest = require('supertest');
const Strapi = require('@strapi/strapi');

let app;
let request;

beforeAll(async () => {
    app = await Strapi().load(); // โหลด Strapi instance
    request = supertest(app.server.httpServer); // กำหนด supertest สำหรับ server Strapi
});

afterAll(async () => {
    await app.destroy(); // ปิด Strapi หลังการทดสอบทั้งหมดเสร็จสิ้น
});

describe("User Profile API", () => {
    const userId = 1;
    const token = "YOUR_TOKEN_HERE"; // Token ในการ Authorization

    it("should fetch user profile data", async () => {
        const res = await request
            .get(`/api/users/${userId}?populate=*`) // เรียก user profile
            .set("Authorization", `Bearer ${token}`)
            .expect(200); // Expected status code to be 200

        expect(res.body).toHaveProperty("email");
        expect(res.body).toHaveProperty("username");
    });

    it("should update user profile data", async () => {
        const updatedData = {
            firstname: "UpdatedFirstName",
            lastname: "UpdatedLastName",
        };

        const res = await request
            .put(`/api/users/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedData)
            .expect(200);

        expect(res.body.firstname).toBe(updatedData.firstname);
        expect(res.body.lastname).toBe(updatedData.lastname);
    });

    it("should return an error if token is invalid", async () => {
        const res = await request
            .get(`/api/users/${userId}?populate=*`)
            .set("Authorization", "Bearer invalid_token")
            .expect(401); // Expected Status code to be 401

        expect(res.body.error.message).toBe("Invalid token.");
    });
});
