'use strict';

const http = require('node:http');
const { applyDiscount } = require('./discount');

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function createApp() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');

    // Логируем каждый запрос — пригодится для docker logs
    console.log(`${new Date().toISOString()} ${req.method} ${url.pathname}${url.search}`);

    if (req.method === 'GET' && url.pathname === '/health') {
      return sendJson(res, 200, {
        status: 'ok',
        env: process.env.APP_ENV || 'local',
        version: process.env.APP_VERSION || 'dev',
      });
    }

    if (req.method === 'GET' && url.pathname === '/api/discount') {
      const price = Number(url.searchParams.get('price'));
      const code = url.searchParams.get('code');
      try {
        return sendJson(res, 200, { price, code, final: applyDiscount(price, code) });
      } catch (err) {
        console.error(`ERROR ${err.message}`);
        return sendJson(res, 400, { error: err.message });
      }
    }

    return sendJson(res, 404, { error: 'Not found' });
  });
}

module.exports = { createApp };
