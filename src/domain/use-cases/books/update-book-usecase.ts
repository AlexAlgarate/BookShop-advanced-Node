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
    bookId: string,
    query: UpdateBookQuery,
    userId: string
  ): Promise<Book | null> {
    const bookToUpdate = await this.bookRepository.findById(bookId);

    if (!bookToUpdate) throw new EntityNotFoundError('Book', bookId);

    if (userId !== bookToUpdate.ownerId)
      throw new ForbiddenOperation('Only owner of the book can update this book');

    const updatedBook = await this.bookRepository.updateOne(bookId, query);

    return updatedBook;
  }
}
