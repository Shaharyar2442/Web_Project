import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const SetRow = ({ set, index, onComplete }) => {
  const [reps, setReps] = useState(set.reps);
  const [weight, setWeight] = useState(set.weight);

  const handleComplete = () => {
    // If completing, pass the updated values. If un-completing, just pass current values.
    onComplete(set._id || set.id, !set.isCompleted, reps, weight);
  };

  return (
    <motion.div 
      className={`relative grid grid-cols-5 gap-2 items-center p-2 rounded-sm border transition-colors ${set.isCompleted ? 'bg-primary/10 border-primary' : 'bg-background border-borderDark hover:border-textMuted'}`}
      animate={set.isCompleted ? { backgroundColor: 'rgba(139, 0, 0, 0.15)', borderColor: 'rgb(139, 0, 0)' } : { backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border-dark)' }}
    >
      {/* Set Number */}
      <div className={`text-center font-bold text-sm ${set.isCompleted ? 'text-primary' : 'text-textMuted'}`}>
        {index + 1}
      </div>

      {/* Previous */}
      <div className="text-center text-textMuted text-xs italic font-mono">
        -
      </div>

      {/* Weight Input */}
      <div className="text-center">
        <input 
          type="number" 
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          disabled={set.isCompleted}
          className={`w-full bg-surface border border-borderDark rounded-sm p-2 text-center font-bold outline-none transition-colors ${set.isCompleted ? 'text-primary opacity-80 border-transparent bg-transparent' : 'text-textLight focus:border-primary'}`}
        />
      </div>

      {/* Reps Input */}
      <div className="text-center">
        <input 
          type="number" 
          value={reps}
          onChange={(e) => setReps(Number(e.target.value))}
          disabled={set.isCompleted}
          className={`w-full bg-surface border border-borderDark rounded-sm p-2 text-center font-bold outline-none transition-colors ${set.isCompleted ? 'text-primary opacity-80 border-transparent bg-transparent' : 'text-textLight focus:border-primary'}`}
        />
      </div>

      {/* Complete Button */}
      <div className="flex justify-center items-center relative h-10 w-full cursor-pointer group" onClick={handleComplete}>
        <div className={`w-8 h-8 rounded-sm border-2 flex items-center justify-center transition-all ${set.isCompleted ? 'bg-primary border-primary' : 'bg-surface border-borderDark group-hover:border-primary'}`}>
          <AnimatePresence>
            {set.isCompleted && (
              <motion.div
                initial={{ scale: 3, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="text-white"
              >
                <Check size={20} strokeWidth={4} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Flash effect overlay */}
        <AnimatePresence>
          {set.isCompleted && (
            <motion.div
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-primary/40 rounded-sm pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SetRow;
