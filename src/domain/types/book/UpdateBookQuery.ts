export interface UpdateBookQuery {
  title?: string;
  description?: string;
  price?: number;
  author?: string;
  status?: 'PUBLISHED' | 'SOLD';
  soldAt?: Date;
}
