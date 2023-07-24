exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
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
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(35)',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(35)',
      notNull: true,
    },
    time: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
