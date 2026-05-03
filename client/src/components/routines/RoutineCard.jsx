import React from 'react';
import { Trash2, Edit3, Play } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const RoutineCard = ({ routine, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="card p-6 flex flex-col h-full hover:border-primary transition-colors group relative shadow-md">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-2xl text-primary font-bold uppercase truncate pr-8">{routine.name}</h3>
      </div>
      
      {routine.notes && (
        <p className="text-sm text-textMuted mb-4 italic line-clamp-2">{routine.notes}</p>
      )}

      <div className="flex-grow mt-2">
        <p className="text-sm font-bold uppercase mb-2 text-textLight">Exercises ({routine.exercises.length}):</p>
        <ul className="text-sm text-textMuted space-y-1">
          {routine.exercises.slice(0, 4).map((ex, i) => (
            <li key={i} className="truncate">• {ex.exercise?.name || 'Unknown Exercise'} <span className="text-xs ml-1 opacity-70">({ex.sets?.length || 0} sets)</span></li>
          ))}
          {routine.exercises.length > 4 && (
            <li className="italic opacity-70">...and {routine.exercises.length - 4} more</li>
          )}
        </ul>
      </div>

      <div className="mt-6 flex justify-between items-center pt-4 border-t border-borderDark">
        <div className="flex gap-2">
          <Link to={`/routines/edit/${routine._id}`} className="text-textMuted hover:text-secondary transition-colors p-2 bg-background rounded-full border border-borderDark hover:border-secondary" title="Edit Routine">
            <Edit3 size={18} />
          </Link>
          <button 
            onClick={() => onDelete(routine._id)} 
            className="text-textMuted hover:text-error transition-colors p-2 bg-background rounded-full border border-borderDark hover:border-error"
            title="Delete Routine"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        <button 
          onClick={() => navigate(`/session/start?routine=${routine._id}`)} 
          className="btn-primary py-2 px-6 text-sm font-bold tracking-widest flex items-center gap-2 shadow-lg"
        >
          <Play size={16} fill="currentColor" /> START
        </button>
      </div>
    </div>
  );
};

export default RoutineCard;
