import { Book } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { EntityNotFoundError } from '@domain/types/errors';
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

    const soldBook = book.sellTo(buyerId);

    const updatedBook = await this.bookRepository.markAsSold(bookId, buyerId, soldBook.soldAt!);

    return updatedBook;
  }
}
