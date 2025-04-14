
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useFormValidation } from '@/hooks/useFormValidation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Building,
  AlertCircle,
  Loader2,
  ExternalLink,
  AtSign,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingState } from '@/components/LoadingState';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading: authLoading, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { values, errors, touched, handleChange, handleBlur, validateForm, setValues } = useFormValidation({
    emailOrUsername: '',
    password: '',
    domain: 'ilmee.com',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Try to get saved email from localStorage
    const savedEmail = localStorage.getItem('lastLoginEmail');
    
    if (savedEmail) {
      setValues(prev => ({ ...prev, emailOrUsername: savedEmail }));
    }
  }, [setValues]);
  
  // Determine if domain field should be shown
  const shouldShowDomain = values.emailOrUsername && !values.emailOrUsername.includes('@');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateForm({
      emailOrUsername: { required: true },
      password: { required: true },
    });
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      // Save email for next login if remember me is checked
      if (rememberMe) {
        localStorage.setItem('lastLoginEmail', values.emailOrUsername);
      }
      
      // Always pass domain for non-email logins
      const loginDomain = !values.emailOrUsername.includes('@') ? values.domain : undefined;
      
      const success = await login(
        values.emailOrUsername, 
        values.password,
        loginDomain
      );
      
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Login submission error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Custom handler for domain to prevent spaces and convert to lowercase
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\s+/g, '').toLowerCase();
    
    setValues({
      ...values,
      [name]: sanitizedValue
    });
  };

  const isLoading = isSubmitting || authLoading;

  const getInputIcon = () => {
    if (values.emailOrUsername && values.emailOrUsername.includes('@')) {
      return <AtSign className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />;
    }
    return <User className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />;
  };

  if (isLoading) {
    return (
      <AuthLayout
        title="Signing you in"
        subtitle="Please wait while we verify your credentials"
      >
        <LoadingState 
          message="Authenticating..." 
          progress={70} 
          statusMessage="Verifying your credentials" 
          className="py-8"
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to continue to your learning dashboard"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="relative">
              {getInputIcon()}
              <Input
                id="emailOrUsername"
                name="emailOrUsername"
                type="text"
                placeholder="Email or username"
                className="pl-10 py-5 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1B68B3] focus:border-transparent"
                value={values.emailOrUsername}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </div>
            {touched.emailOrUsername && errors.emailOrUsername && (
              <div className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <p>{errors.emailOrUsername}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="pl-10 pr-10 py-5 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1B68B3] focus:border-transparent"
                value={values.password}
                onChange={handleChange}
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
            {touched.password && errors.password && (
              <div className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <p>{errors.password}</p>
              </div>
            )}
          </div>
          
          {shouldShowDomain && (
            <div className="space-y-2">
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <Input
                  id="domain"
                  name="domain"
                  type="text"
                  className="pl-10 py-5 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1B68B3] focus:border-transparent"
                  value={values.domain}
                  onChange={handleDomainChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="h-4 w-4 rounded border-gray-300 text-[#1B68B3] focus:ring-[#1B68B3]"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-[#1B68B3] hover:text-blue-600">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full py-5 bg-[#1B68B3] hover:bg-[#1A5DA0] transition-all duration-200 font-medium rounded-lg"
          disabled={isLoading}
        >
          <span className="flex items-center justify-center">
            <LogIn className="mr-2 h-5 w-5" />
            Sign in
          </span>
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#1B68B3] hover:text-blue-600 font-medium inline-flex items-center">
              Create account <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
