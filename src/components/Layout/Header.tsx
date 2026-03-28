import { Link, useLocation } from 'react-router-dom';
import { Server, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const { toggleTheme, isDark } = useTheme();

  return (
    <header className="sticky top-0 z-20 border-b border-themed bg-themed-card backdrop-blur-md">
      <div className="w-full max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl border border-themed bg-accent/15">
              <Server className="w-6 h-6 text-accent" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-themed truncate">primeLine Server Configurator</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs md:text-sm text-themed-secondary">Golden Series AMD A1E15-12</p>
                <span className="chip hidden md:inline-flex">Live Pricing</span>
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 bg-themed-btn rounded-lg transition-colors border border-themed"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-themed-muted" />
              )}
            </button>
            
            {isAdmin ? (
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-colors"
              >
                <Server className="w-4 h-4" />
                Konfigurator
              </Link>
            ) : (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-themed-btn text-themed-secondary rounded-lg transition-colors border border-themed"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
