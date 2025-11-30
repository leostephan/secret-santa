import * as userRepository from '../repositories/user.repository';
import * as sessionRepository from '../repositories/session.repository';
import { CreateUserDTO, LoginDTO, User } from '../types';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export const register = async (data: CreateUserDTO): Promise<{ user: User; token: string }> => {
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await userRepository.findByEmail(data.email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Créer l'utilisateur
  const user = await userRepository.create(data);

  // Lier les participants existants avec cet email au nouvel utilisateur
  await sessionRepository.linkParticipantsToUser(user.email, user.id);

  // Générer un token JWT
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user, token };
};

export const login = async (data: LoginDTO): Promise<{ user: User; token: string }> => {
  // Trouver l'utilisateur
  const user = await userRepository.findByEmail(data.email);
  if (!user || !user.password_hash) {
    throw new Error('Invalid credentials');
  }

  // Vérifier le mot de passe
  const isValid = await userRepository.verifyPassword(data.password, user.password_hash);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Générer un token JWT
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user, token };
};

export const getUserById = async (id: string): Promise<User | null> => {
  return userRepository.findById(id);
};

export const verifyToken = (token: string): { userId: string; email: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
