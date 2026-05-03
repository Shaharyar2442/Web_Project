import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password, data.rememberMe);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="card w-full max-w-md p-8">
        <h2 className="text-4xl text-primary mb-6 text-center">LOGIN</h2>
        
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

          <div>
            <label className="block text-sm text-textMuted mb-1 font-bold uppercase">Password</label>
            <input 
              {...register('password')} 
              type="password" 
              className="w-full bg-background border border-borderDark rounded-sm p-3 text-textLight focus:outline-none focus:border-primary transition-colors"
            />
            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center text-sm text-textMuted cursor-pointer">
              <input 
                {...register('rememberMe')} 
                type="checkbox" 
                className="mr-2 accent-primary" 
              />
              Remember Me
            </label>
            <Link to="/forgot-password" className="text-sm text-secondary hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary w-full mt-6 flex justify-center items-center"
          >
            {isSubmitting ? <span className="animate-pulse">Loading...</span> : 'LIFT OFF'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-textMuted">
          Don't have an account? <Link to="/signup" className="text-secondary hover:underline font-bold">SIGN UP</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
