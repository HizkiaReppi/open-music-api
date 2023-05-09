import Joi from 'joi';

const AlbumsSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

export default AlbumsSchema;
