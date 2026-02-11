import { Book } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { BookFindQuery } from '@domain/types/book/BookFindQuery';
import { CreateBookQuery } from '@domain/types/book/CreateBookQuery';
import { PaginatedResponse } from '@domain/types/pagination';
import { BookModel, BookMongoDb } from '@infrastructure/models/book-model';
import { QueryFilter } from 'mongoose';

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

  async findMany(query: BookFindQuery): Promise<PaginatedResponse<Book>> {
    const searchQuery: QueryFilter<BookMongoDb> = {
      status: 'PUBLISHED',
    };
    if (query.author) {
      searchQuery.author = { $regex: query.author, $options: 'i' };
    }

    if (query.title) {
      searchQuery.title = { $regex: query.title, $options: 'i' };
    }
    if (query.search) {
      searchQuery.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { author: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.ownerId) {
      searchQuery.ownerId = {
        $eq: query.ownerId,
      };
    }

    const skip = (query.page - 1) * query.limit;

    const [mongoBooks, total] = await Promise.all([
      BookModel.find(searchQuery).skip(skip).limit(query.limit),
      BookModel.countDocuments(searchQuery),
    ]);

    return {
      content: mongoBooks.map(mongoBook => this.restoreBook(mongoBook)),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
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
