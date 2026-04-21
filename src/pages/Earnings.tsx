
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../components/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { 
  TrendingUp, 
  Zap, 
  Layers, 
  Wallet, 
  Download, 
  ChevronDown, 
  Filter, 
  Calendar,
  ExternalLink,
  ArrowUpRight,
  ShieldCheck,
  Package,
  ArrowUpDown
} from 'lucide-react';

const SummaryCard = ({ title, value, icon: Icon, color, subValue }: { title: string, value: string, icon: any, color: string, subValue?: string }) => (
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
      {subValue && <p className="text-[9px] font-bold text-black/30 uppercase mt-1">~ {subValue}</p>}
    </div>
  </motion.div>
);

interface EarningRowProps {
  record: any;
  t: any;
}

const EarningRow: React.FC<EarningRowProps> = ({ record, t }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="border-4 border-black rounded-[2.5rem] bg-white shadow-[6px_6px_0_0_#000] overflow-hidden transition-all hover:shadow-[10px_10px_0_0_#CCFF00]">
      <div 
        onClick={() => setExpanded(!expanded)}
        className="p-6 md:p-8 flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-6">
          <div className={`w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center ${record.type === 'Upgrade' ? 'bg-[#CCFF00]' : record.type === 'Matrix' ? 'bg-[#0038FF] text-white' : 'bg-black text-[#CCFF00]'}`}>
            {record.type === 'Upgrade' ? <Zap className="w-6 h-6" /> : record.type === 'Matrix' ? <Layers className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-xl font-black text-black italic tracking-tighter leading-none mb-1">{record.type} Reward</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-black/30">{record.time}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="text-right hidden sm:block">
              <p className="text-[9px] font-black uppercase text-black/20 tracking-widest leading-none mb-1">{t.status}</p>
              <div className="flex items-center gap-1.5 justify-end">
                <div className={`w-1.5 h-1.5 rounded-full ${record.status === 'Paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-[10px] font-black uppercase text-black tracking-tighter">{record.status === 'Paid' ? t.paid : t.pending}</span>
              </div>
           </div>
           <div className="text-right">
              <p className="text-2xl font-black text-green-600 tracking-tighter leading-none">+ {record.amount} USDT</p>
           </div>
           <motion.div animate={{ rotate: expanded ? 180 : 0 }} className="text-black/20 group-hover:text-black">
              <ChevronDown className="w-6 h-6" />
           </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t-2 border-black/5 bg-[#F9FAFB]"
          >
            <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
               <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-black uppercase text-black/30 tracking-[0.2em] mb-2">{t.orderId}</p>
                    <p className="text-sm font-black text-black flex items-center gap-2">#{record.id} <ExternalLink className="w-3 h-3 text-[#0038FF]" /></p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-black/30 tracking-[0.2em] mb-2">{t.originNode}</p>
                    <p className="text-sm font-black text-black">{record.origin}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-black/30 tracking-[0.2em] mb-2">{t.settlementTime}</p>
                    <p className="text-sm font-black text-black">{record.fullTime}</p>
                  </div>
               </div>
               
               <div className="space-y-6 md:col-span-2">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-2xl border border-black/5">
                       <p className="text-[8px] font-black text-black/30 uppercase tracking-widest mb-1">{t.userLevelRatio}</p>
                       <p className="text-lg font-black text-[#0038FF]">{record.ratio}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-black/5">
                       <p className="text-[8px] font-black text-black/30 uppercase tracking-widest mb-1">{t.downstreamPayout}</p>
                       <p className="text-lg font-black text-black">{record.downstream} USDT</p>
                    </div>
                 </div>
                 
                 <div className="bg-black text-white p-6 rounded-3xl border-2 border-white/10 flex items-center justify-between shadow-xl">
                    <div>
                      <p className="text-[10px] font-black uppercase text-[#CCFF00] tracking-widest leading-none mb-2">{t.differentialShare}</p>
                      <p className="text-3xl font-black italic tracking-tighter leading-none">{record.share} <span className="text-sm opacity-50">USDT</span></p>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black uppercase opacity-40 mb-1">Final Result</p>
                       <div className="bg-[#CCFF00] text-black px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-widest">Calculated</div>
                    </div>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Earnings = () => {
  const { t } = useLanguage();
  const { address } = useAccount();
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['userProfile', address],
    queryFn: async () => {
      const res = await fetch(`/api/users/${address}`);
      if (!res.ok) throw new Error('User not found');
      return res.json();
    },
    enabled: !!address,
  });

  const { data: dbTxs, isLoading: isTxsLoading } = useQuery({
    queryKey: ['transactions', address],
    queryFn: async () => {
      const res = await fetch(`/api/users/${address}/transactions`);
      if (!res.ok) throw new Error('Failed to fetch txs');
      return res.json();
    },
    enabled: !!address,
  });

  const filteredEarnings = useMemo(() => {
    if (!dbTxs) return [];
    
    let filtered = dbTxs.filter((tx: any) => tx.type === 'Reward' || tx.amount > 0);

    // Apply Type Filter
    if (typeFilter !== 'All' && typeFilter !== t.all) {
      filtered = filtered.filter((tx: any) => {
        if (typeFilter === t.upgradeRewards) return tx.type === 'Upgrade';
        if (typeFilter === t.matrixRewards) return tx.type === 'Matrix';
        if (typeFilter === t.differentialBonus) return tx.type === 'Reward';
        if (typeFilter === t.buyback) return tx.type === 'Reinvestment';
        return true;
      });
    }

    // Apply Time Filter (Mock logic for demo, usually done via timestamp or date string)
    if (timeFilter !== t.allTime && timeFilter !== 'All Time') {
      const now = new Date();
      filtered = filtered.filter((tx: any) => {
        const txDate = new Date(tx.date);
        const diffDays = Math.ceil((now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24));
        if (timeFilter === t.last7Days) return diffDays <= 7;
        if (timeFilter === t.last30Days) return diffDays <= 30;
        return true;
      });
    }

    // Apply Sorting
    return [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(`${a.date} ${a.time}`).getTime();
      const dateB = new Date(`${b.date} ${b.time}`).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [dbTxs, timeFilter, typeFilter, sortOrder, t]);

  const mockEarnings = filteredEarnings;

  return (
    <div className="w-full pb-32">
      {/* Hero Section */}
      <section className="px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-end lg:items-center justify-between gap-12">
          <div className="w-full lg:w-auto">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 bg-[#CCFF00] px-4 py-1.5 rounded-full border-4 border-black shadow-[6px_6px_0_0_#000] mb-8"
            >
              <TrendingUp className="w-5 h-5 text-black" />
              <span className="text-xs font-black uppercase text-black tracking-[0.2em]">Live Revenue Stream</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[clamp(2.5rem,8vw,80px)] font-black text-white leading-[0.8] uppercase tracking-tighter mb-8"
              style={{ textShadow: 'clamp(2px, 0.4vw, 5px) clamp(2px, 0.4vw, 5px) 0 #0038FF' }}
            >
              {t.myEarningsTitle}
            </motion.h1>

            <p className="text-xl md:text-2xl text-[#CCFF00] font-bold italic max-w-3xl">
              {t.earningsSubtitle}
            </p>
          </div>

          <div className="bg-[#0038FF] border-4 border-black p-8 rounded-[3rem] shadow-[12px_12px_0_0_#CCFF00] flex flex-col gap-6 w-full lg:w-max min-w-[320px] relative group overflow-hidden">
             <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div>
                <p className="text-[#CCFF00] text-[10px] font-black uppercase tracking-widest mb-1">{t.availableWithdraw}</p>
                <p className="text-5xl font-black text-white italic tracking-tighter leading-none">1,240.50 <span className="text-lg opacity-50">USDT</span></p>
             </div>
             <button className="w-full bg-[#CCFF00] text-black font-black py-4 rounded-xl border-2 border-black uppercase tracking-widest text-xs shadow-[4px_4px_0_0_#000] hover:bg-white transition-all active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center gap-2">
                Launch Withdrawal <ArrowUpRight className="w-4 h-4" strokeWidth={3} />
             </button>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
           <SummaryCard title={t.totalEarnings} value="12,412.00" icon={TrendingUp} color="bg-[#CCFF00]" />
           <SummaryCard title={t.upgradeRewards} value="4,800.00" icon={Zap} color="bg-white" />
           <SummaryCard title={t.matrixRewards} value="2,920.00" icon={Layers} color="bg-[#0038FF]" />
           <SummaryCard title={t.differentialBonus} value="4,692.00" icon={Wallet} color="bg-white" />
        </div>
      </section>

      {/* Main List Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Filters Bar */}
        <div className="bg-white border-4 border-black rounded-[2.5rem] p-6 lg:p-10 shadow-[10px_10px_0_0_#0038FF] mb-12 flex flex-col lg:flex-row items-center justify-between gap-8">
           <div className="flex flex-col md:flex-row items-center gap-8 w-full lg:w-auto">
              <div className="w-full md:w-auto">
                <p className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-3 flex items-center gap-2"><Calendar className="w-3 h-3" /> {t.timeRange}</p>
                <div className="flex bg-gray-100 p-1.5 rounded-2xl border-2 border-black/5 gap-2">
                   {[t.last7Days, t.last30Days, t.allTime].map((r, i) => (
                     <button 
                        key={i} 
                        onClick={() => setTimeFilter(r)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${timeFilter === r ? 'bg-black text-white shadow-[2px_2px_0_0_#CCFF00]' : 'hover:bg-black/5'}`}
                     >
                        {r}
                     </button>
                   ))}
                </div>
              </div>

              <div className="w-full md:w-auto">
                 <p className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-3 flex items-center gap-2"><Filter className="w-3 h-3" /> {t.rewardType}</p>
                 <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full md:w-48 bg-gray-100 border-2 border-black/5 p-3 rounded-2xl font-black uppercase text-[10px] transition-all focus:border-black outline-none cursor-pointer"
                 >
                    <option value="All">{t.all}</option>
                    <option value={t.upgradeRewards}>{t.upgradeRewards}</option>
                    <option value={t.matrixRewards}>{t.matrixRewards}</option>
                    <option value={t.differentialBonus}>{t.differentialBonus}</option>
                    <option value={t.buyback}>{t.buyback}</option>
                 </select>
              </div>

              <div className="w-full md:w-auto">
                 <p className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-3 flex items-center gap-2"><ArrowUpDown className="w-3 h-3" /> {t.sorting}</p>
                 <div className="flex bg-gray-100 p-1.5 rounded-2xl border-2 border-black/5 gap-2">
                    <button 
                       onClick={() => setSortOrder('newest')}
                       className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${sortOrder === 'newest' ? 'bg-black text-white shadow-[2px_2px_0_0_#CCFF00]' : 'hover:bg-black/5'}`}
                    >
                       {t.newest}
                    </button>
                    <button 
                       onClick={() => setSortOrder('oldest')}
                       className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${sortOrder === 'oldest' ? 'bg-black text-white shadow-[2px_2px_0_0_#CCFF00]' : 'hover:bg-black/5'}`}
                    >
                       {t.oldest}
                    </button>
                 </div>
              </div>
           </div>

           <button className="w-full lg:w-auto bg-black text-[#CCFF00] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#0038FF] hover:text-white transition-all shadow-[6px_6px_0_0_#CCFF00] italic">
              <Download className="w-5 h-5" />
              {t.exportCsv}
           </button>
        </div>

        {/* Earning List */}
        <div className="space-y-6">
           <div className="flex items-end justify-between mb-8 px-4">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter" style={{ textShadow: '4px 4px 0 #0038FF' }}>{t.earningsList}</h2>
              <p className="text-[10px] font-black uppercase text-[#CCFF00] tracking-widest opacity-60">Displaying 1-{mockEarnings.length} of {mockEarnings.length} records</p>
           </div>
           
           {isTxsLoading ? (
               <div className="p-8 text-center text-sm font-black uppercase text-white/40">Loading Earnings...</div>
           ) : mockEarnings.length === 0 ? (
               <div className="p-8 text-center text-sm font-black uppercase text-white/40">No Earnings Found</div>
           ) : mockEarnings.map((record: any, idx: number) => (
              <EarningRow key={record.id || idx} record={record} t={t} />
           ))}

           {mockEarnings.length > 0 && (
             <div className="pt-10 flex justify-center">
                <button className="px-12 py-5 rounded-2xl border-4 border-white text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center gap-4">
                   Load More Records
                   <ChevronDown className="w-5 h-5" />
                </button>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default Earnings;
