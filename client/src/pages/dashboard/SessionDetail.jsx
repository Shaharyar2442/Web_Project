import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { format } from 'date-fns';
import { ArrowLeft, Clock, Dumbbell, Award, Layers } from 'lucide-react';

const SessionDetail = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await api.get(`/sessions/${id}`);
        setSession(data);
      } catch (error) {
        console.error('Failed to fetch session detail:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><div className="w-16 h-16 border-4 border-borderDark border-t-primary rounded-full animate-spin"></div></div>;
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 text-center mt-20">
        <h2 className="text-2xl text-white font-bold mb-4 uppercase">Session Not Found</h2>
        <Link to="/dashboard" className="btn-secondary">Back to Dashboard</Link>
      </div>
    );
  }

  const durationMs = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
  const durationMins = Math.floor(durationMs / 60000);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      {/* Back button */}
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-textMuted hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest mt-4">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="bg-surface border border-borderDark rounded-sm p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl text-white font-bold uppercase tracking-wide mb-2">{session.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-textMuted uppercase tracking-widest">
              <span className="bg-background px-3 py-1 rounded-sm border border-borderDark">
                {format(new Date(session.endTime), 'MMM d, yyyy')}
              </span>
              {session.routine && (
                <span className="text-primary border border-primary/30 bg-primary/10 px-3 py-1 rounded-sm">
                  Based on Routine: {session.routine.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-borderDark">
          <div>
            <p className="text-xs text-textMuted font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><Clock size={12}/> Duration</p>
            <p className="text-xl text-white font-bold">{durationMins} <span className="text-sm text-textMuted">mins</span></p>
          </div>
          <div>
            <p className="text-xs text-textMuted font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><Dumbbell size={12}/> Volume</p>
            <p className="text-xl text-white font-bold">{session.totalVolume?.toLocaleString()} <span className="text-sm text-textMuted">kg</span></p>
          </div>
          <div>
            <p className="text-xs text-textMuted font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><Layers size={12}/> Sets</p>
            <p className="text-xl text-white font-bold">{session.setsCompleted}</p>
          </div>
        </div>
      </div>

      {/* Exercises Log */}
      <div className="space-y-6">
        <h2 className="text-2xl text-white font-bold uppercase tracking-widest mb-4">Workout Log</h2>
        
        {session.exercises.map((ex, index) => {
          const completedSets = ex.sets.filter(s => s.isCompleted);
          if (completedSets.length === 0) return null;
          
          return (
            <div key={ex._id} className="bg-background border border-borderDark rounded-sm overflow-hidden">
              <div className="bg-surface px-6 py-4 border-b border-borderDark flex justify-between items-center">
                <h3 className="text-lg text-primary font-bold uppercase tracking-wider">
                  {index + 1}. {ex.exerciseName || ex.exercise?.name || 'Unknown Exercise'}
                </h3>
              </div>
              
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs text-textMuted font-bold uppercase tracking-widest border-b border-borderDark">
                        <th className="pb-3 px-2 w-16">Set</th>
                        <th className="pb-3 px-2">Weight</th>
                        <th className="pb-3 px-2">Reps</th>
                        <th className="pb-3 px-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedSets.map((set, setIdx) => (
                        <tr key={set._id} className={`border-b border-borderDark/30 hover:bg-surface/30 transition-colors ${set.isPR ? 'bg-primary/5' : ''}`}>
                          <td className="py-4 px-2 font-bold text-textMuted">{setIdx + 1}</td>
                          <td className="py-4 px-2">
                            <span className="text-lg font-bold text-white">{set.weight}</span> <span className="text-xs text-textMuted">kg</span>
                          </td>
                          <td className="py-4 px-2">
                            <span className="text-lg font-bold text-white">{set.reps}</span>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-2">
                              {set.note ? (
                                <span className="text-xs text-textLight italic opacity-80">{set.note}</span>
                              ) : (
                                <span className="text-xs text-textMuted/30">-</span>
                              )}
                              {set.isPR && (
                                <span className="ml-auto inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-background bg-secondary px-2 py-1 rounded-sm">
                                  <Award size={10} /> PR
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SessionDetail;
