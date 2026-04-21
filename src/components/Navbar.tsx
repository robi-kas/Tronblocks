
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { Menu, X, Globe, ShieldAlert } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from './Tooltip';
import { WalletButton } from './WalletConnect';
import { useMode } from './ModeContext';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { lang, t, toggleLang } = useLanguage();
  const location = useLocation();
  const { mode } = useMode();

  const navLinks = [
    { name: t.home, path: '/' },
    { name: t.system, path: '/system' },
    { name: t.myAccount, path: '/account' },
    { name: t.team, path: '/team' },
    { name: t.earnings, path: '/earnings' },
    { name: t.invite, path: '/invite' },
    { name: t.history, path: '/transactions' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0038FF]/80 backdrop-blur-md border-b border-white/10">
      <nav className="flex items-center justify-between px-4 py-3 md:px-10 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1"
          >
            <div className="bg-white text-black font-black tracking-tight text-xs md:text-sm px-2 md:px-3 py-1 rounded-xl rounded-bl-sm relative shadow-sm group-hover:scale-105 transition-transform">
              TRON
              <div className="absolute -bottom-1.5 left-0 w-3 h-3 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
            </div>
            <div className="bg-[#CCFF00] text-black font-black text-xs md:text-sm px-2 md:px-3 py-1 rounded-full border-[1.5px] border-white shadow-sm group-hover:scale-105 transition-transform">
              BLOCK
            </div>
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-2">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`px-3 py-1.5 rounded-full border ${location.pathname === link.path ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'border-white/30 text-white hover:bg-white/10'} text-[10px] font-bold transition-all uppercase tracking-wider whitespace-nowrap`}
            >
              {link.name}
            </Link>
          ))}
          {/* Admin Tools Menu Item */}
          {(mode === 'ADMIN' || mode === 'TEST') && (
            <Link 
              to="/admin" 
              className={`px-3 py-1.5 rounded-full border border-red-500 bg-red-500/20 text-white hover:bg-red-500 text-[10px] font-bold transition-all uppercase tracking-wider whitespace-nowrap flex items-center gap-1`}
            >
              <ShieldAlert className="w-3 h-3" />
              Admin
            </Link>
          )}

          <div className="h-4 w-px bg-white/20 mx-1"></div>
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 px-2 py-1.5 text-white/70 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === 'en' ? 'EN / 中文' : '中文 / EN'}
          </button>
          <div className="ml-2 scale-90 origin-right">
            <WalletButton />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors relative z-50 cursor-pointer"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 w-full h-screen bg-[#0038FF] border-t border-white/10 pt-20 pb-12 px-6 shadow-2xl z-40 lg:hidden flex flex-col justify-between overflow-y-auto"
            >
              <div className="flex flex-col space-y-6 mt-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-2xl font-black ${location.pathname === link.path ? 'text-[#CCFF00]' : 'text-white'} hover:text-[#CCFF00] transition-colors uppercase tracking-tight`}
                  >
                    {link.name}
                  </Link>
                ))}

                {(mode === 'ADMIN' || mode === 'TEST') && (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-2xl font-black text-red-400 hover:text-red-300 transition-colors uppercase tracking-tight flex items-center gap-2`}
                  >
                    <ShieldAlert className="w-6 h-6" />
                    Admin Panel
                  </Link>
                )}
                
                <div className="h-px w-full bg-white/20 my-2"></div>
                
                <button 
                  onClick={toggleLang}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-xl font-bold uppercase cursor-pointer"
                >
                  <Globe className="w-6 h-6" />
                  {lang === 'en' ? 'EN / 中文' : '中文 / EN'}
                </button>
              </div>
              
              <div className="w-full mt-auto pt-8 pb-10" onClick={() => setIsMenuOpen(false)}>
                <WalletButton expanded />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
