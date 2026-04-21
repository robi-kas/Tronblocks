
import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../components/LanguageContext';
import { 
  Users, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  LayoutGrid, 
  ArrowUpRight, 
  ChevronRight,
  Target,
  Trophy,
  BarChart3,
  Network,
  Activity,
  ArrowDown
} from 'lucide-react';

const TeamNode = ({ address, level, isRoot = false }: { address: string, level: string, isRoot?: boolean }) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`relative px-4 py-3 rounded-2xl border-4 border-black shadow-[4px_4px_0_0_#000] flex flex-col items-center ${isRoot ? 'bg-[#CCFF00] scale-110' : 'bg-white hover:scale-105'} transition-all min-w-[120px]`}>
       <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full border-2 border-black text-[8px] font-black uppercase ${isRoot ? 'bg-black text-white' : 'bg-[#0038FF] text-white'}`}>
         {level}
       </div>
       <Users className="w-5 h-5 mb-1" />
       <span className="font-mono text-[9px] font-bold">{address}</span>
       <div className="h-1 w-full bg-black/5 rounded-full mt-2 overflow-hidden">
          <div className="h-full bg-green-500 w-3/4"></div>
       </div>
    </div>
  </div>
);

const TeamTree = () => {
  return (
    <div className="bg-black/5 border-4 border-dashed border-black/20 p-10 md:p-20 rounded-[4rem] overflow-x-auto">
       <div className="min-w-[800px] flex flex-col items-center gap-20">
          {/* Level 0 */}
          <TeamNode address="YOU (Owner)" level="V6" isRoot />

          <div className="relative w-full">
            {/* SVG Connections for Level 1 */}
            <svg className="absolute top-[-80px] left-0 w-full h-20 pointer-events-none" style={{ filter: 'drop-shadow(2px 2px 0 #000)' }}>
              <line x1="50%" y1="0" x2="20%" y2="80" stroke="black" strokeWidth="4" />
              <line x1="50%" y1="0" x2="50%" y2="80" stroke="black" strokeWidth="4" />
              <line x1="50%" y1="0" x2="80%" y2="80" stroke="black" strokeWidth="4" />
            </svg>

            {/* Level 1 */}
            <div className="flex justify-around items-start">
               {/* Node 1 */}
               <div className="flex flex-col items-center gap-16">
                  <TeamNode address="TR8x...a9V2" level="V5" />
                  <div className="relative w-full h-16 flex justify-center">
                    <svg className="absolute top-0 left-[-40px] w-[140px] h-16 pointer-events-none">
                      <line x1="50%" y1="0" x2="20%" y2="60" stroke="black" strokeWidth="3" strokeDasharray="4 4" />
                      <line x1="50%" y1="0" x2="80%" y2="60" stroke="black" strokeWidth="3" strokeDasharray="4 4" />
                    </svg>
                    <div className="flex gap-8 mt-16 scale-90">
                      <TeamNode address="Sub_A" level="V2" />
                      <TeamNode address="Sub_B" level="V1" />
                    </div>
                  </div>
               </div>

               {/* Node 2 */}
               <div className="flex flex-col items-center gap-16">
                  <TeamNode address="TR5p...x7Y3" level="V2" />
                  <div className="h-16 flex items-center justify-center">
                    <div className="flex flex-col items-center opacity-40">
                      <ArrowDown className="w-4 h-4 animate-bounce" />
                      <span className="text-[8px] font-black uppercase">Expanding</span>
                    </div>
                  </div>
               </div>

               {/* Node 3 */}
               <div className="flex flex-col items-center gap-16">
                  <TeamNode address="TR9q...w2P4" level="V4" />
                  <div className="relative w-full h-16 flex justify-center">
                    <svg className="absolute top-0 left-[-20px] w-[100px] h-16 pointer-events-none">
                      <line x1="50%" y1="0" x2="50%" y2="60" stroke="black" strokeWidth="3" strokeDasharray="4 4" />
                    </svg>
                    <div className="mt-16 scale-90">
                      <TeamNode address="Sub_C" level="V3" />
                    </div>
                  </div>
               </div>
            </div>
          </div>
       </div>
    </div>
  );
};

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

const SectionHeader = ({ title, id }: { title: string, id: string }) => (
  <div id={id} className="mb-10 pt-16">
    <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter" style={{ textShadow: '4px 4px 0 #0038FF' }}>
      {title}
    </h2>
  </div>
);

const Team = () => {
  const { t } = useLanguage();

  const navItems = [
    { name: t.directReferrals, id: 'direct-layer' },
    { name: t.teamTopology, id: 'topology-layer' },
    { name: t.structureLayer, id: 'structure-layer' },
    { name: t.performanceLayer, id: 'performance-layer' },
    { name: t.upgradeGap, id: 'upgrade-gap' },
    { name: t.leaderboard, id: 'leaderboard' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const directMembers = [
    { address: 'TR8x...a9V2', level: 'V5', date: '2026.04.10', contribution: '12,400' },
    { address: 'TR5p...x7Y3', level: 'V2', date: '2026.04.12', contribution: '4,200' },
    { address: 'TR2m...k9L1', level: 'V1', date: '2026.04.15', contribution: '800' },
    { address: 'TR9q...w2P4', level: 'V4', date: '2026.04.05', contribution: '8,900' },
  ];

  const distribution = [
    { level: 'V1', count: 124, color: 'bg-white' },
    { level: 'V2', count: 86, color: 'bg-[#F1F3F5]' },
    { level: 'V3', count: 42, color: 'bg-[#CCFF00]' },
    { level: 'V4', count: 12, color: 'bg-[#0038FF] text-white' },
    { level: 'V5', count: 3, color: 'bg-black text-[#CCFF00]' },
  ];

  return (
    <div className="w-full pb-32">
      {/* Hero Section */}
      <section className="px-6 md:px-10 pt-32 pb-20 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 bg-[#CCFF00] px-4 py-1.5 rounded-full border-4 border-black shadow-[6px_6px_0_0_#000] mb-8"
          >
            <Network className="w-5 h-5 text-black" />
            <span className="text-xs font-black uppercase text-black tracking-[0.2em]">Matrix Structure</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(2.5rem,8vw,80px)] font-black text-white leading-[0.8] uppercase tracking-tighter mb-8"
            style={{ textShadow: 'clamp(2px, 0.4vw, 5px) clamp(2px, 0.4vw, 5px) 0 #0038FF' }}
          >
            {t.myTeamTitle}
          </motion.h1>
          
          <p className="text-xl md:text-2xl text-[#CCFF00] font-bold italic max-w-3xl">
            {t.teamSubtitle}
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <OverviewCard title={t.directMemberCount || 'Direct Member Count'} value="24" icon={Users} color="bg-[#CCFF00]" />
          <OverviewCard title={t.directValidSeatCount || 'Direct Valid Seat Count'} value="22" icon={ShieldCheck} color="bg-white" />
          <OverviewCard title={t.totalTeamSeats || 'Total Team Seats'} value="1,592" icon={LayoutGrid} color="bg-[#0038FF]" />
          <OverviewCard title={t.teamPerformanceVolume || 'Team Performance Volume'} value="124,912" icon={TrendingUp} color="bg-white" />
        </div>
      </section>

      {/* Sticky Navigation */}
      <div className="sticky top-20 z-40 w-full bg-black/50 backdrop-blur-xl border-y-4 border-black mb-10">
        <div className="max-w-7xl mx-auto flex items-center overflow-x-auto no-scrollbar px-6 py-4 gap-4">
           {navItems.map((item) => (
             <button 
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="whitespace-nowrap px-6 py-2 rounded-full bg-white border-2 border-black text-black font-black text-[10px] uppercase tracking-widest hover:bg-[#CCFF00] transition-colors shadow-[4px_4px_0_0_#000]"
             >
               {item.name}
             </button>
           ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* A. Direct Layer */}
        <section id="direct-layer">
          <SectionHeader title={t.directReferrals} id="direct-layer-header" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {directMembers.map((member, i) => (
              <motion.div 
                key={member.address}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white border-4 border-black p-6 rounded-[2.5rem] shadow-[8px_8px_0_0_#000] flex items-center justify-between group hover:shadow-[12px_12px_0_0_#CCFF00] transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#F1F3F5] rounded-2xl border-2 border-black flex items-center justify-center font-black text-2xl italic group-hover:bg-[#CCFF00] transition-colors">
                    {member.level}
                  </div>
                  <div>
                    <p className="text-xl font-black text-black tracking-tight">{member.address}</p>
                    <p className="text-[10px] font-black uppercase text-black/40 tracking-widest">{t.joinedDate}: {member.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-[#0038FF]">{member.contribution} USDT</p>
                  <p className="text-[9px] font-black uppercase text-black/20 tracking-[0.2em]">{t.contribution}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* New: Topology Layer */}
        <section id="topology-layer">
           <SectionHeader title={t.teamTopology} id="topology-layer-header" />
           <TeamTree />
        </section>

        {/* B. Structure Layer */}
        <section id="structure-layer">
          <SectionHeader title={t.structureLayer} id="structure-layer-header" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
             {distribution.map((item, i) => (
                <motion.div 
                  key={item.level}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`${item.color} border-4 border-black p-8 rounded-[2.5rem] shadow-[8px_8px_0_0_#000] flex flex-col items-center justify-center gap-2 text-center group hover:translate-y-[-8px] transition-all`}
                >
                  <span className="text-4xl font-black italic">{item.level}</span>
                  <div className="h-px w-full bg-current opacity-20 my-2"></div>
                  <span className="text-2xl font-black">{item.count}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{t.members}</span>
                </motion.div>
             ))}
          </div>
        </section>

        {/* C. Performance Layer */}
        <section id="performance-layer">
          <SectionHeader title={t.performanceLayer} id="performance-layer-header" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-[#0038FF] border-4 border-black p-10 rounded-[3rem] shadow-[12px_12px_0_0_#000] text-white">
                <h3 className="text-2xl font-black uppercase italic italic mb-8 flex items-center gap-4 text-[#CCFF00]">
                  <BarChart3 className="w-6 h-6" /> {t.performancePerLayer}
                </h3>
                <div className="space-y-8">
                   {[
                     { layer: 'Layer 1', vol: '124,000', perc: 100, color: 'bg-[#CCFF00]' },
                     { layer: 'Layer 2', vol: '86,400', perc: 70, color: 'bg-white' },
                     { layer: 'Layer 3', vol: '42,100', perc: 35, color: 'bg-white/60' },
                     { layer: 'Layer 4-10', vol: '12,912', perc: 10, color: 'bg-white/30' },
                   ].map((l) => (
                     <div key={l.layer} className="group">
                        <div className="flex justify-between items-end mb-3">
                           <div className="flex items-center gap-3">
                              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#CCFF00]">{l.layer}</span>
                              <span className="text-[10px] font-black text-white/40 uppercase italic">{l.perc}% Contr.</span>
                           </div>
                           <span className="text-xl font-black text-white italic tracking-tighter">{l.vol} USDT</span>
                        </div>
                        <div className="h-8 bg-black/40 border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0_0_black] group-hover:shadow-[6px_6px_0_0_black] transition-all relative">
                           <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${l.perc}%` }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                              className={`h-full ${l.color} border-r-4 border-black flex items-center justify-end px-3`}
                           >
                              {l.perc > 15 && <span className="text-[10px] font-black text-black">SELECTED</span>}
                           </motion.div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-white border-4 border-black p-10 rounded-[3rem] shadow-[12px_12px_0_0_#CCFF00]">
                <h3 className="text-2xl font-black uppercase italic italic mb-8 flex items-center gap-4 text-black">
                  <Zap className="w-6 h-6 text-[#0038FF]" /> {t.differentialContribution}
                </h3>
                <div className="space-y-4">
                   {[
                     { name: 'Direct Referrals', val: '5,240', color: 'text-green-600' },
                     { name: 'Secondary Matrix', val: '2,910', color: 'text-blue-600' },
                     { name: 'Team Spillover', val: '1,540', color: 'text-purple-600' },
                   ].map((item) => (
                     <div key={item.name} className="flex items-center justify-between p-5 bg-[#F1F3F5] rounded-2xl border-2 border-black/5 hover:border-black transition-all">
                        <span className="text-xs font-black uppercase text-black/50">{item.name}</span>
                        <span className={`text-xl font-black ${item.color}`}>+ {item.val} USDT</span>
                     </div>
                   ))}
                </div>
                <div className="mt-8 p-6 bg-black rounded-2xl flex items-center justify-between">
                   <div className="text-[#CCFF00] font-black italic text-sm">TOTAL BONUS TRIGGERED</div>
                   <div className="text-white font-black text-2xl tracking-tighter">9,690 USDT</div>
                </div>
             </div>
          </div>
        </section>

        {/* Upgrade Gap Tracker */}
        <section id="upgrade-gap">
          <SectionHeader title={t.upgradeGap} id="upgrade-gap-header" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#CCFF00] border-4 border-black p-10 md:p-16 rounded-[4rem] shadow-[15px_15px_0_0_#000] relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform">
                <Target className="w-64 h-64 text-black" />
             </div>
             
             <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-black text-[#CCFF00] px-4 py-1.5 rounded-xl text-xl font-black italic">V5 &rarr; V6</div>
                  <span className="text-black font-black uppercase tracking-widest text-[10px]">{t.missingNodes}</span>
                </div>
                
                <h4 className="text-5xl md:text-7xl font-black text-black uppercase italic mb-10 leading-none">
                  8 NODES<br/><span className="opacity-40 italic">REMAINING</span>
                </h4>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <span className="text-sm font-black uppercase text-black">Progression</span>
                     <span className="text-2xl font-black text-black">72%</span>
                  </div>
                  <div className="h-8 bg-black/10 rounded-2xl border-4 border-black overflow-hidden relative">
                     <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '72%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-black shadow-[4px_0_20px_rgba(0,0,0,0.5)]"
                     ></motion.div>
                  </div>
                  <p className="text-[10px] font-black uppercase text-black/60 tracking-widest text-center pt-2">
                    Current team structure supports 22 valid seats. 8 more V5 nodes required.
                  </p>
                </div>
             </div>
          </motion.div>
        </section>

        {/* Contribution Leaderboard */}
        <section id="leaderboard">
          <SectionHeader title={t.leaderboard} id="leaderboard-header" />
          <div className="bg-white border-4 border-black rounded-[4rem] p-10 shadow-[20px_20px_0_0_#0038FF] relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#0038FF10_0%,transparent_50%)]"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-12">
                <div className="max-w-sm">
                   <div className="w-16 h-16 bg-[#CCFF00] rounded-2xl border-4 border-black flex items-center justify-center mb-8 shadow-[4px_4px_0_0_#000]">
                      <Trophy className="w-8 h-8 text-black" />
                   </div>
                   <h3 className="text-4xl font-black text-black uppercase italic mb-4 leading-none">{t.topContributors}</h3>
                   <p className="text-black/50 font-bold uppercase tracking-tight text-sm">Recognizing the most active nodes in your matrix architecture.</p>
                </div>

                <div className="flex-1 w-full space-y-4">
                   {[
                     { rank: 1, addr: 'TR8x...a9V2', vol: '124,000', score: 100 },
                     { rank: 2, addr: 'TR5p...x7Y3', vol: '86,400', score: 85 },
                     { rank: 3, addr: 'TR2m...k9L1', vol: '42,100', score: 70 },
                     { rank: 4, addr: 'TR9q...w2P4', vol: '12,900', score: 60 },
                     { rank: 5, addr: 'TR1s...z5X0', vol: '8,400', score: 55 },
                   ].map((item, i) => (
                     <motion.div 
                        key={item.addr}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-6 bg-[#F1F3F5] rounded-3xl border-2 border-black/5 hover:border-black hover:bg-white transition-all cursor-pointer group"
                     >
                       <div className="flex items-center gap-6">
                          <span className={`text-4xl font-black italic ${item.rank === 1 ? 'text-[#CCFF00] drop-shadow-[2px_2px_0_black]' : 'text-black/10'}`}>#0{item.rank}</span>
                          <div>
                            <p className="text-xl font-black text-black tracking-tighter">{item.addr}</p>
                            <div className="flex gap-4 mt-1">
                               <span className="text-[10px] font-black uppercase text-green-600">Active Node</span>
                               <span className="text-[10px] font-black uppercase text-black/20">V5 Rank</span>
                            </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-black text-black tracking-tighter">{item.vol} USDT</p>
                          <div className="w-full h-1 bg-black/5 rounded-full mt-1 overflow-hidden">
                             <div className="h-full bg-[#0038FF]" style={{ width: `${item.score}%` }}></div>
                          </div>
                       </div>
                     </motion.div>
                   ))}
                </div>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Team;
