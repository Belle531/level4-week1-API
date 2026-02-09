import { describe, expect, it } from 'vitest';
import request from 'supertest';

import { createApp } from '../src/createApp.js';
import { createRepos } from '../src/repositories/index.js';

describe('Authentication', () => {
  it('registers a new user and logs in successfully', async () => {
    const app = createApp({
      repos: await createRepos(),
      config: {
        JWT_SECRET: 'test-secret',
      },
    });

    const registerRes = await request(app).post('/auth/register').send({
      email: 'alice@example.com',
      name: 'Alice',
      password: 'Password123!',
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toHaveProperty('data.token');

    const loginRes = await request(app).post('/auth/login').send({
      email: 'alice@example.com',
      password: 'Password123!',
    });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.token).toBeTruthy();
  });
});