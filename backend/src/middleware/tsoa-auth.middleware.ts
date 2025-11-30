import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

export function expressAuthentication(
  request: Request,
  securityName: string,
  _scopes?: string[]
): Promise<JwtPayload> {
  if (securityName === 'jwt') {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return Promise.reject(new Error('No token provided'));
    }

    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        process.env.JWT_SECRET!,
        (err: jwt.VerifyErrors | null, decoded: unknown) => {
          if (err) {
            reject(new Error('Invalid token'));
          } else {
            // Attach userId to request for use in controllers
            const payload = decoded as JwtPayload;
            (request as Request & { userId: string }).userId = payload.userId;
            resolve(payload);
          }
        }
      );
    });
  }

  return Promise.reject(new Error('Security scheme not supported'));
}
