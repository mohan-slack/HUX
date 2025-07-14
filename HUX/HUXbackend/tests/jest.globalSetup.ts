const { execSync } = require('child_process');
const path = require('path');

module.exports = async () => {
  process.env.DATABASE_URL = 'file:./test.db?mode=memory&cache=shared';
  // Run migrations for the in-memory DB
  execSync('npx prisma migrate deploy', {
    cwd: path.resolve(__dirname, '../'),
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
  });
}; 