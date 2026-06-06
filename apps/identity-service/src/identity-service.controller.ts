import { Controller } from '@nestjs/common';
import { IdentityServiceService } from './identity-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '@app/common';

@Controller()
export class IdentityServiceController {
  constructor(
    private readonly identityServiceService: IdentityServiceService,
  ) {}

  @MessagePattern('service.ping')
  ping() {
    return this.identityServiceService.ping();
  }

  @MessagePattern('signup')
  signup(@Payload() createUserDto: CreateUserDto) {
    return this.identityServiceService.signup(createUserDto);
  }
}
