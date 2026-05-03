import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const AddExerciseToSessionModal = ({ isOpen, onClose, onAdd }) => {
  const [exercises, setExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchExercises();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery) {
      setFiltered(exercises.filter(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      setFiltered(exercises);
    }
  }, [searchQuery, exercises]);

  const fetchExercises = async () => {
    try {
      const { data } = await api.get('/exercises');
      setExercises(data);
      setFiltered(data);
    } catch (error) {
      toast.error('Failed to load exercises');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="card w-full max-w-lg p-6 relative flex flex-col max-h-[80vh] border border-borderDark shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-textMuted hover:text-white transition-colors">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl text-primary font-bold uppercase tracking-widest mb-4">Add Exercise</h2>
        
        <div className="relative mb-4 shrink-0">
          <Search size={20} className="absolute left-3 top-3 text-textMuted" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises..." 
            className="w-full bg-surface border border-borderDark rounded-sm py-3 pl-10 pr-3 text-textLight focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="overflow-y-auto flex-grow rounded-sm border border-borderDark divide-y divide-borderDark bg-surface">
          {filtered.map(ex => (
            <button
              key={ex._id}
              onClick={() => onAdd(ex)}
              className="w-full text-left px-4 py-4 hover:bg-background transition-colors flex justify-between items-center group"
            >
              <span className="font-bold text-textLight group-hover:text-primary transition-colors">{ex.name}</span>
              <span className="text-[10px] font-bold tracking-widest bg-background px-2 py-1 rounded-sm text-textMuted uppercase group-hover:text-textLight">
                {ex.muscleGroup}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-textMuted">No exercises found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddExerciseToSessionModal;
