import { Test, TestingModule } from '@nestjs/testing';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

describe('HelloController', () => {
  let controller: HelloController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
      providers: [HelloService],
    }).compile();

    controller = module.get<HelloController>(HelloController);
  });

  describe('getHello', () => {
    it('should return { message: "hello world" }', () => {
      const result = controller.getHello();
      expect(result).toEqual({ message: 'hello world' });
    });

    it('should have message property as string', () => {
      const result = controller.getHello();
      expect(typeof result.message).toBe('string');
    });
  });
});
