import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger = new Logger('CATCH-ALL')) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    const status = exception.status || 500;

    this.logger.warn(` ==> ${request.method} ${request.url}`);
    try {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
        extraInfo: exception.meta,
      });
    } catch (e) {
      this.logger.error(e.message);
      response.status(500).json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        message: 'Internal Server Error',
      });
    }
  }
}
