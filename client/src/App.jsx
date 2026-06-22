import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import { ThemeProvider } from './context/ThemeContext';
import { PlaylistProvider } from './context/PlaylistContext';

// Lazy loading pages for best performance
const HomePage = lazy(() => import('./pages/HomePage'));
const PlaylistPage = lazy(() => import('./pages/PlaylistPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));

// A clean suspense loading fallback
function PageLoader() {
  return (
    <div className="w-full min-h-[50vh] flex items-center justify-center">
      <LoadingSpinner size="large" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PlaylistProvider>
        <Routes>
          {/* Main Layout containing Header, Footer and global glows */}
          <Route path="/" element={<Layout />}>
            <Route index element={
              <Suspense fallback={<PageLoader />}>
                <HomePage />
              </Suspense>
            } />
            <Route path="playlist" element={
              <Suspense fallback={<PageLoader />}>
                <PlaylistPage />
              </Suspense>
            } />
            <Route path="favorites" element={
              <Suspense fallback={<PageLoader />}>
                <FavoritesPage />
              </Suspense>
            } />
            <Route path="history" element={
              <Suspense fallback={<PageLoader />}>
                <HistoryPage />
              </Suspense>
            } />
            <Route path="stats" element={
              <Suspense fallback={<PageLoader />}>
                <StatsPage />
              </Suspense>
            } />
            {/* Redirect any bad routes back home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </PlaylistProvider>
    </ThemeProvider>
  );
}
