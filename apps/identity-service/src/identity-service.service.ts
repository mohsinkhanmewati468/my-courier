import { CreateUserDto, ISignupResponse, LoginDto } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Role, User } from './users/entities/user.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ILoginResponse } from '@app/common/types/interfaces/login-response.interfact';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class IdentityServiceService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
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
  private comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
  private generateTokens({ id, role }: { id: number; role: Role }): {
    accessToken: string;
    refreshToken: string;
  } {
    const refreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'thisisrefreshsecretkey',
    );
    const accessToken = this.jwtService.sign({ id, role });
    const refreshToken = this.jwtService.sign(
      { id, role },
      { secret: refreshSecret, expiresIn: '1h' },
    );
    return { accessToken, refreshToken };
  }
  async signup(createUserDto: CreateUserDto): Promise<ISignupResponse> {
    const { name, password, email, role } = createUserDto;
    const isUserExists = await this.userRepository.findOne({
      where: { email },
    });
    if (isUserExists) {
      throw new RpcException({
        success: false,
        statusCode: HttpStatus.CONFLICT,
        message: 'This email is already registered.',
      });
    }
    const hashedPassword = await this.hashPassword(password);
    const user: User = await this.userRepository.save({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return {
      success: true,
      message: 'Signup successfull.',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<ILoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOneBy({ email });
    const invalidCredentials = () => {
      throw new RpcException({
        success: false,
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    };
    if (!user) {
      return invalidCredentials();
    }
    const isMatch = await this.comparePassword(password, user.password);
    if (!isMatch) {
      return invalidCredentials();
    }
    const tokens = this.generateTokens({ id: user.id, role: user.role });
    return {
      success: true,
      message: 'Login successfull',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
