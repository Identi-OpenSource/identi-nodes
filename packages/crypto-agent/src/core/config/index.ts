import dotenv from 'dotenv'
dotenv.config()

export default {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '3332',
  DATABASE_URL: process.env.DATABASE_URL || '',
  AGENT_SECRET_KEY: process.env.AGENT_SECRET_KEY || '',
  AGENT_API_KEY: process.env.AGENT_API_KEY || '',
}
