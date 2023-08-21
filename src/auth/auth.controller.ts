//src/auth/auth.controller.ts

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator';
import { loginDto, refreshDto, signupDto } from 'src/types/types';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(201)
  public async signup(@Body() dto: signupDto) {
    return await this.authService.signup(dto);
  }
  @Public()
  @Post('/login')
  @HttpCode(200)
  public async login(@Body() dto: loginDto) {
    return await this.authService.login(dto);
  }

  @Post('/refresh')
  @HttpCode(200)
  public async refresh(@Body() dto: refreshDto) {
    try {
      const user = await this.authService.refreshToken(dto.refreshToken);
      return await this.authService.setAndReturnTokens(user);
    } catch (err) {
      throw new ForbiddenException('forbidden');
    }
  }
}
