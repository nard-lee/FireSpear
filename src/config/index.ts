import dotenv from 'dotenv';
dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) throw new Error(`❌ Missing required env var: ${key}`);
  return value;
}

export const config = {

  nodeEnv: getEnv('NODE_ENV', 'development'),
  port: Number(getEnv('PORT', '3000')),
  appUrl: getEnv('APP_URL', `http://localhost:${process.env.PORT || 3000}`),

  sessionSecret: getEnv('SESSION_SECRET'),
  resendKey: getEnv('RESEND_API_KEY'),

  googleClientId: getEnv('GOOGLE_CLIENT_ID'),
  googleClientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
  
  NEON_DB: getEnv('NEON_DATABASE_URL'),

  DB: {
    host: getEnv('DB_HOST'),
    port: Number(getEnv('DB_PORT', '3306')),
    user: getEnv('DB_USER'),
    password: process.env.DB_PASSWORD || undefined, 
    name: getEnv('DB_NAME'),
  },

};