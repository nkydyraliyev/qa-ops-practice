'use strict';

// E2E (имитация UI): каждый тест "открывает страницу" ~2,5 с.

const { describe, test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startApp, uiDelay } = require('../helpers');

describe('E2E: profile', () => {
  let app;

  before(async () => {
    app = await startApp();
  });

  after(async () => {
    await app.stop();
  });

  test('unknown page shows 404', async () => {
    await uiDelay();
    const res = await fetch(`${app.baseUrl}/profile`);
    assert.equal(res.status, 404);
  });

  test('footer shows the app version', async () => {
    await uiDelay();
    const body = await (await fetch(`${app.baseUrl}/health`)).json();
    assert.equal(body.version, process.env.APP_VERSION || 'dev');
  });
});
