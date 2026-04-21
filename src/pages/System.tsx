
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../components/LanguageContext';
import { useSystemConfig } from '../components/ConfigContext';
import { 
  ShieldCheck, 
  ChevronRight, 
  Calculator, 
  ArrowUpRight, 
  Layers, 
  Settings, 
  Users, 
  Zap, 
  BarChart3,
  ArrowRightLeft
} from 'lucide-react';

const levelData = [
  { level: 'V1', req: 'Refer 3 members', reward: '80 USDT', bonus: '0%' },
  { level: 'V2', req: 'Public matrix', reward: '160 USDT', bonus: '0%' },
  { level: 'V3', req: 'Public matrix', reward: '400 USDT', bonus: '0%' },
  { level: 'V4', req: '4 V1', reward: '800 USDT', bonus: '2%' },
  { level: 'V5', req: '6 V1 + 1 V4', reward: '1,600 USDT', bonus: '5%' },
  { level: 'V6', req: '3 V5', reward: '4,000 USDT', bonus: '6%' },
  { level: 'V7', req: '3 V6', reward: '12,000 USDT', bonus: '7%' },
  { level: 'V8', req: '3 V7', reward: '40,000 USDT', bonus: '8%' },
  { level: 'V9', req: '3 V8', reward: '160,000 USDT', bonus: '9%' },
  { level: 'V10', req: '2 V9', reward: '1,440,000 USDT', bonus: '10%' },
];

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-12">
    <motion.h2 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter"
      style={{ textShadow: '4px 4px 0 #0038FF' }}
    >
      {title}
    </motion.h2>
    {subtitle && <p className="text-[#CCFF00] font-bold mt-4 uppercase tracking-widest text-sm">{subtitle}</p>}
  </div>
);

