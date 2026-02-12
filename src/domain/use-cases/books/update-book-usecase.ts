import { Book } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { UpdateBookQuery } from '@domain/types/book/UpdateBookQuery';
import { EntityNotFoundError, ForbiddenOperation } from '@domain/types/errors';

export class UpdateBookUseCase {
  private readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  public async execute(
    productId: string,
    query: UpdateBookQuery,
    userId: string
  ): Promise<Book | null> {
    const bookToUpdate = await this.bookRepository.findById(productId);

    if (!bookToUpdate) throw new EntityNotFoundError('Book', productId);

    if (userId !== bookToUpdate.ownerId)
      throw new ForbiddenOperation('Only owner of the book can update this book');

    const updatedBook = await this.bookRepository.updateOne(productId, query);

    return updatedBook;
  }
}
