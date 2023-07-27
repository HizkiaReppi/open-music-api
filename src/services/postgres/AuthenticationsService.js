import pg from 'pg';
import InvariantError from '../../exceptions/InvariantError.js';

const { Pool } = pg;

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
    this._tbName = 'authentications';
  }

  async addRefreshToken(token) {
    const query = {
      text: `INSERT INTO ${this._tbName} VALUES($1)`,
      values: [token],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: `SELECT * FROM ${this._tbName} WHERE token = $1`,
      values: [token],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: `DELETE FROM ${this._tbName} WHERE token = $1`,
      values: [token],
    };

    await this._pool.query(query);
  }
}

export default AuthenticationsService;
