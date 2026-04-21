
import React from 'react';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { mainnet, bsc } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// WalletConnect Project ID (Generic placeholder)
const projectId = '76249e0c50f4a4f89d53f5a9e38d3505';

export const config = createConfig({
  chains: [mainnet, bsc],
  connectors: [
    injected(),
    coinbaseWallet({ 
      appName: 'TronBlock Matrix',
      preference: 'all' // Allows both extension and mobile app
    }),
    walletConnect({ 
      projectId,
      showQrModal: true,
      qrModalOptions: {
        themeMode: 'dark',
        themeVariables: {
          '--wcm-accent-color': '#CCFF00',
          '--wcm-background-color': '#0038FF',
        }
      }
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
  },
});

const queryClient = new QueryClient();

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};
