import { DomainError } from './DomainError';

export class EmailServiceError extends DomainError {
  readonly name = 'EmailServiceError';

  constructor(recipientEmail: string) {
    super(`Failed to send email to ${recipientEmail}`);
  }
}
