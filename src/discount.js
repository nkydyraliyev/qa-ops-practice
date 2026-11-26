'use strict';

// Промокоды и размер скидки в процентах
const CODES = {
  SALE10: 10,
  SALE25: 25,
  SALE50: 50,
};

/**
 * Возвращает цену после скидки (округление до копеек).
 * Промокод не чувствителен к регистру, неизвестный код = без скидки.
 *
 * INJECT_BUG=1 — учебный "баг": скидка не применяется.
 * Нужен, чтобы в Jenkins увидеть упавшие тесты и разобрать их.
 */
function applyDiscount(price, code) {
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
    throw new RangeError('price must be a non-negative number');
  }

  const normalized = String(code || '').trim().toUpperCase();
  let percent = CODES[normalized] || 0;

  if (process.env.INJECT_BUG === '1') {
    percent = 0; // баг: забыли применить скидку
  }

  const result = price - (price * percent) / 100;
  return Math.round(result * 100) / 100;
}

module.exports = { applyDiscount, CODES };
