import { Book } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { CreateBookQuery } from '@domain/types/book/CreateBookQuery';
import { BusinessConflictError } from '@domain/types/errors';

export class CreateBookUseCase {
  private readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  public async execute(query: CreateBookQuery): Promise<Book> {
    this.validateBookCreationRules(query);

    const createdBook = await this.bookRepository.createOne(query);

    return createdBook;
  }

  private validateBookCreationRules(query: CreateBookQuery): void {
    if (query.price < 1) {
      throw new BusinessConflictError('Book price must be at least 1');
    }

    if (query.title.trim().length === 0) {
      throw new BusinessConflictError('Book title cannot be empty');
    }
  }
}
