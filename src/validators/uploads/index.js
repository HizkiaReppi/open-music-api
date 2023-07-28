import InvariantError from '../../exceptions/InvariantError.js';
import AlbumImageCoverHeadersSchema from './schema.js';

const uploadsValidator = {
  validateAlbumCoverHeaders: (headers) => {
    const { error } = AlbumImageCoverHeadersSchema.validate(headers);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default uploadsValidator;
