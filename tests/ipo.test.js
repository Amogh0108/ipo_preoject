const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../backend/server');
const IPO = require('../backend/models/IPO');
const User = require('../backend/models/User');

describe('IPO API Tests', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ipo_test');

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });

    adminToken = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    await IPO.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/ipos', () => {
    it('should get all IPOs', async () => {
      const res = await request(app).get('/api/ipos');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/ipos', () => {
    it('should create IPO with admin token', async () => {
      const res = await request(app)
        .post('/api/ipos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          companyName: 'Test Company',
          symbol: 'TEST',
          priceRange: { min: 100, max: 120 },
          lotSize: 100,
          openDate: new Date(),
          closeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          totalShares: 1000000,
          minInvestment: 10000,
          status: 'active'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('symbol', 'TEST');
    });
  });
});
