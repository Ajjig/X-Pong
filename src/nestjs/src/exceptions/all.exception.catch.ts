import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger = new Logger('CATCH-ALL')) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    const status = exception.status || 500;

    this.logger.warn(` ==> ${request.method} ${request.url} ${status} ${exception.message}`);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString() || new Date(),
      path: request.url || request.originalUrl,
      message: (status >= 500 ? 'Internal server error' : exception.message),
    });
  }
}
