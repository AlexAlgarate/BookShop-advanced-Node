import { Book } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import {
  BusinessConflictError,
  EntityNotFoundError,
  ForbiddenOperation,
} from '@domain/types/errors';
interface BuyBookRequest {
  bookId: string;
  buyerId: string;
}
export class BuyBookUseCase {
  private readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  public async execute({ bookId, buyerId }: BuyBookRequest): Promise<Book | null> {
    const book = await this.bookRepository.findById(bookId);

    if (!book) {
      throw new EntityNotFoundError('Book', bookId);
    }

    if (book.ownerId === buyerId) {
      throw new ForbiddenOperation('You cannot buy your own book');
    }

    if (book.status !== 'PUBLISHED') {
      throw new BusinessConflictError('Book is not available for purchase');
    }

    const updatedBook = await this.bookRepository.updateOne(bookId, {
      status: 'SOLD',
      soldAt: new Date(),
    });

    return updatedBook;
  }
}
