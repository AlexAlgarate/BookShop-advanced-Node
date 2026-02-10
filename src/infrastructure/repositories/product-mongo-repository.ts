import { Book } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { CreateBookQuery } from '@domain/types/book/CreateBookQuery';
import { BookModel, BookMongoDb } from '@infrastructure/models/book-model';

export class BookMongoRepository implements BookRepository {
  async createOne(query: CreateBookQuery): Promise<Book> {
    const newBook = new BookModel({
      title: query.title,
      description: query.description,
      price: query.price,
      author: query.author,
      status: 'PUBLISHED',
      ownerId: query.ownerId,
      soldAt: null,
    });

    const createdBook = await newBook.save();
    return this.restoreBook(createdBook);
  }

  private restoreBook(mongoBook: BookMongoDb): Book {
    return new Book({
      id: mongoBook._id.toString(),
      title: mongoBook.title,
      description: mongoBook.description,
      price: mongoBook.price,
      author: mongoBook.author,
      status: mongoBook.status,
      ownerId: mongoBook.ownerId.toString(),
      soldAt: mongoBook.soldAt,
      createdAt: mongoBook.createdAt,
    });
  }
}
