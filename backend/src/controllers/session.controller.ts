import {
  Controller,
  Post,
  Get,
  Body,
  Route,
  Tags,
  Security,
  Request,
  Path,
  Query,
  SuccessResponse,
} from 'tsoa';
import * as sessionService from '../services/session.service';
import * as userRepository from '../repositories/user.repository';
import {
  CreateSessionRequest,
  CreateSessionResponse,
  SessionDetailResponse,
  UserSessionsResponse,
  StartSessionResponse,
  UpdateSessionRequest,
  PickParticipantRequest,
  PickParticipantResponse,
  GetAssignmentResponse,
  SessionBasicInfo,
  JoinSessionRequest,
  JoinSessionResponse,
} from '../types/session.dto';
import { SUCCESS_MESSAGES } from '../constants';
import { Request as ExpressRequest } from 'express';

// Helper function to convert Date to ISO string
const toISOString = (date: Date): string => date.toISOString();

@Route('sessions')
@Tags('Sessions')
export class SessionController extends Controller {
  /**
   * Créer une nouvelle session de Secret Santa
   */
  @Post()
  @Security('jwt')
  @SuccessResponse('201', 'Created')
  public async createSession(
    @Body() body: CreateSessionRequest,
    @Request() request: ExpressRequest
  ): Promise<CreateSessionResponse> {
    const userId = (request as ExpressRequest & { userId: string }).userId;

    const session = await sessionService.createSession({
      name: body.name,
      creator_id: userId,
      participants: body.participants || [],
    });

    this.setStatus(201);
    return {
      message: SUCCESS_MESSAGES.SESSION_CREATED,
      session: {
        id: session.id,
        name: session.name,
        invite_code: session.invite_code,
        is_active: session.is_active,
        is_started: session.is_started,
        created_at: toISOString(session.created_at),
      },
    };
  }

  /**
   * Obtenir les détails d'une session par son ID
   */
  @Get('{id}')
  @Security('jwt')
  public async getSession(
    @Path() id: string,
    @Request() request: ExpressRequest
  ): Promise<SessionDetailResponse> {
    const userId = (request as ExpressRequest & { userId: string }).userId;
    const session = await sessionService.getSessionById(id);

    if (!session) {
      this.setStatus(404);
      throw new Error('Session not found');
    }

    const participants = await sessionService.getParticipants(id);
    const isCreator = session.creator_id === userId;

    // Récupérer l'assignation de l'utilisateur connecté s'il participe à la session
    const myAssignment = await sessionService.getMyAssignment(id, userId);

    return {
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
    };
  }

  /**
   * Obtenir les détails d'une session par son code d'invitation
   */
  @Get('invite/{inviteCode}')
  public async getSessionByInviteCode(@Path() inviteCode: string): Promise<SessionDetailResponse> {
    const session = await sessionService.getSessionByInviteCode(inviteCode);

    if (!session) {
      this.setStatus(404);
      throw new Error('Session not found');
    }

    const participants = await sessionService.getParticipants(session.id);

    return {
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
    };
  }

  /**
   * Obtenir toutes les sessions de l'utilisateur connecté
   */
  @Get('user/sessions')
  @Security('jwt')
  public async getUserSessions(@Request() request: ExpressRequest): Promise<UserSessionsResponse> {
    const userId = (request as ExpressRequest & { userId: string }).userId;
    const sessions = await sessionService.getUserSessions(userId);

    // Récupérer le nombre de participants pour chaque session
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

    return {
      sessions: sessionsWithCount,
    };
  }

  /**
   * Démarrer une session (commence le tirage)
   */
  @Post('{id}/start')
  @Security('jwt')
  public async startSession(@Path() id: string): Promise<StartSessionResponse> {
    await sessionService.startSession(id);

    return { message: SUCCESS_MESSAGES.SESSION_STARTED };
  }

  /**
   * Mettre à jour une session
   */
  @Post('{id}/update')
  @Security('jwt')
  @SuccessResponse('200', 'Updated')
  public async updateSession(
    @Path() id: string,
    @Body() body: UpdateSessionRequest,
    @Request() request: ExpressRequest
  ): Promise<{ message: string; session: SessionBasicInfo }> {
    const userId = (request as ExpressRequest & { userId: string }).userId;

    // Vérifier que l'utilisateur est le créateur de la session
    const session = await sessionService.getSessionById(id);
    if (!session || session.creator_id !== userId) {
      this.setStatus(403);
      throw new Error('Unauthorized');
    }

    const updatedSession = await sessionService.updateSession(id, body.name);

    return {
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
    };
  }

