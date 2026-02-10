import { BookMongoRepository } from '@infrastructure/repositories/product-mongo-repository';

export class BookFactory {
  static createRepository(): BookMongoRepository {
    return new BookMongoRepository();
  }
}
