
import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';
import { Tooltip } from '../components/Tooltip';
import { ArrowGreenLeft, ArrowGreenRight, ArrowBlack1, ArrowBlack2 } from '../components/ui/Icons';
import { WalletButton } from '../components/WalletConnect';
import { useAccount } from 'wagmi';
import { useSystemConfig } from '../components/ConfigContext';

const CircularBadge = ({ t, lang }: { t: any, lang: string }) => (
  <div className="w-32 h-32 md:w-44 md:h-44 relative flex items-center justify-center rotate-[12deg] hover:rotate-0 hover:scale-110 transition-all duration-500 cursor-pointer group">
    <div className="absolute inset-0 bg-black/30 rounded-full blur-xl translate-y-4 translate-x-2 group-hover:translate-y-8 group-hover:translate-x-4 transition-transform"></div>
    <div 
      className="absolute inset-[-6px] bg-white" 
      style={{ 
        clipPath: 'polygon(50% 0%, 58% 8%, 66% 2%, 72% 10%, 82% 6%, 86% 16%, 95% 14%, 93% 24%, 100% 30%, 95% 40%, 98% 50%, 93% 60%, 96% 70%, 89% 78%, 91% 88%, 81% 90%, 78% 98%, 68% 94%, 62% 100%, 52% 94%, 42% 100%, 36% 94%, 26% 98%, 23% 90%, 13% 88%, 15% 78%, 8% 70%, 11% 60%, 6% 50%, 9% 40%, 4% 30%, 11% 24%, 9% 14%, 18% 16%, 22% 6%, 32% 10%, 38% 2%, 46% 8%)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
      }}
    ></div>
    <div 
      className="absolute inset-[0px] bg-black" 
      style={{ 
        clipPath: 'polygon(50% 0%, 58% 8%, 66% 2%, 72% 10%, 82% 6%, 86% 16%, 95% 14%, 93% 24%, 100% 30%, 95% 40%, 98% 50%, 93% 60%, 96% 70%, 89% 78%, 91% 88%, 81% 90%, 78% 98%, 68% 94%, 62% 100%, 52% 94%, 42% 100%, 36% 94%, 26% 98%, 23% 90%, 13% 88%, 15% 78%, 8% 70%, 11% 60%, 6% 50%, 9% 40%, 4% 30%, 11% 24%, 9% 14%, 18% 16%, 22% 6%, 32% 10%, 38% 2%, 46% 8%)'
      }}
    ></div>
    <div 
      className="absolute inset-[4px] bg-[#CCFF00] group-hover:bg-[#DEFF55] transition-all duration-300" 
      style={{ 
        clipPath: 'polygon(50% 0%, 58% 8%, 66% 2%, 72% 10%, 82% 6%, 86% 16%, 95% 14%, 93% 24%, 100% 30%, 95% 40%, 98% 50%, 93% 60%, 96% 70%, 89% 78%, 91% 88%, 81% 90%, 78% 98%, 68% 94%, 62% 100%, 52% 94%, 42% 100%, 36% 94%, 26% 98%, 23% 90%, 13% 88%, 15% 78%, 8% 70%, 11% 60%, 6% 50%, 9% 40%, 4% 30%, 11% 24%, 9% 14%, 18% 16%, 22% 6%, 32% 10%, 38% 2%, 46% 8%)'
      }}
    ></div>
    <div className="absolute inset-4 border-2 border-black/5 rounded-full animate-[spin_12s_linear_infinite]">
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-30 group-hover:opacity-100 transition-opacity">
        <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
        <text className={`${lang === 'zh' ? 'text-[8.5px]' : 'text-[10px]'} font-black tracking-[0.15em] uppercase`} fill="black">
          <textPath href="#circlePath" startOffset="0%">
            • {t.badgeText1} • {t.badgeText2} • 
          </textPath>
        </text>
      </svg>
    </div>
    <div className="absolute inset-0 flex flex-col items-center justify-center leading-none pointer-events-none -translate-y-2 md:-translate-y-4">
        <span className="font-black text-4xl md:text-7xl italic text-black -mb-1 relative z-10 drop-shadow-md select-none group-hover:scale-110 transition-transform">V10</span>
        <span className="font-black text-[9px] md:text-xs text-black/50 uppercase tracking-[0.3em] relative z-10 select-none">{t.limit}</span>
    </div>
    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-25deg] group-hover:left-[200%] transition-all duration-1000 pointer-events-none"></div>
  </div>
);

