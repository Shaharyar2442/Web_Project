import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import RoutineCard from '../../components/routines/RoutineCard';

const RoutineList = () => {
  const [routines, setRoutines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const { data } = await api.get('/routines');
      setRoutines(data);
    } catch (error) {
      toast.error('Failed to load routines');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this routine?')) return;
    try {
      await api.delete(`/routines/${id}`);
      setRoutines(routines.filter(r => r._id !== id));
      toast.success('Routine deleted');
    } catch (error) {
      toast.error('Failed to delete routine');
    }
  };

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><div className="w-16 h-16 border-4 border-borderDark border-t-primary rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-5xl text-primary drop-shadow-md">MY ROUTINES</h1>
        <Link to="/routines/create" className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center">
          <Plus size={20} /> BUILD ROUTINE
        </Link>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {routines.length > 0 ? (
          routines.map(routine => (
            <motion.div key={routine._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <RoutineCard routine={routine} onDelete={handleDelete} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-textMuted border border-dashed border-borderDark rounded-sm">
            <p className="text-xl">NO ROUTINES YET</p>
            <p className="text-sm mt-2">Time to build your iron path.</p>
            <Link to="/routines/create" className="btn-secondary mt-4 inline-block">BUILD NOW</Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RoutineList;
