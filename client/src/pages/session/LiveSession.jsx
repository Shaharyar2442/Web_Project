import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Dumbbell, X, Plus } from 'lucide-react';
import TimerDisplay from '../../components/session/TimerDisplay';
import SetRow from '../../components/session/SetRow';
import AddExerciseToSessionModal from '../../components/session/AddExerciseToSessionModal';
import { useUnit } from '../../hooks/useUnit';

const generateObjectId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const randomChars = Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return timestamp + randomChars;
};

const LiveSession = () => {
  const navigate = useNavigate();
  const { displayWeight, unitPreference } = useUnit();
  const [searchParams] = useSearchParams();
  const routineId = searchParams.get('routine');
  
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  
  const [ghostSession, setGhostSession] = useState(null);
  const [lastTimeMap, setLastTimeMap] = useState({});
  
  const initialized = useRef(false);

  // Initialize Session
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    const initializeSession = async () => {
      try {
        const { data: activeSession } = await api.get('/sessions/active');
        if (activeSession) {
          setSession(activeSession);
          setIsLoading(false);
          return;
        }

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

  useEffect(() => {
    if (session) {
      const fetchPreviousData = async () => {
        try {
          const rId = session.routine || routineId;
          const { data } = await api.get(`/sessions/previous-data?routineId=${rId}`);
          setGhostSession(data.previousRoutineSession);
          setLastTimeMap(data.lastTimeMap);
        } catch (error) {
          console.error('Failed to fetch previous data:', error);
        }
      };
      fetchPreviousData();
    }
  }, [session?._id, routineId]);

  const autoSync = async (updatedExercises) => {
    try {
      await api.put(`/sessions/${session._id}`, { exercises: updatedExercises });
    } catch (error) {
      toast.error('Failed to sync workout');
    }
  };

  const handleCompleteSet = (exerciseId, setId, isCompleted, reps, weight, note) => {
    if (!session) return;
    const updatedExercises = session.exercises.map(ex => {
      if (ex._id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => (s._id === setId || s.id === setId) ? { ...s, isCompleted, reps, weight, note } : s)
        };
      }
      return ex;
    });
    setSession({ ...session, exercises: updatedExercises });
    autoSync(updatedExercises);
  };

  const handleUpdateNote = (exerciseId, setId, note) => {
    const updatedExercises = session.exercises.map(ex => {
      if (ex._id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => (s._id === setId || s.id === setId) ? { ...s, note } : s)
        };
      }
      return ex;
    });
    setSession({ ...session, exercises: updatedExercises });
    autoSync(updatedExercises);
  };

  const handleAddSet = (exerciseId) => {
    const updatedExercises = session.exercises.map(ex => {
      if (ex._id === exerciseId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [...ex.sets, {
            id: generateObjectId(),
            reps: lastSet ? lastSet.reps : 10,
            weight: lastSet ? lastSet.weight : 0,
            isCompleted: false,
            note: ''
          }]
        };
      }
      return ex;
    });
    setSession({ ...session, exercises: updatedExercises });
    autoSync(updatedExercises);
  };

  const handleAddExerciseMidWorkout = (exercise) => {
    const newExercise = {
      _id: generateObjectId(),
      exercise,
      order: session.exercises.length,
      sets: [{
        id: generateObjectId(),
        reps: 10,
        weight: 0,
        isCompleted: false,
        note: ''
      }]
    };
    const updatedExercises = [...session.exercises, newExercise];
    setSession({ ...session, exercises: updatedExercises });
    setIsAddingExercise(false);
    autoSync(updatedExercises);
    toast.success('Exercise added!');
  };

  const handleFinishWorkout = async () => {
    if (!window.confirm("Are you sure you're ready to finish this workout?")) return;
    
    try {
      const { data } = await api.post(`/sessions/${session._id}/finish`, { exercises: session.exercises });
      setSummaryData(data);
      setIsFinished(true);
    } catch (error) {
      toast.error('Failed to finish workout');
    }
  };

  const handleCancelSession = async () => {
    if (window.confirm("Are you sure you want to cancel this session? All data will be lost.")) {
      try {
        await api.delete(`/sessions/${session._id}`);
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to cancel session');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center">
        <Dumbbell className="text-primary animate-pulse mb-4" size={48} />
        <h2 className="text-2xl font-bold tracking-widest text-textMuted uppercase animate-pulse">Warming Up</h2>
      </div>
    );
  }

  if (isFinished && summaryData) {
    return (
      <div className="max-w-md mx-auto mt-12 px-4 pb-20">
        <div className="card p-8 text-center shadow-2xl border-primary animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <Dumbbell size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-widest">Workout Complete</h1>
          <p className="text-textMuted mb-8 font-bold uppercase">{summaryData.name}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-surface border border-borderDark p-4 rounded-sm shadow-md">
              <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-1">Total Volume</p>
              <p className="text-2xl font-bold text-secondary">{displayWeight(summaryData.totalVolume)}</p>
            </div>
            <div className="bg-surface border border-borderDark p-4 rounded-sm shadow-md">
              <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-1">Sets Completed</p>
              <p className="text-2xl font-bold text-secondary">{summaryData.setsCompleted}</p>
            </div>
          </div>
          
          <button onClick={() => navigate('/dashboard')} className="btn-primary w-full py-4 text-lg shadow-lg">
            BACK TO HQ
          </button>
        </div>
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
            onClick={handleCancelSession}
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
          <div className="text-center py-12 text-textMuted border border-dashed border-borderDark rounded-sm bg-surface">
            <p>No exercises in this session.</p>
            <button onClick={() => setIsAddingExercise(true)} className="btn-secondary mt-4">ADD EXERCISE</button>
          </div>
        ) : (
          session.exercises.map((ex, index) => {
            const exerciseId = ex.exercise._id || ex.exercise;
            const ghostSets = ghostSession?.exercises.find(e => (e.exercise._id || e.exercise) === exerciseId)?.sets || [];
            const lastTime = lastTimeMap[exerciseId];

            return (
            <div key={ex._id} className="card overflow-hidden shadow-lg border-t-2 border-t-transparent hover:border-t-primary transition-all">
              <div className="bg-surface border-b border-borderDark p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-primary uppercase">
                  <span className="text-textMuted mr-2">{index + 1}.</span>
                  {ex.exercise?.name || ex.exerciseName || 'Unknown Exercise'}
                </h2>
              </div>
              
              {lastTime && (
                <div className="px-4 py-3 bg-surface/30 border-b border-borderDark text-xs">
                  <p className="font-bold uppercase tracking-widest text-textMuted mb-2">
                    LAST TIME — {new Date(lastTime.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})} — <span className="text-secondary">{lastTime.sessionName}</span>
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {lastTime.sets.map((s, i) => (
                      <span key={i} className="font-bold text-textMuted">
                        Set {i+1}: <span className="text-white">{displayWeight(s.weight, false)}{unitPreference} &times; {s.reps}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-background">
                {/* Table Headers */}
                <div className="grid grid-cols-5 gap-2 mb-2 px-2">
                  <div className="text-center text-[10px] font-bold text-textMuted uppercase tracking-wider">Set</div>
                  <div className="text-center text-[10px] font-bold text-textMuted uppercase tracking-wider">Prev</div>
                  <div className="text-center text-[10px] font-bold text-textMuted uppercase tracking-wider">{unitPreference}</div>
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
                      ghostData={ghostSets[setIndex]}
                      onComplete={(setId, isCompleted, reps, weight, note) => handleCompleteSet(ex._id, setId, isCompleted, reps, weight, note)}
                      onUpdateNote={(setId, note) => handleUpdateNote(ex._id, setId, note)}
                    />
                  ))}

                  {/* Faded Ghost Rows for extra sets from last time */}
                  {ghostSets.slice(ex.sets.length).map((gSet, gIndex) => (
                    <div key={`ghost-${gIndex}`} className="grid grid-cols-5 gap-2 items-center px-2 py-3 border-b border-borderDark/20 opacity-30 grayscale pointer-events-none">
                      <div className="text-center font-bold text-textMuted">{ex.sets.length + gIndex + 1}</div>
                      <div className="text-center text-xs font-bold text-textMuted">-</div>
                      <div className="text-center font-bold text-textMuted">{displayWeight(gSet.weight, false)}</div>
                      <div className="text-center font-bold text-textMuted">{gSet.reps}</div>
                      <div className="flex justify-center">-</div>
                    </div>
                  ))}
                </div>

                <button 
                  className="mt-4 w-full py-2 border border-dashed border-borderDark text-textMuted hover:border-primary hover:text-primary transition-colors rounded-sm text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-surface"
                  onClick={() => handleAddSet(ex._id)}
                >
                  <Plus size={16} /> Add Set
                </button>
              </div>
            </div>
            );
          })
        )}

        {/* Add Exercise Mid-Workout */}
        {session.exercises.length > 0 && (
          <button 
            onClick={() => setIsAddingExercise(true)}
            className="w-full py-4 border-2 border-dashed border-borderDark text-textMuted hover:border-secondary hover:text-secondary transition-colors rounded-sm text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-surface shadow-md"
          >
            <Plus size={18} /> ADD EXERCISE
          </button>
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

      <AddExerciseToSessionModal 
        isOpen={isAddingExercise} 
        onClose={() => setIsAddingExercise(false)} 
        onAdd={handleAddExerciseMidWorkout} 
      />
    </div>
  );
};

export default LiveSession;
