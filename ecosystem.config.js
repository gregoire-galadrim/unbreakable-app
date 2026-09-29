module.exports = {
  apps: [
    {
      name: "unstoppable",
      script: "./server.js",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      restart_delay: 1000,
      max_memory_restart: "256M",
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
      },
    },
  ],
};
