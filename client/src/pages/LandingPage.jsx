import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Activity, TrendingUp, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden -mt-8 pt-8">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/bg-hero.png)',
          backgroundPosition: 'center 30%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
      </div>

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-12 mb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-background/50 backdrop-blur-sm border border-borderDark rounded-full flex items-center justify-center text-primary shadow-[0_0_30px_rgba(231,76,60,0.3)]">
            <Dumbbell size={40} />
          </div>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-6xl sm:text-7xl md:text-8xl font-heading text-white mb-6 tracking-wider drop-shadow-2xl"
        >
          LOG IT. LIFT IT. <span className="text-primary text-glow">BREAK IT.</span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-xl sm:text-2xl text-textMuted max-w-3xl mx-auto mb-10 font-medium drop-shadow-md"
        >
          The ultimate intelligent tracking platform for serious lifters. Pre-filled ghost data, precise muscle analytics, and uncompromising progress tracking.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {user ? (
            <Link to="/dashboard" className="btn-primary py-4 px-10 text-lg shadow-[0_0_20px_rgba(231,76,60,0.4)] hover:shadow-[0_0_30px_rgba(231,76,60,0.6)] hover:-translate-y-1 transition-all">
              RETURN TO HQ
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn-primary py-4 px-10 text-lg shadow-[0_0_20px_rgba(231,76,60,0.4)] hover:shadow-[0_0_30px_rgba(231,76,60,0.6)] hover:-translate-y-1 transition-all w-full sm:w-auto">
                JOIN THE IRON
              </Link>
              <Link to="/login" className="btn-secondary py-4 px-10 text-lg hover:-translate-y-1 transition-transform w-full sm:w-auto bg-background/50 backdrop-blur-sm">
                LOG IN
              </Link>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div 
        className="relative z-10 w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="bg-surface/60 backdrop-blur-md border border-borderDark p-8 rounded-sm hover:border-primary/50 transition-colors group">
          <Activity className="text-secondary mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Ghost Tracking</h3>
          <p className="text-textMuted text-sm">Our intelligent logger automatically pre-fills your exact sets and weights from your previous session.</p>
        </div>
        
        <div className="bg-surface/60 backdrop-blur-md border border-borderDark p-8 rounded-sm hover:border-primary/50 transition-colors group">
          <TrendingUp className="text-secondary mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Muscle Analytics</h3>
          <p className="text-textMuted text-sm">Visualize exactly where your volume is going with beautifully crafted charts and precise muscle group breakdowns.</p>
        </div>
        
        <div className="bg-surface/60 backdrop-blur-md border border-borderDark p-8 rounded-sm hover:border-primary/50 transition-colors group">
          <Shield className="text-secondary mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Unbreakable Data</h3>
          <p className="text-textMuted text-sm">Every personal record is snapshotted permanently. Your history is indestructible, even if routine templates change.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
