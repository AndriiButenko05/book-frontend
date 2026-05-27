import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>BookTrack</h1>
        <p className={styles.subtitle}>Your personal reading catalog</p>
        <p className={styles.description}>
          Keep track of every book you read. Search your collection, filter by rating,
          and never lose sight of your library — no matter how large it grows.
        </p>
        <button className={styles.cta} onClick={() => navigate('/books')}>
          Browse My Library
        </button>
      </div>
    </div>
  );
}
