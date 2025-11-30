/**
 * Domain types - Représentent les entités de la base de données
 */

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  google_id?: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: string;
  name: string;
  creator_id: string;
  invite_code: string;
  is_active: boolean;
  is_started: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Participant {
  id: string;
  session_id: string;
  name: string;
  email: string;
  has_picked: boolean;
  assigned_to?: string;
  user_id?: string;
  created_at: Date;
  updated_at: Date;
}
