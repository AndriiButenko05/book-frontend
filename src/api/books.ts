import type { Book, CreateBookInput, ListBooksQuery, PaginatedResponse } from '../types/book';
import { ApiError } from '../types/book';

const BASE = `${import.meta.env.VITE_API_URL ?? ''}/api/books`;

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) return res.json() as Promise<T>;
  let message = 'Oops, something went wrong';
  try {
    const body = (await res.json()) as { error?: string; message?: string };
    message = body.error ?? body.message ?? message;
  } catch {
  }
  throw new ApiError(res.status, message);
}

export async function listBooks(query: ListBooksQuery = {}): Promise<PaginatedResponse<Book>> {
  const params = new URLSearchParams();
  if (query.page !== undefined) params.set('page', String(query.page));
  if (query.limit !== undefined) params.set('limit', String(query.limit));
  if (query.search) params.set('search', query.search);
  if (query.rating !== undefined) params.set('rating', String(query.rating));
  if (query.order) params.set('order', query.order);
  if (query.sortBy) params.set('sortBy', query.sortBy);

  const res = await fetch(`${BASE}?${params}`);
  return handleResponse<PaginatedResponse<Book>>(res);
}

export async function createBook(input: CreateBookInput): Promise<Book> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Book>(res);
}

export async function deleteBook(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (res.status === 204) return;
  return handleResponse<void>(res);
}
