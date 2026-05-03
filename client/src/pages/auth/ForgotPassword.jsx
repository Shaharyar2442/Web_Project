import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const ForgotPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setIsSuccess(true);
      toast.success('Reset link sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process request');
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="card w-full max-w-md p-8 text-center">
          <h2 className="text-3xl text-primary mb-4">CHECK YOUR EMAIL</h2>
          <p className="text-textMuted mb-6">
            If an account exists with that email, we've sent instructions to reset your password.
          </p>
          <Link to="/login" className="btn-secondary inline-block">BACK TO LOGIN</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="card w-full max-w-md p-8">
        <h2 className="text-3xl text-primary mb-2 text-center">FORGOT PASSWORD</h2>
        <p className="text-textMuted text-sm text-center mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-textMuted mb-1 font-bold uppercase">Email</label>
            <input 
              {...register('email')} 
              type="email" 
              className="w-full bg-background border border-borderDark rounded-sm p-3 text-textLight focus:outline-none focus:border-primary transition-colors"
            />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary w-full mt-6 flex justify-center items-center"
          >
            {isSubmitting ? <span className="animate-pulse">Loading...</span> : 'SEND RESET LINK'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-textMuted">
          Remember your password? <Link to="/login" className="text-secondary hover:underline font-bold">LOG IN</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
