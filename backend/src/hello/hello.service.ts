import { Injectable } from '@nestjs/common';
import { HelloResponse } from './hello.controller';

@Injectable()
export class HelloService {
  getHello(): HelloResponse {
    return { message: 'hello world' };
  }
}
