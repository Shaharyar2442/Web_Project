import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-40 bg-surface border-b border-borderDark px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Dumbbell className="text-primary group-hover:text-primaryHover transition-colors" size={28} />
          <span className="font-heading text-3xl tracking-wider text-textLight mt-1 group-hover:text-white transition-colors">
            BREAKING<span className="text-primary">IRON</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-textMuted">
          <Link to="/" className="hover:text-secondary hover:underline underline-offset-8 transition-all">Dashboard</Link>
          <Link to="/" className="hover:text-secondary hover:underline underline-offset-8 transition-all">Exercises</Link>
          <Link to="/" className="hover:text-secondary hover:underline underline-offset-8 transition-all">Routines</Link>
          <Link to="/" className="hover:text-secondary hover:underline underline-offset-8 transition-all">History</Link>
          <Link to="/" className="hover:text-secondary hover:underline underline-offset-8 transition-all">Progress</Link>
        </div>

        {/* User Avatar Placeholder */}
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-background border border-borderDark hover:border-primary transition-colors cursor-pointer">
            <User size={20} className="text-textMuted" />
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
