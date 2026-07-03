"use client";

import React, { createContext, useContext, useState } from 'react';

type ModeContextType = {
  isJuniorMode: boolean;
  setIsJuniorMode: (val: boolean) => void;
};

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [isJuniorMode, setIsJuniorMode] = useState(false);

  return (
    <ModeContext.Provider value={{ isJuniorMode, setIsJuniorMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
