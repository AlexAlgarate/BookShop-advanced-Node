import { DomainError } from './DomainError';

export class ForbiddenOperation extends DomainError {
  readonly name = 'ForbiddenOperation';

  constructor(message: string = 'operation not allowed') {
    super(message);
  }
}
