import { Controller, Post, Get, Body, Route, Tags, Security, Request, SuccessResponse } from 'tsoa';
import * as authService from '../services/auth.service';
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ProfileResponse,
} from '@secret-santa/common';
import { Request as ExpressRequest } from 'express';

@Route('auth')
@Tags('Authentication')
export class AuthController extends Controller {
  /**
   * Créer un nouveau compte utilisateur
   */
  @Post('register')
  @SuccessResponse('201', 'Created')
  public async register(@Body() body: RegisterRequest): Promise<RegisterResponse> {
    const result = await authService.register({
      email: body.email,
      password: body.password,
      name: body.name,
    });

    this.setStatus(201);
    return {
      message: 'User registered successfully',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
      token: result.token,
    };
  }

  /**
   * Se connecter avec email et mot de passe
   */
  @Post('login')
  public async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    const result = await authService.login({
      email: body.email,
      password: body.password,
    });

    return {
      message: 'Login successful',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
      token: result.token,
    };
  }

  /**
   * Obtenir le profil de l'utilisateur connecté
   */
  @Get('profile')
  @Security('jwt')
  public async getProfile(@Request() request: ExpressRequest): Promise<ProfileResponse> {
    const userId = (request as ExpressRequest & { userId: string }).userId;
    const user = await authService.getUserById(userId);

    if (!user) {
      this.setStatus(404);
      throw new Error('User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at.toISOString(),
      },
    };
  }
}
