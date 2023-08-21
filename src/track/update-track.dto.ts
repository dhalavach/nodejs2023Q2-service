import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateTrackDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  artistId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  albumId: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
