import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import type {Request, Response} from 'express'

const sampleToken = '123456789abcdef';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    if (req.headers.authorization !== sampleToken) {
      throw new HttpException('Invalid auth', 401)
    } else {
      next();
    }
  }
}
