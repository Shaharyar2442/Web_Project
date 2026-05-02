import React from 'react';
import { Dumbbell } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-borderDark py-8 mt-auto z-40 relative">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex items-center gap-2">
          <Dumbbell className="text-textMuted" size={20} />
          <span className="font-heading text-xl tracking-wider text-textMuted">BREAKING<span className="text-borderDark">IRON</span></span>
        </div>

        <div className="flex items-center gap-6 text-sm text-textMuted font-bold uppercase tracking-wider">
          <a href="#" className="hover:text-secondary transition-colors">About</a>
          <a href="#" className="hover:text-secondary transition-colors">Contact</a>
          <a href="#" className="hover:text-secondary transition-colors">Privacy</a>
        </div>

        <div className="text-sm text-textMuted">
          &copy; {new Date().getFullYear()} BreakingIron. Log it. Lift it. Break it.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
