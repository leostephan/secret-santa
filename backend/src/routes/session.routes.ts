import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as sessionService from '../services/session.service';
import * as userRepository from '../repositories/user.repository';
import { SUCCESS_MESSAGES } from '../constants';
import { ERROR_MESSAGES } from '@secret-santa/common';

// Interface pour les requêtes authentifiées
interface AuthenticatedRequest extends Request {
  userId: string;
}

const router = Router();

// Helper pour convertir Date en ISO string
const toISOString = (date: Date): string => date.toISOString();

// Helper pour gérer les erreurs et retourner le bon code HTTP
const handleError = (error: unknown, res: Response): void => {
  if (!(error instanceof Error)) {
    res.status(500).json({ error: 'An unknown error occurred' });
    return;
  }

  const message = error.message;

  // Erreurs 404 - Ressource non trouvée
  if (
    message === ERROR_MESSAGES.SESSION_NOT_FOUND ||
    message === ERROR_MESSAGES.PARTICIPANT_NOT_FOUND
  ) {
    res.status(404).json({ error: message });
    return;
  }

  // Erreurs 400 - Requête invalide / état invalide
  if (
    message === ERROR_MESSAGES.SESSION_ALREADY_STARTED ||
    message === ERROR_MESSAGES.SESSION_NOT_STARTED ||
    message === ERROR_MESSAGES.SESSION_NOT_ACTIVE ||
    message === ERROR_MESSAGES.ALREADY_PICKED ||
    message === ERROR_MESSAGES.NO_PARTICIPANTS_AVAILABLE ||
    message === ERROR_MESSAGES.MIN_PARTICIPANTS_REQUIRED ||
    message === ERROR_MESSAGES.CANNOT_SELF_ASSIGN ||
    message === ERROR_MESSAGES.INVALID_EMAIL ||
    message === ERROR_MESSAGES.SESSION_NAME_TOO_SHORT ||
    message === ERROR_MESSAGES.SESSION_NAME_TOO_LONG
  ) {
    res.status(400).json({ error: message });
    return;
  }

  // Erreur 500 par défaut
  res.status(500).json({ error: message });
};

// Middleware d'authentification (extrait de tsoa-auth.middleware)
const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    (req as AuthenticatedRequest).userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * POST /api/sessions - Créer une nouvelle session
 */
router.post('/', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { name, participants = [] } = req.body;

    const session = await sessionService.createSession({
      name,
      creator_id: userId,
      participants,
    });

    res.status(201).json({
      message: SUCCESS_MESSAGES.SESSION_CREATED,
      session: {
        id: session.id,
        name: session.name,
        invite_code: session.invite_code,
        is_active: session.is_active,
        is_started: session.is_started,
        created_at: toISOString(session.created_at),
      },
    });
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * GET /api/sessions/:id - Obtenir les détails d'une session
 */
router.get('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { id } = req.params;

    const session = await sessionService.getSessionById(id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const participants = await sessionService.getParticipants(id);
    const isCreator = session.creator_id === userId;
    const myAssignment = await sessionService.getMyAssignment(id, userId);

    res.json({
      session: {
        id: session.id,
        name: session.name,
        invite_code: session.invite_code,
        is_active: session.is_active,
        is_started: session.is_started,
        created_at: toISOString(session.created_at),
        is_creator: isCreator,
      },
      participants: participants.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        has_picked: p.has_picked,
      })),
      is_creator: isCreator,
      my_assignment: myAssignment
        ? {
            name: myAssignment.name,
            email: myAssignment.email,
          }
        : undefined,
    });
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * GET /api/sessions/invite/:inviteCode - Obtenir session par code d'invitation (PUBLIC)
 */
router.get('/invite/:inviteCode', async (req: Request, res: Response) => {
  try {
    const { inviteCode } = req.params;

    const session = await sessionService.getSessionByInviteCode(inviteCode);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const participants = await sessionService.getParticipants(session.id);

    res.json({
      session: {
        id: session.id,
        name: session.name,
        invite_code: session.invite_code,
        is_active: session.is_active,
        is_started: session.is_started,
        created_at: toISOString(session.created_at),
        is_creator: false,
      },
      participants: participants.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        has_picked: p.has_picked,
      })),
      is_creator: false,
    });
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * GET /api/sessions/user/sessions - Obtenir toutes les sessions de l'utilisateur
 */
