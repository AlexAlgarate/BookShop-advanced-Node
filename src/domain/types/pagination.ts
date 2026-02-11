export interface Pagination {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
