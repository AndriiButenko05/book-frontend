import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout/Layout';
import { LandingPage } from './components/LandingPage/LandingPage';
import { AddBookForm } from './components/AddBookForm/AddBookForm';
import { BookList } from './components/BookList/BookList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/books" element={
            <Layout>
              <AddBookForm />
              <BookList />
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
