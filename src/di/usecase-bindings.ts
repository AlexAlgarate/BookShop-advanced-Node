import { CreateBookUseCase } from '@domain/use-cases/books/create-book-usecase';
import { FindBooksUseCase } from '@domain/use-cases/books/find-books-usecase';
import { FindUserBooksUseCase } from '@domain/use-cases/books/find-user-book-usecase';
import { UpdateBookUseCase } from '@domain/use-cases/books/update-book-usecase';
import { DeleteBookUseCase } from '@domain/use-cases/books/delete-book-usecase';
import { BuyBookUseCase } from '@domain/use-cases/books/buy-book-usecase';
import { SendPriceReductionSuggestionUseCase } from '@domain/use-cases/books/send-price-reduction-suggestion-usecase';
import { CreateUserUseCase } from '@domain/use-cases/user/create-user-usecase';
import { LoginUserUseCase } from '@domain/use-cases/user/login-user-usecase';

import { BookRepository } from '@domain/repositories/BookRepository';
import { UserRepository } from '@domain/repositories/UserRepository';
import { EmailService } from '@domain/services/EmailService';
import { SecurityService } from '@domain/services/SecurityService';
import { NotificationTemplateService } from '@domain/services/NotificationTemplateService';

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
  SECURITY_SERVICE,
  NOTIFICATION_TEMPLATE_SERVICE,
} from './tokens';

export function registerUseCaseBindings(): void {
  container.bind(CREATE_BOOK_USE_CASE).toDynamicValue(context => {
    const bookRepo = context.get<BookRepository>(BOOK_REPOSITORY);
    return new CreateBookUseCase(bookRepo);
  });

  container.bind(FIND_BOOKS_USE_CASE).toDynamicValue(context => {
    const bookRepo = context.get<BookRepository>(BOOK_REPOSITORY);
    return new FindBooksUseCase(bookRepo);
  });

  container.bind(FIND_USER_BOOKS_USE_CASE).toDynamicValue(context => {
    const bookRepo = context.get<BookRepository>(BOOK_REPOSITORY);
    return new FindUserBooksUseCase(bookRepo);
  });

  container.bind(UPDATE_BOOK_USE_CASE).toDynamicValue(context => {
    const bookRepo = context.get<BookRepository>(BOOK_REPOSITORY);
    return new UpdateBookUseCase(bookRepo);
  });

  container.bind(DELETE_BOOK_USE_CASE).toDynamicValue(context => {
    const bookRepo = context.get<BookRepository>(BOOK_REPOSITORY);
    return new DeleteBookUseCase(bookRepo);
  });

  container.bind(BUY_BOOK_USE_CASE).toDynamicValue(context => {
    const bookRepo = context.get<BookRepository>(BOOK_REPOSITORY);
    const userRepo = context.get<UserRepository>(USER_REPOSITORY);
    const emailSvc = context.get<EmailService>(EMAIL_SERVICE);
    const templateSvc = context.get<NotificationTemplateService>(NOTIFICATION_TEMPLATE_SERVICE);
    return new BuyBookUseCase(bookRepo, userRepo, emailSvc, templateSvc);
  });

  container.bind(SEND_PRICE_REDUCTION_USE_CASE).toDynamicValue(context => {
    const bookRepo = context.get<BookRepository>(BOOK_REPOSITORY);
    const userRepo = context.get<UserRepository>(USER_REPOSITORY);
    const emailSvc = context.get<EmailService>(EMAIL_SERVICE);
    const templateSvc = context.get<NotificationTemplateService>(NOTIFICATION_TEMPLATE_SERVICE);
    return new SendPriceReductionSuggestionUseCase(bookRepo, userRepo, emailSvc, templateSvc);
  });

  container.bind(CREATE_USER_USE_CASE).toDynamicValue(context => {
    const userRepo = context.get<UserRepository>(USER_REPOSITORY);
    const securitySvc = context.get<SecurityService>(SECURITY_SERVICE);
    return new CreateUserUseCase(userRepo, securitySvc);
  });

  container.bind(LOGIN_USER_USE_CASE).toDynamicValue(context => {
    const userRepo = context.get<UserRepository>(USER_REPOSITORY);
    const securitySvc = context.get<SecurityService>(SECURITY_SERVICE);
    return new LoginUserUseCase(userRepo, securitySvc);
  });
}
