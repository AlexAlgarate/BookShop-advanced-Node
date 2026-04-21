import { Book, BookStatus } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { BookFindQuery } from '@domain/types/book/BookFindQuery';
import { PaginatedResponse } from '@domain/types/pagination';

export class FindBooksUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(query: BookFindQuery): Promise<PaginatedResponse<Book>> {
    const paginatedBooks = await this.bookRepository.findMany({
      ...query,
      status: BookStatus.PUBLISHED,
    });

    return paginatedBooks;
  }
}