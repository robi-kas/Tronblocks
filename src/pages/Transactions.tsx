
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../components/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { 
  History, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  RefreshCcw, 
  Zap, 
  Wallet, 
  ExternalLink, 
  Filter, 
  Calendar, 
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FlaskConical,
  ChevronDown,
  X,
  TrendingUp as TrendingUpIcon,
  ShieldCheck,
  Package,
  Layers
} from 'lucide-react';

const StatusBadge = ({ status, t }: { status: string, t: any }) => {
  const styles = {
    Success: 'bg-green-100 text-green-700 border-green-200',
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Failed: 'bg-red-100 text-red-700 border-red-200',
    Simulated: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  const icons = {
    Success: <CheckCircle2 className="w-3 h-3" />,
    Pending: <Clock className="w-3 h-3" />,
    Failed: <XCircle className="w-3 h-3" />,
    Simulated: <FlaskConical className="w-3 h-3" />,
  };

  return (
    <div className={`px-3 py-1 rounded-full border flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tight ${styles[status as keyof typeof styles]}`}>
      {icons[status as keyof typeof icons]}
      {status === 'Success' ? t.success : status === 'Pending' ? t.pending : status === 'Failed' ? t.failed : t.simulated}
    </div>
  );
};

const TransactionDetailModal = ({ tx, isOpen, onClose, t }: { tx: any, isOpen: boolean, onClose: () => void, t: any }) => {
  if (!tx) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
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
            className="relative w-full max-w-2xl bg-white border-4 border-black p-8 rounded-[3rem] shadow-[20px_20px_0_0_#0038FF] z-10 overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-black/5 rounded-full transition-colors border-2 border-black/10">
               <X className="w-6 h-6 text-black" />
            </button>

            <div className="flex items-center gap-4 mb-10">
               <div className="w-16 h-16 bg-[#CCFF00] rounded-[1.5rem] border-4 border-black shadow-[4px_4px_0_0_#000] flex items-center justify-center rotate-3">
                  <History className="w-8 h-8 text-black" />
               </div>
               <div>
                  <h3 className="text-3xl font-black text-black uppercase italic tracking-tighter">{t.transactionDetails}</h3>
                  <p className="text-[10px] font-black uppercase text-black/40 tracking-[0.2em]">Block Reference: {tx.id?.toString().padStart(8, '0') || '00000000'}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
               <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-2xl border-2 border-black/5">
                     <p className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-2">{t.fullHash}</p>
                     <div className="flex items-center gap-2 group cursor-pointer hover:text-[#0038FF]">
                        <span className="font-mono text-xs font-bold break-all">{tx.hash}</span>
                        <ExternalLink className="w-4 h-4 shrink-0" />
                     </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl border-2 border-black/5">
                     <p className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-2">{t.settlementTime}</p>
                     <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-black/40" />
                        <span className="text-sm font-black text-black uppercase italic">{tx.date} @ {tx.time}</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-2xl border-2 border-black/5">
                     <p className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-2">{t.originNode}</p>
                     <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
                        <span className="text-sm font-black text-black font-mono">{tx.from}</span>
                     </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl border-2 border-black/5">
                     <p className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-2">{t.contractMethod}</p>
                     <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#0038FF]" />
                        <span className="text-sm font-black text-black uppercase italic">{tx.type} Execution</span>
                     </div>
                  </div>
               </div>
            </div>

            {tx.type === 'Reward' && (
              <div className="bg-black text-white p-8 rounded-[2rem] border-4 border-[#CCFF00] shadow-[8px_8px_0_0_#CCFF00]">
                 <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-black uppercase italic text-[#CCFF00] flex items-center gap-2">
                       <Layers className="w-5 h-5" /> {t.differentialBreakdown}
                    </h4>
                    <Package className="w-6 h-6 text-white/20" />
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase border-b border-white/10 pb-2">
                       <span className="text-white/40">{t.protocolShare}</span>
                       <span>{(tx.amount * 0.1).toFixed(2)} USDT</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase border-b border-white/10 pb-2">
                       <span className="text-white/40">{t.rankSpread}</span>
                       <span>{(tx.amount * 0.05).toFixed(2)} USDT</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-black uppercase pt-2">
                       <span className="text-[#CCFF00]">{t.netSettlement}</span>
                       <span>{tx.amount}.00 USDT</span>
                    </div>
                 </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-center">
              <p className="text-[9px] font-bold text-black/30 uppercase tracking-[0.2em] italic leading-none">
                * All matrix settlements are finalized on-chain and mathematically immutable.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Transactions = () => {
  const { t } = useLanguage();
  const { address } = useAccount();
  const [showAll, setShowAll] = React.useState(false);
  const [selectedTx, setSelectedTx] = React.useState<any | null>(null);

  const { data: dbTxs, isLoading } = useQuery({
    queryKey: ['transactions', address, showAll],
    queryFn: async () => {
      const url = `/api/users/${address}/transactions${showAll ? '?limit=1000' : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch txs');
      return res.json();
    },
    enabled: !!address,
  });

  const txs = dbTxs || [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Deposit': return <ArrowDownCircle className="w-5 h-5 text-green-500" />;
      case 'Withdrawal': return <ArrowUpCircle className="w-5 h-5 text-blue-500" />;
      case 'Reinvestment': return <RefreshCcw className="w-5 h-5 text-purple-500" />;
      case 'Upgrade': return <Zap className="w-5 h-5 text-[#CCFF00]" />;
      case 'Reward': return <TrendingUpIcon className="w-5 h-5 text-green-500" />;
      default: return <History className="w-5 h-5 text-black" />;
    }
  };

  return (
    <div className="w-full pb-32">
      {/* Hero Section */}
      <section className="px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 bg-[#CCFF00] px-4 py-1.5 rounded-full border-4 border-black shadow-[6px_6px_0_0_#000] mb-8"
          >
            <History className="w-5 h-5 text-black" />
            <span className="text-xs font-black uppercase text-black tracking-[0.2em]">Activity Log</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(2.5rem,8vw,80px)] font-black text-white leading-[0.8] uppercase tracking-tighter mb-8"
            style={{ textShadow: 'clamp(2px, 0.4vw, 5px) clamp(2px, 0.4vw, 5px) 0 #0038FF' }}
          >
            {t.transactionHistoryTitle}
          </motion.h1>

          <p className="text-xl md:text-2xl text-[#CCFF00] font-bold italic max-w-3xl">
            {t.transactionHistorySubtitle}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Modes Info */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
           <div className="flex-1 bg-white border-4 border-black p-6 rounded-[2.5rem] shadow-[8px_8px_0_0_#000]">
              <div className="flex items-center gap-4 mb-2">
                 <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center border-2 border-black">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                 </div>
                 <h3 className="font-black text-black uppercase italic tracking-tight">{t.realOnChain}</h3>
              </div>
              <p className="text-[10px] font-black text-black/40 uppercase leading-relaxed">Transactions are permanently recorded on the TRON blockchain and require network confirmation.</p>
           </div>
           <div className="flex-1 bg-white border-4 border-black p-6 rounded-[2.5rem] shadow-[8px_8px_0_0_#CCFF00]">
              <div className="flex items-center gap-4 mb-2">
                 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center border-2 border-black">
                    <FlaskConical className="w-4 h-4 text-purple-600" />
                 </div>
                 <h3 className="font-black text-black uppercase italic tracking-tight">{t.testDemoMode}</h3>
              </div>
              <p className="text-[10px] font-black text-black/40 uppercase leading-relaxed">Simulated records allow for strategy testing without actual USDT expenditure or on-chain execution.</p>
           </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border-4 border-black rounded-[2.5rem] p-6 lg:p-10 shadow-[10px_10px_0_0_#0038FF] mb-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 items-end">
           <div>
              <p className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-3 flex items-center gap-2"><Calendar className="w-3 h-3" /> {t.timeRange}</p>
              <select className="w-full bg-gray-100 border-2 border-black/5 p-3 rounded-2xl font-black uppercase text-[10px] transition-all focus:border-black outline-none cursor-pointer">
                 <option>{t.last7Days}</option>
                 <option>{t.last30Days}</option>
                 <option>{t.allTime}</option>
              </select>
           </div>

           <div>
              <p className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-3 flex items-center gap-2"><Filter className="w-3 h-3" /> {t.txType}</p>
              <select className="w-full bg-gray-100 border-2 border-black/5 p-3 rounded-2xl font-black uppercase text-[10px] transition-all focus:border-black outline-none cursor-pointer">
                 <option>{t.all}</option>
                 <option>{t.deposit}</option>
                 <option>{t.withdrawal}</option>
                 <option>{t.reinvestment}</option>
                 <option>{t.upgrades}</option>
              </select>
           </div>

           <div>
              <p className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-3 flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> {t.status}</p>
              <select className="w-full bg-gray-100 border-2 border-black/5 p-3 rounded-2xl font-black uppercase text-[10px] transition-all focus:border-black outline-none cursor-pointer">
                 <option>{t.all}</option>
                 <option>{t.success}</option>
                 <option>{t.pending}</option>
                 <option>{t.failed}</option>
                 <option>{t.simulated}</option>
              </select>
           </div>

           <div className="lg:col-span-1">
              <button className="w-full bg-black text-[#CCFF00] px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-[#0038FF] hover:text-white transition-all shadow-[4px_4px_0_0_#CCFF00]">
                 <Search className="w-4 h-4" />
                 Apply Filters
              </button>
           </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white border-4 border-black rounded-[3rem] shadow-[15px_15px_0_0_#000] overflow-hidden">
           {/* Desktop Header */}
           <div className="hidden lg:grid grid-cols-6 p-8 border-b-4 border-black bg-gray-50 text-[10px] font-black uppercase tracking-widest text-black/40 italic">
              <div>{t.txType}</div>
              <div>{t.amount} (USDT)</div>
              <div>{t.status}</div>
              <div>{t.history}</div>
              <div>{t.txHash}</div>
              <div className="text-right">{t.fromTo}</div>
           </div>

           <div className="divide-y-2 divide-black/5">
              {isLoading ? (
                 <div className="p-8 text-center text-sm font-black uppercase text-black/40">Loading Transactions...</div>
              ) : txs.length === 0 ? (
                 <div className="p-8 text-center text-sm font-black uppercase text-black/40">No Transactions Found</div>
              ) : txs.map((tx: any, idx: number) => (
                <motion.div 
                  key={tx.id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedTx(tx)}
                  className="grid grid-cols-1 lg:grid-cols-6 p-8 hover:bg-black/5 transition-colors items-center gap-4 lg:gap-0 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-center">
                        {getTypeIcon(tx.type)}
                     </div>
                     <div>
                        <p className="text-sm font-black text-black leading-none mb-1">{tx.type}</p>
                        {tx.simulated && (
                          <span className="text-[8px] font-black uppercase text-purple-600 tracking-tighter flex items-center gap-1">
                            <FlaskConical className="w-2 h-2" /> {t.simulated}
                          </span>
                        )}
                     </div>
                  </div>

                  <div className="lg:block">
                     <span className="text-lg font-black text-black tracking-tighter font-mono">{tx.amount}.00</span>
                  </div>

                  <div>
                     <StatusBadge status={tx.status} t={t} />
                  </div>

                  <div>
                     <p className="text-[10px] font-black text-black leading-none mb-1 font-mono">{tx.date}</p>
                     <p className="text-[9px] font-bold text-black/30 tracking-widest font-mono">{tx.time}</p>
                  </div>

                  <div className="flex items-center gap-2 group">
                     <span className="text-[10px] font-black text-black/40 group-hover:text-[#0038FF] font-mono">{tx.hash}</span>
                     <ExternalLink className="w-3 h-3 text-black/20 group-hover:text-[#0038FF]" />
                  </div>

                  <div className="text-right lg:block">
                     <p className="text-[9px] font-black text-black/30 uppercase tracking-widest">{tx.from} &rarr; {tx.to}</p>
                  </div>
                </motion.div>
              ))}
           </div>

           <div className="p-8 bg-gray-50 border-t-2 border-black/5 flex justify-center">
              <button 
                onClick={() => setShowAll(!showAll)}
                disabled={isLoading}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 hover:text-black transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                 {isLoading ? 'Syncing...' : showAll ? 'Show Recent Activity' : 'View All Logs'} 
                 {!showAll && <ChevronDown className="w-4 h-4" />}
              </button>
           </div>
        </div>

        <TransactionDetailModal tx={selectedTx} isOpen={!!selectedTx} onClose={() => setSelectedTx(null)} t={t} />

      </div>
    </div>
  );
};

export default Transactions;
