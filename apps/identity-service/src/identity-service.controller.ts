import { Controller } from '@nestjs/common';
import { IdentityServiceService } from './identity-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, ISignupResponse, LoginDto } from '@app/common';
import { ILoginResponse } from '@app/common/types/interfaces/login-response.interfact';

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
  signup(@Payload() createUserDto: CreateUserDto): Promise<ISignupResponse> {
    return this.identityServiceService.signup(createUserDto);
  }

  @MessagePattern('login')
  login(@Payload() loginDto: LoginDto): Promise<ILoginResponse> {
    return this.identityServiceService.login(loginDto);
  }
}
