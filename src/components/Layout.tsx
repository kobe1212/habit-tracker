import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isDarkMode, onThemeToggle }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors">
        {/* Header */}
        <header className="bg-blue-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Habit Tracker
            </h1>
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8 flex-grow">
          {children}
        </main>

        {/* Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:static md:border-t-0">
          <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 md:gap-4 overflow-x-auto">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isActive('/')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              📅 Calendar
            </Link>
            <Link
              to="/today"
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isActive('/today')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              ✓ Today
            </Link>
            <Link
              to="/stats"
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isActive('/stats')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              📊 Stats
            </Link>
            <Link
              to="/settings"
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isActive('/settings')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              ⚙️ Settings
            </Link>
          </div>
        </nav>

        {/* Spacer for fixed nav on mobile */}
        <div className="h-24 md:h-0" />
      </div>
    </div>
  );
};

export default Layout;
