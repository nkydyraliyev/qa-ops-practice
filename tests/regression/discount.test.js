'use strict';

const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { applyDiscount } = require('../../src/discount');

describe('Regression: discount', () => {
  test('SALE25 gives 25% off', () => {
    assert.equal(applyDiscount(200, 'SALE25'), 150);
  });

  test('promo code is case-insensitive', () => {
    assert.equal(applyDiscount(100, 'sale10'), 90);
  });

  test('unknown promo code gives no discount', () => {
    assert.equal(applyDiscount(100, 'WRONG'), 100);
  });

  test('price 0 stays 0 (boundary value)', () => {
    assert.equal(applyDiscount(0, 'SALE10'), 0);
  });

  test('result is rounded to 2 decimals', () => {
    assert.equal(applyDiscount(9.99, 'SALE10'), 8.99);
  });

  test('negative price is rejected', () => {
    assert.throws(() => applyDiscount(-1, 'SALE10'), RangeError);
  });

  test('refund flow', { skip: 'BUG-123: refunds are not implemented yet' }, () => {});
});
