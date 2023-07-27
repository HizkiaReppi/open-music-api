import InvariantError from '../../exceptions/InvariantError.js';
import ExportPlaylistsSchema from './schema.js';

const exportsValidator = {
  validateExportPlaylistsPayload: (payload) => {
    const { error } = ExportPlaylistsSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default exportsValidator;
