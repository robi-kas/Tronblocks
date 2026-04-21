
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { X, Wallet, LogOut, ChevronRight, Check, Copy, Network } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { connect, connectors, isPending } = useConnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter and map connectors to nicer names/logos
  const walletOptions = [
    { name: 'OKX Wallet', id: 'injected', icon: 'https://static.okx.com/cdn/assets/imgs/247/E0B0B0B0B0B0B0B0.png' },
    { name: 'MetaMask', id: 'io.metamask', icon: 'https://cdn.worldvectorlogo.com/logos/metamask.svg' },
    { name: 'TokenPocket', id: 'injected', icon: 'https://tokenpocket.pro/favicon.ico' },
    { name: 'imToken', id: 'injected', icon: 'https://token.im/favicon.ico' },
    { name: 'Trust Wallet', id: 'injected', icon: 'https://trustwallet.com/assets/images/media/assets/trust_primary_logo.png' },
    { name: 'Coinbase Wallet', id: 'coinbaseWalletSDK', icon: 'https://avatars.githubusercontent.com/u/18060234?v=4' },
    { name: 'WalletConnect', id: 'walletConnect', icon: 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg' },
  ];

  const [selectedNetwork, setSelectedNetwork] = useState<'BSC' | 'ETH'>('BSC');

  const networks = [
    { id: 'BSC', name: 'BNB Smart Chain', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=035', color: '#F3BA2F' },
    { id: 'ETH', name: 'Ethereum Mainnet', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=035', color: '#627EEA' },
  ];

  const handleConnect = async (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId) || connectors[0];
    if (connector) {
      connect({ connector }, {
        onSuccess: async (data) => {
           // Register/Login user on backend
           try {
              const referrer = localStorage.getItem('tronblock_ref');
              const res = await fetch('/api/auth', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    address: data.accounts[0],
                    referrer: referrer || undefined
                  })
              });
              if(!res.ok) console.error("Failed to sync profile");
           } catch (e) {
               console.error("Backend auth error", e);
           }
        }
      });
      onClose();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6" style={{ WebkitTransform: 'translateZ(0)' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm md:max-w-md bg-white border-4 border-black p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-[10px_10px_0_0_#0038FF] md:shadow-[20px_20px_0_0_#0038FF] flex flex-col max-h-[85vh] z-[100000]"
          >
            <div className="absolute top-0 right-0 p-4 md:p-8 z-20">
              <button 
                onClick={onClose}
                className="p-1.5 md:p-2 bg-white/80 backdrop-blur-sm hover:bg-black/5 rounded-full transition-colors border border-black/10"
              >
                <X className="w-5 h-5 md:w-6 md:h-6 text-black" />
              </button>
            </div>

            <div className="mb-6 md:mb-10 flex-shrink-0">
              <h3 className="text-2xl md:text-4xl font-black text-black uppercase italic tracking-tighter leading-none mb-2">{t.selectWallet}</h3>
              <p className="text-black/40 font-bold uppercase tracking-tight text-[10px]">Secure on-chain gateway</p>
            </div>

            {/* Network Selection Section */}
            <div className="mb-8 flex-shrink-0">
               <p className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-3 flex items-center gap-2">
                 <Network className="w-3 h-3" /> {t.selectNetwork}
               </p>
               <div className="grid grid-cols-2 gap-3">
                  {networks.map((net) => (
                     <button
                        key={net.id}
                        onClick={() => setSelectedNetwork(net.id as any)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group ${selectedNetwork === net.id ? 'border-black bg-black text-white shadow-[4px_4px_0_0_#CCFF00]' : 'border-black/10 bg-gray-50 hover:border-black'}`}
                     >
                        <div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center p-2 mb-1 ${selectedNetwork === net.id ? 'bg-white' : 'bg-white'}`}>
                           <img src={net.icon} alt={net.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{net.id}</span>
                     </button>
                  ))}
               </div>
            </div>

            <div className="space-y-3 md:space-y-4 overflow-y-auto pr-2 scrollbar-hide flex-1 pb-4">
               <p className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-1">{t.availableWallets}</p>
               {walletOptions.map((opt, i) => (
                 <motion.button
                   key={i}
                   whileHover={{ x: 10 }}
                   onClick={() => handleConnect(opt.id)}
                   className="w-full flex items-center justify-between p-4 md:p-6 bg-[#F1F3F5] hover:bg-[#CCFF00] border-2 border-black rounded-xl md:rounded-2xl transition-all group shadow-[3px_3px_0_0_black] md:shadow-[4px_4px_0_0_black] hover:shadow-[5px_5px_0_0_black]"
                 >
                   <div className="flex items-center gap-3 md:gap-6 text-left">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl border-2 border-black flex items-center justify-center p-1.5 md:p-2 shrink-0">
                        <img 
                          src={opt.icon} 
                          alt={opt.name} 
                          className="w-full h-full object-contain" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${opt.name}&background=random&color=fff`;
                          }}
                        />
                      </div>
                      <span className="text-lg md:text-xl font-black text-black italic tracking-tight">{opt.name}</span>
                   </div>
                   <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-black/20 group-hover:text-black transition-colors" strokeWidth={3} />
                 </motion.button>
               ))}
            </div>

            <div className="mt-2 md:mt-4 p-4 md:p-6 bg-[#0038FF]/5 rounded-xl md:rounded-2xl border-2 border-dashed border-black/10 flex-shrink-0">
               <p className="text-[10px] font-bold text-center text-black/40 uppercase leading-relaxed tracking-wider italic">
                 {t.termsAgreement}
               </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export const WalletButton: React.FC<{ expanded?: boolean }> = ({ expanded }) => {
  const { t } = useLanguage();
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const shortenedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  if (isConnected && address) {
    return (
      <div className="relative">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex items-center gap-3 bg-[#CCFF00] border-4 border-black px-6 py-2.5 rounded-full shadow-[4px_4px_0_0_black] hover:shadow-[6px_6px_0_0_black] transition-all cursor-pointer ${expanded ? 'w-full justify-center' : ''}`}
        >
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse border border-black/20"></div>
          <span className="font-black text-black text-[13px] uppercase tracking-tighter">{shortenedAddress}</span>
        </button>

        <AnimatePresence>
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-64 bg-white border-4 border-black rounded-[2rem] shadow-[10px_10px_0_0_#0038FF] z-50 overflow-hidden"
              >
                <div className="p-6 border-b-2 border-black/5">
                   <p className="text-[9px] font-black uppercase text-black/30 tracking-widest mb-1">Network</p>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#0038FF]"></div>
                      <span className="text-sm font-black text-black">{chain?.name || 'Unknown'}</span>
                   </div>
                </div>
                <div className="p-2">
                   <button 
                     onClick={() => {
                       navigator.clipboard.writeText(address);
                       setShowDropdown(false);
                     }}
                     className="w-full flex items-center justify-between p-4 hover:bg-black/5 rounded-xl transition-colors group"
                   >
                     <span className="text-[11px] font-black uppercase text-black group-hover:text-[#0038FF]">{t.copyAddress}</span>
                     <Copy className="w-4 h-4 text-black/20 group-hover:text-[#0038FF]" />
                   </button>
                   <button 
                     onClick={() => {
                        disconnect();
                        setShowDropdown(false);
                     }}
                     className="w-full flex items-center justify-between p-4 hover:bg-red-50 rounded-xl transition-colors group"
                   >
                     <span className="text-[11px] font-black uppercase text-red-500">{t.disconnect}</span>
                     <LogOut className="w-4 h-4 text-red-200 group-hover:text-red-500" />
                   </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className={`px-8 py-2.5 rounded-full border-4 border-black bg-white text-black font-black uppercase tracking-widest shadow-[4px_4px_0_0_black] md:shadow-[6px_6px_0_0_black] hover:bg-[#CCFF00] transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-3 ${expanded ? 'w-full justify-center text-lg md:text-xl py-4 md:py-5 rounded-xl md:rounded-2xl bg-[#CCFF00]' : 'text-[11px]'}`}
      >
        <Wallet className={expanded ? 'w-5 h-5 md:w-6 md:h-6' : 'w-4 h-4'} />
        {t.connect}
      </button>
      <ConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
