'use strict';

const { describe, test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startApp } = require('../helpers');

describe('Smoke: API', () => {
  let app;

  before(async () => {
    app = await startApp();
  });

  after(async () => {
    await app.stop();
  });

  test('GET /health returns 200 and status ok', async () => {
    const res = await fetch(`${app.baseUrl}/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'ok');
  });

  test('GET /health shows the environment from APP_ENV', async () => {
    const res = await fetch(`${app.baseUrl}/health`);
    const body = await res.json();
    assert.equal(body.env, process.env.APP_ENV || 'local');
  });

  test('GET /api/discount applies SALE10 to price 100', async () => {
    const res = await fetch(`${app.baseUrl}/api/discount?price=100&code=SALE10`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.final, 90);
  });
});
