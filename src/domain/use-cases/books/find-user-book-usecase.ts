import { Book } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { BookFindQuery } from '@domain/types/book/BookFindQuery';
import { PaginatedResponse } from '@domain/types/pagination';

export class FindUserBooksUseCase {
  private readonly bookRepository: BookRepository;
  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  public async execute(query: BookFindQuery): Promise<PaginatedResponse<Book | null>> {
    const paginatedUserBooks = await this.bookRepository.findMany(query);

    return paginatedUserBooks;
  }
}
