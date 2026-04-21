import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface ModeState {
  mode: 'PRODUCTION' | 'TEST' | 'DEMO';
  setMode: (mode: 'PRODUCTION' | 'TEST' | 'DEMO') => void;
  showDebug: boolean;
  setShowDebug: (show: boolean) => void;
}

const ModeContext = createContext<ModeState>({
  mode: 'PRODUCTION',
  setMode: () => {},
  showDebug: false,
  setShowDebug: () => {}
});

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'PRODUCTION' | 'TEST' | 'DEMO'>('PRODUCTION');
  const [showDebug, setShowDebug] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      fetch(`/api/users/${address}`)
        .then(res => res.json())
        .then(data => {
          if (data.account_mode) {
             setMode(data.account_mode);
          }
        })
        .catch(console.error);
    }
  }, [address]);

  return (
    <ModeContext.Provider value={{ mode, setMode, showDebug, setShowDebug }}>
      {children}
      {mode === 'TEST' && (
         <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center text-xs font-black uppercase tracking-widest py-1 z-[9999]">
           TEST MODE ACTIVE - Simulated Transactions
         </div>
      )}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);
