
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useFormValidation } from '@/hooks/useFormValidation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { 
  Mail, 
  AlertCircle,
  ArrowLeft,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingState } from '@/components/LoadingState';

const ForgotPassword = () => {
  const { forgotPassword, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { values, errors, touched, handleChange, handleBlur, validateForm } = useFormValidation({
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateForm({
      email: { required: true, isEmail: true },
    });
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await forgotPassword(values.email);
      
      if (success) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error('Forgot password submission error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || authLoading;

  if (isLoading) {
    return (
      <AuthLayout
        title="Requesting password reset"
        subtitle="Please wait while we process your request"
      >
        <LoadingState 
          message="Sending reset instructions" 
          progress={60} 
          statusMessage="Checking your email address" 
          className="py-8"
        />
      </AuthLayout>
    );
  }

  if (emailSent) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent you instructions to reset your password"
      >
        <div className="text-center space-y-6 py-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Send className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              We've sent an email to <span className="font-medium text-gray-900 dark:text-white">{values.email}</span> with instructions to reset your password.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              If you don't see it in your inbox, please check your spam folder.
            </p>
          </div>
          
          <div className="pt-4">
            <Link to="/login" className="text-[#1B68B3] hover:text-blue-600 font-medium inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Forgot Password" 
      subtitle="Enter your email to reset your password"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                className="pl-10 py-5 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1B68B3] focus:border-transparent"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </div>
            {touched.email && errors.email && (
              <div className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <p>{errors.email}</p>
              </div>
            )}
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full py-5 bg-[#1B68B3] hover:bg-[#1A5DA0] transition-all duration-200 font-medium rounded-lg"
          disabled={isLoading}
        >
          <span className="flex items-center justify-center">
            <Send className="mr-2 h-5 w-5" />
            Send Reset Instructions
          </span>
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
            <Link to="/login" className="text-[#1B68B3] hover:text-blue-600 font-medium inline-flex items-center">
              Sign in <ArrowLeft className="ml-1 h-3 w-3 rotate-180" />
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
