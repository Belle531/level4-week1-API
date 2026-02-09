import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { createApp } from '../src/createApp.js';
import { createRepos } from '../src/repositories/index.js';

async function registerAndGetToken(app) {
  const res = await request(app).post('/auth/register').send({
    email: 'bob@example.com',
    name: 'Bob',
    password: 'Password123!',
  });

  return res.body.data.token;
}

describe('Posts', () => {
  it('create post requires auth', async () => {
    const app = createApp({
      repos: await createRepos(),
      config: {
        JWT_SECRET: 'test-secret',
      },
    });
    const res = await request(app).post('/posts').send({ title: 't', body: 'b' });
    expect(res.status).toBe(401);
  });

  it('creates and lists posts with pagination meta', async () => {
    const app = createApp({
      repos: await createRepos(),
      config: {
        JWT_SECRET: 'test-secret',
      },
    });

    const token = await registerAndGetToken(app);

    await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'A', body: '1' })
      .expect(201);
    await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'B', body: '2' })
      .expect(201);
    await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'C', body: '3' })
      .expect(201);

    const res = await request(app).get('/posts?limit=2&offset=1').expect(200);

    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta.pagination.total).toBe(3);
    expect(res.body.meta.pagination.limit).toBe(2);
    expect(res.body.meta.pagination.offset).toBe(1);
  });

  it('gets a post by id, or returns 404 envelope', async () => {
    const app = createApp({
      repos: await createRepos(),
      config: {
        JWT_SECRET: 'test-secret',
      },
    });

    const token = await registerAndGetToken(app);

    const created = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'A', body: '1' })
      .expect(201);

    const id = created.body.data.id;

    const getRes = await request(app).get(`/posts/${id}`).expect(200);
    expect(getRes.body.data.id).toBe(id);

    const miss = await request(app).get('/posts/9999').expect(404);
    expect(miss.body.error.code).toBe('not_found');
  });
});