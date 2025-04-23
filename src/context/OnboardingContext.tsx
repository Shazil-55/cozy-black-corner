
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { userService } from '../services/userService';
import { toast } from 'sonner';

interface OnboardingContextType {
  isOnboardingComplete: boolean;
  completeOnboarding: () => void;
  goals: string[];
  mainGoal: string | null;
  userRange: string | null;
  industry: string | null;
  setGoals: (goals: string[]) => void;
  setMainGoal: (goal: string) => void;
  setUserRange: (range: string) => void;
  setIndustry: (industry: string) => void;
  getOnboardingData: () => {
    mainGoal: string[];
    portalUsers: string;
    industry: string;
  };
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // We're moving the useAuth hook to a safer place to avoid context nesting issues
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);
  const [goals, setGoals] = useState<string[]>([]);
  const [mainGoal, setMainGoal] = useState<string | null>(null);
  const [userRange, setUserRange] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  
  // Use a try-catch for router hooks since we might be outside a router context
  let navigate = undefined;
  let location = undefined;
  
  try {
    // This will throw an error if outside router context
    navigate = useNavigate();
    location = useLocation();
  } catch (error) {
    // We're outside of a router context, navigate will remain undefined
    console.log("Router not available yet, navigation features disabled");
  }
  
  // Use useAuth directly instead of accessing the context
  const auth = useAuth();
  
  // Check if onboarding is complete on mount
  useEffect(() => {
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (onboardingComplete === 'true') {
      setIsOnboardingComplete(true);
    } else {
      // Load saved onboarding data if available
      const savedGoals = localStorage.getItem('onboardingGoals');
      const savedMainGoal = localStorage.getItem('onboardingMainGoal');
      const savedUserRange = localStorage.getItem('onboardingUserRange');
      const savedIndustry = localStorage.getItem('onboardingIndustry');
      
      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedMainGoal) setMainGoal(savedMainGoal);
      if (savedUserRange) setUserRange(savedUserRange);
      if (savedIndustry) setIndustry(savedIndustry);
    }
  }, []);

  // Safe reference to refreshUserData
  const refreshUserData = auth?.refreshUserData;

  // Redirect newly registered users to onboarding
  useEffect(() => {
    // Only attempt navigation if we have navigate function and auth is initialized
    if (navigate && auth?.isAuthenticated && !isOnboardingComplete) {
      // Check if we're not already on an onboarding page
      if (location && !location.pathname.includes('/onboarding')) {
        navigate('/onboarding/step1');
      }
    }
  }, [auth?.isAuthenticated, isOnboardingComplete, navigate, location]);

  const completeOnboarding = async () => {
    try {
      // Update user profile with onboarding data
      const onboardingData = getOnboardingData();
      console.log("Completing onboarding with data:", onboardingData);
      
      await userService.updateUser({
        mainGoal: onboardingData.mainGoal,
        portalUsers: onboardingData.portalUsers,
        industry: onboardingData.industry
      });
      
      // Refresh user data to get the latest profile information
      if (refreshUserData) {
        await refreshUserData();
      }
      
      localStorage.setItem('onboardingComplete', 'true');
      setIsOnboardingComplete(true);
      toast.success('Profile updated successfully!');
      
      // Only navigate if we have the navigate function
      if (navigate) {
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      toast.error('Failed to save your preferences. Please try again.');
    }
  };

  const getOnboardingData = () => {
    // Make sure mainGoal is always an array
    const mainGoalValue = localStorage.getItem('onboardingMainGoal');
    return {
      mainGoal: mainGoalValue ? [mainGoalValue] : [],
      portalUsers: localStorage.getItem('onboardingUserRange') || '',
      industry: localStorage.getItem('onboardingIndustry') || ''
    };
  };

  return (
    <OnboardingContext.Provider 
      value={{
        isOnboardingComplete,
        completeOnboarding,
        goals,
        mainGoal,
        userRange,
        industry,
        setGoals,
        setMainGoal,
        setUserRange,
        setIndustry,
        getOnboardingData
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
