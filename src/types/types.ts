export type Artist = {
  id: string;
  name: string;
  grammy: boolean;
};

export type Album = {
  id: string;
  name: string;
  year: number;
  artistId: string;
};

export type Track = {
  id: string;
  name: string;
  artistId: string;
  albumId: string;
  duration: number;
};

export type FavoritesData = {
  favoritesId: string;
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
};
