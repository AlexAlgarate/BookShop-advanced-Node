import { CreateBookUseCase } from '@domain/use-cases/books/create-book-usecase';
import { FindBooksUseCase } from '@domain/use-cases/books/find-books-usecase';
import { FindUserBooksUseCase } from '@domain/use-cases/books/find-user-book-usecase';
import { UpdateBookUseCase } from '@domain/use-cases/books/update-book-usecase';
import { DeleteBookUseCase } from '@domain/use-cases/books/delete-book-usecase';
import { BuyBookUseCase } from '@domain/use-cases/books/buy-book-usecase';
import { SendPriceReductionSuggestionUseCase } from '@domain/use-cases/books/send-price-reduction-suggestion-usecase';
import { CreateUserUseCase } from '@domain/use-cases/user/create-user-usecase';
import { LoginUserUseCase } from '@domain/use-cases/user/login-user-usecase';

import { container } from './container.js';
import {
  BOOK_REPOSITORY,
  USER_REPOSITORY,
  EMAIL_SERVICE,
  SECURITY_SERVICE,
  CREATE_BOOK_USE_CASE,
  FIND_BOOKS_USE_CASE,
  FIND_USER_BOOKS_USE_CASE,
  UPDATE_BOOK_USE_CASE,
  DELETE_BOOK_USE_CASE,
  BUY_BOOK_USE_CASE,
  SEND_PRICE_REDUCTION_USE_CASE,
  CREATE_USER_USE_CASE,
  LOGIN_USER_USE_CASE,
} from './tokens.js';

export function registerUseCaseBindings(): void {
  container.register(
    CREATE_BOOK_USE_CASE,
    () => new CreateBookUseCase(container.resolve(BOOK_REPOSITORY))
  );
  container.register(
    FIND_BOOKS_USE_CASE,
    () => new FindBooksUseCase(container.resolve(BOOK_REPOSITORY))
  );
  container.register(
    FIND_USER_BOOKS_USE_CASE,
    () => new FindUserBooksUseCase(container.resolve(BOOK_REPOSITORY))
  );
  container.register(
    UPDATE_BOOK_USE_CASE,
    () => new UpdateBookUseCase(container.resolve(BOOK_REPOSITORY))
  );
  container.register(
    DELETE_BOOK_USE_CASE,
    () => new DeleteBookUseCase(container.resolve(BOOK_REPOSITORY))
  );
  container.register(
    BUY_BOOK_USE_CASE,
    () =>
      new BuyBookUseCase(
        container.resolve(BOOK_REPOSITORY),
        container.resolve(USER_REPOSITORY),
        container.resolve(EMAIL_SERVICE)
      )
  );
  container.register(
    SEND_PRICE_REDUCTION_USE_CASE,
    () =>
      new SendPriceReductionSuggestionUseCase(
        container.resolve(BOOK_REPOSITORY),
        container.resolve(USER_REPOSITORY),
        container.resolve(EMAIL_SERVICE)
      )
  );
  container.register(
    CREATE_USER_USE_CASE,
    () =>
      new CreateUserUseCase(container.resolve(USER_REPOSITORY), container.resolve(SECURITY_SERVICE))
  );
  container.register(
    LOGIN_USER_USE_CASE,
    () =>
      new LoginUserUseCase(container.resolve(USER_REPOSITORY), container.resolve(SECURITY_SERVICE))
  );
}
