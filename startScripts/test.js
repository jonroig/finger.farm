// simple test start script
// uses pm2, ignores changes to /db
const pm2 = require('pm2');

pm2.connect(() => {
  pm2.start([
    {
      script: 'index.js',
      name: 'FingerFarm',
      exec_mode: 'fork',
      instances: 1,
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
      ignore_watch: ['./db'],
    },
  ], (err) => {
    if (err) throw new Error(err);
    pm2.disconnect();
  });
});