import 'reflect-metadata';
import { injectable, inject } from 'inversify';

import { Book, BookStatus } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { CreateBookQuery } from '@domain/types/book/CreateBookQuery';
import { BOOK_REPOSITORY } from '@di/tokens';

@injectable()
export class CreateBookUseCase {
  constructor(@inject(BOOK_REPOSITORY) private readonly bookRepository: BookRepository) {}

  public async execute(query: CreateBookQuery): Promise<Book> {
    const createdBook = await this.bookRepository.createOne({
      ...query,
      status: BookStatus.PUBLISHED,
      soldAt: null,
    });

    return createdBook;
  }
}