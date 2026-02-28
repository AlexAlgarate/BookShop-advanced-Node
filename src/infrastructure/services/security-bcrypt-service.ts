/* eslint-disable import/no-named-as-default-member */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '@domain/entities/User';
import { SecurityService } from '@domain/services/SecurityService';
import { environmentService } from './environment-service';
import { UnauthorizedError } from '@domain/types/errors';

export class SecurityBcryptService implements SecurityService {
  private readonly jwtSecret: string;

  constructor() {
    const { JWT_SECRET } = environmentService.get();
    this.jwtSecret = JWT_SECRET;
  }

  async comparePasswords(incomingPassword: string, userPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(incomingPassword, userPassword);

    if (!isMatch) throw new UnauthorizedError('Password is incorrect');

    return isMatch;
  }

  generateJWT(user: User): string {
    try {
      const token = jwt.sign({ userId: user.id }, this.jwtSecret, { expiresIn: '15Minutes' });
      return token;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'jwt.sign error';
      throw new UnauthorizedError(`Error generating JWT: ${errorMessage}`);
    }
  }
  async hashPassword(password: string): Promise<string> {
    const rounds = process.env.NODE_ENV === 'test' ? 1 : 14;
    const salt = await bcrypt.genSalt(rounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  verifyJWT(token: string): { userId: string } {
    try {
      const data = jwt.verify(token, this.jwtSecret, { algorithms: ['HS256'] }) as {
        userId: string;
      };
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'jwt.verify error';
      throw new UnauthorizedError(`Error verifying JWT: ${errorMessage}`);
    }
  }
}
