import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.link}>
          <div className={styles.title}>BookTrack</div>
          <div className={styles.subtitle}>Your personal reading catalog</div>
        </Link>
      </div>
    </header>
  );
}
