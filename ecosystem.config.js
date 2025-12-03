const path = require('path');

module.exports = {
  apps: [
    {
      name: 'shadikart',
      script: 'npm',
      args: 'start',
      cwd: process.cwd(), // Use current directory instead of hardcoded path
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      max_memory_restart: '1G',
    },
  ],
}
