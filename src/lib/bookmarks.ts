import { AnimeItem, MovieItem } from './api';

// Bookmark types
export interface BookmarkItem {
  id: string; // slug
  type: 'anime' | 'movie';
  title: string;
  addedAt: number; // timestamp
  data: AnimeItem | MovieItem;
}

// Local storage key
const BOOKMARKS_STORAGE_KEY = 'kanata_anime_bookmarks';

// Get all bookmarks from local storage
export const getBookmarks = (): BookmarkItem[] => {
  try {
    const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading bookmarks from localStorage:', error);
    return [];
  }
};

// Save bookmarks to local storage
const saveBookmarks = (bookmarks: BookmarkItem[]): void => {
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Error saving bookmarks to localStorage:', error);
  }
};

// Add a bookmark
export const addBookmark = (item: AnimeItem | MovieItem, type: 'anime' | 'movie'): boolean => {
  try {
    const bookmarks = getBookmarks();
    const slug = 'slug' in item ? item.slug : '';

    // Check if already bookmarked
    if (bookmarks.some(b => b.id === slug)) {
      return false; // Already bookmarked
    }

    const newBookmark: BookmarkItem = {
      id: slug,
      type,
      title: type === 'anime' ? (item as AnimeItem).judul : (item as MovieItem).title,
      addedAt: Date.now(),
      data: item
    };

    bookmarks.unshift(newBookmark); // Add to beginning
    saveBookmarks(bookmarks);
    return true;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return false;
  }
};

// Remove a bookmark
export const removeBookmark = (slug: string): boolean => {
  try {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter(b => b.id !== slug);

    if (filtered.length === bookmarks.length) {
      return false; // Bookmark not found
    }

    saveBookmarks(filtered);
    return true;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }
};

// Check if an item is bookmarked
export const isBookmarked = (slug: string): boolean => {
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.id === slug);
};

// Toggle bookmark (add if not exists, remove if exists)
export const toggleBookmark = (item: AnimeItem | MovieItem, type: 'anime' | 'movie'): boolean => {
  const slug = 'slug' in item ? item.slug : '';

  if (isBookmarked(slug)) {
    removeBookmark(slug);
    return false; // Removed
  } else {
    addBookmark(item, type);
    return true; // Added
  }
};

// Get bookmarks filtered by type
export const getBookmarksByType = (type: 'anime' | 'movie'): BookmarkItem[] => {
  return getBookmarks().filter(b => b.type === type);
};

// Clear all bookmarks
export const clearAllBookmarks = (): void => {
  try {
    localStorage.removeItem(BOOKMARKS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing bookmarks:', error);
  }
};

// Get bookmark count
export const getBookmarkCount = (): number => {
  return getBookmarks().length;
};
