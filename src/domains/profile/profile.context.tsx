'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ProfileFormData } from './profile.types';

interface ProfileContextType {
  profile: ProfileFormData;
  updateProfile: (updates: Partial<ProfileFormData>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileFormData>({
    name: '',
    photo: null,
    breed: '',
    age: null,
    weight: null,
    dislikedIngredients: [],
    healthConcerns: [],
    texturePreference: null,
  });

  const updateProfile = (updates: Partial<ProfileFormData>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextType {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}
