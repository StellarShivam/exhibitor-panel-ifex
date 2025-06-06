'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context value
interface LoaderContextType {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

// Create the context with a default value of `null`
const LoaderContext = createContext<LoaderContextType | null>(null);

// Define the props for the LoaderProvider
interface LoaderProviderProps {
  children: ReactNode;
}

export function LoaderProvider({ children }: LoaderProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>{children}</LoaderContext.Provider>
  );
}

// Custom hook to use the LoaderContext
export const useLoader = (): LoaderContextType => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};
