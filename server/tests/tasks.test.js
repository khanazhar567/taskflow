const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const createApp = require('./testApp');

let mongoServer;
let app;
let adminToken;
let userToken;
let projectId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Seed one admin + one standard user + one project before each test
beforeEach(async () => {
  // Wipe all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }

  // Create standard user
  const userReg = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Standard User', email: 'user@test.com', password: 'pass1234' });
  userToken = userReg.body.token;

  // Create admin user directly via model (so we can set role)
  const User = require('../models/User');
  await User.create({ name: 'Admin', email: 'admin@test.com', password: 'adminpass', role: 'admin' });
  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'adminpass' });
  adminToken = adminLogin.body.token;

  // Create a project as admin
  const proj = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Alpha Project', color: '#6366f1' });
  projectId = proj.body._id;
});

// ---------------------------------------------------------------------------
// POST /api/tasks  — any authenticated user can create
// ---------------------------------------------------------------------------
describe('POST /api/tasks', () => {
  it('allows a standard user to create a task (auto-assigned to themselves)', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'My Task', project: projectId, priority: 'medium', status: 'todo' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('My Task');
    expect(res.body).toHaveProperty('_id');
  });

  it('allows an admin to create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Admin Task', project: projectId });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Admin Task');
  });

  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'No Auth Task', project: projectId });

    expect(res.status).toBe(401);
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ project: projectId });

    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// GET /api/tasks  — role-based filtering
// ---------------------------------------------------------------------------
describe('GET /api/tasks', () => {
  beforeEach(async () => {
    // Admin creates task assigned to admin
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Admin Task', project: projectId });

    // Standard user creates task (assigned to themselves)
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'User Task', project: projectId });
  });

  it('admin sees all tasks in the project', async () => {
    const res = await request(app)
      .get(`/api/tasks?project=${projectId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('standard user only sees their own assigned tasks', async () => {
    const res = await request(app)
      .get(`/api/tasks?project=${projectId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    // User only created one task assigned to themselves
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('User Task');
  });
});

// ---------------------------------------------------------------------------
// PUT /api/tasks/:id  — admin only
// ---------------------------------------------------------------------------
describe('PUT /api/tasks/:id (admin only)', () => {
  let taskId;

  beforeEach(async () => {
    const task = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Editable Task', project: projectId });
    taskId = task.body._id;
  });

  it('admin can update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('standard user gets 403 when trying to update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Sneaky Update' });

    expect(res.status).toBe(403);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/tasks/:id/status  — admin only
// ---------------------------------------------------------------------------
describe('PATCH /api/tasks/:id/status (admin only)', () => {
  let taskId;

  beforeEach(async () => {
    const task = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Status Task', project: projectId, status: 'todo' });
    taskId = task.body._id;
  });

  it('admin can change task status', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'in-progress' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('in-progress');
  });

  it('standard user gets 403 when trying to change status', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'done' });

    expect(res.status).toBe(403);
  });

  it('returns 400 for an invalid status value', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'flying' });

    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/tasks/:id  — admin only
// ---------------------------------------------------------------------------
describe('DELETE /api/tasks/:id (admin only)', () => {
  let taskId;

  beforeEach(async () => {
    const task = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Deletable Task', project: projectId });
    taskId = task.body._id;
  });

  it('admin can delete a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });

  it('standard user gets 403 when trying to delete a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });
});
