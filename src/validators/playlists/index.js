import InvariantError from '../../exceptions/InvariantError.js';
import {
  PlaylistsPayloadScheme,
  SongsPlaylistPayloadScheme,
} from './schema.js';

const playlistsValidator = {
  validatePlaylistPayload: (payload) => {
    const { error } = PlaylistsPayloadScheme.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  validateSongPlaylistPayload: (payload) => {
    const { error } = SongsPlaylistPayloadScheme.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default playlistsValidator;
