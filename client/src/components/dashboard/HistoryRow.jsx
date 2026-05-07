import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Dumbbell, Calendar, Clock } from 'lucide-react';

const HistoryRow = ({ session }) => {
  const durationMs = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
  const durationMins = Math.floor(durationMs / 60000);

  return (
    <Link to={`/history/${session._id}`} className="block bg-surface border border-borderDark rounded-sm p-4 hover:border-primary transition-colors cursor-pointer shadow-md group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-primary uppercase group-hover:text-secondary transition-colors">{session.name}</h3>
        <span className="text-xs font-bold text-textMuted bg-background px-2 py-1 rounded-sm uppercase tracking-wider flex items-center gap-2">
          <Calendar size={14} />
          {format(new Date(session.endTime), 'MMM d, yyyy')}
        </span>
      </div>

      <div className="flex flex-wrap gap-6 text-xs font-bold text-textMuted uppercase tracking-wider mb-4 border-b border-borderDark pb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-secondary" />
          {durationMins} mins
        </div>
        <div className="flex items-center gap-2">
          <Dumbbell size={16} className="text-secondary" />
          {session.totalVolume?.toLocaleString() || 0} kg
        </div>
        <div className="flex items-center gap-2 bg-background px-2 py-1 rounded-sm border border-borderDark">
          {session.setsCompleted || 0} Sets
        </div>
      </div>

      <div>
        <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-2">Exercises Performed</p>
        <div className="flex flex-wrap gap-2">
          {session.exercises.slice(0, 5).map((ex, i) => {
            const completedSets = ex.sets.filter(s => s.isCompleted).length;
            if (completedSets === 0) return null;
            return (
              <span key={i} className="text-xs font-bold text-textLight bg-background border border-borderDark px-2 py-1 rounded-sm truncate max-w-[150px]">
                {completedSets}x {ex.exercise?.name || 'Unknown'}
              </span>
            );
          })}
          {session.exercises.length > 5 && (
            <span className="text-[10px] font-bold text-textMuted italic py-1">
              +{session.exercises.length - 5} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default HistoryRow;
