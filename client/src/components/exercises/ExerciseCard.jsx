import React from 'react';
import { Trash2, Edit2, Globe, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ExerciseCard = ({ exercise, onDelete }) => {
  const { user } = useAuth();
  
  const canDelete = exercise.isGlobal ? user?.role === 'admin' : exercise.createdBy === user?._id;

  return (
    <div className="card p-4 hover:border-primary transition-colors group relative">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl text-primary font-bold uppercase">{exercise.name}</h3>
        {exercise.isGlobal ? (
          <Globe size={16} className="text-secondary" title="Global Exercise" />
        ) : (
          <User size={16} className="text-textMuted" title="Custom Exercise" />
        )}
      </div>
      
      <div className="flex gap-2 mb-4">
        <span className="text-xs bg-background border border-borderDark px-2 py-1 rounded-sm text-textMuted uppercase font-bold">
          {exercise.muscleGroup}
        </span>
        <span className="text-xs bg-background border border-borderDark px-2 py-1 rounded-sm text-textMuted uppercase font-bold">
          {exercise.category}
        </span>
      </div>

      {canDelete && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onDelete(exercise._id)} 
            className="text-textMuted hover:text-error transition-colors p-1"
            title="Delete Exercise"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
