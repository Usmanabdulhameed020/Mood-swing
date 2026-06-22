import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Music, Heart, History, BarChart3, Home } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import MobileNav from './MobileNav';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeStyle = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
      isActive
        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
        : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-200/50 dark:hover:bg-zinc-800/50'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 border-b border-slate-200/30 dark:border-zinc-800/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Music className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
            Mood Swing
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={activeStyle}>
            <Home className="w-4 h-4" />
            Home
          </NavLink>
          <NavLink to="/favorites" className={activeStyle}>
            <Heart className="w-4 h-4" />
            Favorites
          </NavLink>
          <NavLink to="/history" className={activeStyle}>
            <History className="w-4 h-4" />
            History
          </NavLink>
          <NavLink to="/stats" className={activeStyle}>
            <BarChart3 className="w-4 h-4" />
            Stats
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-full text-slate-600 dark:text-zinc-300 hover:bg-slate-200/50 dark:hover:bg-zinc-800/50 focus:outline-none cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}
