import Joi from 'joi';

const CollaborationsPayloadScheme = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

export default CollaborationsPayloadScheme;
