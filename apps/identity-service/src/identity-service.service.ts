import { Injectable } from '@nestjs/common';

@Injectable()
export class IdentityServiceService {
  ping() {
    return {
      ok: true,
      service: 'identity-service',
      now: new Date().toISOString(),
    };
  }
}
