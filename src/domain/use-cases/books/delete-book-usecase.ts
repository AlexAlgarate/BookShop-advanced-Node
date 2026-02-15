import { Book } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { EntityNotFoundError, ForbiddenOperation } from '@domain/types/errors';

export class DeleteBookUseCase {
  private readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

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
      throw new ForbiddenOperation('Forbidden operation');
    }
  }
}
