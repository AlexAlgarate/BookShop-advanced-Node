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
} from './tokens';

export function registerUseCases(): void {
  container.bind(CREATE_BOOK_USE_CASE).to(CreateBookUseCase);
  container.bind(FIND_BOOKS_USE_CASE).to(FindBooksUseCase);
  container.bind(FIND_USER_BOOKS_USE_CASE).to(FindUserBooksUseCase);
  container.bind(UPDATE_BOOK_USE_CASE).to(UpdateBookUseCase);
  container.bind(DELETE_BOOK_USE_CASE).to(DeleteBookUseCase);
  container.bind(BUY_BOOK_USE_CASE).to(BuyBookUseCase);
  container.bind(SEND_PRICE_REDUCTION_USE_CASE).to(SendPriceReductionSuggestionUseCase);
  container.bind(CREATE_USER_USE_CASE).to(CreateUserUseCase);
  container.bind(LOGIN_USER_USE_CASE).to(LoginUserUseCase);
}
