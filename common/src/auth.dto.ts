/**
 * Authentication DTOs - Types pour les endpoints d'authentification
 */

// Shared types
export interface UserBasicInfo {
  id: string;
  email: string;
  name: string;
}

export interface AuthSuccessResponse {
  message: string;
  user: UserBasicInfo;
  token: string;
}

// Requests
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Responses
export interface RegisterResponse extends AuthSuccessResponse {}

export interface LoginResponse extends AuthSuccessResponse {}

export interface ProfileResponse {
  user: UserBasicInfo & {
    created_at: string; // ISO string for JSON compatibility
  };
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
}
