export default () => ({
  port: parseInt(process.env.PORT, 10) || 3002,
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:08septembeR%40k12%5E@194.233.81.192:5432/acca_db?schema=public',
  },
  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '379a9b0ad9f10b9f8dfd0564d843f1cf',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '3cea9e3e80932d9d114543f0aa0b2f46',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '9b1208c23ce6d1cf61c67fc1ea89c277aa1462ce35afbf9f97c6283033aaa917',
    bucket: process.env.R2_BUCKET || 'acca',
    publicBaseUrl: process.env.R2_PUBLIC_BASE_URL || 'https://tiny-field-c83e.imbank8993.workers.dev',
    ptspFolder: process.env.R2_PTSP_FOLDER || 'PTSP',
  },
  cors: {
    origins: (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001,https://ptsp.icgowa.sch.id')
      .split(',')
      .map(s => s.trim()),
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60000,
    limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 60,
  },
});
