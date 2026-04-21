import 'reflect-metadata';
import { injectable, inject } from 'inversify';

import { Book } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { BookFindQuery } from '@domain/types/book/BookFindQuery';
import { PaginatedResponse } from '@domain/types/pagination';
import { BOOK_REPOSITORY } from '@di/tokens';

@injectable()
export class FindUserBooksUseCase {
  constructor(@inject(BOOK_REPOSITORY) private readonly bookRepository: BookRepository) {}

  public async execute(query: BookFindQuery): Promise<PaginatedResponse<Book | null>> {
    const paginatedUserBooks = await this.bookRepository.findMany(query);

    return paginatedUserBooks;
  }
}