import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import albums from './api/albums/index.js';
import songs from './api/songs/index.js';
import AlbumsService from './services/AlbumService.js';
import SongsService from './services/SongService.js';
import albumsValidator from './validators/albums/index.js';
import songsValidator from './validators/songs/index.js';
import ClientError from './exceptions/ClientError.js';

dotenv.config();

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: albumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: songsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (req, h) => {
    const { response } = req;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h
          .response({
            status: 'fail',
            message: response.message,
          })
          .code(response.statusCode);
        return newResponse;
      }
      if (!response.isServer) {
        return h.continue;
      }
      const newResponse = h
        .response({
          status: 'error',
          message: 'Mohon maaf, terjadi kegagalan pada server',
        })
        .code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
