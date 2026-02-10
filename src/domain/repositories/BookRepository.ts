import { Book } from '@domain/entities/Book';
import { CreateBookQuery } from '@domain/types/book/CreateBookQuery';

export interface BookRepository {
  createOne(query: CreateBookQuery): Promise<Book>;
}
