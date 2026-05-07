import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { config } from '../config/index.js';
import * as schema from './schema.js';

const pool = new Pool({ connectionString: config.NEON_DB });

export const db = drizzle(pool, { schema });
export default db;