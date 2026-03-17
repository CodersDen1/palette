module.exports = {
  apps: [
    {
      name: "palette",
      script: "./node_modules/.bin/vite",
      args: "preview --host 0.0.0.0 --port 4173",
      cwd: "/home/palette-2",
      watch: false,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        NODE_ENV: "production",
        PORT: 4173,
      },
    },
  ],
};
