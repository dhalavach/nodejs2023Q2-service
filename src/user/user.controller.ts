import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get()
  getAll() {
    return this.UserService.getAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.UserService.getUserById(id);
  }

  @Post()
  @HttpCode(201)
  createUser(@Body() dto: CreateUserDto) {
    return this.UserService.createUser(dto);
  }

  @Put(':id')
  updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.UserService.updateUserById(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteUserById(@Param('id') id: string) {
    return this.UserService.deleteUserById(id);
  }
}