const PricingCard = ({ type, t, config }: { type: 'seat' | 'cycle', t: any, config?: any }) => (
  <div className="w-full max-w-[180px] aspect-[1/1.3] bg-white border-[3px] border-black rounded-3xl p-5 flex flex-col items-center justify-center shadow-[10px_10px_0_#001A99] hover:shadow-[15px_15px_0_#CCFF00] hover:-translate-y-2 hover:-translate-x-1 transition-all duration-300 overflow-hidden relative group cursor-crosshair">
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]"></div>
    <div className={`w-14 h-14 md:w-22 md:h-22 ${type === 'seat' ? 'bg-[#CCFF00]' : 'bg-[#0038FF]'} rounded-2xl border-2 border-black mb-4 flex flex-col items-center justify-center overflow-hidden shadow-[4px_4px_0_black] group-hover:rotate-6 transition-transform relative`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        {type === 'seat' ? (
          <span className="text-[#0038FF] font-black text-2xl md:text-4xl pt-0.5 relative z-10 select-none">{config?.entryPrice || 80}</span>
        ) : (
          <>
            <span className="text-white font-black text-xl md:text-3xl relative z-10 select-none">{(config?.entryPrice || 80) * 8}</span>
            <span className="text-[8px] font-black text-[#CCFF00] relative z-10 tracking-widest">MAX</span>
          </>
        )}
    </div>
    <div className="flex flex-col items-center gap-1.5 md:gap-2">
      <p className="font-black text-[12px] md:text-sm text-black whitespace-nowrap uppercase italic tracking-tighter">
        {type === 'seat' ? t.seatPrice : t.firstCycle}
      </p>
      <div className={`${type === 'seat' ? 'bg-black text-[#CCFF00]' : 'bg-[#0038FF] text-white'} px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-black/10`}>
        {type === 'seat' ? `USDT • BSC/${t.tron || 'TRON'}` : 'UP TO V10'}
      </div>
    </div>
    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-black/5 rounded-full blur-xl pointer-events-none"></div>
  </div>
);

