import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-surface border-b border-borderDark px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <Dumbbell className="text-primary group-hover:text-primaryHover transition-colors" size={28} />
          <span className="font-heading text-3xl tracking-wider text-textLight mt-1 group-hover:text-white transition-colors">
            BREAKING<span className="text-primary">IRON</span>
          </span>
        </Link>

        {/* Desktop Links */}
        {user && (
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-textMuted">
            <Link to="/dashboard" className="hover:text-secondary hover:underline underline-offset-8 transition-all">Dashboard</Link>
            <Link to="/exercises" className="hover:text-secondary hover:underline underline-offset-8 transition-all">Exercises</Link>
            <Link to="/routines" className="hover:text-secondary hover:underline underline-offset-8 transition-all">Routines</Link>
          </div>
        )}

        {/* User Actions */}
        <div className="flex items-center gap-4 relative">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-background border border-borderDark hover:border-primary transition-colors cursor-pointer focus:outline-none"
              >
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-primary font-bold text-sm uppercase">{user.name.charAt(0)}</span>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-borderDark rounded-sm shadow-xl z-50">
                  <div className="p-3 border-b border-borderDark">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className="text-xs text-textMuted truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-background transition-colors" onClick={() => setShowDropdown(false)}>Profile</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-secondary hover:bg-background transition-colors" onClick={() => setShowDropdown(false)}>Admin Panel</Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-error hover:bg-background transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-textMuted hover:text-white transition-colors">LOGIN</Link>
              <Link to="/signup" className="btn-primary py-2 px-4 text-xs">SIGN UP</Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
