import InvariantError from '../../exceptions/InvariantError.js';
import AlbumsSchema from './schema.js';

const albumsValidator = {
  validateAlbumPayload: (payload) => {
    const { error } = AlbumsSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default albumsValidator;
