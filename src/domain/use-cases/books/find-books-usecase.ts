import 'reflect-metadata';
import { injectable, inject } from 'inversify';

import { Book, BookStatus } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { BookFindQuery } from '@domain/types/book/BookFindQuery';
import { PaginatedResponse } from '@domain/types/pagination';
import { BOOK_REPOSITORY } from '@di/tokens';

@injectable()
export class FindBooksUseCase {
  constructor(@inject(BOOK_REPOSITORY) private readonly bookRepository: BookRepository) {}

  async execute(query: BookFindQuery): Promise<PaginatedResponse<Book>> {
    const paginatedBooks = await this.bookRepository.findMany({
      ...query,
      status: BookStatus.PUBLISHED,
    });

    return paginatedBooks;
  }
}