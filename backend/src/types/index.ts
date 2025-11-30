/**
 * Central export point for all types
 */

// Domain types
export * from './domain.types';

// DTOs
export * from './auth.dto';
export * from './session.dto';

// Legacy types - for backward compatibility
export interface CreateUserDTO {
  email: string;
  password?: string;
  google_id?: string;
  name: string;
}

export interface CreateSessionDTO {
  name: string;
  creator_id: string;
  participants?: Array<{
    name: string;
    email: string;
  }>;
}

export interface LoginDTO {
  email: string;
  password: string;
}
