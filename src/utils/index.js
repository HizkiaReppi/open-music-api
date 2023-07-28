export const mapDBtoAlbumModel = ({ id, name, year, coverUrl, songs }) => ({
  id,
  name,
  year,
  coverUrl,
  songs,
});

export const mapDBtoSongsModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});
