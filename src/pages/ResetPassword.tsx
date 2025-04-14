
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useFormValidation } from '@/hooks/useFormValidation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  KeyRound
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingState } from '@/components/LoadingState';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  // Get token from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token') || '';
  
  const { values, errors, touched, handleChange, handleBlur, validateForm, setErrors } = useFormValidation({
    password: '',
    confirmPassword: '',
  });

  // Custom validation function to check if passwords match
  const validatePasswordMatch = () => {
    const newErrors = { ...errors };
    
    if (values.confirmPassword && values.password !== values.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    } else {
      delete newErrors.confirmPassword;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields using the standard validation
    const isValid = validateForm({
      password: { required: true, minLength: 6 },
      confirmPassword: { required: true },
    });
    
    // Additionally check if passwords match
    const passwordsMatch = validatePasswordMatch();
    
    if (!isValid || !passwordsMatch) return;
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await resetPassword(token, values.password);
      
      if (success) {
        setResetSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Reset password submission error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isLoading = isSubmitting || authLoading;

  if (isLoading) {
    return (
      <AuthLayout
        title="Resetting your password"
        subtitle="Please wait while we update your account"
      >
        <LoadingState 
          message="Updating your password" 
          progress={75} 
          statusMessage="Applying security changes" 
          className="py-8"
        />
      </AuthLayout>
    );
  }

  if (resetSuccess) {
    return (
      <AuthLayout
        title="Password Reset Complete"
        subtitle="Your password has been updated successfully"
      >
        <div className="text-center space-y-6 py-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              Your password has been reset successfully. You will be redirected to the login page.
            </p>
          </div>
          
          <div className="pt-4">
            <Link to="/login" className="text-[#1B68B3] hover:text-blue-600 font-medium inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset Your Password" 
      subtitle="Create a new password for your account"
    >
      {!token ? (
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Invalid Reset Link</h3>
            <p className="text-gray-600 dark:text-gray-400">
              This password reset link is invalid or has expired.
            </p>
          </div>
          
          <div className="pt-4">
            <Link to="/forgot-password" className="text-[#1B68B3] hover:text-blue-600 font-medium inline-flex items-center">
              Request a new reset link
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  className="pl-10 pr-10 py-5 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1B68B3] focus:border-transparent"
                  value={values.password}
                  onChange={(e) => {
                    handleChange(e);
                    if (values.confirmPassword) {
                      validatePasswordMatch();
                    }
                  }}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              <PasswordStrength password={values.password} />
              
              {touched.password && errors.password && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <p>{errors.password}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="pl-10 pr-10 py-5 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1B68B3] focus:border-transparent"
                  value={values.confirmPassword}
                  onChange={(e) => {
                    handleChange(e);
                    validatePasswordMatch();
                  }}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  onClick={toggleShowConfirmPassword}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <p>{errors.confirmPassword}</p>
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
              <KeyRound className="mr-2 h-5 w-5" />
              Reset Password
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
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
