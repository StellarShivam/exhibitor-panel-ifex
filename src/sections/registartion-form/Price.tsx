'use client';

import React, { createContext, useContext, useState } from 'react';

// Create the context
const PriceContext = createContext<{
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
} | null>(null);

// Create a provider component
export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [amount, setAmount] = useState<number>(1); // Default registration amount is 1

  return <PriceContext.Provider value={{ amount, setAmount }}>{children}</PriceContext.Provider>;
};

// Custom hook to use the PriceContext
export const usePrice = () => {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePrice must be used within a PriceProvider');
  }
  return context;
};
