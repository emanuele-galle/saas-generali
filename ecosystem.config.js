module.exports = {
  apps: [
    {
      name: "saas-generali",
      user: 'sviluppatore',
      script: "npm",
      args: "start",
      cwd: "/var/www/projects/saas-generali",
      env: {
        NODE_ENV: "production",
        PORT: 3010,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      error_file: "/home/sviluppatore/.pm2/logs/saas-generali-error.log",
      out_file: "/home/sviluppatore/.pm2/logs/saas-generali-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
