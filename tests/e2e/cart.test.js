'use strict';

// E2E (имитация UI): каждый тест "открывает страницу" ~2,5 с.

const { describe, test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startApp, uiDelay } = require('../helpers');

describe('E2E: cart', () => {
  let app;

  before(async () => {
    app = await startApp();
  });

  after(async () => {
    await app.stop();
  });

  test('unknown promo code keeps the price', async () => {
    await uiDelay();
    const body = await (await fetch(`${app.baseUrl}/api/discount?price=50&code=NOPE`)).json();
    assert.equal(body.final, 50);
  });

  test('negative price shows an error', async () => {
    await uiDelay();
    const res = await fetch(`${app.baseUrl}/api/discount?price=-1&code=SALE10`);
    assert.equal(res.status, 400);
  });
});
