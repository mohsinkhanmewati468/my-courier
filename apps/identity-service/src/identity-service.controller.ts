import { Controller } from '@nestjs/common';
import { IdentityServiceService } from './identity-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class IdentityServiceController {
  constructor(
    private readonly identityServiceService: IdentityServiceService,
  ) {}

  @MessagePattern('service.ping')
  ping() {
    return this.identityServiceService.ping();
  }
}
