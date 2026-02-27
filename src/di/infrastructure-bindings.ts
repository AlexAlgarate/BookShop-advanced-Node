import { BookRepository } from '@domain/repositories/BookRepository';
import { UserRepository } from '@domain/repositories/UserRepository';
import { EmailService } from '@domain/services/EmailService';
import { SecurityService } from '@domain/services/SecurityService';
import { NotificationTemplateService } from '@domain/services/NotificationTemplateService';

import { BookMongoRepository } from '@infrastructure/repositories/book-mongo-repository';
import { UserMongoRepository } from '@infrastructure/repositories/user-mongo-repository';
import { MailtrapService } from '@infrastructure/services/mailtrap-email-service';
import { SecurityBcryptService } from '@infrastructure/services/security-bcrypt-service';
import { NotificationTemplateServiceImpl } from '@infrastructure/services/notification-template-service';

import { container } from './container.js';
import {
  BOOK_REPOSITORY,
  USER_REPOSITORY,
  EMAIL_SERVICE,
  SECURITY_SERVICE,
  NOTIFICATION_TEMPLATE_SERVICE,
} from './tokens.js';

export function registerInfrastructureBindings(): void {
  container.registerSingleton<BookRepository>(BOOK_REPOSITORY, () => new BookMongoRepository());
  container.registerSingleton<UserRepository>(USER_REPOSITORY, () => new UserMongoRepository());
  container.registerSingleton<EmailService>(EMAIL_SERVICE, () => new MailtrapService());
  container.registerSingleton<SecurityService>(SECURITY_SERVICE, () => new SecurityBcryptService());
  container.registerSingleton<NotificationTemplateService>(
    NOTIFICATION_TEMPLATE_SERVICE,
    () => new NotificationTemplateServiceImpl()
  );
}
