import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from 'shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import apiClient from '@/services/apiClient';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: any) => {
    setError('');
    try {
      await apiClient.post('/auth/register', data);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-slate-50">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold font-serif">Join MediCare</CardTitle>
          <CardDescription>Start your healthcare journey with the most trusted hospital network</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && <div className="p-4 bg-red-50 text-red-500 rounded-lg text-sm">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" {...register('name')} />{errors.name && <p className="text-xs text-red-500">{errors.name.message as string}</p>}</div>
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register('email')} />{errors.email && <p className="text-xs text-red-500">{errors.email.message as string}</p>}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="phone">Phone (Optional)</Label><Input id="phone" {...register('phone')} />{errors.phone && <p className="text-xs text-red-500">{errors.phone.message as string}</p>}</div>
              <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" {...register('password')} />{errors.password && <p className="text-xs text-red-500">{errors.password.message as string}</p>}</div>
            </div>
            <div className="flex items-center space-x-2 p-4 bg-slate-50 rounded-lg border border-slate-100"><ShieldCheck className="h-5 w-5 text-primary" /><p className="text-xs text-slate-500">By signing up, you agree to our Terms of Service and Privacy Policy. Your data is encrypted and secure.</p></div>
            <Button type="submit" className="w-full h-11" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create Account'}</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <p className="text-sm text-slate-600">Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
};
export default RegisterPage;
