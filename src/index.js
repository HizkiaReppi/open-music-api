import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import albums from './api/albums/index.js';
import AlbumsService from './services/AlbumService.js';
import albumsValidator from './validator/albums/index.js';

dotenv.config();

const init = async () => {
  const albumsService = new AlbumsService();
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
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
