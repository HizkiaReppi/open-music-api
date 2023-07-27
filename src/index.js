import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import dotenv from 'dotenv';

import albums from './api/albums/index.js';
import songs from './api/songs/index.js';
import users from './api/users/index.js';
import authentications from './api/authentications/index.js';
import playlists from './api/playlists/index.js';
import collaborations from './api/collaborations/index.js';
import _exports from './api/exports/index.js';

import AlbumsService from './services/postgres/AlbumService.js';
import SongsService from './services/postgres/SongService.js';
import UsersService from './services/postgres/UserService.js';
import AuthenticationsService from './services/postgres/AuthenticationsService.js';
import PlaylistsService from './services/postgres/PlaylistService.js';
import CollaborationsService from './services/postgres/CollaborationsService.js';
import ProducerService from './services/rabbitmq/ProducerService.js';

import albumsValidator from './validators/albums/index.js';
import songsValidator from './validators/songs/index.js';
import usersValidator from './validators/users/index.js';
import authenticationsValidator from './validators/authentications/index.js';
import playlistsValidator from './validators/playlists/index.js';
import collaborationsValidator from './validators/collaborations/index.js';
import exportsValidator from './validators/exports/index.js';

import ClientError from './exceptions/ClientError.js';

import TokenManager from './tokenize/TokenManager.js';

import logger from './utils/logging.js';

dotenv.config();

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);

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
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('open_music_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: users,
      options: {
        service: usersService,
        validator: usersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: authenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        songsService,
        validator: playlistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: collaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        producerService: ProducerService,
        playlistsService,
        validator: exportsValidator,
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

        logger.error(response.message);
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
      logger.error('Terjadi kegagalan pada server');
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  logger.info(`Server berjalan pada ${server.info.uri}`);
};

init();
