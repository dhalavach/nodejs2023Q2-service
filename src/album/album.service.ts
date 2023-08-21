import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './create-album.dto';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'uuid';
import { UpdateAlbumDto } from './update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.album.findMany();
  }

  async getAlbumById(id: string) {
    if (!validate(id)) throw new BadRequestException('invalid id');
    const album = await this.prisma.album.findFirst({ where: { id: id } });
    if (!album) throw new NotFoundException('album not found');
    else return album;
  }

  async createAlbum(dto: CreateAlbumDto) {
    if (!(dto?.name && dto?.year)) {
      throw new BadRequestException('dto missing required fields');
    } else {
      const albumData = {
        id: uuidv4(),
        name: dto.name,
        year: dto.year,
        artistId: dto.artistId,
      };
      return await this.prisma.album.create({
        data: albumData,
      });
    }
  }

  async updateAlbumById(id: string, dto: UpdateAlbumDto) {
    if (!validate(id)) throw new BadRequestException('invalid id');

    const album = await this.prisma.album.findFirst({ where: { id: id } });
    if (!album) throw new NotFoundException('album not found');

    if (
      (!dto?.name && !dto?.year && !dto?.artistId) ||
      (dto?.name && typeof dto?.name !== 'string') ||
      (dto?.year && typeof dto?.year !== 'number') ||
      (dto?.artistId && typeof dto?.artistId !== 'string')
    )
      throw new BadRequestException('invalid dto');

    const newAlbumData = {
      ...album,
      name: dto?.name,
      year: dto?.year,
      artistId: dto?.artistId,
    };

    return await this.prisma.album.update({
      where: {
        id: id,
      },
      data: newAlbumData,
    });
  }

  async deleteAlbumById(id: string) {
    if (!validate(id)) throw new BadRequestException('invalid id');

    if (!(await this.prisma.album.findFirst({ where: { id: id } })))
      throw new NotFoundException('album not found');

    await this.prisma.track.updateMany({
      where: {
        albumId: {
          equals: id,
        },
      },
      data: {
        albumId: null,
      },
    });

    return await this.prisma.album.delete({
      where: {
        id: id,
      },
    });
  }
}
