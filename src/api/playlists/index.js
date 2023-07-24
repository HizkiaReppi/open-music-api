import PlaylistsHandler from './handler.js';
import routes from './routes.js';

const playlistsPlugin = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { playlistsService, songsService, validator }) => {
    const playlistHandler = new PlaylistsHandler(
      playlistsService,
      songsService,
      validator,
    );
    server.route(routes(playlistHandler));
  },
};

export default playlistsPlugin;
