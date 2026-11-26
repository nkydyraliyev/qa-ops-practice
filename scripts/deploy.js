'use strict';

// ИМИТАЦИЯ деплоя на тестовое окружение.
// Настоящая джоба здесь выкатила бы сборку на сервер / в Kubernetes,
// а мы только записываем, "что и куда" было бы задеплоено.

const fs = require('node:fs');

const info = {
  environment: process.env.APP_ENV || 'local',
  build: process.env.BUILD_NUMBER || 'local',
  commit: process.env.GIT_COMMIT || 'unknown',
  branch: process.env.GIT_BRANCH || 'unknown',
  node: process.env.NODE_NAME || 'local',
  deployedAt: new Date().toISOString(),
};

fs.writeFileSync('deploy-info.json', JSON.stringify(info, null, 2));
console.log(`[deploy] Build #${info.build} (${info.commit.slice(0, 7)}) deployed to "${info.environment}" (simulation)`);
