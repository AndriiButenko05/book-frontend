import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listBooks } from '../../api/books';
import { SearchBar } from '../SearchBar/SearchBar';
import { BookTable } from '../BookTable/BookTable';
import { Pagination } from '../Pagination/Pagination';
import styles from './BookList.module.css';

const PAGE_SIZE = 15;

export function BookList() {
  const [page, setPage] = useState(1);
  const [inputSearch, setInputSearch] = useState('');
  const [search, setSearch] = useState('');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<'createdAt' | 'pages' | 'rating' | 'title'>('pages');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(inputSearch.trim());
      setPage(1);
    }, 1000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputSearch]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['books', { page, search, rating, order, sortBy }],
    queryFn: () => listBooks({ page, limit: PAGE_SIZE, search: search || undefined, rating, order, sortBy }),
    placeholderData: (prev) => prev,
  });

  const handleRatingChange = (r: number | undefined) => { setRating(r); setPage(1); };
  const handleOrderChange  = (o: 'asc' | 'desc')    => { setOrder(o);  setPage(1); };
  const handleSortByChange = (s: 'createdAt' | 'pages' | 'rating' | 'title') => { setSortBy(s); setPage(1); };

  const hasSearch = Boolean(search || rating !== undefined);
  const total = data?.meta.total ?? 0;

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          Your Library
        </div>
        {data && (
          <span className={styles.countBadge}>
            {total.toLocaleString()} {total === 1 ? 'book' : 'books'}
          </span>
        )}
      </div>

      <div className={styles.toolbar}>
        <SearchBar
          search={inputSearch}
          onSearchChange={setInputSearch}
          rating={rating}
          onRatingChange={handleRatingChange}
          order={order}
          onOrderChange={handleOrderChange}
          sortBy={sortBy}
          onSortByChange={handleSortByChange}
        />
      </div>

      <div className={styles.body}>
        {isLoading && !data && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            Loading your library…
          </div>
        )}

        {isError && (
          <div role="alert" className={styles.errorAlert}>
            {error instanceof Error ? error.message : 'Failed to load books.'}
          </div>
        )}

        {data && <BookTable books={data.data} hasSearch={hasSearch} />}
      </div>

      {data && data.meta.totalPages > 1 && (
        <div className={styles.footer}>
          <Pagination meta={data.meta} onPageChange={setPage} />
        </div>
      )}
    </section>
  );
}
