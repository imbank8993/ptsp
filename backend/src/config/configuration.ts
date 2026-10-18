function resolveEnv(val: string | undefined, fallback: string): string {
  if (!val) return fallback;
  const trimmed = val.trim();
  if (
    trimmed === '' ||
    trimmed.startsWith('your_') ||
    trimmed.includes('your-r2-worker') ||
    trimmed.includes('password@host')
  ) {
    return fallback;
  }
  return trimmed;
}

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3003,
  database: {
    url: resolveEnv(
      process.env.DATABASE_URL,
      'postgresql://postgres:08septembeR%40k12%5E@194.233.81.192:5432/acca_db?schema=public',
    ),
  },
  r2: {
    accountId: resolveEnv(process.env.R2_ACCOUNT_ID, '379a9b0ad9f10b9f8dfd0564d843f1cf'),
    accessKeyId: resolveEnv(process.env.R2_ACCESS_KEY_ID, '3cea9e3e80932d9d114543f0aa0b2f46'),
    secretAccessKey: resolveEnv(
      process.env.R2_SECRET_ACCESS_KEY,
      '9b1208c23ce6d1cf61c67fc1ea89c277aa1462ce35afbf9f97c6283033aaa917',
    ),
    bucket: resolveEnv(process.env.R2_BUCKET, 'acca'),
    publicBaseUrl: resolveEnv(
      process.env.R2_PUBLIC_BASE_URL,
      'https://tiny-field-c83e.imbank8993.workers.dev',
    ),
    ptspFolder: resolveEnv(process.env.R2_PTSP_FOLDER, 'PTSP'),
  },
  cors: {
    origins: (
      process.env.CORS_ORIGIN ||
      'http://localhost:3000,http://localhost:3001,http://localhost:3003,https://ptsp.icgowa.sch.id,http://ptsp1.icgowa.sch.id,https://ptsp1.icgowa.sch.id'
    )
      .split(',')
      .map((s) => s.trim()),
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60000,
    limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 60,
  },
});

