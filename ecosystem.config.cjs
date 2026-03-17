module.exports = {
  apps: [
    {
      name: "palette",
      script: "npm",
      args: "run preview",
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
