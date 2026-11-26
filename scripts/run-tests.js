'use strict';

// Запуск тестов.
//   SUITE   — набор: smoke | regression | e2e | all (по умолчанию smoke)
//   WORKERS — сколько тестовых файлов выполнять параллельно (как --workers в Playwright).
//             Не задан — решает Node.js (по числу ядер).
// Отчёт: в консоль (spec) и в reports/junit.xml (для Jenkins).

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');

const SUITES = {
  smoke: ['tests/smoke/*.test.js'],
  regression: ['tests/regression/*.test.js'],
  e2e: ['tests/e2e/*.test.js'],
  all: ['tests/**/*.test.js'],
};

const suite = process.env.SUITE || 'smoke';
const patterns = SUITES[suite];

if (!patterns) {
  console.error(`ERROR: unknown SUITE="${suite}". Use one of: ${Object.keys(SUITES).join(', ')}`);
  process.exit(2);
}

const args = [
  '--test',
  '--test-reporter=spec', '--test-reporter-destination=stdout',
  '--test-reporter=junit', '--test-reporter-destination=reports/junit.xml',
];

const workers = process.env.WORKERS;
if (workers) {
  if (!/^[1-9]\d*$/.test(workers)) {
    console.error(`ERROR: WORKERS must be a positive number, got "${workers}"`);
    process.exit(2);
  }
  args.push(`--test-concurrency=${workers}`);
}

fs.mkdirSync('reports', { recursive: true });

console.log(
  `[run-tests] SUITE=${suite} WORKERS=${workers || 'auto'} ` +
  `APP_ENV=${process.env.APP_ENV || 'local'} INJECT_BUG=${process.env.INJECT_BUG || '0'}`,
);

const started = Date.now();
const result = spawnSync(process.execPath, [...args, ...patterns], { stdio: 'inherit' });
const seconds = ((Date.now() - started) / 1000).toFixed(1);

console.log(`[run-tests] finished in ${seconds} s with exit code ${result.status}`);
process.exit(result.status === null ? 1 : result.status);
