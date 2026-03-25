import { Book } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { UpdateBookQuery } from '@domain/types/book/UpdateBookQuery';
import { EntityNotFoundError, ForbiddenOperation } from '@domain/types/errors';

export class UpdateBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  public async execute(
    bookId: string,
    query: UpdateBookQuery,
    userId: string
  ): Promise<Book | null> {
    const bookToUpdate = await this.bookRepository.findById(bookId);

    if (!bookToUpdate) throw new EntityNotFoundError('Book', bookId);

    if (userId !== bookToUpdate.ownerId)
      throw new ForbiddenOperation('Only owner of the book can update this book');

    const updatedBook = new Book({
      title: query.title ?? bookToUpdate.title,
      description: query.description ?? bookToUpdate.description,
      price: query.price ?? bookToUpdate.price,
      author: query.author ?? bookToUpdate.author,
      status: bookToUpdate.status,
      ownerId: bookToUpdate.ownerId,
      soldAt: bookToUpdate.soldAt,
      id: bookToUpdate.id,
      createdAt: bookToUpdate.createdAt,
    });

    return await this.bookRepository.updateBookDetails(updatedBook);
  }
}
