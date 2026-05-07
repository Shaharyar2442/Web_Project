import React, { useState } from 'react';
import { Dumbbell, X, Mail, Phone } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);

  const getModalContent = () => {
    switch (activeModal) {
      case 'about':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-4">About BreakingIron</h2>
            <p className="text-textLight leading-relaxed">
              BreakingIron is an advanced, uncompromised lifting tracker designed for serious athletes. It goes beyond simple rep counting by offering ghost-data tracking, exact volume analytics, and unbreakable historical snapshots of every set you've ever completed.
            </p>
          </div>
        );
      case 'contact':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-6">Contact Support</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-background p-4 rounded-sm border border-borderDark">
                <Mail className="text-primary" />
                <div>
                  <p className="text-xs font-bold text-textMuted uppercase tracking-widest">Email</p>
                  <a href="mailto:shaharyar.rizwan11@gmail.com" className="text-white font-bold hover:text-primary transition-colors">shaharyar.rizwan11@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-background p-4 rounded-sm border border-borderDark">
                <Phone className="text-primary" />
                <div>
                  <p className="text-xs font-bold text-textMuted uppercase tracking-widest">Phone</p>
                  <a href="tel:03238449301" className="text-white font-bold hover:text-primary transition-colors">03238449301</a>
                </div>
              </div>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-4">Privacy Policy</h2>
            <p className="text-textLight leading-relaxed">
              Your lifting data is yours. BreakingIron stores your data securely to provide analytical insights and historical tracking. We do not sell your personal records, routines, or identifying information to third parties. Soft-deleted accounts anonymize email addresses to maintain statistical integrity without compromising privacy.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="bg-background border-t border-borderDark py-8 mt-auto z-40 relative">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex items-center gap-2">
          <Dumbbell className="text-textMuted" size={20} />
          <span className="font-heading text-xl tracking-wider text-textMuted">BREAKING<span className="text-borderDark">IRON</span></span>
        </div>

        <div className="flex items-center gap-6 text-sm text-textMuted font-bold uppercase tracking-wider">
          <button onClick={() => setActiveModal('about')} className="hover:text-secondary transition-colors focus:outline-none">About</button>
          <button onClick={() => setActiveModal('contact')} className="hover:text-secondary transition-colors focus:outline-none">Contact</button>
          <button onClick={() => setActiveModal('privacy')} className="hover:text-secondary transition-colors focus:outline-none">Privacy</button>
        </div>

        <div className="text-sm text-textMuted">
          &copy; {new Date().getFullYear()} BreakingIron. Log it. Lift it. Break it.
        </div>

      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-surface border border-borderDark p-8 shadow-2xl max-w-md w-full"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-textMuted hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              {getModalContent()}
              
              <button 
                onClick={() => setActiveModal(null)}
                className="w-full mt-8 btn-secondary"
              >
                CLOSE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
