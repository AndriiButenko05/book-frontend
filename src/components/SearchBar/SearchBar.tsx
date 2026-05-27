import styles from './SearchBar.module.css';

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  rating: number | undefined;
  onRatingChange: (rating: number | undefined) => void;
  order: 'asc' | 'desc';
  onOrderChange: (order: 'asc' | 'desc') => void;
  sortBy: 'createdAt' | 'pages' | 'rating' | 'title';
  onSortByChange: (sortBy: 'createdAt' | 'pages' | 'rating' | 'title') => void;
}

export function SearchBar({
  search,
  onSearchChange,
  rating,
  onRatingChange,
  order,
  onOrderChange,
  sortBy,
  onSortByChange,
}: SearchBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.searchWrap}>
        <input
          id="search"
          type="search"
          placeholder="Search by title or author…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="filter-rating" className={styles.filterLabel}>Rating</label>
        <select
          id="filter-rating"
          value={rating ?? ''}
          onChange={(e) => onRatingChange(e.target.value === '' ? undefined : Number(e.target.value))}
          className={styles.select}
        >
          <option value="">All ratings</option>
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="sort-by" className={styles.filterLabel}>Sort by</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as 'createdAt' | 'pages' | 'rating' | 'title')}
          className={styles.select}
        >
          <option value="pages">Pages</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
          <option value="createdAt">Date added</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="sort-order" className={styles.filterLabel}>Order</label>
        <select
          id="sort-order"
          value={order}
          onChange={(e) => onOrderChange(e.target.value as 'asc' | 'desc')}
          className={styles.select}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}
