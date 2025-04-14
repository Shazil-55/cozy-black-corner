
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useFormValidation } from '@/hooks/useFormValidation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch'; 
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AvatarUpload } from '@/components/auth/AvatarUpload';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { 
  UserPlus, 
  User,
  AtSign, 
  Lock, 
  Eye, 
  EyeOff, 
  Building,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingState } from '@/components/LoadingState';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading: authLoading, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  
  const { values, errors, touched, handleChange, handleBlur, validateForm, setValues } = useFormValidation({
    name: '',
    username: '',
    email: '',
    password: '',
    domainPrefix: '', 
    agreeTerms: false
  });

  // Form validation state
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/onboarding/step1');
    }
  }, [isAuthenticated, navigate]);

  // Check form validity whenever values change
  useEffect(() => {
    const requiredFields = {
      name: values.name.trim(),
      username: values.username.trim(),
      email: values.email.trim(),
      password: values.password.trim()
    };
    
    const allFieldsFilled = Object.values(requiredFields).every(value => value !== '');
    const termsAccepted = values.agreeTerms === true;
    
    setIsFormValid(allFieldsFilled && termsAccepted);
  }, [values]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateForm({
      name: { required: true, minLength: 2 },
      username: { required: true, minLength: 3 },
      email: { required: true, isEmail: true },
      password: { required: true, minLength: 6 },
      agreeTerms: { required: true }
    });
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      // Create a custom domain by combining domainPrefix with base domain
      // Trim spaces and normalize domain prefix - convert to lowercase
      const domainPrefix = values.domainPrefix.trim().toLowerCase();
      // Use a default domain if domainPrefix is empty
      const domain = domainPrefix ? `${domainPrefix}.ilmee.com` : 'ilmee.com';
      
      // Create registration data object
      const registrationData: {
        name: string;
        email: string;
        password: string;
        username: string;
        domain: string;
        profileImage?: string;
      } = {
        name: values.name, 
        email: values.email, 
        password: values.password, 
        username: values.username,
        domain: domain,
      };
      
      // Only add profileImage if it exists
      if (avatar) {
        registrationData.profileImage = avatar;
      }
      
      const success = await register(
        registrationData.name,
        registrationData.email,
        registrationData.password,
        registrationData.username,
        registrationData.domain,
        registrationData.profileImage
      );
      
      if (success) {
        toast.success('Account created successfully!');
        navigate('/onboarding/step1');
      }
    } catch (error) {
      console.error('Registration submission error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleAvatarChange = (imageUrl: string | null) => {
    setAvatar(imageUrl);
  };

  const handleSwitchChange = (checked: boolean) => {
    setValues({
      ...values,
      agreeTerms: checked
    });
  };

  // Custom handler for domain prefix to prevent spaces and convert to lowercase
  const handleDomainPrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\s+/g, '').toLowerCase();
    
    setValues({
      ...values,
      [name]: sanitizedValue
    });
  };

  const isLoading = isSubmitting || authLoading;

  if (isLoading) {
    return (
      <AuthLayout
        title="Creating your account"
        subtitle="Please wait while we set up your profile"
      >
        <LoadingState 
          message="Setting up your account" 
          progress={80} 
          statusMessage="Creating your profile" 
          className="py-8"
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Join Ilmee to start your learning journey"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AvatarUpload name={values.name} onChange={handleAvatarChange} />
        
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Full name"
                className="pl-10 py-5 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1B68B3] focus:border-transparent"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </div>
            {touched.name && errors.name && (
              <div className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <p>{errors.name}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                className="pl-10 py-5 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1B68B3] focus:border-transparent"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </div>
            {touched.username && errors.username && (
              <div className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <p>{errors.username}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <AtSign className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
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
          
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
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
              <Building className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <div className="flex">
                <Input
                  id="domainPrefix"
                  name="domainPrefix"
                  type="text"
                  placeholder="yourcompany"
                  className="pl-10 py-5 rounded-l-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1B68B3] focus:border-transparent"
                  value={values.domainPrefix}
                  onChange={handleDomainPrefixChange}
                  onBlur={handleBlur}
                />
                <div className="inline-flex items-center px-4 border border-l-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-r-lg">
                  .ilmee.com
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 pt-2">
            <Switch
              id="terms"
              checked={values.agreeTerms === true}
              onCheckedChange={handleSwitchChange}
              className="data-[state=checked]:bg-[#1B68B3]"
            />
            <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
              I agree to the <a href="#" className="text-[#1B68B3] hover:underline hover:text-blue-700">Terms of Service</a> and <a href="#" className="text-[#1B68B3] hover:underline hover:text-blue-700">Privacy Policy</a>
            </label>
          </div>
          {touched.agreeTerms && errors.agreeTerms && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              <p>You must agree to the terms to continue</p>
            </div>
          )}
        </div>
        
        <Button
          type="submit"
          className="w-full py-5 bg-[#1B68B3] hover:bg-[#1A5DA0] transition-all duration-200 font-medium rounded-lg"
          disabled={isLoading || !isFormValid}
        >
          <span className="flex items-center justify-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Create free account
          </span>
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1B68B3] hover:text-blue-600 font-medium inline-flex items-center">
              Sign in <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
