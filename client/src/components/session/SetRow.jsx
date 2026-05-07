import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MessageSquare } from 'lucide-react';
import { useUnit } from '../../hooks/useUnit';

const SetRow = ({ set, index, onComplete, onUpdateNote, ghostData }) => {
  const { displayWeight, convertToKg, unitPreference } = useUnit();
  
  const [reps, setReps] = useState(set.reps);
  // Initialize state with converted display value
  const [weight, setWeight] = useState(set.weight ? displayWeight(set.weight, false) : 0);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState(set.note || '');

  const isGhostingWeight = weight === 0 && ghostData;
  const isGhostingReps = reps === 0 && ghostData;

  const handleComplete = () => {
    // If ghosting, use the raw ghost kg weight. If manual, convert the input display weight back to kg.
    const finalWeightKg = isGhostingWeight && !set.isCompleted ? ghostData.weight : convertToKg(weight);
    const finalReps = isGhostingReps && !set.isCompleted ? ghostData.reps : reps;
    
    if (!set.isCompleted) {
      // Set the local state to the display version of the weight we are about to save
      setWeight(displayWeight(finalWeightKg, false));
      setReps(finalReps);
    }
    
    onComplete(set._id || set.id, !set.isCompleted, finalReps, finalWeightKg, note);
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
    onUpdateNote(set._id || set.id, e.target.value);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <motion.div 
        className={`relative grid grid-cols-[1fr_1fr_2fr_2fr_1fr] gap-2 items-center p-2 rounded-sm border transition-colors ${set.isCompleted ? 'bg-primary/10 border-primary' : 'bg-background border-borderDark hover:border-textMuted'}`}
        animate={set.isCompleted ? { backgroundColor: 'rgba(139, 0, 0, 0.15)', borderColor: 'rgb(139, 0, 0)' } : { backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border-dark)' }}
      >
        {/* Set Number & Note Icon */}
        <div className="flex items-center justify-center gap-2">
          <div className={`font-bold text-sm ${set.isCompleted ? 'text-primary' : 'text-textMuted'}`}>
            {index + 1}
          </div>
          <button 
            onClick={() => setShowNote(!showNote)}
            className="p-1 hover:bg-surface rounded-sm transition-colors disabled:opacity-50"
          >
            <MessageSquare size={14} className={note ? 'text-secondary' : 'text-textMuted hover:text-primary'} />
          </button>
        </div>

        {/* Previous */}
        <div className="text-center text-textMuted text-[10px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
          {ghostData ? `${displayWeight(ghostData.weight, false)}${unitPreference} × ${ghostData.reps}` : '-'}
        </div>

        {/* Weight Input */}
        <div className="text-center">
          <input 
            type="number" 
            value={isGhostingWeight ? '' : weight}
            placeholder={isGhostingWeight ? displayWeight(ghostData.weight, false) : ''}
            onChange={(e) => setWeight(Number(e.target.value))}
            disabled={set.isCompleted}
            className={`w-full rounded-sm p-2 text-center font-bold outline-none transition-colors ${set.isCompleted ? 'text-primary opacity-80 border-transparent bg-transparent' : (isGhostingWeight ? 'bg-[rgba(184,134,11,0.15)] border-transparent border-l-[3px] border-l-[#b8860b] text-[#b8860b] placeholder-[#b8860b]/50' : 'bg-surface border border-borderDark focus:border-primary text-textLight')}`}
          />
        </div>

        {/* Reps Input */}
        <div className="text-center">
          <input 
            type="number" 
            value={isGhostingReps ? '' : reps}
            placeholder={isGhostingReps ? ghostData.reps : ''}
            onChange={(e) => setReps(Number(e.target.value))}
            disabled={set.isCompleted}
            className={`w-full rounded-sm p-2 text-center font-bold outline-none transition-colors ${set.isCompleted ? 'text-primary opacity-80 border-transparent bg-transparent' : (isGhostingReps ? 'bg-[rgba(184,134,11,0.15)] border-transparent border-l-[3px] border-l-[#b8860b] text-[#b8860b] placeholder-[#b8860b]/50' : 'bg-surface border border-borderDark focus:border-primary text-textLight')}`}
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

      {/* Note Textarea */}
      {showNote && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="w-full"
        >
          <textarea 
            value={note}
            onChange={handleNoteChange}
            disabled={set.isCompleted}
            placeholder="Add form cues, equipment settings, or notes for this set..."
            className={`w-full bg-surface border border-borderDark rounded-sm p-2 mt-1 text-xs text-textLight outline-none focus:border-secondary transition-colors resize-y min-h-[50px] ${set.isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </motion.div>
      )}
    </div>
  );
};

export default SetRow;
