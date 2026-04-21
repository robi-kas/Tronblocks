import React from 'react';
import { useAccount } from 'wagmi';
import { Navigate, useLocation } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { WalletButton } from './WalletConnect';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#0038FF]">
        <div className="bg-white border-4 border-black p-10 rounded-[3rem] shadow-[20px_20px_0_0_#000] max-w-md text-center">
          <div className="w-20 h-20 bg-[#CCFF00] rounded-3xl border-4 border-black flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0_0_#000]">
            <Wallet className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-3xl font-display font-black text-black uppercase tracking-tighter mb-4">
            Wallet Required
          </h2>
          <p className="text-black/60 font-bold uppercase tracking-tight text-sm mb-10">
            You must connect your wallet to view this section and interact with the Matrix protocol.
          </p>
          <WalletButton expanded />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
