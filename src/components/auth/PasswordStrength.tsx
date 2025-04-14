
import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const [strength, setStrength] = useState(0);
  const [validations, setValidations] = useState({
    length: false,
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false
  });

  useEffect(() => {
    const checkPasswordStrength = () => {
      const result = {
        length: password.length >= 8,
        hasLower: /[a-z]/.test(password),
        hasUpper: /[A-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      };
      
      setValidations(result);
      
      // Calculate strength
      const criteriaCount = Object.values(result).filter(Boolean).length;
      setStrength(criteriaCount);
    };
    
    checkPasswordStrength();
  }, [password]);
  
  // Determine color and width based on strength
  const getColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  const getWidth = () => {
    return `${(strength / 5) * 100}%`;
  };
  
  const getText = () => {
    if (strength <= 1) return 'Very Weak';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Moderate';
    if (strength <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="space-y-2 mt-1 mb-4">
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: getWidth() }}
        />
      </div>
      
      {password && (
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Password strength: <span className={`${strength >= 4 ? 'text-green-500' : strength >= 3 ? 'text-blue-500' : strength >= 2 ? 'text-yellow-500' : 'text-red-500'}`}>{getText()}</span>
          </p>
          
          <div className="mt-2 grid grid-cols-2 gap-2">
            <ValidationItem text="At least 8 characters" isValid={validations.length} />
            <ValidationItem text="Has lowercase letters" isValid={validations.hasLower} />
            <ValidationItem text="Has uppercase letters" isValid={validations.hasUpper} />
            <ValidationItem text="Has numbers" isValid={validations.hasNumber} />
            <ValidationItem text="Has special characters" isValid={validations.hasSpecial} />
          </div>
        </div>
      )}
    </div>
  );
};

const ValidationItem = ({ text, isValid }: { text: string; isValid: boolean }) => (
  <div className="flex items-center gap-1.5">
    {isValid ? (
      <Check size={12} className="text-green-500" />
    ) : (
      <X size={12} className="text-gray-400" />
    )}
    <span className={`text-xs ${isValid ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
      {text}
    </span>
  </div>
);
