import InvariantError from '../../exceptions/InvariantError.js';
import SongsSchema from './schema.js';

const songsValidator = {
  validateSongPayload: (payload) => {
    const { error } = SongsSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default songsValidator;
