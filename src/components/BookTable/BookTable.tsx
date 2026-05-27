import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Book } from '../../types/book';
import { deleteBook } from '../../api/books';
import styles from './BookTable.module.css';

interface BookTableProps {
  books: Book[];
  hasSearch: boolean;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  );
}

export function BookTable({ books, hasSearch }: BookTableProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'] }),
  });

  if (books.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyTitle}>
          {hasSearch ? 'No books match your search' : 'Your library is empty'}
        </div>
        <div className={styles.emptyHint}>
          {hasSearch ? 'Try a different search term or clear the filters.' : 'Add your first book using the form on the left.'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Book</th>
            <th className={styles.th}>ISBN</th>
            <th className={`${styles.th} ${styles.thRight}`}>Pages</th>
            <th className={styles.th}>Rating</th>
            <th className={`${styles.th} ${styles.thCenter}`}></th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id} className={styles.tr}>
              <td className={styles.td}>
                <div className={styles.bookTitle}>{book.title}</div>
                <div className={styles.bookAuthor}>{book.author}</div>
              </td>
              <td className={styles.td}>
                <span className={styles.isbn}>{book.isbn}</span>
              </td>
              <td className={`${styles.td} ${styles.pagesCell}`}>
                <span className={styles.pagesNum}>{book.pages.toLocaleString()}</span>
                <span className={styles.pagesUnit}>pp</span>
              </td>
              <td className={`${styles.td} ${styles.ratingCell}`}>
                <Stars rating={book.rating} />
              </td>
              <td className={`${styles.td} ${styles.actionCell}`}>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${book.title}"?`)) {
                      deleteMutation.mutate(book._id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  aria-label={`Delete ${book.title}`}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
