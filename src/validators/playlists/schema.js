import Joi from 'joi';

const PlaylistsPayloadScheme = Joi.object({
  name: Joi.string().required(),
});

const SongsPlaylistPayloadScheme = Joi.object({
  songId: Joi.string().required(),
});

export { PlaylistsPayloadScheme, SongsPlaylistPayloadScheme };
