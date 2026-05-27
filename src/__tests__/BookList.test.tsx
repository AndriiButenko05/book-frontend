import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BookList } from '../components/BookList/BookList';
import * as booksApi from '../api/books';
import type { PaginatedResponse, Book } from '../types/book';

vi.mock('../api/books');

function makeBook(overrides: Partial<Book> = {}): Book {
  return {
    _id: '1', title: 'Test Book', author: 'Test Author', isbn: '1234567890',
    pages: 300, rating: 4, createdAt: '', updatedAt: '', ...overrides,
  };
}

function makePage(books: Book[], total = books.length): PaginatedResponse<Book> {
  return {
    data: books,
    meta: { page: 1, limit: 20, total, totalPages: Math.ceil(total / 20), hasNextPage: total > 20, hasPrevPage: false },
  };
}

function renderWithQuery(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

describe('BookList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders a list of books', async () => {
    vi.mocked(booksApi.listBooks).mockResolvedValue(makePage([
      makeBook({ _id: '1', title: 'Dune', author: 'Frank Herbert' }),
      makeBook({ _id: '2', title: '1984', author: 'George Orwell' }),
    ]));

    renderWithQuery(<BookList />);

    await waitFor(() => {
      expect(screen.getByText('Dune')).toBeInTheDocument();
      expect(screen.getByText('1984')).toBeInTheDocument();
    });
  });

  it('shows empty state when no books returned', async () => {
    vi.mocked(booksApi.listBooks).mockResolvedValue(makePage([]));
    renderWithQuery(<BookList />);
    await waitFor(() => {
      expect(screen.getByText('Your library is empty')).toBeInTheDocument();
    });
  });

  it('shows pagination controls when multiple pages exist', async () => {
    vi.mocked(booksApi.listBooks).mockResolvedValue({
      data: [makeBook()],
      meta: { page: 1, limit: 20, total: 50, totalPages: 3, hasNextPage: true, hasPrevPage: false },
    });

    renderWithQuery(<BookList />);

    await waitFor(() => {
      expect(screen.getByText(/page 1/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });
  });

  it('refetches with search param after typing in search box', async () => {
    vi.mocked(booksApi.listBooks).mockResolvedValue(makePage([]));
    renderWithQuery(<BookList />);

    const searchInput = await screen.findByPlaceholderText(/title or author/i);
    await userEvent.type(searchInput, 'Dune');

    await waitFor(() => {
      const calls = vi.mocked(booksApi.listBooks).mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall?.search).toBe('Dune');
    }, { timeout: 2000 });
  });

  it('calls deleteBook and invalidates query on delete', async () => {
    vi.mocked(booksApi.listBooks).mockResolvedValue(makePage([makeBook({ _id: 'abc', title: 'To Delete' })]));
    vi.mocked(booksApi.deleteBook).mockResolvedValue(undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderWithQuery(<BookList />);

    const deleteBtn = await screen.findByRole('button', { name: /delete to delete/i });
    await userEvent.click(deleteBtn);

    await waitFor(() => {
      const calls = vi.mocked(booksApi.deleteBook).mock.calls;
      expect(calls[0]?.[0]).toBe('abc');
    });
  });
});
