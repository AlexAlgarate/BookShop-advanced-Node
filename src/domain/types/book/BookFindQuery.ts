import { Pagination } from '../pagination';

export interface BookFindQuery extends Pagination {
  title?: string;
  author?: string;
  search?: string;
  ownerId?: string;
}
