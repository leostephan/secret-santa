import { pool } from '../config/database';
import { User, CreateUserDTO } from '../types';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const findByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

export const findById = async (id: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const findByGoogleId = async (googleId: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
  return result.rows[0] || null;
};

export const create = async (data: CreateUserDTO): Promise<User> => {
  let passwordHash = null;

  if (data.password) {
    passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  }

  const result = await pool.query(
    `INSERT INTO users (email, password_hash, google_id, name)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.email, passwordHash, data.google_id || null, data.name]
  );

  return result.rows[0];
};

export const verifyPassword = async (
  plainPassword: string,
  passwordHash: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, passwordHash);
};
