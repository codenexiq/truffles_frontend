// PM2 process definition. Started by deploy/remote-release.sh from inside each release folder.
module.exports = {
  apps: [
    {
      name: "truffles-web",
      script: "server.js", // Next.js standalone server
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "127.0.0.1", // only nginx talks to it
      },
    },
  ],
};
