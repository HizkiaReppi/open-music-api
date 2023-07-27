import pg from 'pg';
import { nanoid } from 'nanoid';
import { mapDBtoSongsModel } from '../../utils/index.js';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';

const { Pool } = pg;

class SongsService {
  constructor() {
    this._pool = new Pool();
    this._tbName = 'songs';
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${this._tbName} VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('lagu gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getSongs(title, performer) {
    let query = '';
    if (title && performer) {
      query = {
        text: `SELECT id, title, performer FROM ${this._tbName} WHERE LOWER(title) LIKE $1 AND LOWER(performer) LIKE $2`,
        values: [`%${title}%`, `%${performer}%`],
      };
    } else if (title) {
      query = {
        text: `SELECT id, title, performer FROM ${this._tbName} WHERE LOWER(title) LIKE $1`,
        values: [`%${title}%`],
      };
    } else if (performer) {
      query = {
        text: `SELECT id, title, performer FROM ${this._tbName} WHERE LOWER(performer) LIKE $1`,
        values: [`%${performer}%`],
      };
    } else {
      query = `SELECT id, title, performer FROM ${this._tbName}`;
    }

    const { rows } = await this._pool.query(query);

    return rows;
  }

  async getSongById(id) {
    const query = {
      text: `SELECT * FROM ${this._tbName} WHERE id = $1`,
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return mapDBtoSongsModel(rows[0]);
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE ${this._tbName} SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id`,
      values: [title, year, performer, genre, duration, albumId, updatedAt, id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: `DELETE FROM ${this._tbName} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan');
    }
  }
}

export default SongsService;
