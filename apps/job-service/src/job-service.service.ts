import { Injectable } from '@nestjs/common';

@Injectable()
export class JobServiceService {
  ping() {
    return {
      ok: true,
      service: 'job-service',
      now: new Date().toISOString(),
    };
  }
}
