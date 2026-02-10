import { User } from '@domain/entities/User';
import { CreateUserQuery } from '@domain/types/user/CreateUserQuery';

export interface UserRepository {
  createOne(query: CreateUserQuery): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  find(): Promise<User[]>;
}
