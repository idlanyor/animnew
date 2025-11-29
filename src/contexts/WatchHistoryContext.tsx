import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

export interface WatchHistoryItem {
  slug: string;
  title: string;
  episode?: string;
  episodeSlug?: string;
  type: 'anime' | 'movie';
  watchedAt: number; // timestamp
  progress?: number; // seconds watched
  duration?: number; // total duration in seconds
}

interface WatchHistoryContextType {
  history: WatchHistoryItem[];
  addToHistory: (item: Omit<WatchHistoryItem, 'watchedAt'>) => void;
  updateProgress: (slug: string, progress: number, duration?: number) => void;
  removeFromHistory: (slug: string) => void;
  clearHistory: () => void;
  getLastWatched: (slug: string) => WatchHistoryItem | undefined;
}

const WatchHistoryContext = createContext<WatchHistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'kanata_watch_history';
const MAX_HISTORY_ITEMS = 50;

export function WatchHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading watch history:', error);
    }
  }, []);

  // Save to localStorage when history changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving watch history:', error);
    }
  }, [history]);

  const addToHistory = useCallback((item: Omit<WatchHistoryItem, 'watchedAt'>) => {
    setHistory(prev => {
      // Remove existing entry with same slug
      const filtered = prev.filter(h => h.episodeSlug !== item.episodeSlug);
      
      // Add new entry at the beginning
      const newHistory = [
        { ...item, watchedAt: Date.now() },
        ...filtered
      ].slice(0, MAX_HISTORY_ITEMS);
      
      return newHistory;
    });
  }, []);

  const updateProgress = useCallback((episodeSlug: string, progress: number, duration?: number) => {
    setHistory(prev => 
      prev.map(item => 
        item.episodeSlug === episodeSlug 
          ? { ...item, progress, duration: duration || item.duration, watchedAt: Date.now() }
          : item
      )
    );
  }, []);

  const removeFromHistory = useCallback((episodeSlug: string) => {
    setHistory(prev => prev.filter(item => item.episodeSlug !== episodeSlug));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getLastWatched = useCallback((slug: string) => {
    return history.find(item => item.slug === slug || item.episodeSlug === slug);
  }, [history]);

  const value = useMemo(() => ({
    history,
    addToHistory,
    updateProgress,
    removeFromHistory,
    clearHistory,
    getLastWatched
  }), [history, addToHistory, updateProgress, removeFromHistory, clearHistory, getLastWatched]);

  return (
    <WatchHistoryContext.Provider value={value}>
      {children}
    </WatchHistoryContext.Provider>
  );
}

export function useWatchHistory() {
  const context = useContext(WatchHistoryContext);
  if (!context) {
    throw new Error('useWatchHistory must be used within a WatchHistoryProvider');
  }
  return context;
}

// Helper function to format time
export function formatWatchTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Helper function to format relative time
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  
  return new Date(timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  });
}
