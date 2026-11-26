'use strict';

const { createApp } = require('./app');

const port = Number(process.env.PORT) || 3000;

createApp().listen(port, () => {
  console.log(`QA practice app started on port ${port}, APP_ENV=${process.env.APP_ENV || 'local'}`);
});