const NetworkSection = ({ t }: { t: any }) => (
  <section className="bg-transparent py-20 px-6 md:px-10 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,#CCFF0030_0%,transparent_50%)]"></div>
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col lg:flex-row items-end justify-between gap-10 mb-16">
        <div className="max-w-2xl text-center lg:text-left">
          <h2 className="text-[clamp(2.5rem,6vw,80px)] font-black text-white leading-none uppercase tracking-tighter mb-6">
            {t.multiChainTitle}
          </h2>
          <p className="text-xl text-[#CCFF00] font-bold italic">
            {t.multiChainSub}
          </p>
        </div>
        <div className="hidden lg:flex flex-col items-end">
           <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-6 flex items-center gap-6 shadow-2xl">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center border-4 border-[#0038FF] z-30 shadow-lg p-2.5">
                  <img src="https://cryptologos.cc/logos/tron-trx-logo.svg" alt="TRX" className="w-full h-full object-contain" />
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#F3BA2F] flex items-center justify-center border-4 border-[#0038FF] z-20 shadow-lg p-2.5">
                  <img src="https://cryptologos.cc/logos/bnb-bnb-logo.svg" alt="BNB" className="w-full h-full object-contain" />
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#627EEA] flex items-center justify-center border-4 border-[#0038FF] z-10 shadow-lg p-2.5">
                  <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="w-full h-full object-contain" />
                </div>
              </div>
              <p className="text-white font-black text-sm uppercase tracking-widest">{t.networks}</p>
           </div>
        </div>
      </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {[
            { name: t.tronNetwork || 'TRON NETWORK', symbol: 'TRX', color: 'bg-white', text: '#0038FF', desc: t.tronDesc },
            { name: t.bnbChain || 'BNB CHAIN', symbol: 'BSC', color: 'bg-[#F3BA2F]', text: 'white', desc: t.bnbDesc },
            { name: t.ethereum || 'ETHEREUM', symbol: 'ETH', color: 'bg-[#627EEA]', text: 'white', desc: t.ethDesc }
          ].map((net, i) => (
          <motion.div 
            key={net.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-white border-4 border-black p-8 rounded-[2rem] shadow-[10px_10px_0_0_#000] hover:shadow-[15px_15px_0_0_#CCFF00] hover:-translate-y-2 hover:-translate-x-1 transition-all cursor-pointer overflow-hidden"
          >
            <div className={`w-16 h-16 ${net.color} rounded-2xl border-2 border-black mb-6 flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform`}>
              <span className="font-black text-xl" style={{ color: net.text }}>{net.symbol}</span>
            </div>
            <h4 className="text-2xl font-black text-black mb-3 italic tracking-tight">{net.name}</h4>
            <p className="text-sm font-bold text-black/50 leading-relaxed uppercase tracking-tight">
              {net.desc}
            </p>
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-8 h-8 text-[#0038FF]" strokeWidth={4} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Home = () => {
  const { lang, t } = useLanguage();
  const { scrollY } = useScroll();
  const { isConnected } = useAccount();
  const { config } = useSystemConfig();
  const navigate = useNavigate();
  
  const titleY = useTransform(scrollY, [0, 500], [0, -100]);
  const subtextY = useTransform(scrollY, [0, 500], [0, -50]);
  const arrowOpacity = useTransform(scrollY, [0, 200], [0.7, 0.1]);
  const stickerScale = useTransform(scrollY, [0, 500], [1, 0.8]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-start w-full px-4 md:px-10 pt-20 md:pt-24 pb-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1 backdrop-blur-sm mb-8 md:mb-12 z-30 relative shadow-lg"
        >
            <span className="text-[#CCFF00] font-bold text-[10px] md:text-[12px] uppercase tracking-widest">{t.ruleVersion} {config?.version || 'V2026.04.19'}</span>
        </motion.div>

        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center z-10">
          <motion.div 
            style={{ y: titleY }} 
            className={`flex flex-col items-center relative z-10 ${lang === 'zh' ? 'space-y-4' : '-space-y-2 md:-space-y-4'} px-4 w-full`}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full flex justify-center relative z-30"
            >
              <h1 
                className="text-[clamp(3rem,8vw,90px)] font-display font-black leading-[0.9] tracking-tighter text-[#CCFF00] m-0 p-0 uppercase select-none text-center drop-shadow-md"
              >
                {t.empower}
              </h1>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full flex justify-center relative z-20"
            >
              <h1 
                className="text-[clamp(3.5rem,12vw,130px)] font-display font-black leading-[0.9] tracking-tighter text-white m-0 p-0 uppercase select-none text-center drop-shadow-md"
              >
                TRONBLOCK
              </h1>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full flex justify-center relative z-10"
            >
              <h1 
                className="text-[clamp(3rem,8vw,90px)] font-display font-black leading-[0.9] tracking-tighter text-white m-0 p-0 uppercase select-none text-center drop-shadow-md"
              >
                {t.matrix}
              </h1>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ y: subtextY }}
            className="relative z-30 mt-8 flex flex-col items-center max-w-3xl px-4"
          >
              <p className="text-white/90 text-sm md:text-xl font-bold mb-8 text-center leading-relaxed" style={{ textShadow: '0px 2px 20px rgba(0,0,0,0.8)'}}>
                  {t.subtext}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto">
                  <Tooltip content={t.tooltipConnect}>
                    {isConnected ? (
                      <button 
                        onClick={() => navigate('/account')}
                        className="px-8 py-4 md:px-12 md:py-5 rounded-xl md:rounded-2xl bg-[#CCFF00] text-black text-xs md:text-lg font-black uppercase tracking-widest shadow-[0_0_30px_rgba(204,255,0,0.3)] md:shadow-[0_0_50px_rgba(204,255,0,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                      >
                        {t.launchMatrix} <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={3} />
                      </button>
                    ) : (
                      <WalletButton expanded />
                    )}
                  </Tooltip>
                  <Tooltip content={t.tooltipReview}>
                    <button 
                      onClick={() => navigate('/system')}
                      className="px-8 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl border-2 md:border-4 border-white bg-transparent text-white text-xs md:text-lg font-black uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                    >
                        {t.readRules}
                    </button>
                  </Tooltip>
              </div>

              <div className="flex xl:hidden gap-4 mt-16 mb-8 justify-center w-full relative h-48 scale-[0.85] origin-center z-40">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }} className="relative z-20">
                    <PricingCard type="seat" t={t} />
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }} className="relative z-10">
                    <PricingCard type="cycle" t={t} />
                </motion.div>
              </div>
          </motion.div>

          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-visible hidden xl:block perspective-[1200px]">
            <motion.div 
              initial={{ opacity: 0, y: 0, rotate: -8 }}
              animate={{ opacity: 1 }}
              whileHover={{ rotateY: 15, rotateX: -10, scale: 1.05, z: 150, boxShadow: "0 40px 80px rgba(0,0,0,0.3)" }}
              className="absolute top-[0%] left-[-20%] z-30 pointer-events-auto transform-style-3d cursor-pointer"
            >
              <PricingCard type="seat" t={t} />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 0, rotate: 10 }}
              animate={{ opacity: 1 }}
              whileHover={{ rotateY: -15, rotateX: 10, scale: 1.05, z: 150, boxShadow: "0 40px 80px rgba(0,0,0,0.3)" }}
              className="absolute top-[10%] right-[-20%] z-30 pointer-events-auto transform-style-3d cursor-pointer"
            >
              <PricingCard type="cycle" t={t} />
            </motion.div>
            <motion.div style={{ opacity: arrowOpacity }} className="absolute bottom-[20%] left-[-15%] z-20 flex items-center justify-center scale-90">
              <ArrowGreenLeft />
            </motion.div>
            <motion.div style={{ opacity: arrowOpacity }} className="absolute top-[5%] right-[-10%] z-20 flex items-center justify-center scale-90">
              <ArrowGreenRight />
            </motion.div>
            <motion.div style={{ scale: stickerScale }} className="absolute right-[-100%] bottom-[10%] z-40 pointer-events-auto">
              <Tooltip content={t.tooltipV10}>
                <CircularBadge t={t} lang={lang} />
              </Tooltip>
            </motion.div>
          </div>
          
          {/* Mobile badges and arrows */}
          <div className="block xl:hidden w-full relative h-[300px] mt-8 pointer-events-none overflow-visible">
            <motion.div style={{ opacity: arrowOpacity }} className="absolute top-[10%] left-[-5%] z-10 flex items-center justify-center scale-50 origin-left">
              <ArrowGreenLeft />
            </motion.div>
            <motion.div style={{ opacity: arrowOpacity }} className="absolute top-[10%] right-[-5%] z-10 flex items-center justify-center scale-50 origin-right">
              <ArrowGreenRight />
            </motion.div>
            <motion.div className="absolute right-0 bottom-[-10%] z-40 pointer-events-auto scale-75 origin-bottom-right">
              <Tooltip content={t.tooltipV10}>
                <CircularBadge t={t} lang={lang} />
              </Tooltip>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Bottom Features */}
      <section className="bg-white text-black rounded-t-[3rem] px-6 py-12 md:px-10 lg:py-20 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.2)] w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <motion.div whileHover={{ y: -10 }} className="bg-[#F1F3F5] rounded-3xl p-6 flex flex-col items-center text-center relative h-auto md:h-48 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <h3 className="text-lg uppercase leading-tight mb-2 font-black italic">{t.activateSeat.split(' ').slice(0, 1)}<br/>{t.activateSeat.split(' ').slice(1).join(' ')}</h3>
            <p className="text-[9px] text-black/50 font-bold mb-6 md:mb-4 uppercase tracking-tighter">{t.payUsdt}</p>
            <div className="w-full flex items-center bg-[#0038FF] rounded-xl p-2 text-white relative z-10 mt-auto shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-6 h-6 bg-[#CCFF00] rounded-full mr-3 flex items-center justify-center flex-shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-[#0038FF]" strokeWidth={3} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[9px] font-bold text-[#CCFF00] tracking-wider">{t.onChain}</p>
                <p className="text-[7px] opacity-80 uppercase mt-0.5">{t.membership}</p>
              </div>
            </div>
            <div className="hidden md:block absolute -right-8 bottom-1/2 translate-y-1/2 w-10 h-10 z-30"><ArrowBlack1 /></div>
          </motion.div>
          <motion.div whileHover={{ y: -10 }} className="bg-[#F1F3F5] rounded-3xl p-6 flex flex-col items-center text-center relative h-auto md:h-48 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <h3 className="text-lg uppercase leading-tight mb-2 font-black italic">{t.publicMatrix.split(' ').slice(0, 1)}<br/>{t.publicMatrix.split(' ').slice(1).join(' ')}</h3>
            <p className="text-[9px] text-black/50 font-bold mb-6 md:mb-4 uppercase tracking-tighter">{t.earnSystem}</p>
            <div className="flex items-center justify-center bg-[#CCFF00] rounded-full px-6 py-2.5 border-2 border-black/5 mt-auto shadow-sm w-full relative z-10 group-hover:scale-105 transition-transform">
               <span className="text-xs font-black uppercase tracking-wider tracking-[0.1em]">{t.globalHub}</span>
               <div className="absolute -bottom-3 right-4 bg-white rounded-full p-1.5 shadow-md transform rotate-12 flex items-center justify-center">
                   <ArrowUpRight className="w-3 h-3 text-[#0038FF]" strokeWidth={4} />
               </div>
            </div>
            <div className="hidden md:block absolute -right-8 bottom-1/2 translate-y-1/2 w-10 h-10 z-30"><ArrowBlack2 /></div>
          </motion.div>
          <motion.div whileHover={{ y: -10 }} className="bg-[#F1F3F5] rounded-3xl p-6 flex flex-col items-center text-center relative h-auto md:h-48 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <h3 className="text-lg uppercase leading-tight mb-2 font-black italic">{t.teamPerf.split(' ').slice(0, 1)}<br/>{t.teamPerf.split(' ').slice(1).join(' ')}</h3>
            <p className="text-[9px] text-black/50 font-bold mb-6 md:mb-4 uppercase tracking-tighter">{t.progressV1}</p>
            <div className="bg-white rounded-xl px-4 py-3 border border-black/5 shadow-sm mt-auto w-full relative z-10 flex flex-col items-center group-hover:scale-105 transition-transform">
               <p className="text-[14px] font-black text-[#0038FF] tracking-widest">V1 &rarr; V10</p>
               <p className="text-[8px] uppercase font-bold opacity-40 tracking-wider">{t.unlockRewards}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="w-full bg-[#CCFF00] py-5 border-y-[4px] border-black relative z-20 flex overflow-hidden">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 15, ease: "linear", repeat: Infinity }} className="flex whitespace-nowrap items-center w-max">
          {Array.from({ length: 12 }).map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-2xl md:text-3xl font-black uppercase text-black px-6 tracking-tighter">{t.marquee1}</span>
              <span className="text-xl md:text-2xl font-black text-black opacity-50">◆</span>
              <span className="text-2xl md:text-3xl font-black uppercase text-black px-6 tracking-tighter">{t.marquee2}</span>
              <span className="text-xl md:text-2xl font-black text-black opacity-50">◆</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      <NetworkSection t={t} />

      {/* Levels */}
      <section className="bg-white text-black px-6 pt-10 pb-16 md:px-10 relative z-20 w-full border-b-[8px] border-black shadow-[0_20px_0_0_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-16 lg:mb-24">
            <motion.h2 initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-[clamp(2.5rem,8vw,100px)] font-black leading-[0.85] uppercase tracking-tighter text-black mb-6" style={{ textShadow: 'clamp(2px, 0.4vw, 5px) clamp(2px, 0.4vw, 5px) 0 #CCFF00' }}>
              {t.levelProg}
            </motion.h2>
            <p className="max-w-2xl text-black/70 font-bold uppercase tracking-widest text-[10px] md:text-sm mt-4 leading-relaxed">{t.climbRanks}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-[#F1F3F5] rounded-3xl p-6 md:p-8 border-2 border-black/10 hover:border-black hover:bg-[#CCFF00] hover:shadow-[8px_8px_0_#0038FF] hover:-translate-y-2 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all duration-300 group cursor-pointer flex flex-col justify-between aspect-square relative overflow-hidden">
                <div className="text-[#0038FF] font-black text-5xl md:text-7xl group-hover:text-black tracking-tighter transition-colors">V{i+1}</div>
                <div className="mt-auto relative z-10 w-full flex items-center justify-between">
                   <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-black/30 group-hover:text-black/60">{t.tier} {i+1}</p>
                   <div className="bg-black/5 group-hover:bg-black/10 rounded-full p-1.5 transition-colors"><ArrowUpRight className="w-5 h-5 text-black/20 group-hover:text-black transition-colors" strokeWidth={3} /></div>
                </div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 text-black/5 opacity-0 group-hover:opacity-20 transition-all duration-500 group-hover:scale-150 rotate-12">
                    <svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0L100 50L50 100L0 50Z" /></svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white px-6 pt-32 pb-16 md:px-10 relative z-20 w-full overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none z-0"></div>
        <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[clamp(2.5rem,8vw,100px)] font-black leading-[0.8] text-center uppercase tracking-tighter text-white mb-16" style={{ textShadow: 'clamp(2px, 0.4vw, 5px) clamp(2px, 0.4vw, 5px) 0 #0038FF' }}>
            {t.seatYours.split(' ').slice(0, 3).join(' ')}<br/><span className="text-[#CCFF00]">{t.seatYours.split(' ').slice(3).join(' ')}</span>
          </motion.h2>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-12 py-6 rounded-2xl bg-[#CCFF00] text-black text-sm md:text-lg font-black uppercase tracking-widest shadow-[0_0_50px_rgba(204,255,0,0.3)] hover:shadow-[0_0_70px_rgba(204,255,0,0.5)] transition-all flex items-center justify-center gap-4 cursor-pointer group">
              {t.launchMatrix} <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={3} />
          </motion.button>
          <div className="w-full mt-12 md:mt-16 pt-12 border-t border-white/10 flex flex-col lg:row items-center justify-between gap-10">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex items-center gap-1">
                 <div className="bg-[#CCFF00] text-black font-black text-xs px-3 py-1 rounded-sm">TRON</div>
                 <div className="text-white font-black text-xs uppercase tracking-widest">BLOCK</div>
              </div>
              <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest text-center whitespace-nowrap">© 2026 TronBlock.cc · {t.builtOn}</p>
            </div>
            <div className="flex gap-10">
              {[
                { name: t.readRules, path: '/system' },
                { name: t.telegram, path: '#' },
                { name: t.twitter, path: '#' },
                { name: t.contract, path: '#' }
              ].map(link => (
                <button 
                  key={link.name} 
                  onClick={() => link.path.startsWith('/') ? navigate(link.path) : window.open(link.path)} 
                  className="text-[10px] font-black text-white/40 hover:text-[#CCFF00] uppercase tracking-[0.2em] transition-all hover:-translate-y-0.5"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
