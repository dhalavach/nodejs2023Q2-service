import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './create-track.dto';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'uuid';
import { UpdateTrackDto } from './update-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.track.findMany();
  }

  async getTrackById(id: string) {
    if (!validate(id)) throw new BadRequestException('invalid id');
    const track = await this.prisma.track.findFirst({ where: { id: id } });
    if (!track) throw new NotFoundException('track not found');
    else return track;
  }

  async createTrack(dto: CreateTrackDto) {
    if (!(dto?.name && dto?.duration)) {
      throw new BadRequestException('dto missing required fields');
    } else {
      const trackData = {
        id: uuidv4(),
        name: dto.name,
        duration: dto.duration,
        artistId: dto?.artistId,
        albumId: dto?.albumId,
      };
      return await this.prisma.track.create({
        data: trackData,
      });
    }
  }

  async updateTrackById(id: string, dto: UpdateTrackDto) {
    if (!validate(id)) throw new BadRequestException('invalid id');

    const track = await this.prisma.track.findFirst({ where: { id: id } });
    if (!track) throw new NotFoundException('track not found');

    if (
      (!dto?.name && !dto?.duration && !dto?.artistId && !dto?.albumId) ||
      (dto?.name && typeof dto?.name !== 'string') ||
      (dto?.duration && typeof dto?.duration !== 'number') ||
      (dto?.artistId && typeof dto?.artistId !== 'string') ||
      (dto?.albumId && typeof dto?.albumId !== 'string')
    )
      throw new BadRequestException('invalid dto');

    const newTrackData = {
      ...track,
      name: dto?.name,
      duration: dto?.duration,
      artistId: dto?.artistId,
      albumId: dto?.albumId,
    };

    return await this.prisma.track.update({
      where: {
        id: id,
      },
      data: newTrackData,
    });
  }

  async deleteTrackById(id: string) {
    if (!validate(id)) throw new BadRequestException('invalid id');

    if (!(await this.prisma.track.findFirst({ where: { id: id } })))
      throw new NotFoundException('track not found');

    return await this.prisma.track.delete({
      where: {
        id: id,
      },
    });
  }
}