router.get('/user/sessions', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const sessions = await sessionService.getUserSessions(userId);

    const sessionsWithCount = await Promise.all(
      sessions.map(async s => {
        const participants = await sessionService.getParticipants(s.id);
        return {
          id: s.id,
          name: s.name,
          invite_code: s.invite_code,
          is_active: s.is_active,
          is_started: s.is_started,
          created_at: toISOString(s.created_at),
          is_creator: s.creator_id === userId,
          participant_count: participants.length,
        };
      })
    );

    res.json({ sessions: sessionsWithCount });
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * POST /api/sessions/:id/start - Démarrer une session
 */
router.post('/:id/start', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await sessionService.startSession(id);
    res.json({ message: SUCCESS_MESSAGES.SESSION_STARTED });
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * POST /api/sessions/:id/update - Mettre à jour une session
 */
router.post('/:id/update', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { id } = req.params;
    const { name } = req.body;

    const session = await sessionService.getSessionById(id);
    if (!session || session.creator_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedSession = await sessionService.updateSession(id, name);

    res.json({
      message: SUCCESS_MESSAGES.SESSION_UPDATED,
      session: {
        id: updatedSession.id,
        name: updatedSession.name,
        invite_code: updatedSession.invite_code,
        is_active: updatedSession.is_active,
        is_started: updatedSession.is_started,
        created_at: toISOString(updatedSession.created_at),
        is_creator: true,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * POST /api/sessions/:id/join - Rejoindre une session (PUBLIC)
 */
router.post('/:id/join', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const participant = await sessionService.joinSession(id, name, email);

    res.status(201).json({
      message: SUCCESS_MESSAGES.SESSION_JOINED,
      participant: {
        id: participant.id,
        name: participant.name,
        email: participant.email,
        has_picked: participant.has_picked,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * POST /api/sessions/:id/join-authenticated - Rejoindre en tant qu'utilisateur authentifié
 */
router.post('/:id/join-authenticated', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { id } = req.params;

    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const participant = await sessionService.joinSession(id, user.name, user.email, userId);

    res.status(201).json({
      message: SUCCESS_MESSAGES.SESSION_JOINED,
      participant: {
        id: participant.id,
        name: participant.name,
        email: participant.email,
        has_picked: participant.has_picked,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * POST /api/sessions/:id/pick - Tirer au sort (PUBLIC)
 */
router.post('/:id/pick', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const assignedParticipant = await sessionService.pickParticipant(id, name, email);

    res.json({
      message: SUCCESS_MESSAGES.PICK_SUCCESS,
      assigned_to: {
        name: assignedParticipant.name,
        email: assignedParticipant.email,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * GET /api/sessions/:id/assignment - Obtenir l'assignation (PUBLIC)
 */
router.get('/:id/assignment', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email } = req.query;

    const assignment = await sessionService.getAssignment(id, email as string);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json({
      assigned_to: {
        name: assignment.name,
        email: assignment.email,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * POST /api/sessions/:id/participants/:participantId/delete - Supprimer un participant
 */
router.post(
  '/:id/participants/:participantId/delete',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const { id, participantId } = req.params;

      const session = await sessionService.getSessionById(id);
      if (!session || session.creator_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await sessionService.deleteParticipant(participantId);
      res.json({ message: SUCCESS_MESSAGES.PARTICIPANT_DELETED });
    } catch (error) {
      handleError(error, res);
    }
  }
);

/**
 * POST /api/sessions/:id/delete - Supprimer une session
 */
router.post('/:id/delete', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { id } = req.params;

    const session = await sessionService.getSessionById(id);
    if (!session || session.creator_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await sessionService.deleteSession(id);
    res.json({ message: SUCCESS_MESSAGES.SESSION_DELETED });
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
