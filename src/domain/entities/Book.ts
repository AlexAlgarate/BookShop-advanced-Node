import { Entity } from './Entity';

export class Book extends Entity {
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly author: string;
  readonly status: 'PUBLISHED' | 'SOLD';
  readonly ownerId: string;
  readonly soldAt: Date | null;

  constructor({
    title,
    description,
    price,
    author,
    status = 'PUBLISHED',
    ownerId,
    soldAt = null,
    id,
    createdAt,
  }: {
    title: string;
    description: string;
    price: number;
    author: string;
    status?: 'PUBLISHED' | 'SOLD';
    ownerId: string;
    soldAt?: Date | null;
    id: string;
    createdAt: Date;
  }) {
    super(id, createdAt);
    this.title = title;
    this.description = description;
    this.price = price;
    this.author = author;
    this.status = status;
    this.ownerId = ownerId;
    this.soldAt = soldAt;

    if (this.status === 'PUBLISHED' && this.soldAt !== null)
      throw new Error('soldAt must be null when status is PUBLISHED');

    if (this.status === 'SOLD' && this.soldAt === null)
      throw new Error('soldAt must have a date when status is SOLD');
  }
}
