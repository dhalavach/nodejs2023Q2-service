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
import { TrackService } from './track.service';
import { CreateTrackDto } from './create-track.dto';
import { UpdateTrackDto } from './update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly TrackService: TrackService) {}

  @Get()
  getAll() {
    return this.TrackService.getAll();
  }

  @Get(':id')
  getTrackById(@Param('id') id: string) {
    return this.TrackService.getTrackById(id);
  }

  @Post()
  @HttpCode(201)
  createTrack(@Body() dto: CreateTrackDto) {
    return this.TrackService.createTrack(dto);
  }

  @Put(':id')
  updateTrackById(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateTrackDto,
  ) {
    return this.TrackService.updateTrackById(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteTrackById(@Param('id') id: string) {
    return this.TrackService.deleteTrackById(id);
  }
}
