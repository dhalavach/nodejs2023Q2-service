import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const favs = await this.prisma.favorites.findFirst();

    if (!favs) return { artists: [], albums: [], tracks: [] };

    const tracks = await Promise.all(
      favs.tracks.map(async (id) => {
        const trackObject = await this.prisma.track.findFirst({
          where: { id: id },
        });

        return {
          albumId: trackObject?.albumId,
          artistId: trackObject?.artistId,
          id: trackObject?.id,
          name: trackObject?.name,
          duration: trackObject?.duration,
        };
        // return trackObject;
      }),
    );

    const albums = await Promise.all(
      favs.albums.map(async (id) => {
        const albumObject = await this.prisma.album.findFirst({
          where: { id: id },
        });

        return {
          artistId: albumObject?.artistId,
          id: albumObject?.id,
          name: albumObject?.name,
          year: albumObject?.year,
        };
      }),
    );

    const artists = await Promise.all(
      favs.artists.map(async (id) => {
        const artistObject = await this.prisma.artist.findFirst({
          where: { id: id },
        });

        return {
          id: artistObject?.id,
          name: artistObject?.name,
          grammy: artistObject?.grammy,
        };
      }),
    );

    return {
      tracks: tracks,
      albums: albums,
      artists: artists,
    };
  }

  async addAlbum(id: string) {
    if (!validate(id)) throw new BadRequestException('invalid id');

    const album = await this.prisma.album.findFirst({
      where: {
        id: id,
      },
    });
    if (!album) throw new UnprocessableEntityException();
    const data = await this.prisma.favorites.findFirst();
    const favObject = {
      favoritesId: uuidv4(),
      albums: [],
      artists: [],
      tracks: [],
    };

    // if (!data) throw new NotFoundException('favorites not found');
    if (!data) {
      await this.prisma.favorites.create({ data: favObject });
    }
    const albums = data.albums;
    albums.push(album.id);
    // const favId = data ? data.favoritesId : favObject.favoritesId;
    await this.prisma.favorites.update({
      where: {
        favoritesId: data.favoritesId,
      },
      data: { ...data, albums: albums },
    });
  }

  async addArtist(id: string) {
    if (!validate(id)) throw new BadRequestException('invalid id');

    const artist = await this.prisma.artist.findFirst({
      where: {
        id: id,
      },
    });
    if (!artist) throw new UnprocessableEntityException();

    const data = await this.prisma.favorites.findFirst();
    //if (!data) throw new NotFoundException('favorites not found');
    if (!data) {
      const favObject = {
        favoritesId: uuidv4(),
        albums: [],
        artists: [],
        tracks: [],
      };
      favObject.artists.push(artist.id);
      await this.prisma.favorites.create({ data: favObject });
    }

    const artistData = data.artists;
    artistData.push(id);
    const newData = { ...data, artists: artistData };
    return await this.prisma.favorites.update({
      where: {
        favoritesId: data.favoritesId,
      },
      data: newData,
    });
  }

  async addTrack(id: string) {
    if (!validate(id)) throw new BadRequestException('invalid id');

    const track = await this.prisma.track.findFirst({
      where: {
        id: id,
      },
    });
    if (!track) throw new UnprocessableEntityException('track not found');

    const data = await this.prisma.favorites.findFirst();
    // if (!data) throw new NotFoundException('favorites not found');
    const favObject = {
      favoritesId: uuidv4(),
      albums: [],
      artists: [],
      tracks: [],
    };
    if (!data) await this.prisma.favorites.create({ data: favObject });

    const favId = data ? data.favoritesId : favObject.favoritesId;

    const tracks = data?.tracks || [];
    tracks.push(track.id);

    await this.prisma.favorites.update({
      where: {
        favoritesId: favId,
      },
      data: { ...data, tracks: tracks },
    });
  }

  async deleteTrack(id: string) {
    const favs = await this.prisma.favorites.findFirst();
    if (favs.tracks.findIndex((el) => el === id) === -1) {
      throw new NotFoundException('track not in favorites');
    }
    const newTracks = favs?.tracks.filter((track) => track !== id);

    return await this.prisma.favorites.update({
      where: {
        favoritesId: favs.favoritesId,
      },
      data: { ...favs, tracks: newTracks },
    });
  }

  async deleteAlbum(id: string) {
    const favs = await this.prisma.favorites.findFirst();
    const newAlbums = favs?.albums.filter((album) => album !== id);

    await this.prisma.favorites.update({
      where: {
        favoritesId: favs.favoritesId,
      },
      data: { ...favs, albums: newAlbums },
    });
  }
  async deleteArtist(id: string) {
    const favs = await this.prisma.favorites.findFirst();
    const newArtists = favs?.artists.filter((artist) => artist !== id);

    return await this.prisma.favorites.update({
      where: {
        favoritesId: favs.favoritesId,
      },
      data: { ...favs, artists: newArtists },
    });
  }
}
