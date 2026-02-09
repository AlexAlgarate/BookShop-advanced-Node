import { User } from '@domain/entities/User';
import { UserCreationQuery } from '@domain/types/user/UserCreationQuery';

export interface UserRepository {
  createOne(query: UserCreationQuery): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  find(): Promise<User[]>;
}
