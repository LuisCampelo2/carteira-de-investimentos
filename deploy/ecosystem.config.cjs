module.exports = {
  apps: [
    {
      name: 'mapa-mental-backend',
      cwd: '/var/www/mapa-mental-investimento/backend',
      script: 'dist/index.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
