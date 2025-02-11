module.exports = {
  apps: [
    {
      name: 'NETS',
      script: 'build/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
