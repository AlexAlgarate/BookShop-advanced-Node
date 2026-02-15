import { Book } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { BookFindQuery } from '@domain/types/book/BookFindQuery';
import { CreateBookQuery } from '@domain/types/book/CreateBookQuery';
import { UpdateBookQuery } from '@domain/types/book/UpdateBookQuery';
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
    const searchQuery = this.buildSearchQuery(query);

    const { skip, limit } = this.buildPagination(query);

    const [books, total] = await Promise.all([
      BookModel.find(searchQuery).skip(skip).limit(limit),
      BookModel.countDocuments(searchQuery),
    ]);

    return {
      meta: {
        page: query.page,
        limit: limit,
        total,
      },
      content: books.map(book => this.restoreBook(book)),
    };
  }

  async updateBookDetails(bookId: string, query: UpdateBookQuery): Promise<Book | null> {
    const updateData = await BookModel.findByIdAndUpdate(bookId, query, { new: true });
    return updateData ? this.restoreBook(updateData) : null;
  }

  async findById(bookId: string): Promise<Book | null> {
    const book = await BookModel.findById(bookId);
    return book ? this.restoreBook(book) : null;
  }

  async markAsSold(bookId: string, buyerId: string, soldAt: Date): Promise<Book | null> {
    const updated = await BookModel.findByIdAndUpdate(
      bookId,
      {
        $set: {
          ownerId: buyerId,
          status: 'SOLD',
          soldAt,
        },
      },
      { new: true }
    );

    return updated ? this.restoreBook(updated) : null;
  }

  async deleteBook(bookId: string): Promise<boolean> {
    const deleteBook = await BookModel.findByIdAndDelete(bookId);
    return !!deleteBook;
  }

  private buildSearchQuery(query: BookFindQuery): QueryFilter<BookMongoDb> {
    const searchQuery: QueryFilter<BookMongoDb> = {};

    if (!query.ownerId) {
      searchQuery.status = 'PUBLISHED';
    }

    if (query.search) {
      searchQuery.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { author: { $regex: query.search, $options: 'i' } },
      ];
      return searchQuery;
    }
    if (query.author) {
      searchQuery.author = { $regex: query.author, $options: 'i' };
    }

    if (query.title) {
      searchQuery.title = { $regex: query.title, $options: 'i' };
    }

    if (query.ownerId) {
      searchQuery.ownerId = query.ownerId;
    }

    return searchQuery;
  }
  private buildPagination(query: BookFindQuery): {
    limit: number;
    skip: number;
  } {
    const limit = query.limit;
    const skip = (query.page - 1) * query.limit;

    return { limit, skip };
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
