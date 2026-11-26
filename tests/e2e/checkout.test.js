'use strict';

// E2E (имитация UI): каждый тест "открывает страницу" ~2,5 с.

const { describe, test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startApp, uiDelay } = require('../helpers');

describe('E2E: checkout', () => {
  let app;

  before(async () => {
    app = await startApp();
  });

  after(async () => {
    await app.stop();
  });

  test('SALE10 makes 100 into 90', async () => {
    await uiDelay();
    const body = await (await fetch(`${app.baseUrl}/api/discount?price=100&code=SALE10`)).json();
    assert.equal(body.final, 90);
  });

  test('lowercase sale25 makes 200 into 150', async () => {
    await uiDelay();
    const body = await (await fetch(`${app.baseUrl}/api/discount?price=200&code=sale25`)).json();
    assert.equal(body.final, 150);
  });
});
