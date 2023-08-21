import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Logger } from 'src/log/logging-service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error!';

    const errorLogData = {
      request: {
        method: request.method,
        url: request.url,
        query: request.query,
        body: request.body,
      },
      response: {
        statusCode: status,
        message: message,
      },
    };
    await this.logger.error(JSON.stringify(errorLogData));
    response.status(status).json(errorLogData);
  }
}
