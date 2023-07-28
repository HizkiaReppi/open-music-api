import pg from 'pg';
import { nanoid } from 'nanoid';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import ClientError from '../../exceptions/ClientError.js';

const { Pool } = pg;

class AlbumLikeService {
  constructor(albumService, cacheService) {
    this._pool = new Pool();
    this._albumService = albumService;
    this._cacheService = cacheService;
    this._tbName = 'user_album_likes';
  }

  async addLikesToAlbum(albumId, userId) {
    const id = `like-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${this._tbName} VALUES($1, $2, $3) RETURNING id`,
      values: [id, userId, albumId],
    };
    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Gagal menyukai album');
    }

    await this._cacheService.delete(`album-likes:${albumId}`);

    return rows[0].id;
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`album-likes:${albumId}`);
      return {
        likes: JSON.parse(result),
        cache: true,
      };
    } catch (error) {
      const query = {
        text: `SELECT * FROM ${this._tbName} WHERE album_id = $1`,
        values: [albumId],
      };

      const { rowCount } = await this._pool.query(query);

      if (!rowCount) {
        throw new NotFoundError('Album belum memiliki like');
      }

      await this._cacheService.set(`album-likes:${albumId}`, rowCount);

      return {
        likes: rowCount,
        cache: false,
      };
    }
  }

  async deleteLike(albumId, userId) {
    const query = {
      text: `DELETE FROM ${this._tbName} WHERE album_id = $1 AND user_id = $2`,
      values: [albumId, userId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Like gagal dihapus. Id tidak ditemukan');
    }

    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async verifyUserLiked(albumId, userId) {
    await this._albumService.getAlbumById(albumId);

    const query = {
      text: `SELECT * FROM ${this._tbName} WHERE album_id = $1 AND user_id = $2`,
      values: [albumId, userId],
    };

    const { rowCount } = await this._pool.query(query);

    if (rowCount > 0) {
      throw new ClientError('Anda sudah menyukai album ini');
    }
  }
}

export default AlbumLikeService;
