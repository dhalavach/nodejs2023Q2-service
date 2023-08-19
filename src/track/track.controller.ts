import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './create-track.dto';
import { UpdateTrackDto } from './update-track.dto';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('track')
export class TrackController {
  constructor(private readonly TrackService: TrackService) {}

  @Get()
  @ApiBearerAuth()
  getAll() {
    return this.TrackService.getAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  getTrackById(@Param('id') id: string) {
    return this.TrackService.getTrackById(id);
  }

  @Post()
  @ApiBearerAuth()
  @HttpCode(201)
  createTrack(@Body() dto: CreateTrackDto) {
    return this.TrackService.createTrack(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  updateTrackById(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateTrackDto,
  ) {
    return this.TrackService.updateTrackById(id, updateAlbumDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(204)
  deleteTrackById(@Param('id') id: string) {
    return this.TrackService.deleteTrackById(id);
  }
}
