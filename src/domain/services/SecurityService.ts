import { User } from '@domain/entities/User';

export interface SecurityService {
  hashPassword(password: string): Promise<string>;
  generateJWT(user: User): string;
  comparePasswords(incomingPassword: string, userPassword: string): Promise<boolean>;
  verifyJWT(token: string): { userId: string };
}
