import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Glutes', 'Core', 'Full Body', 'Cardio'];
const categories = ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Cardio'];

const AddExerciseModal = ({ isOpen, onClose, onSave, isAdmin }) => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      defaultUnit: 'kg',
      isGlobal: false
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    await onSave(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="card w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-textMuted hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-3xl text-primary mb-6">ADD EXERCISE</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-textMuted mb-1 font-bold uppercase">Exercise Name</label>
            <input 
              {...register('name', { required: true })} 
              className="w-full bg-background border border-borderDark rounded-sm p-3 text-textLight focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. Incline Bench Press"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-textMuted mb-1 font-bold uppercase">Muscle Group</label>
              <select 
                {...register('muscleGroup', { required: true })}
                className="w-full bg-background border border-borderDark rounded-sm p-3 text-textLight focus:outline-none focus:border-primary transition-colors"
              >
                {muscleGroups.map(mg => <option key={mg} value={mg}>{mg}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-textMuted mb-1 font-bold uppercase">Category</label>
              <select 
                {...register('category', { required: true })}
                className="w-full bg-background border border-borderDark rounded-sm p-3 text-textLight focus:outline-none focus:border-primary transition-colors"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-textMuted mb-1 font-bold uppercase">Default Unit</label>
            <div className="flex gap-4">
              <label className="flex items-center text-sm cursor-pointer">
                <input type="radio" value="kg" {...register('defaultUnit')} className="mr-2 accent-primary" /> kg
              </label>
              <label className="flex items-center text-sm cursor-pointer">
                <input type="radio" value="lbs" {...register('defaultUnit')} className="mr-2 accent-primary" /> lbs
              </label>
            </div>
          </div>

          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-borderDark">
              <label className="flex items-center text-sm text-secondary cursor-pointer font-bold uppercase">
                <input type="checkbox" {...register('isGlobal')} className="mr-2 accent-secondary" /> 
                Create as Global Exercise (Visible to all users)
              </label>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">CANCEL</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'SAVING...' : 'SAVE EXERCISE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExerciseModal;
