import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { v4 as uuidv4 } from 'uuid';

import { PrismaClient } from '@prisma/client';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { validate } from 'uuid';
import { Album } from 'src/album';
import { FavoritesData } from 'src/types/types';
const prisma = new PrismaClient();

@Injectable()
export class FavoritesService {
  async getAll() {
    const favs = await prisma.favorites.findFirst();
    // console.log('FAVS: ' + favs);
    // console.log('FAVS albums: ' + favs?.albums);
    if (!favs) return { artists: [], albums: [], tracks: [] };

    const tracks = await Promise.all(
      favs.tracks.map(async (id) => {
        const trackObject = await prisma.track.findFirst({
          where: { id: id },
        });

        // return {
        //   artistId: trackObject?.artistId,
        //   id: trackObject?.id,
        //   name: trackObject?.name,
        //   year: trackObject?.duration,
        // };
        return trackObject;
      }),
    );

    const albums = await Promise.all(
      favs.albums.map(async (id) => {
        const albumObject = await prisma.album.findFirst({
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
        const artistObject = await prisma.artist.findFirst({
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

    const album = await prisma.album.findFirst({
      where: {
        id: id,
      },
    });
    if (!album) throw new UnprocessableEntityException();
    const data = await prisma.favorites.findFirst();
    const favObject = {
      favoritesId: uuidv4(),
      albums: [],
      artists: [],
      tracks: [],
    };

    // if (!data) throw new NotFoundException('favorites not found');
    if (!data) {
      await prisma.favorites.create({ data: favObject });
    }
    const albums = data.albums;
    albums.push(album.id);
    // const favId = data ? data.favoritesId : favObject.favoritesId;
    await prisma.favorites.update({
      where: {
        favoritesId: data.favoritesId,
      },
      data: { ...data, albums: albums },
    });
  }

  async addArtist(id: string) {
    if (!validate(id)) throw new BadRequestException('invalid id');

    const artist = await prisma.artist.findFirst({
      where: {
        id: id,
      },
    });
    if (!artist) throw new UnprocessableEntityException();

    const data = await prisma.favorites.findFirst();
    //if (!data) throw new NotFoundException('favorites not found');
    if (!data) {
      const favObject = {
        favoritesId: uuidv4(),
        albums: [],
        artists: [],
        tracks: [],
      };
      favObject.artists.push(artist);
      await prisma.favorites.create({ data: favObject });
    }

    const artistData = data.artists;
    artistData.push(id);
    const newData = { ...data, artists: artistData };
    return await prisma.favorites.update({
      where: {
        favoritesId: data.favoritesId,
      },
      data: newData,
    });
  }

  async addTrack(id: string) {
    if (!validate(id)) throw new BadRequestException('invalid id');

    const track = await prisma.track.findFirst({
      where: {
        id: id,
      },
    });
    if (!track) throw new UnprocessableEntityException();

    const data = await prisma.favorites.findFirst();
    // if (!data) throw new NotFoundException('favorites not found');
    if (!data) {
      const favObject = {
        favoritesId: uuidv4(),
        albums: [],
        artists: [],
        tracks: [],
      };
      favObject.tracks.push(track);
      await prisma.favorites.create({ data: favObject });
    }

    const trackData = data.tracks;
    trackData.push(id);
    const newData = { ...data, tracks: trackData };

    return await prisma.favorites.update({
      where: {
        favoritesId: data.favoritesId,
      },
      data: newData,
    });
  }

  async deleteTrack(id: string) {
    const favs = await prisma.favorites.findFirst();
    const newTracks = favs?.tracks.filter((track) => track !== id);
    const newTrackData = { ...favs, tracks: newTracks };

    return await prisma.favorites.update({
      where: {
        favoritesId: favs.favoritesId,
      },
      data: newTrackData,
    });
  }

  async deleteAlbum(id: string) {
    const favs = await prisma.favorites.findFirst();
    const newAlbums = favs?.albums.filter((album) => album !== id);

    return await prisma.favorites.update({
      where: {
        favoritesId: favs.favoritesId,
      },
      data: { ...favs, albums: newAlbums },
    });
  }
  async deleteArtist(id: string) {
    const favs = await prisma.favorites.findFirst();
    const newArtists = favs?.artists.filter((artist) => artist !== id);

    return await prisma.favorites.update({
      where: {
        favoritesId: favs.favoritesId,
      },
      data: { ...favs, artists: newArtists },
    });
  }
}
