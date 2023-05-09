import AlbumsHandler from './handler.js';
import albumRoutes from './routes.js';

export default {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumsHandler = new AlbumsHandler(service, validator);
    server.route(albumRoutes(albumsHandler));
  },
};
