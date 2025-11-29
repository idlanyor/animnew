import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNavigation from './components/BottomNavigation';
import LoadingSpinner from './components/LoadingSpinner';
import { WatchHistoryProvider } from './contexts/WatchHistoryContext';

// Lazy load all pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const OngoingPage = lazy(() => import('./pages/OngoingPage'));
const CompletePage = lazy(() => import('./pages/CompletePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const GenresPage = lazy(() => import('./pages/GenresPage'));
const MoviePage = lazy(() => import('./pages/MoviePage'));
const AuthorPage = lazy(() => import('./pages/AuthorPage'));
const AnimeDetailPage = lazy(() => import('./pages/AnimeDetailPage'));
const EpisodePage = lazy(() => import('./pages/EpisodePage'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage'));
const MovieWatchPage = lazy(() => import('./pages/MovieWatchPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <WatchHistoryProvider>
      <div className="bg-gray-200 dark:bg-black min-h-screen transition-colors duration-300">
        <Header />
        <main className="min-h-screen pb-24 md:pb-0">
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-200 to-gray-100 dark:from-black dark:to-gray-950">
                <LoadingSpinner size="lg" text="Loading page..." />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/ongoing" element={<OngoingPage />} />
              <Route path="/complete" element={<CompletePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/genres" element={<GenresPage />} />
              <Route path="/movie" element={<MoviePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/author" element={<AuthorPage />} />
              <Route path="/anime/:slug" element={<AnimeDetailPage />} />
              <Route path="/episode/:slug" element={<EpisodePage />} />
              <Route path="/movie/:slug" element={<MovieDetailPage />} />
              <Route path="/movie/watch/:slug" element={<MovieWatchPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <BottomNavigation />
      </div>
    </WatchHistoryProvider>
  );
}

export default App;
