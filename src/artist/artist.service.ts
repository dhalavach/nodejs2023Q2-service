import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './create-artist.dto';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'uuid';
import { UpdateArtistDto } from './update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(ArtistService.name);
  async getAll() {
    this.logger.log('getting all artists');
    return await this.prisma.artist.findMany();
  }

  async getArtistById(id: string) {
    if (!validate(id)) throw new BadRequestException('invalid id');
    const artist = await this.prisma.artist.findFirst({ where: { id: id } });
    if (!artist) throw new NotFoundException('artist not found');
    else return artist;
  }

  async createArtist(dto: CreateArtistDto) {
    if (!(dto?.name && dto?.grammy)) {
      throw new BadRequestException('dto missing required fields');
    } else {
      const artistData = {
        id: uuidv4(),
        name: dto.name,
        grammy: dto.grammy,
      };
      return await this.prisma.artist.create({
        data: artistData,
      });
    }
  }

  async updateArtistById(id: string, dto: UpdateArtistDto) {
    if (!validate(id)) throw new BadRequestException('invalid id');

    const artist = await this.prisma.artist.findFirst({ where: { id: id } });
    if (!artist) throw new NotFoundException('artist not found');

    if (
      (!dto?.name && !dto?.grammy) ||
      (dto?.name && typeof dto?.name !== 'string') ||
      (dto?.grammy && typeof dto?.grammy !== 'boolean')
    )
      throw new BadRequestException('invalid dto');

    const newArtistData = {
      ...artist,
      name: dto.name,
      grammy: dto.grammy,
    };

    return await this.prisma.artist.update({
      where: {
        id: id,
      },
      data: newArtistData,
    });
  }

  async deleteArtistById(id: string) {
    if (!validate(id)) throw new BadRequestException('invalid id');

    if (!(await this.prisma.artist.findFirst({ where: { id: id } })))
      throw new NotFoundException('artist not found');

    await this.prisma.album.updateMany({
      where: {
        artistId: {
          equals: id,
        },
      },
      data: {
        artistId: null,
      },
    });

    await this.prisma.track.updateMany({
      where: {
        artistId: {
          equals: id,
        },
      },
      data: {
        artistId: null,
      },
    });

    return await this.prisma.artist.delete({
      where: {
        id: id,
      },
    });
  }
}
