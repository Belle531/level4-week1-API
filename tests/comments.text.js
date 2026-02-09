// tests/comments.test.js
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

describe('Comments (nested)', () => {
  it('creates and lists comments for a post', async () => {
    const app = createApp({
      repos: await createRepos(),
      config: {
        JWT_SECRET: 'test-secret',
      },
    });

    const token = await registerAndGetToken(app);

    const postRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'A', body: '1' })
      .expect(201);
    const postId = postRes.body.data.id;

    const createComment = await request(app)
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Nice!' })
      .expect(201);

    expect(createComment.body.data.postId).toBe(postId);

    const list = await request(app).get(`/posts/${postId}/comments`).expect(200);
    expect(list.body.data).toHaveLength(1);
  });

  it('returns 404 when post does not exist', async () => {
    const app = createApp({
      repos: await createRepos(),
      config: {
        JWT_SECRET: 'test-secret',
      },
    });

    const token = await registerAndGetToken(app);

    const res = await request(app)
      .post('/posts/9999/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'x' })
      .expect(404);
    expect(res.body.error.code).toBe('not_found');
  });
});