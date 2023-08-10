import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user';
import { ArtistModule } from './artist/artist.module';
import { Artist } from './artist';
import { AlbumModule } from './album/album.module';
import { Album } from './album';
import { TrackModule } from './track/track.module';
import { Track } from './track';
import { FavoritesModule } from './favorites/favorites.module';
import { Favorites } from './favorites';
import { PrismaModule } from './prisma/prisma.module';
import { UserService } from './user/user.service';
import { ArtistService } from './artist/artist.service';
import { AlbumService } from './album/album.service';
import { TrackService } from './track/track.service';
import { FavoritesService } from './favorites/favorites.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavoritesModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    ArtistService,
    AlbumService,
    TrackService,
    FavoritesService,
    PrismaService,
  ],
})
export class AppModule {}
