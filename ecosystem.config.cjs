module.exports = {
  apps: [
    {
      name: "palette",
      script: "npx",
      args: "vite preview --host 0.0.0.0 --port 4173",
      cwd: "~/palette-2",
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "~/palette-2/logs/error.log",
      out_file: "~/palette-2/logs/out.log",
      merge_logs: true,
    },
  ],
};
