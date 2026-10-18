import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DatabaseService } from '../../database/database.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly dbService?: DatabaseService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Terjadi kesalahan sistem internal. Silakan coba beberapa saat lagi.';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const anyRes = res as any;
        message = anyRes.message || message;
        if (Array.isArray(anyRes.message)) {
          message = anyRes.message[0];
          errors = anyRes.message;
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled Exception at ${request.method} ${request.url}: ${exception.message}`, exception.stack);
      
      // Asynchronously log to ptsp_system_logs
      if (this.dbService) {
        this.dbService.logSystemError(
          request.url,
          exception.message,
          request.body,
          request.headers['user-agent'] as string,
        ).catch(() => {});
      }
    }

    response.status(status).json({
      ok: false,
      statusCode: status,
      message,
      errors: errors || undefined,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
