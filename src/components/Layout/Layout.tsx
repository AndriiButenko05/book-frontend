import type { ReactNode } from 'react';
import { Header } from '../Header/Header';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.wrap}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
