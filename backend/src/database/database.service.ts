import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient, types } from 'pg';

// Setup pg type parsers to prevent timezone shift and bigint precision loss
types.setTypeParser(20, (val) => {
  if (val === null) return null;
  const num = Number(val);
  return Number.isSafeInteger(num) ? num : val;
});
types.setTypeParser(1082, (val) => val); // date string 'YYYY-MM-DD'
types.setTypeParser(1083, (val) => val); // time string 'HH:mm:ss'

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const connectionString = this.configService.get<string>('database.url');
    this.pool = new Pool({
      connectionString,
      max: 15,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    this.pool.on('error', (err) => {
      this.logger.error('Unexpected database client error in pool', err);
    });

    this.logger.log('Database pool initialized for acca_db');
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      this.logger.log('Database pool closed');
    }
  }

  /**
   * Execute a parameterized SQL query safely
   */
  async query<T = any>(text: string, params: any[] = []): Promise<T[]> {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      if (duration > 1000) {
        this.logger.warn(`Slow query (${duration}ms): ${text.substring(0, 100)}...`);
      }
      return res.rows as T[];
    } catch (err) {
      this.logger.error(`Database query error: ${err.message}`, {
        text: text.substring(0, 150),
      });
      throw err;
    }
  }

  /**
   * Execute a query and return the single first row or null
   */
  async queryOne<T = any>(text: string, params: any[] = []): Promise<T | null> {
    const rows = await this.query<T>(text, params);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Execute a series of queries in an atomic database transaction
   */
  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      this.logger.error(`Transaction rollback due to error: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Log system errors to ptsp_system_logs asynchronously
   */
  async logSystemError(formType: string, errorMessage: string, payload?: any, userAgent?: string) {
    try {
      const sql = `
        INSERT INTO ptsp_system_logs (level, form_type, error_message, payload_snapshot, user_agent, created_at)
        VALUES ($1, $2, $3, $4, $5, timezone('utc'::text, now()))
      `;
      const safePayload = payload ? JSON.stringify(payload) : null;
      await this.pool.query(sql, ['error', formType, errorMessage, safePayload, userAgent || null]);
    } catch (e) {
      this.logger.error('Failed to write to ptsp_system_logs', e.message);
    }
  }
}
