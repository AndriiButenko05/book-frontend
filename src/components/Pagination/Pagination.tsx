import type { PaginationMeta } from '../../types/book';
import styles from './Pagination.module.css';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, hasPrevPage, hasNextPage, total, limit } = meta;

  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className={styles.wrap}>
      <p className={styles.info}>
        Showing{' '}
        <span className={styles.infoStrong}>{from.toLocaleString()}–{to.toLocaleString()}</span>
        {' '}of{' '}
        <span className={styles.infoStrong}>{total.toLocaleString()}</span> books
      </p>

      <div className={styles.controls}>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className={styles.btn}
        >
          ← Previous
        </button>

        <span className={styles.pageChip}>
          Page {page} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className={styles.btn}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
