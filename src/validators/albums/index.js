import InvariantError from '../../exceptions/InvariantError.js';
import AlbumsSchema from './schema.js';

const albumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default albumsValidator;
