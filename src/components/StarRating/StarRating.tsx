import styles from './StarRating.module.css';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  error?: string;
}

export function StarRating({ value, onChange, error }: StarRatingProps) {
  return (
    <div>
      <div className={styles.group} role="group" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            aria-pressed={value === star}
            className={`${styles.star} ${star <= value ? styles.starFilled : ''}`}
          >
            ★
          </button>
        ))}
      </div>
      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
}
