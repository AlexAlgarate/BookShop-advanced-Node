import { Book, BookStatus } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { BookFindQuery } from '@domain/types/book/BookFindQuery';
import { PaginatedResponse } from '@domain/types/pagination';

export class FindBooksUseCase {
  private readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(query: BookFindQuery): Promise<PaginatedResponse<Book>> {
    const paginatedBooks = await this.bookRepository.findMany({
      ...query,
      status: BookStatus.PUBLISHED,
    });

    return paginatedBooks;
  }
}
