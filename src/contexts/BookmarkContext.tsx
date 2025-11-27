import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AnimeItem, MovieItem } from '@/lib/api';
import {
  BookmarkItem,
  getBookmarks,
  addBookmark as addBookmarkUtil,
  removeBookmark as removeBookmarkUtil,
  toggleBookmark as toggleBookmarkUtil,
  isBookmarked as isBookmarkedUtil,
  getBookmarksByType,
  clearAllBookmarks,
  getBookmarkCount
} from '@/lib/bookmarks';

interface BookmarkContextType {
  bookmarks: BookmarkItem[];
  addBookmark: (item: AnimeItem | MovieItem, type: 'anime' | 'movie') => boolean;
  removeBookmark: (slug: string) => boolean;
  toggleBookmark: (item: AnimeItem | MovieItem, type: 'anime' | 'movie') => boolean;
  isBookmarked: (slug: string) => boolean;
  getAnimeBookmarks: () => BookmarkItem[];
  getMovieBookmarks: () => BookmarkItem[];
  clearAll: () => void;
  count: number;
  refreshBookmarks: () => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  // Load bookmarks on mount
  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  // Refresh bookmarks from storage
  const refreshBookmarks = () => {
    setBookmarks(getBookmarks());
  };

  const addBookmark = (item: AnimeItem | MovieItem, type: 'anime' | 'movie'): boolean => {
    const success = addBookmarkUtil(item, type);
    if (success) {
      refreshBookmarks();
    }
    return success;
  };

  const removeBookmark = (slug: string): boolean => {
    const success = removeBookmarkUtil(slug);
    if (success) {
      refreshBookmarks();
    }
    return success;
  };

  const toggleBookmark = (item: AnimeItem | MovieItem, type: 'anime' | 'movie'): boolean => {
    const isNowBookmarked = toggleBookmarkUtil(item, type);
    refreshBookmarks();
    return isNowBookmarked;
  };

  const isBookmarked = (slug: string): boolean => {
    return isBookmarkedUtil(slug);
  };

  const getAnimeBookmarks = (): BookmarkItem[] => {
    return getBookmarksByType('anime');
  };

  const getMovieBookmarks = (): BookmarkItem[] => {
    return getBookmarksByType('movie');
  };

  const clearAll = (): void => {
    clearAllBookmarks();
    refreshBookmarks();
  };

  const value: BookmarkContextType = {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    getAnimeBookmarks,
    getMovieBookmarks,
    clearAll,
    count: getBookmarkCount(),
    refreshBookmarks
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}
