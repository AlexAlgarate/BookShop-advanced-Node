import { BookMongoRepository } from '@infrastructure/repositories/book-mongo-repository';

export class BookFactory {
  static createRepository(): BookMongoRepository {
    return new BookMongoRepository();
  }
}
