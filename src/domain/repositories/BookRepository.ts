import { Book } from '@domain/entities/Book';
import { BookFindQuery } from '@domain/types/book/BookFindQuery';
import { CreateBookQuery } from '@domain/types/book/CreateBookQuery';
import { PaginatedResponse } from '@domain/types/pagination';

export interface BookRepository {
  createOne(query: CreateBookQuery): Promise<Book>;
  findMany(query: BookFindQuery): Promise<PaginatedResponse<Book>>;
}
