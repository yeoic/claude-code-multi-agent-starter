import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('HealthController (e2e)', () => {
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

  describe('GET /health', () => {
    it('should return health status with correct schema', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      // Validate response structure
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
      expect(['ok', 'error']).toContain(response.body.status);
    });

    it('should return status "ok"', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
    });

    it('should return valid ISO timestamp', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toISOString()).toBe(response.body.timestamp);
    });

    it('should return version string', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(typeof response.body.version).toBe('string');
      expect(response.body.version.length).toBeGreaterThan(0);
    });
  });
});
