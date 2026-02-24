import { BookStatus } from '@domain/entities/Book';

export interface CreateBookQuery {
  title: string;
  description: string;
  price: number;
  author: string;
  ownerId: string;
  status?: BookStatus;
  soldAt?: Date | null;
}
