import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Plus, MessageSquare } from 'lucide-react';

const DraggableExerciseItem = ({ exercise, onRemove, onAddSet, onRemoveSet, onUpdateSet }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: exercise.id });
  const [showNoteFor, setShowNoteFor] = useState(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`bg-surface border border-borderDark rounded-sm p-4 flex flex-col md:flex-row items-start gap-4 relative group ${isDragging ? 'shadow-2xl border-primary opacity-90' : 'shadow-sm'}`}
    >
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-textMuted hover:text-primary transition-colors p-2 -ml-2 hidden md:block outline-none mt-1">
        <GripVertical size={20} />
      </div>

      <div className="flex-grow w-full">
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-4 border-b border-borderDark pb-2">
          <div className="flex items-center gap-2">
            <div {...attributes} {...listeners} className="md:hidden cursor-grab active:cursor-grabbing text-textMuted hover:text-primary outline-none">
              <GripVertical size={20} />
            </div>
            <h3 className="text-xl font-bold text-primary truncate pr-4 uppercase">{exercise.name}</h3>
          </div>
          <button onClick={onRemove} className="text-textMuted hover:text-error transition-colors p-1" title="Remove Exercise">
            <X size={20} />
          </button>
        </div>
        
        {/* Sets List */}
        <div className="space-y-2 mb-4">
          {exercise.sets.map((set, index) => (
            <div key={set.id} className="flex flex-col gap-1 w-full border border-borderDark rounded-sm bg-background p-2">
              <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3">
                <div className="flex items-center gap-2 md:w-16">
                  <div className="w-10 text-center font-bold text-textMuted text-sm uppercase hidden sm:block">
                    Set {index + 1}
                  </div>
                  <button 
                    onClick={() => setShowNoteFor(showNoteFor === set.id ? null : set.id)}
                    className="p-1 hover:bg-surface rounded-sm transition-colors"
                    title={set.note ? "Edit Note" : "Add Note"}
                  >
                    <MessageSquare size={16} className={set.note ? 'text-secondary' : 'text-textMuted hover:text-primary'} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 flex-grow">
                  <label className="text-textMuted font-bold uppercase text-[10px] sm:hidden">Reps</label>
                  <input 
                    type="number" min="1" max="999" 
                    value={set.reps} 
                    onChange={e => onUpdateSet(set.id, 'reps', e.target.value)}
                    className="w-full sm:w-16 bg-surface border border-borderDark rounded-sm p-1.5 text-center text-textLight focus:border-primary outline-none transition-colors"
                  />
                </div>
                
                <div className="flex items-center gap-2 flex-grow">
                  <label className="text-textMuted font-bold uppercase text-[10px] sm:hidden">Wt</label>
                  <input 
                    type="number" min="0" max="9999" step="0.5"
                    value={set.weight} 
                    onChange={e => onUpdateSet(set.id, 'weight', e.target.value)}
                    className="w-full sm:w-20 bg-surface border border-borderDark rounded-sm p-1.5 text-center text-textLight focus:border-primary outline-none transition-colors"
                  />
                </div>
                
                <div className="flex items-center gap-2 flex-grow">
                  <label className="text-textMuted font-bold uppercase text-[10px] sm:hidden">Rest</label>
                  <input 
                    type="number" min="0" max="900" step="15"
                    value={set.restTimerSeconds} 
                    onChange={e => onUpdateSet(set.id, 'restTimerSeconds', e.target.value)}
                    className="w-full sm:w-16 bg-surface border border-borderDark rounded-sm p-1.5 text-center text-textLight focus:border-primary outline-none transition-colors"
                  />
                </div>

                <button onClick={() => onRemoveSet(set.id)} className="text-textMuted hover:text-error transition-colors p-1 md:ml-2">
                  <X size={16} />
                </button>
              </div>
              
              {showNoteFor === set.id && (
                <div className="mt-1">
                  <textarea 
                    value={set.note || ''} 
                    onChange={e => onUpdateSet(set.id, 'note', e.target.value)} 
                    placeholder="Add form cues, equipment settings, or notes for this set..." 
                    className="w-full bg-surface border border-borderDark p-2 text-xs rounded-sm text-textLight outline-none focus:border-secondary resize-y min-h-[60px]" 
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={onAddSet}
          className="text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-wider"
        >
          <Plus size={14} /> Add Set
        </button>

      </div>
    </div>
  );
};

export default DraggableExerciseItem;
