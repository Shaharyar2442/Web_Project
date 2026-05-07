import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name max 50 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'admin']).default('user')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const Signup = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur'
  });

  const onSubmit = async (data) => {
    const result = await registerAuth(data.name, data.email, data.password, data.role);
    if (result.success) {
      toast.success('Account created! Welcome to BreakingIron.');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="card w-full max-w-md p-8">
        <h2 className="text-4xl text-primary mb-6 text-center">REGISTER</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-textMuted mb-1 font-bold uppercase">Full Name</label>
            <input 
              {...register('name')} 
              type="text" 
              className="w-full bg-background border border-borderDark rounded-sm p-3 text-textLight focus:outline-none focus:border-primary transition-colors"
            />
            {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-textMuted mb-1 font-bold uppercase">Email</label>
            <input 
              {...register('email')} 
              type="email" 
              className="w-full bg-background border border-borderDark rounded-sm p-3 text-textLight focus:outline-none focus:border-primary transition-colors"
            />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-textMuted mb-1 font-bold uppercase">Password</label>
            <input 
              {...register('password')} 
              type="password" 
              className="w-full bg-background border border-borderDark rounded-sm p-3 text-textLight focus:outline-none focus:border-primary transition-colors"
            />
            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-textMuted mb-1 font-bold uppercase">Confirm Password</label>
            <input 
              {...register('confirmPassword')} 
              type="password" 
              className="w-full bg-background border border-borderDark rounded-sm p-3 text-textLight focus:outline-none focus:border-primary transition-colors"
            />
            {errors.confirmPassword && <p className="text-error text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-textMuted mb-1 font-bold uppercase">Account Type</label>
            <select
              {...register('role')}
              className="w-full bg-background border border-borderDark rounded-sm p-3 text-textLight focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="user">Standard User</option>
              <option value="admin">Platform Admin (Demo)</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary w-full mt-6 flex justify-center items-center"
          >
            {isSubmitting ? <span className="animate-pulse">Loading...</span> : 'JOIN THE IRON'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-textMuted">
          Already have an account? <Link to="/login" className="text-secondary hover:underline font-bold">LOG IN</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
