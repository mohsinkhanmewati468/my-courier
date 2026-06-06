import { CreateUserDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './users/entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class IdentityServiceService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  ping() {
    return {
      ok: true,
      service: 'identity-service',
      now: new Date().toISOString(),
    };
  }
  private hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
  async signup(createUserDto: CreateUserDto) {
    const { name, email, role } = createUserDto;
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const user = await this.userRepository.save({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const { password, ...result } = user;
    return {
      success: true,
      messsage: 'Signup successfull.',
      data: result,
    };
  }
}
