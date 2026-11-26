'use strict';

const { createApp } = require('../src/app');

// Поднимает приложение на свободном порту и возвращает базовый URL
async function startApp() {
  const server = createApp();
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    stop: () => new Promise((resolve) => server.close(resolve)),
  };
}

// Имитация медленного UI-шага (как будто браузер открывает страницу).
// Нужна только для задания на ускорение прогона.
// В настоящих тестах фиксированные паузы — антипаттерн: ждать нужно конкретное условие.
function uiDelay(ms = Number(process.env.E2E_DELAY_MS) || 2500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { startApp, uiDelay };
