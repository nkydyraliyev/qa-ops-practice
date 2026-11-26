# qa-ops-practice

Учебный проект для практики к квалификации **QA Ops KP2**: Git, Pull Request, Jenkins (запуск джоб с параметрами, разбор падений, логи узлов, ускорение прогона) и Docker (запуск контейнеров, сборка образа из готового Dockerfile).

Внешних зависимостей нет: тесты написаны на встроенном в Node.js раннере `node:test`, поэтому `npm install` не нужен.

## Что внутри

| Путь | Что это |
| --- | --- |
| `src/` | Мини-приложение: HTTP-сервер с `/health` и `/api/discount` |
| `tests/smoke/` | Smoke API-тесты: 3 быстрых теста |
| `tests/regression/` | Регрессионные тесты расчёта скидки: 6 тестов + 1 skipped |
| `tests/e2e/` | Имитация медленных UI-тестов: 4 файла по 2 теста, каждый ~2,5 с |
| `scripts/run-tests.js` | Запуск тестов: набор `SUITE`, параллельность `WORKERS`, отчёт `reports/junit.xml` |
| `scripts/deploy.js` | Имитация деплоя на тестовое окружение |
| `Jenkinsfile` | Pipeline с параметрами и учебными поломками |
| `Dockerfile` | Образ приложения |
| `Dockerfile.broken` | Сломанный Dockerfile для задания на чтение ошибки |

## Запуск локально (нужен Node.js 22+)

```bash
npm test                                # smoke-тесты
SUITE=all npm test                      # все тесты (PowerShell: $env:SUITE="all"; npm test)
SUITE=e2e WORKERS=1 npm test            # медленно: ~20 с
SUITE=e2e WORKERS=4 npm test            # параллельно: ~5 с
INJECT_BUG=1 SUITE=all npm test         # учебный баг — часть тестов упадёт
npm start                               # приложение на http://localhost:3000/health
```

## Переменные окружения

| Переменная | Значения | Зачем |
| --- | --- | --- |
| `SUITE` | `smoke` (по умолчанию), `regression`, `e2e`, `all` | Какой набор тестов запускать |
| `WORKERS` | `1`, `2`, `4`…; не задан — по числу ядер | Сколько тестовых файлов выполнять параллельно |
| `APP_ENV` | любое, по умолчанию `local` | Имя окружения, видно в `/health` |
| `INJECT_BUG` | `1` | Учебный баг: скидка не применяется |
| `PORT` | по умолчанию `3000` | Порт приложения |
| `APP_VERSION` | по умолчанию `dev` | Версия, видна в `/health` |
| `E2E_DELAY_MS` | по умолчанию `2500` | Длительность «UI-шага» в e2e-тестах |

## Учебные поломки в Jenkins (параметр `FAILURE_MODE`)

| Значение | Что произойдёт | Ожидаемый статус |
| --- | --- | --- |
| `none` | Всё проходит | SUCCESS |
| `failing-tests` | Включается баг, часть тестов падает | UNSTABLE |
| `broken-step` | Вызывается несуществующий `npm run lint` | FAILURE |
| `timeout` | Шаг ждёт 120 с при лимите 20 с | ABORTED |

## Check