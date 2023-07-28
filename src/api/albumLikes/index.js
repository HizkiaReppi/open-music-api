import AlbumLikesHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'albumLikes',
  version: '1.0.0',
  register: async (server, { service }) => {
    const albumLikesHandler = new AlbumLikesHandler(service);
    server.route(routes(albumLikesHandler));
  },
};
