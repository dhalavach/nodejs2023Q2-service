export type User = {
  id: string;
  login: string;
  password: string;
  createdAt: number;
  updatedAt: number;
  version: number;
  refreshToken?: string;
};

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

export type signupDto = {
  login: string;
  password: string;
};

export type loginDto = {
  login: string;
  password: string;
};

export type refreshDto = {
  refreshToken: string;
};

export type tokensObject = {
  accessToken: string;
  refreshToken: string;
};
