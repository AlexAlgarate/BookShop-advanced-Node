import { Entity } from './Entity';

export class User extends Entity {
  readonly email: string;
  readonly password: string;

  constructor({
    email,
    password,
    id,
    createdAt,
  }: {
    email: string;
    password: string;
    id: string;
    createdAt: Date;
  }) {
    super(id, createdAt);
    this.email = email;
    this.password = password;
  }
}
