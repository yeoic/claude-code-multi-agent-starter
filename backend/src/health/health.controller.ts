import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
}

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): HealthResponse {
    return this.healthService.getHealth();
  }
}
