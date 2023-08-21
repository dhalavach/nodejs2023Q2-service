import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'uuid';
import { UpdateUserDto } from './update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  public async getAll() {
    return await this.prisma.user.findMany();
  }

  public async getUserById(id: string) {
    if (!validate(id)) throw new BadRequestException('invalid id');

    if (!(await this.prisma.user.findFirst({ where: { id: id } })))
      throw new NotFoundException('user not found');
    console.log('testing reload');

    return await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
  }

  public async getUserByLogin(login: string) {
    if (!login) throw new BadRequestException('invalid login!');
    if (!(await this.prisma.user.findFirst({ where: { login: login } })))
      throw new NotFoundException('user not found');

    return await this.prisma.user.findFirst({
      where: {
        login: login,
      },
    });
  }

  async createUser(dto: CreateUserDto) {
    if (!(dto.login && dto.password))
      throw new BadRequestException('invalid id');

    const hashedPassword = await bcrypt.hash(dto.password, roundsOfHashing);
    const now = Number(Date.now());

    const userData = {
      id: uuidv4(),
      login: dto.login,
      password: hashedPassword,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    await this.prisma.user.create({
      data: userData,
    });
    delete userData.password;
    return userData;
  }

  async updateUserById(id: string, dto: UpdateUserDto) {
    if (!validate(id)) throw new BadRequestException('invalid id');

    if (!(dto?.oldPassword && dto?.newPassword))
      throw new BadRequestException('invalid dto');

    const user = await this.prisma.user.findFirst({ where: { id: id } });
    if (!user) throw new NotFoundException('user not found');
    const passwordIsValid = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!passwordIsValid) throw new ForbiddenException('wrong password');
    const updatedPassword = await bcrypt.hash(dto.newPassword, roundsOfHashing);
    const newUserData = {
      ...user,
      password: updatedPassword,
      updatedAt: Date.now(),
      version: (user.version += 1),
    };

    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: newUserData,
    });

    delete newUserData.password;
    return newUserData;
  }

  async deleteUserById(id: string) {
    if (!validate(id)) throw new BadRequestException('invalid id');

    if (!(await this.prisma.user.findFirst({ where: { id: id } })))
      throw new NotFoundException('user not found');

    return await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }

  async updateRefreshTokenById(id: string, refreshToken: string) {
    try {
      await this.prisma.user.update({
        where: { id: id },
        data: {
          refreshToken: refreshToken,
        },
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
