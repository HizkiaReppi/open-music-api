import pg from 'pg';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import InvariantError from '../exceptions/InvariantError.js';
import AuthenticationError from '../exceptions/AuthenticationError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

const { Pool } = pg;

class UsersService {
  constructor() {
    this._pool = new Pool();
    this._tbName = 'users';
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: `INSERT INTO ${this._tbName} VALUES($1, $2, $3, $4) RETURNING id`,
      values: [id, username, hashedPassword, fullname],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getUserById(id) {
    const query = {
      text: `SELECT * FROM ${this._tbName} WHERE id = $1`,
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return rows[0];
  }

  async verifyNewUsername(username) {
    const query = {
      text: `SELECT username FROM ${this._tbName} WHERE username = $1`,
      values: [username],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length > 0) {
      throw new InvariantError(
        'Gagal menambahkan user. Username sudah digunakan',
      );
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: `SELECT id, password FROM ${this._tbName} WHERE username = $1`,
      values: [username],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new AuthenticationError('Username atau password salah!');
    }

    const { id, password: hashedPassword } = rows[0];

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      throw new AuthenticationError('Username atau password salah!');
    }

    return id;
  }
}

export default UsersService;