const System = () => {
  const { t } = useLanguage();
  const { config } = useSystemConfig();
  const [calcInput, setCalcInput] = React.useState('');
  const [calcResult, setCalcResult] = React.useState<number | null>(null);
  
  // Upgrade Path State
  const [currRank, setCurrRank] = React.useState(1);
  const [targetRank, setTargetRank] = React.useState(2);
  const [directSeats, setDirectSeats] = React.useState('0');
  const [teamNodes, setTeamNodes] = React.useState('0');
  const [upgradeAnalysis, setUpgradeAnalysis] = React.useState<{ missingSeats: number, missingNodes: number } | null>(null);

  const calculateUpgrade = () => {
    const dSeats = parseInt(directSeats) || 0;
    const tNodes = parseInt(teamNodes) || 0;
    
    // Simple logic based on speculative progression if config missing
    const targetLvlData = config?.levelProgression?.find(p => p.level === targetRank);
    const reqSeats = targetLvlData?.directReq || (targetRank * 3);
    const reqNodes = targetRank > 3 ? (targetRank - 3) * 10 : 0;
    
    setUpgradeAnalysis({
      missingSeats: Math.max(0, reqSeats - dSeats),
      missingNodes: Math.max(0, reqNodes - tNodes)
    });
  };

  const navItems = [
    { name: t.ruleVersion, id: 'rule-version' },
    { name: t.levelStructure, id: 'level-structure' },
    { name: t.upgradeConditions, id: 'upgrade-conditions' },
    { name: t.matrixRules, id: 'matrix-rules' },
    { name: t.differentialBonus, id: 'differential-bonus' },
    { name: t.calculators, id: 'calculators' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const formatRule = (text: string) => {
    if (!config) return text;
    return text
      .replace('{entryPrice}', config.entryPrice.toString())
      .replace('{currency}', config.currency)
      .replace('{network}', config.networks[0])
      .replace('{maxLevel}', config.maxLevel.toString())
      .replace('{spreadAmount}', (config.entryPrice * 0.1).toString());
  };

  const getSystemRules = () => {
    if (!config?.rulesText) {
      return [
        { 
          title: t.activateSeat, 
          desc: `${config?.entryPrice || 80} ${config?.currency || 'USDT'} entry fee. Grants 1 membership position on the ${config?.networks?.[0] || 'TRON'} network with instant smart contract verification.`,
          icon: Zap,
          color: 'bg-[#CCFF00]'
        },
        { 
          title: t.publicMatrix, 
          desc: t.recursiveRoutingDesc,
          icon: Layers,
          color: 'bg-white'
        },
        { 
          title: t.teamPerformanceTitle, 
          desc: t.teamPerfDesc,
          icon: Users,
          color: 'bg-[#0038FF] text-white'
        }
      ];
    }

    return [
      { 
        title: t.activateSeat, 
        desc: formatRule(config.rulesText.activateSeat),
        icon: Zap,
        color: 'bg-[#CCFF00]'
      },
      { 
        title: t.publicMatrix, 
        desc: formatRule(config.rulesText.publicMatrix),
        icon: Layers,
        color: 'bg-white'
      },
      { 
        title: t.teamPerformanceTitle, 
        desc: formatRule(config.rulesText.teamPerformance),
        icon: Users,
        color: 'bg-[#0038FF] text-white'
      }
    ];
  };

  const calculateEarnings = () => {
    const val = parseFloat(calcInput);
    if (!isNaN(val) && config) {
      // Detailed logic breakdown for Differential Bonus (Extreme Spread)
      const entryPrice = config.entryPrice;
      const matrixShare = val * 0.3; // 30% to global matrix
      const directReward = val * 0.1; // 10% direct acquisition
      const maxSpread = val * 0.1; // 10% max team spread (differential)
      
      // Breakdown for the UI
      setCalcResult(val + matrixShare + directReward + (maxSpread * 0.5)); // 5% average capture
    } else if (!isNaN(val)) {
      setCalcResult(val * 12.5); // Fallback
    }
  };

  return (
    <div className="w-full pb-32">
      {/* Hero Section */}
      <section className="px-6 md:px-10 pt-32 pb-20 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-20"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 bg-[#CCFF00] px-6 py-2 rounded-full border-4 border-black shadow-[8px_8px_0_0_#000] mb-8"
          >
            <Settings className="w-6 h-6 text-black animate-spin-slow" />
            <span className="text-sm font-black uppercase text-black tracking-[0.2em]">Configuration Center</span>
          </motion.div>
          
          <h1 
            className="text-[clamp(2.5rem,8vw,90px)] font-black text-white leading-[0.8] uppercase tracking-tighter mb-8"
            style={{ textShadow: 'clamp(2px, 0.4vw, 6px) clamp(2px, 0.4vw, 6px) 0 #0038FF' }}
          >
            {t.systemRulesTitle.split(' & ').map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br className="hidden md:block"/>}
                <span className={i === 1 ? 'text-[#CCFF00]' : ''}>{part}</span>
                {i === 0 && <span className="text-[#CCFF00]"> & </span>}
              </React.Fragment>
            ))}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 font-bold italic max-w-3xl">
            {t.rulesConfigCenter}
          </p>
        </motion.div>
      </section>

      {/* Sticky Redirector */}
      <div className="sticky top-20 z-40 w-full bg-black/50 backdrop-blur-xl border-y-4 border-black mb-20">
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
        {/* Rule Version Card */}
        <section id="rule-version" className="mb-32">
          <SectionHeader title={t.currentActiveVersion} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#CCFF00] border-4 border-black rounded-[3rem] p-8 md:p-12 shadow-[15px_15px_0_0_#0038FF] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <ShieldCheck className="w-48 h-48 text-black" />
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
              <div className="flex flex-col items-center md:items-start">
                 <p className="text-black font-bold uppercase tracking-widest text-xs opacity-50 mb-2">Version String</p>
                 <h3 className="text-5xl md:text-7xl font-black text-black italic tracking-tighter">{config?.version || 'V2026.04.19'}</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full md:w-auto">
                <div className="bg-black/5 p-6 rounded-2xl border-2 border-black/10">
                   <p className="text-black font-black uppercase text-[10px] tracking-widest mb-1">{t.effectiveDate}</p>
                   <p className="text-2xl font-black text-black">{config?.effectiveTime ? new Date(config.effectiveTime).toISOString().split('T')[0] : '2026.04.19'} / 00:00 UTC</p>
                </div>
                <div className="bg-black/5 p-6 rounded-2xl border-2 border-black/10">
                   <p className="text-black font-black uppercase text-[10px] tracking-widest mb-1">{t.lastUpdated}</p>
                   <p className="text-2xl font-black text-black">{config?.effectiveTime ? new Date(config.effectiveTime).toISOString().split('T')[0] : '2026.04.18'} / 14:22 UTC</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

         {/* Level Structure */}
        <section id="level-structure" className="mb-32">
          <SectionHeader title={t.levelStructure} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {(config?.levelProgression ? config.levelProgression.map(l => ({
               level: `V${l.level}`, 
               req: l.directReq ? (l.reqLevel ? `${l.directReq} V${l.reqLevel}` : `Refer ${l.directReq} members`) : 'Public matrix', 
               reward: `${l.price.toLocaleString()} ${config.currency || 'USDT'}`, 
               bonus: `${l.level > 3 ? l.level - 2 : 0}%` 
            })) : levelData).map((lvl, i) => (
              <motion.div 
                key={lvl.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border-4 border-black rounded-[2rem] p-6 shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#CCFF00] hover:-translate-y-2 transition-all group flex flex-col justify-between aspect-square"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-5xl font-black text-[#0038FF] italic group-hover:text-black transition-colors">{lvl.level}</span>
                  {lvl.bonus !== '0%' && (
                    <div className="bg-[#CCFF00] px-3 py-1 rounded-full border-2 border-black font-black text-[10px] shadow-[2px_2px_0_0_#000]">
                      +{lvl.bonus}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-black/30 tracking-widest mb-1">{t.directRequirement}</p>
                    <p className="text-sm font-black text-black group-hover:text-[#0038FF] transition-colors">{lvl.req}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-black/30 tracking-widest mb-1">{t.rewardAmount}</p>
                    <p className="text-xl font-black text-black">{lvl.reward}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Core Systems */}
        <section id="upgrade-conditions" className="mb-32">
          <SectionHeader title={t.coreEcosystemLogic} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getSystemRules().map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`${item.color} border-4 border-black p-10 rounded-[3rem] shadow-[10px_10px_0_0_#000] flex flex-col gap-6 group hover:shadow-[15px_15px_0_0_#CCFF00] transition-all`}
              >
                <div className="w-16 h-16 rounded-2xl border-4 border-black flex items-center justify-center shadow-[4px_4px_0_0_#000] bg-white group-hover:rotate-12 transition-transform">
                  <item.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter">{item.title}</h3>
                <p className={`text-sm font-bold uppercase tracking-tight ${item.color.includes('white') ? 'text-black/50' : 'opacity-70'}`}>
                  {item.desc}
                </p>
                <button className="mt-4 flex items-center gap-2 font-black uppercase text-xs tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                  {t.learnMoreBtn} <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Matrix Rules Description */}
        <section id="matrix-rules" className="mb-32">
          <SectionHeader title={t.matrixRules || "Matrix Protocol Architecture"} />
          <div className="bg-black border-4 border-white p-10 md:p-16 rounded-[4rem] text-white shadow-[20px_20px_0_0_#0038FF]">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <h4 className="text-3xl font-black uppercase text-[#CCFF00] italic mb-6">{t.recursiveRoutingTitle}</h4>
                  <p className="text-white/60 font-bold leading-relaxed mb-6">
                    {t.recursiveRoutingDesc}
                  </p>
                  <ul className="space-y-4">
                    {[
                      t.onChainSettlement,
                      t.automatedSpillover,
                      t.buybackLogic,
                      t.multiLayerVerification
                    ].map((r, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full"></div>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/5 border-2 border-white/10 p-8 rounded-3xl flex flex-col justify-center">
                   <div className="flex items-center gap-6 mb-8">
                      <div className="text-6xl font-black text-[#CCFF00] italic">80%</div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{t.systemPayoutLabel}</div>
                   </div>
                   <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0038FF] w-[80%]"></div>
                   </div>
                   <p className="mt-8 text-[9px] font-bold text-white/30 uppercase leading-relaxed italic">
                     * {t.zeroReserveModel}
                   </p>
                </div>
             </div>
          </div>
        </section>

        {/* Differential Bonus Explanation */}
        <section id="differential-bonus" className="mb-32">
          <SectionHeader title={t.extremeSpreadTitle} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white border-4 border-black p-8 rounded-[3rem] shadow-[8px_8px_0_0_#000]">
                <h5 className="text-xl font-black uppercase italic mb-4">{t.gapCaptureTitle}</h5>
                <p className="text-[10px] font-bold text-black/50 uppercase leading-relaxed">
                  {t.gapCaptureDesc}
                </p>
             </div>
             <div className="bg-white border-4 border-black p-8 rounded-[3rem] shadow-[8px_8px_0_0_#000]">
                <h5 className="text-xl font-black uppercase italic mb-4">{t.unlimitedDepthTitle}</h5>
                <p className="text-[10px] font-bold text-black/50 uppercase leading-relaxed">
                  {t.unlimitedDepthDesc}
                </p>
             </div>
             <div className="bg-white border-4 border-black p-8 rounded-[3rem] shadow-[8px_8px_0_0_#000]">
                <h5 className="text-xl font-black uppercase italic mb-4">{t.dynamicRecalcTitle}</h5>
                <p className="text-[10px] font-bold text-black/50 uppercase leading-relaxed">
                  {t.dynamicRecalcDesc}
                </p>
             </div>
          </div>
        </section>

        {/* Calculators */}
        <section id="calculators" className="mb-32">
          <SectionHeader title={t.calculators} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Upgrade Path Calculator */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white border-4 border-black rounded-[4rem] p-10 md:p-16 shadow-[15px_15px_0_0_#000] relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                  <Calculator className="w-64 h-64 text-black" />
               </div>
               <div className="relative z-10">
                 <h4 className="text-3xl font-black text-black uppercase italic italic mb-8 flex items-center gap-4">
                   <div className="w-10 h-10 bg-[#CCFF00] rounded-xl border-2 border-black flex items-center justify-center shadow-[3px_3px_0_0_#000]">
                      <BarChart3 className="w-5 h-5 text-black" />
                   </div>
                   {t.upgradeCalculator}
                 </h4>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-2 block">{t.currentRank}</label>
                        <select 
                          value={currRank}
                          onChange={(e) => setCurrRank(parseInt(e.target.value))}
                          className="w-full bg-gray-100 border-2 border-black p-4 rounded-xl font-black uppercase text-xs focus:outline-none focus:ring-4 ring-[#CCFF00]/50 transition-all cursor-pointer"
                        >
                          {config?.levelProgression ? config.levelProgression.map(l => <option key={l.level} value={l.level}>V{l.level}</option>) : levelData.map(l => <option key={l.level} value={l.level}>{l.level}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-2 block">{t.targetRank}</label>
                        <select 
                          value={targetRank}
                          onChange={(e) => setTargetRank(parseInt(e.target.value))}
                          className="w-full bg-gray-100 border-2 border-black p-4 rounded-xl font-black uppercase text-xs focus:outline-none focus:ring-4 ring-[#0038FF]/30 transition-all cursor-pointer"
                        >
                          {config?.levelProgression ? config.levelProgression.map(l => <option key={l.level} value={l.level}>V{l.level}</option>) : levelData.map(l => <option key={l.level} value={l.level}>{l.level}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-2 block">{t.directSeatsLabel}</label>
                        <input 
                           type="number"
                           value={directSeats}
                           onChange={(e) => setDirectSeats(e.target.value)}
                           className="w-full bg-gray-100 border-2 border-black p-4 rounded-xl font-black text-sm focus:outline-none" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-2 block">{t.teamVNodes}</label>
                        <input 
                           type="number"
                           value={teamNodes}
                           onChange={(e) => setTeamNodes(e.target.value)}
                           className="w-full bg-gray-100 border-2 border-black p-4 rounded-xl font-black text-sm focus:outline-none" 
                        />
                      </div>
                    </div>
                    <button 
                      onClick={calculateUpgrade}
                      className="w-full bg-[#0038FF] text-white font-black py-5 rounded-2xl border-4 border-black uppercase tracking-widest shadow-[5px_5px_0_0_#000] hover:bg-[#CCFF00] hover:text-black transition-all active:translate-y-1 active:shadow-none"
                    >
                      {t.analyzeBtn}
                    </button>

                    <AnimatePresence>
                      {upgradeAnalysis && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-6 border-t-2 border-dashed border-black/10 text-center"
                        >
                           <p className="text-[10px] font-black uppercase text-[#0038FF] tracking-widest mb-4 italic">Strategy Output Matrix</p>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-black/5 p-4 rounded-2xl border border-black/5">
                                 <p className="text-[8px] font-black uppercase text-black/40 mb-1">Missing Seats</p>
                                 <p className="text-2xl font-black text-black">{upgradeAnalysis.missingSeats}</p>
                              </div>
                              <div className="bg-black/5 p-4 rounded-2xl border border-black/5">
                                 <p className="text-[8px] font-black uppercase text-black/40 mb-1">Missing Nodes</p>
                                 <p className="text-2xl font-black text-black">{upgradeAnalysis.missingNodes}</p>
                              </div>
                           </div>
                           <p className="mt-4 text-[9px] font-bold text-black/30 uppercase leading-relaxed">Focus on routing direct nodes to higher V-Levels to capture the differential spread.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
               </div>
            </motion.div>

            {/* Earnings Simulator */}
            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="bg-black border-4 border-[#CCFF00] rounded-[4rem] p-10 md:p-16 shadow-[20px_20px_0_0_#CCFF00]"
            >
               <h4 className="text-3xl font-black text-[#CCFF00] uppercase italic mb-8 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl border-2 border-black flex items-center justify-center shadow-[3px_3px_0_0_#000]">
                    <ArrowRightLeft className="w-5 h-5 text-black" />
                  </div>
                  {t.earningsSimulator}
               </h4>
               <div className="space-y-8">
                  <div className="relative">
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-2 block">{t.amountToInvest}</label>
                    <input 
                      type="number" 
                      value={calcInput}
                      onChange={(e) => setCalcInput(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full bg-white/5 border-2 border-[#CCFF00] p-6 pr-20 rounded-2xl font-black text-white text-2xl focus:outline-none focus:bg-white/10 transition-all placeholder:text-white/10"
                    />
                    <div className="absolute right-6 bottom-6 font-black text-white/30 text-lg">{config?.currency || 'USDT'}</div>
                  </div>
                  
                  <button 
                    onClick={calculateEarnings}
                    className="w-full bg-[#CCFF00] text-black font-black py-6 rounded-2xl border-4 border-white uppercase tracking-widest shadow-[0_0_30px_rgba(204,255,0,0.2)] hover:scale-[1.02] transition-all flex items-center justify-center gap-4 group"
                  >
                    Simulate Earnings <Zap className="w-6 h-6 group-hover:scale-125 transition-transform" />
                  </button>

                  <AnimatePresence>
                    {calcResult !== null && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 bg-white/10 rounded-3xl border-2 border-white/20 text-center"
                      >
                         <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-2">Estimated Yield</p>
                         <p className="text-5xl font-black text-[#CCFF00] tracking-tighter">~ {calcResult.toLocaleString()} {config?.currency || 'USDT'}</p>
                         <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-4 italic">* Based on current network velocity and historical spillover metrics.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </motion.div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default System;
