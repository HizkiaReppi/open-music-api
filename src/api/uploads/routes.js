import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = ({ postUploadAlbumCoverHandler }) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: postUploadAlbumCoverHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/albums/images/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../albums/file/images/album_cover'),
      },
    },
  },
];

export default routes;
