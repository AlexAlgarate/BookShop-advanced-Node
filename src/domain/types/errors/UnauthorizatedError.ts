import { DomainError } from './DomainError';

export class UnauthorizatedError extends DomainError {
  readonly name = 'UnauthorizatedError';

  constructor(message: string = 'unauthorizated error') {
    super(message);
  }
}
