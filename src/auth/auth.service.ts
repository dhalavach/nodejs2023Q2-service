//src/auth/auth.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User, tokensObject } from 'src/types/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async setAndReturnTokens(user: User): Promise<tokensObject> {
    const payload = { sub: user.id, username: user.login };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_KEY,
      expiresIn: process.env.TOKEN_EXPIRATION_TIME,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_KEY,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
    });
    const salt = Number(process.env.SALT);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    await this.userService.updateRefreshTokenById(user.id, hashedRefreshToken);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  public async refreshToken(refreshToken: string) {
    const payload = this.jwtService.decode(refreshToken);
    if (!payload) {
      throw new ForbiddenException('forbidden: empty payload');
    }
    const user = await this.userService.getUserById(payload.sub);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    try {
      const secret = process.env.JWT_REFRESH_KEY;
      await this.jwtService.verifyAsync(refreshToken, { secret: secret });
    } catch (err) {
      console.log(err);
      throw new ForbiddenException('forbidden');
    }
    return user;
  }

  public async signup(dto) {
    return await this.userService.createUser(dto);
  }

  public async login(dto): Promise<AuthEntity> {
    const { login, password } = dto;
    const user = await this.userService.getUserByLogin(login);

    if (!user) {
      throw new NotFoundException(`No user found`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokens = await this.setAndReturnTokens(user);
    return tokens;
  }
}
