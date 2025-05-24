
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [goals, setGoals] = useState<string[]>([]);
  const [mainGoal, setMainGoal] = useState<string | null>(null);
  const [userRange, setUserRange] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // Use useAuth directly
  const auth = useAuth();
  
  // Check if onboarding is complete based on user.mainGoal
  useEffect(() => {
    // If user is authenticated, check if they have mainGoal
    if (auth.user) {
      const hasCompletedOnboarding = auth.user.mainGoal && 
                                    Array.isArray(auth.user.mainGoal) && 
                                    auth.user.mainGoal.length > 0;
      
      setIsOnboardingComplete(hasCompletedOnboarding);
      
      // If onboarding is not complete, and we're checking this after authentication
      if (auth.isAuthenticated && !hasCompletedOnboarding) {
        // Check if we're not already on an onboarding page
        if (!window.location.pathname.includes('/onboarding')) {
          navigate('/onboarding/step1');
        }
      }
      
      // Load saved onboarding data from user object if available
      if (auth.user.mainGoal && Array.isArray(auth.user.mainGoal) && auth.user.mainGoal.length > 0) {
        setMainGoal(auth.user.mainGoal[0]);
      }
      
      if (auth.user.portalUsers) {
        setUserRange(auth.user.portalUsers);
      }
      
      if (auth.user.industry) {
        setIndustry(auth.user.industry);
      }
    } else {
      // If no user, also load from localStorage as fallback (for the form state persistence)
      const savedGoals = localStorage.getItem('onboardingGoals');
      const savedMainGoal = localStorage.getItem('onboardingMainGoal');
      const savedUserRange = localStorage.getItem('onboardingUserRange');
      const savedIndustry = localStorage.getItem('onboardingIndustry');
      
      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedMainGoal) setMainGoal(savedMainGoal);
      if (savedUserRange) setUserRange(savedUserRange);
      if (savedIndustry) setIndustry(savedIndustry);
    }
  }, [auth.user, auth.isAuthenticated, navigate]);

  // Safe reference to refreshUserData
  const refreshUserData = auth.refreshUserData;

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
      
      // Set onboarding complete 
      setIsOnboardingComplete(true);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      toast.error('Failed to save your preferences. Please try again.');
    }
  };

  const getOnboardingData = () => {
    // Make sure mainGoal is always an array
    const mainGoalValue = mainGoal || localStorage.getItem('onboardingMainGoal');
    return {
      mainGoal: mainGoalValue ? [mainGoalValue] : [],
      portalUsers: userRange || localStorage.getItem('onboardingUserRange') || '',
      industry: industry || localStorage.getItem('onboardingIndustry') || ''
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
