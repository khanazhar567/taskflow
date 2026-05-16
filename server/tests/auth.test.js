const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const createApp = require('./testApp');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Wipe all collections between tests for isolation
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------
describe('POST /api/auth/register', () => {
  it('creates a new user and returns 201 with a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Azhar Javed', email: 'azhar@test.com', password: 'pass1234' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe('azhar@test.com');
    expect(res.body.role).toBe('user');
    expect(res.body).not.toHaveProperty('password');
  });

  it('returns 400 when a required field is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'noname@test.com', password: 'pass1234' }); // no name

    expect(res.status).toBe(400);
  });

  it('returns 400 when email is already registered', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'First', email: 'dup@test.com', password: 'pass1234' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Second', email: 'dup@test.com', password: 'pass1234' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Login User', email: 'login@test.com', password: 'mypassword' });
  });

  it('returns 200 and a token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'mypassword' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe('login@test.com');
  });

  it('returns 401 for a wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('returns 401 for a non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ghost@test.com', password: 'mypassword' });

    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// GET /api/auth/me
// ---------------------------------------------------------------------------
describe('GET /api/auth/me', () => {
  it('returns the authenticated user without password field', async () => {
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Me User', email: 'me@test.com', password: 'pass1234' });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${reg.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('me@test.com');
    expect(res.body).not.toHaveProperty('password');
  });

  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns 401 when an invalid token is provided', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken123');
    expect(res.status).toBe(401);
  });
});
