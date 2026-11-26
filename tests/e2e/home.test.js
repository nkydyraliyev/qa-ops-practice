'use strict';

// E2E (имитация UI): каждый тест "открывает страницу" ~2,5 с.

const { describe, test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startApp, uiDelay } = require('../helpers');

describe('E2E: home page', () => {
  let app;

  before(async () => {
    app = await startApp();
  });

  after(async () => {
    await app.stop();
  });

  test('home page opens', async () => {
    await uiDelay();
    const res = await fetch(`${app.baseUrl}/health`);
    assert.equal(res.status, 200);
  });

  test('environment badge shows APP_ENV', async () => {
    await uiDelay();
    const body = await (await fetch(`${app.baseUrl}/health`)).json();
    assert.equal(body.env, process.env.APP_ENV || 'local');
  });
});
