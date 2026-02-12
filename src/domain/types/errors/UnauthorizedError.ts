import { DomainError } from './DomainError';

export class UnauthorizedError extends DomainError {
  readonly name = 'UnauthorizatedError';

  constructor(message: string = 'unauthorizated error') {
    super(message);
  }
}
