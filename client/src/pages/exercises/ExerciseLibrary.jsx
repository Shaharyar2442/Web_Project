import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Search, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ExerciseCard from '../../components/exercises/ExerciseCard';
import AddExerciseModal from '../../components/exercises/AddExerciseModal';
import { useAuth } from '../../context/AuthContext';

const muscleGroups = ['All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Glutes', 'Core', 'Full Body', 'Cardio'];
const categories = ['All', 'Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Cardio'];

const ExerciseLibrary = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    // Debounce search client-side
    // [BAD CHANGE] Omitted the cleanup function for setTimeout.
    // If the user types quickly, multiple timeouts will fire out of order,
    // leading to a race condition (incorrect filtering results) and memory leaks.
    const handler = setTimeout(() => {
      let filtered = exercises;
      
      if (searchTerm) {
        filtered = filtered.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      if (muscleFilter !== 'All') {
        filtered = filtered.filter(ex => ex.muscleGroup === muscleFilter);
      }
      if (categoryFilter !== 'All') {
        filtered = filtered.filter(ex => ex.category === categoryFilter);
      }
      
      setFilteredExercises(filtered);
    }, 300);
  }, [searchTerm, muscleFilter, categoryFilter, exercises]);

  const fetchExercises = async () => {
    try {
      const { data } = await api.get('/exercises');
      setExercises(data);
      setFilteredExercises(data);
    } catch (error) {
      toast.error('Failed to load exercises');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) return;
    try {
      await api.delete(`/exercises/${id}`);
      setExercises(exercises.filter(ex => ex._id !== id));
      toast.success('Exercise deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  const handleSaveExercise = async (data) => {
    try {
      const endpoint = data.isGlobal ? '/exercises/global' : '/exercises';
      const { data: newExercise } = await api.post(endpoint, data);
      
      setExercises([...exercises, newExercise].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success('Exercise added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save exercise');
    }
  };

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><div className="w-16 h-16 border-4 border-borderDark border-t-primary rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-5xl text-primary drop-shadow-md">EXERCISE LIBRARY</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center">
          <Plus size={20} /> ADD EXERCISE
        </button>
      </div>

      <div className="bg-surface p-4 border border-borderDark rounded-sm mb-8 flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="flex-grow relative">
          <Search size={20} className="absolute left-3 top-3 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search exercises..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-borderDark rounded-sm py-3 pl-10 pr-3 text-textLight focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        
        <div className="w-full md:w-48">
          <select 
            value={muscleFilter}
            onChange={(e) => setMuscleFilter(e.target.value)}
            className="w-full bg-background border border-borderDark rounded-sm py-3 px-3 text-textLight focus:outline-none focus:border-primary transition-colors"
          >
            {muscleGroups.map(mg => <option key={mg} value={mg}>{mg}</option>)}
          </select>
        </div>

        <div className="w-full md:w-48">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-background border border-borderDark rounded-sm py-3 px-3 text-textLight focus:outline-none focus:border-primary transition-colors"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.length > 0 ? (
          filteredExercises.map(exercise => (
            <ExerciseCard key={exercise._id} exercise={exercise} onDelete={handleDelete} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-textMuted border border-dashed border-borderDark rounded-sm">
            <p className="text-xl">NO EXERCISES FOUND</p>
            <p className="text-sm mt-2">Try adjusting your filters or add a new custom exercise.</p>
          </div>
        )}
      </div>

      <AddExerciseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveExercise}
        isAdmin={user?.role === 'admin'}
      />
    </div>
  );
};

export default ExerciseLibrary;
