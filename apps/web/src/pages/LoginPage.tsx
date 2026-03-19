import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from 'shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import apiClient from '@/services/apiClient';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const loginApp = useAuthStore(state => state.login);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: any) => {
    setError('');
    try {
      const response = await apiClient.post('/auth/login', data);
      loginApp(response.data.data);
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold font-serif">Welcome Back</CardTitle>
          <p className="text-sm text-slate-500">Sign in to manage your appointments</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && <div className="p-4 bg-red-50 text-red-500 rounded-lg text-sm flex items-center"><AlertCircle className="mr-2 h-4 w-4" /> {error}</div>}
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register('email')} />{errors.email && <p className="text-xs text-red-500">{errors.email.message as string}</p>}</div>
            <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" {...register('password')} />{errors.password && <p className="text-xs text-red-500">{errors.password.message as string}</p>}</div>
            <Button type="submit" className="w-full h-11" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign In'}</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <p className="text-sm text-slate-600">Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Sign up for free</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
};
export default LoginPage;
