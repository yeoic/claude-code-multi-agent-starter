import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('HelloController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /hello', () => {
    it('should return 200 status code', async () => {
      await request(app.getHttpServer())
        .get('/hello')
        .expect(200);
    });

    it('should return { message: "hello world" }', async () => {
      const response = await request(app.getHttpServer())
        .get('/hello')
        .expect(200);

      expect(response.body).toEqual({ message: 'hello world' });
    });

    it('should have message property as string', async () => {
      const response = await request(app.getHttpServer())
        .get('/hello')
        .expect(200);

      expect(typeof response.body.message).toBe('string');
    });
  });
});
