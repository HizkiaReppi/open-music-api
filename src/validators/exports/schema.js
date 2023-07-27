import Joi from 'joi';

const ExportPlaylistsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

export default ExportPlaylistsPayloadSchema;
