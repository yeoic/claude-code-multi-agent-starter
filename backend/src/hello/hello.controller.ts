import { Controller, Get } from '@nestjs/common';
import { HelloService } from './hello.service';

export interface HelloResponse {
  message: string;
}

@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get()
  getHello(): HelloResponse {
    return this.helloService.getHello();
  }
}
