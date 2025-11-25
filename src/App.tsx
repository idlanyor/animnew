import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import OngoingPage from './pages/OngoingPage';
import CompletePage from './pages/CompletePage';
import SearchPage from './pages/SearchPage';
import SchedulePage from './pages/SchedulePage';
import GenresPage from './pages/GenresPage';
import MoviePage from './pages/MoviePage';
import AuthorPage from './pages/AuthorPage';
import AnimeDetailPage from './pages/AnimeDetailPage';
import EpisodePage from './pages/EpisodePage';
import MovieDetailPage from './pages/MovieDetailPage';
import MovieWatchPage from './pages/MovieWatchPage';

function App() {
  return (
    <div className="bg-black min-h-screen">
      <Header />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ongoing" element={<OngoingPage />} />
          <Route path="/complete" element={<CompletePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/genres" element={<GenresPage />} />
          <Route path="/movie" element={<MoviePage />} />
          <Route path="/author" element={<AuthorPage />} />
          <Route path="/anime/:slug" element={<AnimeDetailPage />} />
          <Route path="/episode/:slug" element={<EpisodePage />} />
          <Route path="/movie/:slug" element={<MovieDetailPage />} />
          <Route path="/movie/watch/:slug" element={<MovieWatchPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
