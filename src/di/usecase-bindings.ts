import { CreateBookUseCase } from '@application/use-cases/books/create-book-usecase';
import { FindBooksUseCase } from '@application/use-cases/books/find-books-usecase';
import { FindUserBooksUseCase } from '@application/use-cases/books/find-user-book-usecase';
import { UpdateBookUseCase } from '@application/use-cases/books/update-book-usecase';
import { DeleteBookUseCase } from '@application/use-cases/books/delete-book-usecase';
import { BuyBookUseCase } from '@application/use-cases/books/buy-book-usecase';
import { SendPriceReductionSuggestionUseCase } from '@application/use-cases/books/send-price-reduction-suggestion-usecase';
import { CreateUserUseCase } from '@application/use-cases/user/create-user-usecase';
import { LoginUserUseCase } from '@application/use-cases/user/login-user-usecase';

import { BookRepository } from '@domain/repositories/BookRepository';
import { UserRepository } from '@domain/repositories/UserRepository';
import { EmailService } from '@domain/services/EmailService';
import { NotificationTemplateService } from '@domain/services/NotificationTemplateService';
import { LoggerService } from '@domain/services/LoggerService';
import { SecurityService } from '@domain/services/SecurityService';

import { container } from './container';
import {
  CREATE_BOOK_USE_CASE,
  FIND_BOOKS_USE_CASE,
  FIND_USER_BOOKS_USE_CASE,
  UPDATE_BOOK_USE_CASE,
  DELETE_BOOK_USE_CASE,
  BUY_BOOK_USE_CASE,
  SEND_PRICE_REDUCTION_USE_CASE,
  CREATE_USER_USE_CASE,
  LOGIN_USER_USE_CASE,
  BOOK_REPOSITORY,
  USER_REPOSITORY,
  EMAIL_SERVICE,
  NOTIFICATION_TEMPLATE_SERVICE,
  LOGGER_SERVICE,
  SECURITY_SERVICE,
} from './tokens';

export function registerUseCases(): void {
  container.bind(CREATE_BOOK_USE_CASE).toDynamicValue(() => {
    const bookRepository = container.get<BookRepository>(BOOK_REPOSITORY);
    return new CreateBookUseCase(bookRepository);
  });

  container.bind(FIND_BOOKS_USE_CASE).toDynamicValue(() => {
    const bookRepository = container.get<BookRepository>(BOOK_REPOSITORY);
    return new FindBooksUseCase(bookRepository);
  });

  container.bind(FIND_USER_BOOKS_USE_CASE).toDynamicValue(() => {
    const bookRepository = container.get<BookRepository>(BOOK_REPOSITORY);
    return new FindUserBooksUseCase(bookRepository);
  });

  container.bind(UPDATE_BOOK_USE_CASE).toDynamicValue(() => {
    const bookRepository = container.get<BookRepository>(BOOK_REPOSITORY);
    return new UpdateBookUseCase(bookRepository);
  });

  container.bind(DELETE_BOOK_USE_CASE).toDynamicValue(() => {
    const bookRepository = container.get<BookRepository>(BOOK_REPOSITORY);
    return new DeleteBookUseCase(bookRepository);
  });

  container.bind(BUY_BOOK_USE_CASE).toDynamicValue(() => {
    const bookRepository = container.get<BookRepository>(BOOK_REPOSITORY);
    const userRepository = container.get<UserRepository>(USER_REPOSITORY);
    const emailService = container.get<EmailService>(EMAIL_SERVICE);
    const templateService = container.get<NotificationTemplateService>(
      NOTIFICATION_TEMPLATE_SERVICE
    );
    const loggerService = container.get<LoggerService>(LOGGER_SERVICE);
    return new BuyBookUseCase(
      bookRepository,
      userRepository,
      emailService,
      templateService,
      loggerService
    );
  });

  container.bind(SEND_PRICE_REDUCTION_USE_CASE).toDynamicValue(() => {
    const bookRepository = container.get<BookRepository>(BOOK_REPOSITORY);
    const userRepository = container.get<UserRepository>(USER_REPOSITORY);
    const emailService = container.get<EmailService>(EMAIL_SERVICE);
    const templateService = container.get<NotificationTemplateService>(
      NOTIFICATION_TEMPLATE_SERVICE
    );
    return new SendPriceReductionSuggestionUseCase(
      bookRepository,
      userRepository,
      emailService,
      templateService
    );
  });

  container.bind(CREATE_USER_USE_CASE).toDynamicValue(() => {
    const userRepository = container.get<UserRepository>(USER_REPOSITORY);
    const securityService = container.get<SecurityService>(SECURITY_SERVICE);
    return new CreateUserUseCase(userRepository, securityService);
  });

  container.bind(LOGIN_USER_USE_CASE).toDynamicValue(() => {
    const userRepository = container.get<UserRepository>(USER_REPOSITORY);
    const securityService = container.get<SecurityService>(SECURITY_SERVICE);
    return new LoginUserUseCase(userRepository, securityService);
  });
}