  /**
   * Rejoindre une session avec nom et email (public)
   */
  @Post('{id}/join')
  @SuccessResponse('201', 'Created')
  public async joinSession(
    @Path() id: string,
    @Body() body: JoinSessionRequest
  ): Promise<JoinSessionResponse> {
    const participant = await sessionService.joinSession(id, body.name, body.email);

    this.setStatus(201);
    return {
      message: SUCCESS_MESSAGES.SESSION_JOINED,
      participant: {
        id: participant.id,
        name: participant.name,
        email: participant.email,
        has_picked: participant.has_picked,
      },
    };
  }

  /**
   * Rejoindre une session en tant qu'utilisateur authentifié
   */
  @Post('{id}/join-authenticated')
  @Security('jwt')
  @SuccessResponse('201', 'Created')
  public async joinSessionAuthenticated(
    @Path() id: string,
    @Request() request: ExpressRequest
  ): Promise<JoinSessionResponse> {
    console.log('hello');
    const userId = (request as ExpressRequest & { userId: string }).userId;

    // Récupérer les infos de l'utilisateur depuis le token
    const user = await userRepository.findById(userId);

    if (!user) {
      this.setStatus(401);
      throw new Error('User not found');
    }

    const participant = await sessionService.joinSession(id, user.name, user.email, userId);

    this.setStatus(201);
    return {
      message: SUCCESS_MESSAGES.SESSION_JOINED,
      participant: {
        id: participant.id,
        name: participant.name,
        email: participant.email,
        has_picked: participant.has_picked,
      },
    };
  }

  /**
   * Tirer au sort un participant pour offrir un cadeau
   */
  @Post('{id}/pick')
  public async pickParticipant(
    @Path() id: string,
    @Body() body: PickParticipantRequest
  ): Promise<PickParticipantResponse> {
    const assignedParticipant = await sessionService.pickParticipant(id, body.name, body.email);

    return {
      message: SUCCESS_MESSAGES.PICK_SUCCESS,
      assigned_to: {
        name: assignedParticipant.name,
        email: assignedParticipant.email,
      },
    };
  }

  /**
   * Obtenir l'assignation d'un participant (à qui il doit offrir)
   */
  @Get('{id}/assignment')
  public async getAssignment(
    @Path() id: string,
    @Query() email: string
  ): Promise<GetAssignmentResponse> {
    const assignment = await sessionService.getAssignment(id, email);

    if (!assignment) {
      this.setStatus(404);
      throw new Error('Assignment not found');
    }

    return {
      assigned_to: {
        name: assignment.name,
        email: assignment.email,
      },
    };
  }

  /**
   * Supprimer un participant d'une session
   */
  @Post('{id}/participants/{participantId}/delete')
  @Security('jwt')
  @SuccessResponse('200', 'Deleted')
  public async deleteParticipant(
    @Path() id: string,
    @Path() participantId: string,
    @Request() request: ExpressRequest
  ): Promise<{ message: string }> {
    const userId = (request as ExpressRequest & { userId: string }).userId;

    // Vérifier que l'utilisateur est le créateur de la session
    const session = await sessionService.getSessionById(id);
    if (!session || session.creator_id !== userId) {
      this.setStatus(403);
      throw new Error('Unauthorized');
    }

    await sessionService.deleteParticipant(participantId);

    return { message: SUCCESS_MESSAGES.PARTICIPANT_DELETED };
  }

  /**
   * Supprimer une session
   */
  @Post('{id}/delete')
  @Security('jwt')
  @SuccessResponse('200', 'Deleted')
  public async deleteSession(
    @Path() id: string,
    @Request() request: ExpressRequest
  ): Promise<{ message: string }> {
    const userId = (request as ExpressRequest & { userId: string }).userId;

    // Vérifier que l'utilisateur est le créateur de la session
    const session = await sessionService.getSessionById(id);
    if (!session || session.creator_id !== userId) {
      this.setStatus(403);
      throw new Error('Unauthorized');
    }

    await sessionService.deleteSession(id);

    return { message: SUCCESS_MESSAGES.SESSION_DELETED };
  }
}
