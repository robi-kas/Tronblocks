
import React, { ReactNode } from 'react';
import { useLanguage } from './LanguageContext';
import { useSystemConfig } from './ConfigContext';
import { useMode } from './ModeContext';
import { Navbar } from './Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { Info, AlertTriangle, Settings, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'sonner';

const DebugPanel = () => {
  const { mode } = useMode();
  const { config } = useSystemConfig();
  const [isOpen, setIsOpen] = React.useState(false);

  if (mode === 'PRODUCTION') return null;

  return (
    <div className="fixed bottom-24 right-6 z-[100]">
      <motion.button 
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-black border-4 border-[#CCFF00] rounded-2xl flex items-center justify-center shadow-[5px_5px_0_0_#000] group"
      >
        <Settings className="w-8 h-8 text-[#CCFF00] group-hover:rotate-90 transition-transform" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-80 bg-black border-4 border-[#CCFF00] rounded-[2rem] p-6 text-white shadow-[15px_15px_0_0_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-3 mb-6">
               <Activity className="w-5 h-5 text-[#CCFF00]" />
               <h3 className="text-sm font-black uppercase tracking-widest italic">Diagnostic Terminal</h3>
            </div>
            
            <div className="space-y-4">
               <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[8px] font-black uppercase text-white/40 tracking-widest mb-1">Environment Mode</p>
                  <p className="text-xs font-black text-[#CCFF00]">{mode}</p>
               </div>
               <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[8px] font-black uppercase text-white/40 tracking-widest mb-1">Config Engine</p>
                  <p className="text-xs font-black text-white">{config?.version || 'Syncing...'}</p>
               </div>
               <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[8px] font-black uppercase text-white/40 tracking-widest mb-1">Simulation State</p>
                  <p className="text-xs font-black text-green-400">NOMINAL / READ-WRITE</p>
               </div>
               <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[8px] font-black uppercase text-white/40 tracking-widest mb-1">Last Matrix Sync</p>
                  <p className="text-xs font-black text-white/60">JUST NOW</p>
               </div>
            </div>
            
            <button className="w-full mt-6 py-3 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-[10px] rounded-xl border-2 border-white shadow-[3px_3px_0_0_rgba(255,255,255,0.2)]">
               Flush Sync Cache
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GlobalBanners = () => {
  const { data: banners } = useQuery({
    queryKey: ['activeBanners'],
    queryFn: async () => {
      const res = await fetch('/api/banners');
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 30000 // refresh every 30s
  });

  if (!banners || banners.length === 0) return null;

  return (
    <div className="w-full flex justify-center z-40 fixed top-[80px] px-4 pointer-events-none">
      <div className="flex flex-col gap-2 max-w-4xl w-full pointer-events-auto">
        <AnimatePresence>
          {banners.map((b: any) => {
            const isError = b.type === 'error';
            const isWarn = b.type === 'warning';
            
            return (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} key={b.id}>
                <div className={`p-3 rounded-xl border-2 border-black flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_0_#000] text-center ${isError ? 'bg-red-500 text-white' : isWarn ? 'bg-yellow-400 text-black' : 'bg-blue-500 text-white'}`}>
                  {isError ? <AlertTriangle className="w-5 h-5 shrink-0" /> : isWarn ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <Info className="w-5 h-5 shrink-0" />}
                  {b.message}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const BackgroundParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5
          }}
          animate={{
            y: ["0%", "100%"],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        />
      ))}
      {/* Matrix Horizontal Lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute left-0 right-0 h-px bg-white/[0.03]"
          style={{ top: (i + 1) * 20 + "%" }}
          animate={{
            x: ["-100%", "100%"]
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export const CookieConsent = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:w-96 bg-white border-4 border-black p-6 rounded-3xl shadow-[10px_10px_0_0_#000] z-[100] flex flex-col gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="bg-[#CCFF00] p-2 rounded-xl border-2 border-black shadow-[3px_3px_0_0_#000]">
              <Info className="w-5 h-5 text-black" />
            </div>
            <p className="text-xs font-black uppercase text-black leading-tight italic">
              {t.cookieText}
            </p>
          </div>
          <button
            onClick={acceptCookies}
            className="w-full bg-[#0038FF] text-white font-black py-3 rounded-xl border-2 border-black uppercase tracking-widest text-xs hover:bg-[#CCFF00] hover:text-black transition-all active:scale-95 cursor-pointer shadow-[4px_4px_0_0_#000]"
          >
            {t.accept}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useLanguage();
  const { config } = useSystemConfig();
  const bgColor = 'bg-[#0038FF]';

  return (
    <div className={`min-h-screen ${bgColor} flex flex-col font-sans selection:bg-[#CCFF00] selection:text-black relative overflow-x-hidden w-full transition-colors duration-700`}>
      {/* Background Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:2rem_2rem] md:bg-[size:4rem_4rem] pointer-events-none z-0"
        style={{ 
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 90%)'
        }}
      ></div>
      
      <BackgroundParticles />
      <Navbar />
      <GlobalBanners />
      
      <main className="flex-1 relative z-10 w-full">
        {children}
      </main>

      {/* Global Footer */}
      <footer className="bg-black text-white px-6 py-12 md:px-10 relative z-20 w-full border-t-4 border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
             <div className="flex items-center gap-2">
                <div className="bg-[#CCFF00] text-black font-black text-[10px] px-3 py-1 rounded-sm shadow-[2px_2px_0_0_#FFF]">TRON</div>
                <div className="text-white font-black text-xs uppercase tracking-widest">BLOCK MATRIX</div>
             </div>
             <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] leading-normal text-center md:text-left">
                RULE VERSION: {config?.version || 'V2026.04.19'} <br className="md:hidden" />
                <span className="mx-4 hidden md:inline opacity-10">|</span>
                EFFECTIVE SINCE: {config?.effectiveTime ? new Date(config.effectiveTime).toISOString().split('T')[0] : '2026-04-19'}
             </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
             <button className="text-[10px] font-black uppercase text-white/40 hover:text-[#CCFF00] tracking-widest transition-colors">Risk Disclaimer</button>
             <button className="text-[10px] font-black uppercase text-white/40 hover:text-[#CCFF00] tracking-widest transition-colors">Smart Contract</button>
             <button className="text-[10px] font-black uppercase text-white/40 hover:text-[#CCFF00] tracking-widest transition-colors">Audit Report</button>
          </div>

          <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 group hover:border-[#CCFF00] transition-colors">
             <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></div>
             <span className="text-[9px] font-bold uppercase text-white/60 tracking-widest group-hover:text-white transition-colors">{t.builtOn || 'DECIDED BY SMART CONTRACT'}</span>
          </div>
        </div>
      </footer>

      <CookieConsent />
      <DebugPanel />
      <Toaster position="bottom-right" theme="dark" toastOptions={{ style: { background: 'black', color: '#CCFF00', border: '2px solid #CCFF00', borderRadius: '1rem', textTransform: 'uppercase', fontWeight: 900, fontSize: '10px', letterSpacing: '0.1em' } }} />
    </div>
  );
};
