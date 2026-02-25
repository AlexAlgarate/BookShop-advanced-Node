import type { CreateBookUseCase } from '@domain/use-cases/books/create-book-usecase';
import type { FindBooksUseCase } from '@domain/use-cases/books/find-books-usecase';
import type { FindUserBooksUseCase } from '@domain/use-cases/books/find-user-book-usecase';
import type { UpdateBookUseCase } from '@domain/use-cases/books/update-book-usecase';
import type { DeleteBookUseCase } from '@domain/use-cases/books/delete-book-usecase';
import type { BuyBookUseCase } from '@domain/use-cases/books/buy-book-usecase';
import type { SendPriceReductionSuggestionUseCase } from '@domain/use-cases/books/send-price-reduction-suggestion-usecase';
import type { CreateUserUseCase } from '@domain/use-cases/user/create-user-usecase';
import type { LoginUserUseCase } from '@domain/use-cases/user/login-user-usecase';

import { container } from './container.js';
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
} from './tokens.js';

export const useCases = {
  createBook: (): CreateBookUseCase => container.resolve(CREATE_BOOK_USE_CASE),
  findBooks: (): FindBooksUseCase => container.resolve(FIND_BOOKS_USE_CASE),
  findUserBooks: (): FindUserBooksUseCase => container.resolve(FIND_USER_BOOKS_USE_CASE),
  updateBook: (): UpdateBookUseCase => container.resolve(UPDATE_BOOK_USE_CASE),
  deleteBook: (): DeleteBookUseCase => container.resolve(DELETE_BOOK_USE_CASE),
  buyBook: (): BuyBookUseCase => container.resolve(BUY_BOOK_USE_CASE),
  sendPriceReduction: (): SendPriceReductionSuggestionUseCase =>
    container.resolve(SEND_PRICE_REDUCTION_USE_CASE),
  createUser: (): CreateUserUseCase => container.resolve(CREATE_USER_USE_CASE),
  loginUser: (): LoginUserUseCase => container.resolve(LOGIN_USER_USE_CASE),
};
