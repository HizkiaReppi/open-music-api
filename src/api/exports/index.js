import ExportsHandler from './handler.js';
import routes from './routes.js';

const exportsPlugin = {
  name: 'exports',
  version: '1.0.0',
  register: async (
    server,
    { producerService, playlistsService, validator },
  ) => {
    const exportHandler = new ExportsHandler(
      producerService,
      playlistsService,
      validator,
    );
    server.route(routes(exportHandler));
  },
};

export default exportsPlugin;
