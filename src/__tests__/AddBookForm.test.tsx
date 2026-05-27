import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AddBookForm } from '../components/AddBookForm/AddBookForm';
import * as booksApi from '../api/books';

vi.mock('../api/books');

function renderWithQuery(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

describe('AddBookForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows required field errors on empty submit', async () => {
    renderWithQuery(<AddBookForm />);
    await userEvent.click(screen.getByRole('button', { name: /add book/i }));

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Author is required')).toBeInTheDocument();
      expect(screen.getByText('ISBN is required')).toBeInTheDocument();
    });
  });

  it('shows pages validation error for non-numeric input', async () => {
    renderWithQuery(<AddBookForm />);
    await userEvent.type(screen.getByLabelText(/pages/i), 'abc');
    await userEvent.click(screen.getByRole('button', { name: /add book/i }));
    await waitFor(() => {
      expect(screen.getByText('Pages must be a number')).toBeInTheDocument();
    });
  });

  it('shows rating error when no star selected', async () => {
    renderWithQuery(<AddBookForm />);
    await userEvent.type(screen.getByLabelText(/title/i), 'My Book');
    await userEvent.type(screen.getByLabelText(/author/i), 'Author');
    await userEvent.type(screen.getByLabelText(/isbn/i), '1234567890');
    await userEvent.type(screen.getByLabelText(/pages/i), '200');
    await userEvent.click(screen.getByRole('button', { name: /add book/i }));
    await waitFor(() => {
      expect(screen.getByText('Rating must be between 1 and 5')).toBeInTheDocument();
    });
  });

  it('submits successfully and shows success message', async () => {
    const mockBook = {
      _id: '1', title: 'My Book', author: 'Author', isbn: '1234567890',
      pages: 200, rating: 4, createdAt: '', updatedAt: '',
    };
    vi.mocked(booksApi.createBook).mockResolvedValue(mockBook);

    renderWithQuery(<AddBookForm />);

    await userEvent.type(screen.getByLabelText(/title/i), 'My Book');
    await userEvent.type(screen.getByLabelText(/author/i), 'Author');
    await userEvent.type(screen.getByLabelText(/isbn/i), '1234567890');
    await userEvent.type(screen.getByLabelText(/pages/i), '200');
    await userEvent.click(screen.getByRole('button', { name: /rate 4/i }));
    await userEvent.click(screen.getByRole('button', { name: /add book/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('"My Book" added successfully.');
    });
  });

  it('shows API error on 409 duplicate ISBN', async () => {
    const { ApiError } = await import('../types/book');
    vi.mocked(booksApi.createBook).mockRejectedValue(new ApiError(409, 'A book with this ISBN already exists'));

    renderWithQuery(<AddBookForm />);

    await userEvent.type(screen.getByLabelText(/title/i), 'My Book');
    await userEvent.type(screen.getByLabelText(/author/i), 'Author');
    await userEvent.type(screen.getByLabelText(/isbn/i), '1234567890');
    await userEvent.type(screen.getByLabelText(/pages/i), '200');
    await userEvent.click(screen.getByRole('button', { name: /rate 3/i }));
    await userEvent.click(screen.getByRole('button', { name: /add book/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('A book with this ISBN already exists');
    });
  });
});
