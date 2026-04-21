import { CreateBookUseCase } from '@domain/use-cases/books/create-book-usecase';
import { FindBooksUseCase } from '@domain/use-cases/books/find-books-usecase';
import { FindUserBooksUseCase } from '@domain/use-cases/books/find-user-book-usecase';
import { UpdateBookUseCase } from '@domain/use-cases/books/update-book-usecase';
import { DeleteBookUseCase } from '@domain/use-cases/books/delete-book-usecase';
import { BuyBookUseCase } from '@domain/use-cases/books/buy-book-usecase';
import { SendPriceReductionSuggestionUseCase } from '@domain/use-cases/books/send-price-reduction-suggestion-usecase';
import { CreateUserUseCase } from '@domain/use-cases/user/create-user-usecase';
import { LoginUserUseCase } from '@domain/use-cases/user/login-user-usecase';

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
  container.bind(CREATE_BOOK_USE_CASE).toDynamicValue(ctx => new CreateBookUseCase(ctx.get(BOOK_REPOSITORY)));
  container.bind(FIND_BOOKS_USE_CASE).toDynamicValue(ctx => new FindBooksUseCase(ctx.get(BOOK_REPOSITORY)));
  container.bind(FIND_USER_BOOKS_USE_CASE).toDynamicValue(ctx => new FindUserBooksUseCase(ctx.get(BOOK_REPOSITORY)));
  container.bind(UPDATE_BOOK_USE_CASE).toDynamicValue(ctx => new UpdateBookUseCase(ctx.get(BOOK_REPOSITORY)));
  container.bind(DELETE_BOOK_USE_CASE).toDynamicValue(ctx => new DeleteBookUseCase(ctx.get(BOOK_REPOSITORY)));
  container.bind(BUY_BOOK_USE_CASE).toDynamicValue(ctx => new BuyBookUseCase(
    ctx.get(BOOK_REPOSITORY),
    ctx.get(USER_REPOSITORY),
    ctx.get(EMAIL_SERVICE),
    ctx.get(NOTIFICATION_TEMPLATE_SERVICE),
    ctx.get(LOGGER_SERVICE)
  ));
  container.bind(SEND_PRICE_REDUCTION_USE_CASE).toDynamicValue(ctx => new SendPriceReductionSuggestionUseCase(
    ctx.get(BOOK_REPOSITORY),
    ctx.get(USER_REPOSITORY),
    ctx.get(EMAIL_SERVICE),
    ctx.get(NOTIFICATION_TEMPLATE_SERVICE)
  ));
  container.bind(CREATE_USER_USE_CASE).toDynamicValue(ctx => new CreateUserUseCase(
    ctx.get(USER_REPOSITORY),
    ctx.get(SECURITY_SERVICE)
  ));
  container.bind(LOGIN_USER_USE_CASE).toDynamicValue(ctx => new LoginUserUseCase(
    ctx.get(USER_REPOSITORY),
    ctx.get(SECURITY_SERVICE)
  ));
}