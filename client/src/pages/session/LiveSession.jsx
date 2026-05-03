import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Dumbbell, X } from 'lucide-react';
import TimerDisplay from '../../components/session/TimerDisplay';
import SetRow from '../../components/session/SetRow';

const LiveSession = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routineId = searchParams.get('routine');
  
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // 1. Check for active session first
        const { data: activeSession } = await api.get('/sessions/active');
        if (activeSession) {
          setSession(activeSession);
          setIsLoading(false);
          return;
        }

        // 2. If no active session, start one (with or without routine)
        const { data: newSession } = await api.post('/sessions/start', { routineId });
        setSession(newSession);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to initialize session');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [routineId, navigate]);

  // Handle Set Completion
  const handleCompleteSet = async (exerciseId, setId, isCompleted, reps, weight) => {
    if (!session) return;

    // Optimistic UI Update
    const updatedExercises = session.exercises.map(ex => {
      if (ex._id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => {
            if (s._id === setId || s.id === setId) {
              return { ...s, isCompleted, reps, weight };
            }
            return s;
          })
        };
      }
      return ex;
    });

    setSession({ ...session, exercises: updatedExercises });

    // Auto-save to backend
    try {
      await api.put(`/sessions/${session._id}`, { exercises: updatedExercises });
    } catch (error) {
      toast.error('Failed to sync set');
    }
  };

  const handleFinishWorkout = () => {
    toast('Finish Workout flow coming in Phase 7!', { icon: '🏗️' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center">
        <Dumbbell className="text-primary animate-pulse mb-4" size={48} />
        <h2 className="text-2xl font-bold tracking-widest text-textMuted uppercase animate-pulse">Warming Up</h2>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-2xl mx-auto pb-32">
      {/* Sticky Header */}
      <div className="sticky top-[68px] z-30 bg-surface/95 backdrop-blur-md border-b border-borderDark p-4 shadow-xl flex justify-between items-center -mx-4 px-4 sm:mx-0 sm:rounded-b-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary uppercase truncate max-w-[180px] sm:max-w-[300px]">
            {session.name}
          </h1>
          <p className="text-xs text-textMuted font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span> In Progress
          </p>
        </div>
        <div className="flex items-center gap-4">
          <TimerDisplay startTime={session.startTime} />
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to cancel this session? All data will be lost.")) {
                navigate('/dashboard'); // Hard delete will be added later
              }
            }}
            className="text-textMuted hover:text-error transition-colors p-2 rounded-sm hover:bg-background"
            title="Cancel Session"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Exercises List */}
      <div className="mt-6 space-y-8">
        {session.exercises.length === 0 ? (
          <div className="text-center py-12 text-textMuted border border-dashed border-borderDark rounded-sm">
            <p>No exercises in this session.</p>
            <p className="text-sm">Adding exercises mid-workout comes in Phase 7!</p>
          </div>
        ) : (
          session.exercises.map((ex, index) => (
            <div key={ex._id} className="card overflow-hidden shadow-lg border-t-2 border-t-transparent hover:border-t-primary transition-all">
              <div className="bg-surface border-b border-borderDark p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-primary uppercase">
                  <span className="text-textMuted mr-2">{index + 1}.</span>
                  {ex.exercise?.name || 'Unknown Exercise'}
                </h2>
              </div>
              
              <div className="p-4 bg-background">
                {/* Table Headers */}
                <div className="grid grid-cols-5 gap-2 mb-2 px-2">
                  <div className="text-center text-[10px] font-bold text-textMuted uppercase tracking-wider">Set</div>
                  <div className="text-center text-[10px] font-bold text-textMuted uppercase tracking-wider">Prev</div>
                  <div className="text-center text-[10px] font-bold text-textMuted uppercase tracking-wider">kg</div>
                  <div className="text-center text-[10px] font-bold text-textMuted uppercase tracking-wider">Reps</div>
                  <div className="text-center text-[10px] font-bold text-textMuted uppercase tracking-wider">Done</div>
                </div>

                {/* Set Rows */}
                <div className="space-y-2">
                  {ex.sets.map((set, setIndex) => (
                    <SetRow 
                      key={set._id || set.id} 
                      set={set} 
                      index={setIndex} 
                      onComplete={(setId, isCompleted, reps, weight) => handleCompleteSet(ex._id, setId, isCompleted, reps, weight)}
                    />
                  ))}
                </div>

                {/* Add Set Button placeholder for Phase 7 */}
                <button 
                  className="mt-4 w-full py-2 border border-dashed border-borderDark text-textMuted hover:border-primary hover:text-primary transition-colors rounded-sm text-sm font-bold uppercase tracking-widest"
                  onClick={() => toast('Adding sets mid-workout coming in Phase 7', { icon: '🏗️' })}
                >
                  + Add Set
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sticky Bottom Finish Button */}
      <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-borderDark p-4 z-40 sm:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
        <button onClick={handleFinishWorkout} className="btn-primary w-full py-4 text-lg">
          FINISH WORKOUT
        </button>
      </div>
      
      {/* Desktop Finish Button */}
      <div className="hidden sm:block mt-8">
        <button onClick={handleFinishWorkout} className="btn-primary w-full py-4 text-xl">
          FINISH WORKOUT
        </button>
      </div>

    </div>
  );
};

export default LiveSession;
