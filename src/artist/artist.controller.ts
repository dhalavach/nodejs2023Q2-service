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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './create-artist.dto';
import { UpdateArtistDto } from './update-artist.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('artist')
export class ArtistController {
  constructor(private readonly ArtistService: ArtistService) {}

  @Get()
  @ApiBearerAuth()
  getAll() {
    return this.ArtistService.getAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  getArtistById(@Param('id') id: string) {
    return this.ArtistService.getArtistById(id);
  }

  @Post()
  @ApiBearerAuth()
  @HttpCode(201)
  createArtist(@Body() dto: CreateArtistDto) {
    return this.ArtistService.createArtist(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  updateArtistById(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return this.ArtistService.updateArtistById(id, updateArtistDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(204)
  deleteArtistById(@Param('id') id: string) {
    return this.ArtistService.deleteArtistById(id);
  }
}
