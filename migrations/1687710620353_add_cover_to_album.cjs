exports.up = (pgm) => {
  pgm.addColumn('albums', {
    cover: {
      type: 'TEXT',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('albums', 'cover');
};
