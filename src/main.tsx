import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BookmarkProvider } from './contexts/BookmarkContext';
import App from './App';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <BookmarkProvider>
          <App />
        </BookmarkProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
