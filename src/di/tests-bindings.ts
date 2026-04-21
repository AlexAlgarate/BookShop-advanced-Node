import { BookRepository } from '@domain/repositories/BookRepository';
import { UserRepository } from '@domain/repositories/UserRepository';
import { EmailService } from '@domain/services/EmailService';
import { LoggerService } from '@domain/services/LoggerService';
import { SecurityService } from '@domain/services/SecurityService';
import { NotificationTemplateService } from '@domain/services/NotificationTemplateService';

import { BookMongoRepository } from '@infrastructure/repositories/book-mongo-repository';
import { UserMongoRepository } from '@infrastructure/repositories/user-mongo-repository';
import { SecurityBcryptService } from '@infrastructure/services/security-bcrypt-service';
import { NotificationTemplateServiceImpl } from '@infrastructure/services/notification-template-service';

import { container } from './container';
import {
  BOOK_REPOSITORY,
  USER_REPOSITORY,
  EMAIL_SERVICE,
  LOGGER_SERVICE,
  SECURITY_SERVICE,
  NOTIFICATION_TEMPLATE_SERVICE,
} from './tokens';
import { registerUseCases } from './usecase-bindings';

export function registerTestBindings(): void {
  registerUseCases();
  container.bind<BookRepository>(BOOK_REPOSITORY).to(BookMongoRepository).inSingletonScope();
  container.bind<UserRepository>(USER_REPOSITORY).to(UserMongoRepository).inSingletonScope();
  container.bind<SecurityService>(SECURITY_SERVICE).to(SecurityBcryptService).inSingletonScope();
  container
    .bind<NotificationTemplateService>(NOTIFICATION_TEMPLATE_SERVICE)
    .to(NotificationTemplateServiceImpl)
    .inSingletonScope();
  container.bind<LoggerService>(LOGGER_SERVICE).toConstantValue({
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  });
  container.bind<EmailService>(EMAIL_SERVICE).toConstantValue({
    sendEmailToSeller: vi.fn(),
  });
}
