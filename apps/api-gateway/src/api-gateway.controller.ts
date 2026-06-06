import { CreateUserDto, ISignupResponse, LoginDto } from '@app/common';
import { ILoginResponse } from '@app/common/types/interfaces/login-response.interfact';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface PingResponse {
  message: string;
}

interface HealthResult {
  ok: boolean;
  service: string;
  result?: PingResponse;
  error?: string;
}

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject('IDENTITY_CLIENT')
    private readonly identityClient: ClientProxy,

    @Inject('JOB_CLIENT')
    private readonly jobClient: ClientProxy,
  ) {}

  @Get('health')
  async health() {
    const ping = async (
      serviceName: string,
      client: ClientProxy,
    ): Promise<HealthResult> => {
      try {
        const result = await firstValueFrom(
          client.send<PingResponse>('service.ping', {
            from: 'gateway',
          }),
        );

        return {
          ok: true,
          service: serviceName,
          result,
        };
      } catch (error: unknown) {
        return {
          ok: false,
          service: serviceName,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    };

    const [identity, job] = await Promise.all([
      ping('identity_service', this.identityClient),
      ping('job_service', this.jobClient),
    ]);

    return {
      ok: identity.ok && job.ok,
      gateway: {
        service: 'gateway',
        now: new Date().toISOString(),
      },
      services: {
        identity,
        job,
      },
    };
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return firstValueFrom(
      this.identityClient.send<ISignupResponse>('signup', createUserDto),
    );
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return firstValueFrom(
      this.identityClient.send<ILoginResponse>('login', loginDto),
    );
  }
}
