import {
  Injectable,
  Logger,
  NestMiddleware,
  RawBodyRequest,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  public logger = new Logger(`HTTP`);
  use(req: RawBodyRequest<Request>, res: Response, next: NextFunction) {
    const body = req.rawBody ? req.rawBody.toString() : '';
    this.logger.log(
      `Method: ${req.method} URL: ${req.url} Header: ${req.rawHeaders} Body:${body} Status: ${res.statusCode}`,
    );
    next();
  }
}
