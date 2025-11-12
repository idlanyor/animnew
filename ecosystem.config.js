module.exports = {
  apps: [
    {
      name: "anime-streaming", // nama app lu, bisa lu ganti biar keren
      script: "npm",
      args: "start",
      cwd: __dirname,
      instances: 1, // kalau mau cluster mode: "max"
      exec_mode: "fork", // bisa "cluster" kalo mau scale multi-core
      env: {
        NODE_ENV: "production",
        PORT: 3005, // biar konsisten sama package.json
      },
    },
  ],
};
