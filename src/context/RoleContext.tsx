
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'administrator' | 'instructor' | 'learner' | 'parent';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  roleDisplayName: Record<UserRole, string>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    // Try to get the role from localStorage, default to 'administrator'
    const savedRole = localStorage.getItem('userRole');
    return (savedRole as UserRole) || 'administrator';
  });

  // Role display names for better UI presentation
  const roleDisplayName: Record<UserRole, string> = {
    administrator: 'Administrator',
    instructor: 'Instructor',
    learner: 'Learner',
    parent: 'Parent'
  };

  // Save role to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userRole', role);
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole, roleDisplayName }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
