import { pool } from '../config/database';
import { Session, CreateSessionDTO, Participant } from '../types';

const generateInviteCode = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export const findById = async (id: string): Promise<Session | null> => {
  const result = await pool.query('SELECT * FROM sessions WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const findByInviteCode = async (inviteCode: string): Promise<Session | null> => {
  const result = await pool.query('SELECT * FROM sessions WHERE invite_code = $1', [inviteCode]);
  return result.rows[0] || null;
};

export const findByCreatorId = async (creatorId: string): Promise<Session[]> => {
  const result = await pool.query(
    'SELECT * FROM sessions WHERE creator_id = $1 ORDER BY created_at DESC',
    [creatorId]
  );
  return result.rows;
};

export const create = async (data: CreateSessionDTO): Promise<Session> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const inviteCode = generateInviteCode();

    // Créer la session
    const sessionResult = await client.query(
      `INSERT INTO sessions (name, creator_id, invite_code)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.name, data.creator_id, inviteCode]
    );

    const session = sessionResult.rows[0];

    // Ajouter les participants et les lier aux utilisateurs si ils existent (optionnel)
    if (data.participants && data.participants.length > 0) {
      for (const participant of data.participants) {
        await client.query(
          `INSERT INTO participants (session_id, name, email, user_id)
           VALUES ($1, $2, $3, (SELECT id FROM users WHERE email = $3))`,
          [session.id, participant.name, participant.email]
        );
      }
    }

    await client.query('COMMIT');
    return session;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const startSession = async (sessionId: string): Promise<void> => {
  await pool.query('UPDATE sessions SET is_started = true WHERE id = $1', [sessionId]);
};

export const updateSession = async (sessionId: string, name: string): Promise<Session | null> => {
  const result = await pool.query(
    'UPDATE sessions SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [name, sessionId]
  );
  return result.rows[0] || null;
};

export const getParticipants = async (sessionId: string): Promise<Participant[]> => {
  const result = await pool.query(
    'SELECT * FROM participants WHERE session_id = $1 ORDER BY created_at ASC',
    [sessionId]
  );
  return result.rows;
};

export const findParticipantByEmail = async (
  sessionId: string,
  email: string
): Promise<Participant | null> => {
  const result = await pool.query(
    'SELECT * FROM participants WHERE session_id = $1 AND email = $2',
    [sessionId, email]
  );
  return result.rows[0] || null;
};

export const createParticipant = async (
  sessionId: string,
  name: string,
  email: string
): Promise<Participant> => {
  const result = await pool.query(
    `INSERT INTO participants (session_id, name, email, user_id)
     VALUES ($1, $2, $3, (SELECT id FROM users WHERE email = $3))
     RETURNING *`,
    [sessionId, name, email]
  );
  return result.rows[0];
};

export const getAvailableParticipants = async (sessionId: string): Promise<Participant[]> => {
  const result = await pool.query(
    'SELECT * FROM participants WHERE session_id = $1 AND has_picked = false ORDER BY created_at ASC',
    [sessionId]
  );
  return result.rows;
};

export const assignParticipant = async (
  participantId: string,
  assignedToId: string
): Promise<void> => {
  await pool.query('UPDATE participants SET assigned_to = $1, has_picked = true WHERE id = $2', [
    assignedToId,
    participantId,
  ]);
};

export const getAssignment = async (participantId: string): Promise<Participant | null> => {
  const result = await pool.query(
    `SELECT p2.* FROM participants p1
     JOIN participants p2 ON p1.assigned_to = p2.id
     WHERE p1.id = $1`,
    [participantId]
  );
  return result.rows[0] || null;
};

export const getParticipantWhoAssigned = async (
  participantId: string
): Promise<Participant | null> => {
  const result = await pool.query('SELECT * FROM participants WHERE assigned_to = $1', [
    participantId,
  ]);
  return result.rows[0] || null;
};

export const deleteParticipant = async (participantId: string): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Trouver qui avait assigné ce participant (personne A)
    const personA = await client.query('SELECT * FROM participants WHERE assigned_to = $1', [
      participantId,
    ]);

    // Trouver à qui ce participant était assigné (personne C)
    const personBResult = await client.query('SELECT assigned_to FROM participants WHERE id = $1', [
      participantId,
    ]);
    const personCId = personBResult.rows[0]?.assigned_to;

    // Si quelqu'un avait assigné ce participant, réassigner à la personne C
    if (personA.rows.length > 0 && personCId) {
      await client.query('UPDATE participants SET assigned_to = $1 WHERE id = $2', [
        personCId,
        personA.rows[0].id,
      ]);
    }

    // Supprimer le participant
    await client.query('DELETE FROM participants WHERE id = $1', [participantId]);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
};

export const linkParticipantsToUser = async (email: string, userId: string): Promise<void> => {
  await pool.query('UPDATE participants SET user_id = $1 WHERE email = $2 AND user_id IS NULL', [
    userId,
    email,
  ]);
};

export const findSessionsByParticipantUserId = async (userId: string): Promise<Session[]> => {
  const result = await pool.query(
    `SELECT DISTINCT s.* FROM sessions s
     INNER JOIN participants p ON s.id = p.session_id
     WHERE p.user_id = $1
     ORDER BY s.created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const linkParticipantToUserIfExists = async (
  participantId: string,
  email: string
): Promise<void> => {
  await pool.query(
    `UPDATE participants p
     SET user_id = u.id
     FROM users u
     WHERE p.id = $1 AND p.email = $2 AND u.email = $2 AND p.user_id IS NULL`,
    [participantId, email]
  );
};

export const getParticipantByUserIdAndSessionId = async (
  userId: string,
  sessionId: string
): Promise<Participant | null> => {
  const result = await pool.query(
    'SELECT * FROM participants WHERE user_id = $1 AND session_id = $2',
    [userId, sessionId]
  );
  return result.rows[0] || null;
};

export const updateParticipantUserId = async (
  participantId: string,
  userId: string
): Promise<void> => {
  await pool.query('UPDATE participants SET user_id = $1 WHERE id = $2', [userId, participantId]);
};

export const createParticipantWithUserId = async (
  sessionId: string,
  name: string,
  email: string,
  userId?: string
): Promise<Participant> => {
  const result = await pool.query(
    `INSERT INTO participants (session_id, name, email, user_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [sessionId, name, email, userId || null]
  );
  return result.rows[0];
};
