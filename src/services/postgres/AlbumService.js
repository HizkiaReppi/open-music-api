import pg from 'pg';
import { nanoid } from 'nanoid';
import { mapDBtoAlbumModel } from '../../utils/index.js';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';

const { Pool } = pg;

class AlbumsService {
  constructor() {
    this._pool = new Pool();
    this._tbName = 'albums';
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${this._tbName} VALUES($1, $2, $3) RETURNING id`,
      values: [id, name, year],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: `SELECT * FROM ${this._tbName} WHERE id = $1`,
      values: [id],
    };
    const { rowCount, rows } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const albumData = rows[0];
    const songQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };

    const songResult = await this._pool.query(songQuery);

    const resultAlbum = {
      id: albumData.id,
      name: albumData.name,
      year: albumData.year,
      coverUrl: albumData.cover,
      songs: songResult.rows,
    };

    return mapDBtoAlbumModel(resultAlbum);
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE ${this._tbName} SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id`,
      values: [name, year, updatedAt, id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async addAlbumCoverById(id, path) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [path, id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan.');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: `DELETE FROM ${this._tbName} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan');
    }
  }
}

export default AlbumsService;
