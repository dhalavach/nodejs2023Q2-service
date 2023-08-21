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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get()
  @ApiBearerAuth()
  getAll() {
    return this.UserService.getAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  getUserById(@Param('id') id: string) {
    return this.UserService.getUserById(id);
  }

  @Post()
  @HttpCode(201)
  createUser(@Body() dto: CreateUserDto) {
    return this.UserService.createUser(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.UserService.updateUserById(id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(204)
  deleteUserById(@Param('id') id: string) {
    return this.UserService.deleteUserById(id);
  }
}
