import 'reflect-metadata';
import { injectable, inject } from 'inversify';

import { Book } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { EntityNotFoundError, ForbiddenOperation } from '@domain/types/errors';
import { BOOK_REPOSITORY } from '@di/tokens';

@injectable()
export class DeleteBookUseCase {
  constructor(@inject(BOOK_REPOSITORY) private readonly bookRepository: BookRepository) {}

  public async execute(bookId: string, userId: string): Promise<void> {
    const bookToRemove = await this.getBookToRemove(bookId);

    this.ensureUserIsOwner(userId, bookToRemove.ownerId);

    const isRemoved = await this.bookRepository.deleteBook(bookId);

    if (!isRemoved) {
      throw new EntityNotFoundError('Book', bookId);
    }
  }

  private async getBookToRemove(bookId: string): Promise<Book> {
    const book = await this.bookRepository.findById(bookId);

    if (!book) {
      throw new EntityNotFoundError('Book', bookId);
    }

    return book;
  }

  private ensureUserIsOwner(userId: string, ownerId: string): void {
    if (userId !== ownerId) {
      throw new ForbiddenOperation('Only the owner can delete this book');
    }
  }
}