import app from './app.js';
import { config } from './config/index.js';
import { db } from './database/index.js';
import { sql } from 'drizzle-orm';

const start = async () => {
  try {
    await db.execute(sql`SELECT 1`);
    console.log(`==> database connected: neon.`);
    const server = app.listen(config.port, () => {
      console.log(`==> ${config.nodeEnv} server running in: http://localhost:${config.port}`);
    });
    process.on('SIGTERM', () => {
      console.log('==> SIGTERM received, shutting down gracefully');
      server.close(() => {
        // No pool to close with Neon HTTP
        console.log('==> Server closed');
        console.log('Process terminated');
      });
    });
  } catch (err) {
    console.error('==> database connection failed', err);
    process.exit(1);
  }
};

start();