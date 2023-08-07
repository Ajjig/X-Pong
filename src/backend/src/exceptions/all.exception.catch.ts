import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Exception } from '@prisma/client/runtime/library';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger = new Logger('CATCH-ALL')) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    const status: number = exception.status || 500;

    
    function getMessages(exception: any) {
      try {
        if (exception.response && exception.response.message)
          return [exception.response.message];
        if (exception.message)
          return [exception.message];
      } catch (e) {}
      return [ "Something went wrong!" ];
    }

    if (status < 400) {
      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString() || new Date(),
        path: request.url || request.originalUrl,
        message: exception.message,
        messages: getMessages(exception),
      });
    }
    
    if (status < 500) {
      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString() || new Date(),
        path: request.url || request.originalUrl,
        message: exception.message,
        messages: getMessages(exception),
      });
    }
    
    this.logger.warn(`${request.method} ${request.url} ${status}: ${exception.message}`);
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString() || new Date(),
      path: request.url || request.originalUrl,
      message: (status >= 500 ? 'Something went wrong!' : exception.message),
      messages: getMessages(exception),
    });
  }
}
