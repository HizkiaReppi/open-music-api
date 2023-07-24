exports.up = (pgm) => {
  pgm.createTable('songs_playlist', {
    id: {
      type: 'VARCHAR(35)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(35)',
      references: '"playlists"',
      onDelete: 'cascade',
    },
    song_id: {
      type: 'VARCHAR(35)',
      references: '"songs"',
      onDelete: 'cascade',
    },
    created_at: {
      type: 'timestamp',
      notNull: false,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: false,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs_playlist');
};
