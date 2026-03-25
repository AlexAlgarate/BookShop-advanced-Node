import { Book } from '@domain/entities/Book';
import { BookFindQuery } from '@domain/types/book/BookFindQuery';
import { CreateBookQuery } from '@domain/types/book/CreateBookQuery';
import { PaginatedResponse } from '@domain/types/pagination';

export interface BookRepository {
  createOne(query: CreateBookQuery): Promise<Book>;
  findMany(query: BookFindQuery): Promise<PaginatedResponse<Book>>;
  updateBookDetails(book: Book): Promise<Book | null>;
  findById(bookId: string): Promise<Book | null>;
  markAsSold(bookId: string, buyerId: string, soldAt: Date): Promise<Book | null>;
  deleteBook(bookId: string): Promise<boolean>;
}
