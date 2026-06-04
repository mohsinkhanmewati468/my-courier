import { Controller } from '@nestjs/common';
import { JobServiceService } from './job-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class JobServiceController {
  constructor(private readonly jobServiceService: JobServiceService) {}

  @MessagePattern('service.ping')
  ping() {
    return this.jobServiceService.ping();
  }
}
