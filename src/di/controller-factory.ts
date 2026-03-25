import { container } from '@di/container';
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
} from '@di/tokens';
import type { CreateBookUseCase } from '@domain/use-cases/books/create-book-usecase';
import type { FindBooksUseCase } from '@domain/use-cases/books/find-books-usecase';
import type { FindUserBooksUseCase } from '@domain/use-cases/books/find-user-book-usecase';
import type { UpdateBookUseCase } from '@domain/use-cases/books/update-book-usecase';
import type { DeleteBookUseCase } from '@domain/use-cases/books/delete-book-usecase';
import type { BuyBookUseCase } from '@domain/use-cases/books/buy-book-usecase';
import type { SendPriceReductionSuggestionUseCase } from '@domain/use-cases/books/send-price-reduction-suggestion-usecase';
import type { CreateUserUseCase } from '@domain/use-cases/user/create-user-usecase';
import type { LoginUserUseCase } from '@domain/use-cases/user/login-user-usecase';

type getControllersType = {
  createBookUseCase: () => CreateBookUseCase;
  findBooksUseCase: () => FindBooksUseCase;
  findUserBooksUseCase: () => FindUserBooksUseCase;
  updateBookUseCase: () => UpdateBookUseCase;
  deleteBookUseCase: () => DeleteBookUseCase;
  buyBookUseCase: () => BuyBookUseCase;
  sendPriceReductionUseCase: () => SendPriceReductionSuggestionUseCase;
  createUserUseCase: () => CreateUserUseCase;
  loginUserUseCase: () => LoginUserUseCase;
};

export const getControllers = (): getControllersType => ({
  createBookUseCase: (): CreateBookUseCase => container.get(CREATE_BOOK_USE_CASE),
  findBooksUseCase: (): FindBooksUseCase => container.get(FIND_BOOKS_USE_CASE),
  findUserBooksUseCase: (): FindUserBooksUseCase => container.get(FIND_USER_BOOKS_USE_CASE),
  updateBookUseCase: (): UpdateBookUseCase => container.get(UPDATE_BOOK_USE_CASE),
  deleteBookUseCase: (): DeleteBookUseCase => container.get(DELETE_BOOK_USE_CASE),
  buyBookUseCase: (): BuyBookUseCase => container.get(BUY_BOOK_USE_CASE),
  sendPriceReductionUseCase: (): SendPriceReductionSuggestionUseCase =>
    container.get(SEND_PRICE_REDUCTION_USE_CASE),
  createUserUseCase: (): CreateUserUseCase => container.get(CREATE_USER_USE_CASE),
  loginUserUseCase: (): LoginUserUseCase => container.get(LOGIN_USER_USE_CASE),
});
