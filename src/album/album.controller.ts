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
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './create-album.dto';
import { UpdateAlbumDto } from './update-album.dto';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('album')
export class AlbumController {
  constructor(private readonly AlbumService: AlbumService) {}

  @Get()
  @ApiBearerAuth()
  getAll() {
    return this.AlbumService.getAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  getAlbumById(@Param('id') id: string) {
    return this.AlbumService.getAlbumById(id);
  }

  @Post()
  @ApiBearerAuth()
  @HttpCode(201)
  createAlbum(@Body() dto: CreateAlbumDto) {
    return this.AlbumService.createAlbum(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  updateAlbumById(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.AlbumService.updateAlbumById(id, updateAlbumDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(204)
  deleteAlbumById(@Param('id') id: string) {
    return this.AlbumService.deleteAlbumById(id);
  }
}
