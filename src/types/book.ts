export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  pages: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ListBooksQuery {
  page?: number;
  limit?: number;
  search?: string;
  rating?: number;
  order?: 'asc' | 'desc';
  sortBy?: 'createdAt' | 'pages' | 'rating' | 'title';
}

export interface CreateBookInput {
  title: string;
  author: string;
  isbn: string;
  pages: number;
  rating: number;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
