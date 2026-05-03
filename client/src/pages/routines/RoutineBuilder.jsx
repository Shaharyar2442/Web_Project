import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Save, Search, ArrowLeft } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableExerciseItem from '../../components/routines/DraggableExerciseItem';

const RoutineBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allExercises, setAllExercises] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchAllExercises();
    if (id) {
      setIsEditing(true);
      fetchRoutine(id);
    }
  }, [id]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = allExercises.filter(ex => 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allExercises]);

  const fetchAllExercises = async () => {
    try {
      const { data } = await api.get('/exercises');
      setAllExercises(data);
    } catch (error) {
      toast.error('Failed to load exercises for search');
    }
  };

  const fetchRoutine = async (routineId) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/routines/${routineId}`);
      setName(data.name);
      setNotes(data.notes);
      
      const mappedExercises = data.exercises.map(ex => ({
        id: ex._id || Math.random().toString(36).substr(2, 9),
        exerciseId: ex.exercise._id,
        name: ex.exercise.name,
        sets: ex.sets.map(s => ({
          id: s._id || Math.random().toString(36).substr(2, 9),
          reps: s.reps,
          weight: s.weight,
          restTimerSeconds: s.restTimerSeconds
        }))
      }));
      setSelectedExercises(mappedExercises);
    } catch (error) {
      toast.error('Failed to load routine');
      navigate('/routines');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExercise = (exercise) => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      exerciseId: exercise._id,
      name: exercise.name,
      sets: [{
        id: Math.random().toString(36).substr(2, 9),
        reps: 10,
        weight: 0,
        restTimerSeconds: 90,
        note: ''
      }]
    };
    setSelectedExercises([...selectedExercises, newItem]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveExercise = (idToRemove) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== idToRemove));
  };

  const handleAddSet = (exerciseId) => {
    setSelectedExercises(selectedExercises.map(ex => {
      if (ex.id === exerciseId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [...ex.sets, {
            id: Math.random().toString(36).substr(2, 9),
            reps: lastSet ? lastSet.reps : 10,
            weight: lastSet ? lastSet.weight : 0,
            restTimerSeconds: lastSet ? lastSet.restTimerSeconds : 90,
            note: ''
          }]
        };
      }
      return ex;
    }));
  };

  const handleRemoveSet = (exerciseId, setId) => {
    setSelectedExercises(selectedExercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.filter(s => s.id !== setId)
        };
      }
      return ex;
    }));
  };

  const handleUpdateSet = (exerciseId, setId, field, value) => {
    setSelectedExercises(selectedExercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => 
            s.id === setId ? { ...s, [field]: Number(value) } : s
          )
        };
      }
      return ex;
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSelectedExercises((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      return toast.error('Routine name is required');
    }
    if (selectedExercises.length === 0) {
      return toast.error('Add at least one exercise');
    }
    
    // Validate that every exercise has at least one set
    const invalidExercise = selectedExercises.find(ex => ex.sets.length === 0);
    if (invalidExercise) {
      return toast.error(`Exercise "${invalidExercise.name}" has no sets. Add a set or remove the exercise.`);
    }

    const payload = {
      name,
      notes,
      exercises: selectedExercises.map((ex, index) => ({
        exercise: ex.exerciseId,
        sets: ex.sets.map(s => ({
          reps: s.reps,
          weight: s.weight,
          restTimerSeconds: s.restTimerSeconds
        })),
        order: index
      }))
    };

    try {
      if (isEditing) {
        await api.put(`/routines/${id}`, payload);
        toast.success('Routine updated');
      } else {
        await api.post('/routines', payload);
        toast.success('Routine created');
      }
      navigate('/routines');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save routine');
    }
  };

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><div className="w-16 h-16 border-4 border-borderDark border-t-primary rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="pb-20 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/routines')} className="text-textMuted hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-4xl text-primary">{isEditing ? 'EDIT ROUTINE' : 'BUILD ROUTINE'}</h1>
      </div>

      <div className="card p-6 mb-8 space-y-4 shadow-md">
        <div>
          <label className="block text-sm text-textMuted mb-1 font-bold uppercase">Routine Name</label>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            type="text" 
            placeholder="e.g. Push Day Heavy"
            className="w-full bg-background border border-borderDark rounded-sm p-3 text-textLight focus:outline-none focus:border-primary transition-colors text-xl font-bold"
          />
        </div>
        <div>
          <label className="block text-sm text-textMuted mb-1 font-bold uppercase">Notes (Optional)</label>
          <textarea 
            value={notes} 
            onChange={e => setNotes(e.target.value)} 
            placeholder="e.g. Focus on eccentric movement"
            className="w-full bg-background border border-borderDark rounded-sm p-3 text-textLight focus:outline-none focus:border-primary transition-colors resize-none h-24"
          />
        </div>
      </div>

      {/* Search and Add Exercise */}
      <div className="mb-8 relative z-20">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-textMuted" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search to add an exercise..." 
            className="w-full bg-surface border border-borderDark rounded-sm py-3 pl-10 pr-3 text-textLight focus:outline-none focus:border-primary transition-colors shadow-lg"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="absolute w-full mt-1 bg-surface border border-borderDark rounded-sm shadow-2xl max-h-60 overflow-y-auto">
            {searchResults.map(ex => (
              <button
                key={ex._id}
                onClick={() => handleAddExercise(ex)}
                className="w-full text-left px-4 py-3 hover:bg-background border-b border-borderDark last:border-b-0 transition-colors flex justify-between items-center group"
              >
                <span className="font-bold">{ex.name}</span>
                <span className="text-xs bg-background px-2 py-1 rounded text-textMuted uppercase">{ex.muscleGroup}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Draggable Exercise List */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-textMuted uppercase mb-4 tracking-widest border-b border-borderDark pb-2">Workout Plan</h2>
        
        {selectedExercises.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-borderDark rounded-sm text-textMuted">
            Search and add exercises above to start building.
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={selectedExercises.map(ex => ex.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {selectedExercises.map((ex) => (
                  <DraggableExerciseItem 
                    key={ex.id} 
                    exercise={ex} 
                    onRemove={() => handleRemoveExercise(ex.id)}
                    onAddSet={() => handleAddSet(ex.id)}
                    onRemoveSet={(setId) => handleRemoveSet(ex.id, setId)}
                    onUpdateSet={(setId, field, value) => handleUpdateSet(ex.id, setId, field, value)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <button onClick={handleSave} className="btn-primary w-full flex justify-center items-center gap-2 py-4 text-lg shadow-lg">
        <Save size={20} /> {isEditing ? 'UPDATE ROUTINE' : 'SAVE ROUTINE'}
      </button>
    </div>
  );
};

export default RoutineBuilder;
