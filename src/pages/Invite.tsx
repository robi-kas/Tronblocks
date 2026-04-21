
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount } from 'wagmi';
import { useLanguage } from '../components/LanguageContext';
import { toast } from 'sonner';
import { 
  Share2, 
  Copy, 
  Check, 
  ChevronRight,
  Lock, 
  Unlock, 
  QrCode, 
  Image as ImageIcon, 
  Send, 
  Twitter, 
  MessageCircle,
  HelpCircle,
  Users,
  Zap,
  ArrowUpRight,
  FileText,
  ExternalLink
} from 'lucide-react';

const Invite = () => {
  const { t } = useLanguage();
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);
  const [copiedPostId, setCopiedPostId] = useState<number | null>(null);
  
  const baseUrl = window.location.origin;
  const referralLink = address ? `${baseUrl}/join?ref=${address}` : `${baseUrl}/join`;

  const copyToClipboard = (text: string, type: 'link' | 'post', id?: number) => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopied(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else if (id !== undefined) {
      setCopiedPostId(id);
      toast.success("Marketing post copied!");
      setTimeout(() => setCopiedPostId(null), 2000);
    }
  };

  const marketingPosts = [
    {
      id: 1,
      title: "The Financial Revolution",
      content: "🚀 Join the future of decentralized finance with TronBlock. Earn up to 20% commission on referrals and build your own matrix. Secure, transparent, and built on the blockchain. \n\nJoin here: " + referralLink
    },
    {
      id: 2,
      title: "Matrix Passive Income",
      content: "💎 Looking for passive income? TronBlock is the answer. Our matrix protocol ensures rewards flow through the community. No middlemen, just smart contracts. \n\nGet started: " + referralLink
    },
    {
      id: 3,
      title: "Built on Ethereum/BNB",
      content: "⛓️ The biggest mechanism of the project is the referrer. Secure your spot in the matrix today. \n\nRegister now: " + referralLink
    }
  ];

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
            <Share2 className="w-5 h-5 text-black" />
            <span className="text-xs font-black uppercase text-black tracking-[0.2em]">Affiliate Network</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(2.5rem,8vw,80px)] font-black text-white leading-[0.8] uppercase tracking-tighter mb-8"
            style={{ textShadow: 'clamp(2px, 0.4vw, 5px) clamp(2px, 0.4vw, 5px) 0 #0038FF' }}
          >
            {t.inviteEarn}
          </motion.h1>

          <div className="w-full max-w-2xl mt-10 text-center flex flex-col items-center">
             <p className="text-[#CCFF00] font-black uppercase tracking-[0.2em] text-[10px] mb-4">{t.referralLink}</p>
             <div className="bg-white border-4 border-black p-2 rounded-2xl md:rounded-[2rem] shadow-[10px_10px_0_0_#0038FF] flex items-center gap-2 group w-full">
                <div className="flex-1 px-6 overflow-hidden text-left">
                   <p className="text-black font-black text-xs md:text-xl truncate tracking-tight uppercase italic">{referralLink}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(referralLink, 'link')}
                  className="bg-[#0038FF] text-white px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-[#CCFF00] hover:text-black transition-all active:scale-95 shadow-[4px_4px_0_0_black] shrink-0"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> <span>COPIED</span>
                      </motion.div>
                    ) : (
                      <motion.div key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2">
                        <Copy className="w-4 h-4" /> <span>{t.copyLink}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
             </div>
             {!address && <p className="mt-4 text-red-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">Connect wallet to activate personal link</p>}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Stats & Marketing Posts */}
        <div className="space-y-12">
           {/* Marketing Posts Section */}
           <div>
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-[#0038FF] rounded-xl border-2 border-black flex items-center justify-center shadow-[3px_3px_0_0_#000]">
                    <FileText className="w-5 h-5 text-white" />
                 </div>
                 <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Social Posts</h2>
              </div>
              <div className="space-y-6">
                 {marketingPosts.map((post) => (
                    <motion.div 
                      key={post.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="bg-white border-4 border-black p-6 rounded-[2rem] shadow-[8px_8px_0_0_#000] relative group hover:shadow-[12px_12px_0_0_#CCFF00] transition-all"
                    >
                       <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-black text-black uppercase italic tracking-tighter">{post.title}</h4>
                          <button 
                             onClick={() => copyToClipboard(post.content, 'post', post.id)}
                             className="text-black/40 hover:text-[#0038FF] transition-colors"
                          >
                             {copiedPostId === post.id ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                          </button>
                       </div>
                       <p className="text-xs font-bold text-black/60 leading-relaxed uppercase tracking-tight italic">
                          {post.content}
                       </p>
                    </motion.div>
                 ))}
              </div>
           </div>
           {/* Bound Referrer */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="bg-white border-4 border-black p-8 rounded-[3rem] shadow-[10px_10px_0_0_#000] relative overflow-hidden"
           >
              <div className="flex items-start justify-between mb-8">
                 <div>
                    <p className="text-black/40 font-black uppercase text-[10px] tracking-widest mb-1">{t.boundReferrer}</p>
                    <h3 className="text-3xl font-black text-black italic tracking-tighter">TR6yP...f2K9</h3>
                 </div>
                 <div className="flex items-center gap-2 bg-black text-[#CCFF00] px-4 py-1.5 rounded-xl border-2 border-black font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
                    <Lock className="w-3 h-3" /> {t.referralLocked}
                 </div>
              </div>
              <div className="p-4 bg-[#F1F3F5] rounded-2xl border-2 border-black/5 flex items-center gap-4">
                 <div className="w-10 h-10 bg-white rounded-full border-2 border-black flex items-center justify-center">
                    <Zap className="w-5 h-5 text-[#0038FF]" />
                 </div>
                 <p className="text-[10px] font-bold text-black/50 uppercase leading-tight italic">
                    Your referral relationship is secured on the TRON smart contract and cannot be altered once activated.
                 </p>
              </div>
           </motion.div>

           {/* Stats */}
           <div className="grid grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[#0038FF] border-4 border-black p-8 rounded-[3rem] shadow-[8px_8px_0_0_#000] text-white"
              >
                 <Users className="w-8 h-8 text-[#CCFF00] mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{t.peopleInvited}</p>
                 <p className="text-4xl font-black italic tracking-tighter leading-none">124</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white border-4 border-black p-8 rounded-[3rem] shadow-[8px_8px_0_0_#000]"
              >
                 <Zap className="w-8 h-8 text-[#0038FF] mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">{t.successfulActivations}</p>
                 <p className="text-4xl font-black italic tracking-tighter leading-none text-black">86</p>
              </motion.div>
           </div>

           {/* Buyback Rules Card */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-black border-4 border-[#CCFF00] p-8 md:p-10 rounded-[3rem] shadow-[12px_12px_0_0_#CCFF00] relative group"
           >
              <div className="absolute top-4 right-4 text-white/10 group-hover:text-white/20 transition-colors">
                 <HelpCircle className="w-24 h-24 rotate-12" />
              </div>
              <h4 className="text-2xl font-black text-[#CCFF00] uppercase italic mb-6 leading-none flex items-center gap-3">
                 <QrCode className="w-6 h-6" /> {t.buybackRules}
              </h4>
              <p className="text-white/70 font-bold uppercase tracking-tight text-xs leading-relaxed italic relative z-10">
                 {t.buybackExplainer}
              </p>
           </motion.div>
        </div>

        {/* Right Column: Share Tools */}
        <div className="space-y-12">
           <div className="bg-white border-4 border-black rounded-[4rem] p-10 md:p-12 shadow-[15px_15px_0_0_#000] relative overflow-hidden flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-10">
                 <h3 className="text-3xl font-black text-black uppercase italic tracking-tighter leading-none">{t.shareTools}</h3>
                 <div className="w-10 h-10 bg-[#CCFF00] rounded-xl border-2 border-black flex items-center justify-center shadow-[3px_3px_0_0_#000]">
                    <Share2 className="w-5 h-5 text-black" />
                 </div>
              </div>

              {/* Poster Mockup Preview */}
              <div className="w-full max-w-[280px] aspect-[9/16] bg-black rounded-[2rem] border-4 border-black shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden p-6 flex flex-col justify-between group cursor-zoom-in">
                 <div className="absolute inset-0 bg-[#0038FF]/20 mix-blend-overlay group-hover:bg-[#0038FF]/40 transition-colors"></div>
                 
                 {/* Poster Content Mock */}
                 <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-4">
                       <div className="bg-[#CCFF00] text-black font-black text-[8px] px-2 py-0.5 rounded-sm">TRON</div>
                       <div className="text-white font-black text-[8px] uppercase tracking-widest leading-none">BLOCK</div>
                    </div>
                    <h5 className="text-2xl font-black text-white italic leading-tight uppercase select-none">JOIN THE<br/><span className="text-[#CCFF00]">MATRIX</span></h5>
                 </div>

                 <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="bg-white p-4 rounded-2xl border-4 border-[#CCFF00] shadow-xl">
                       <QrCode className="w-24 h-24 text-black" />
                    </div>
                    <p className="text-[#CCFF00] font-black uppercase text-[10px] tracking-[0.2em]">{t.joinWith80}</p>
                 </div>

                 {/* Visual noise/grain */}
                 <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-[length:200px_200px]"></div>
              </div>

              <div className="w-full mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button className="bg-[#0038FF] text-white font-black py-5 rounded-2xl border-4 border-black uppercase tracking-widest text-xs shadow-[6px_6px_0_0_#000] hover:bg-[#CCFF00] hover:text-black transition-all active:translate-y-1 active:shadow-none flex items-center justify-center gap-3">
                    <ImageIcon className="w-5 h-5" />
                    {t.posterGenerator}
                 </button>
                 <div className="flex gap-4">
                   <button className="flex-1 bg-white border-4 border-black rounded-2xl flex items-center justify-center hover:bg-[#F1F3F5] transition-all active:scale-95 shadow-[4px_4px_0_0_#000]">
                      <Twitter className="w-6 h-6 text-[#1DA1F2]" fill="currentColor" />
                   </button>
                   <button className="flex-1 bg-white border-4 border-black rounded-2xl flex items-center justify-center hover:bg-[#F1F3F5] transition-all active:scale-95 shadow-[4px_4px_0_0_#000]">
                      <Send className="w-6 h-6 text-[#229ED9]" fill="currentColor" />
                   </button>
                   <button className="flex-1 bg-white border-4 border-black rounded-2xl flex items-center justify-center hover:bg-[#F1F3F5] transition-all active:scale-95 shadow-[4px_4px_0_0_#000]">
                      <MessageCircle className="w-6 h-6 text-green-500" fill="currentColor" />
                   </button>
                 </div>
              </div>
           </div>

           <div className="bg-[#CCFF00] border-4 border-black rounded-[3rem] p-8 md:p-10 shadow-[10px_10px_0_0_#0038FF] flex items-center justify-between group cursor-pointer hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0_15px_rgba(0,0,0,0.05)] group-hover:rotate-12 transition-transform">
                    <ArrowUpRight className="w-8 h-8 text-[#CCFF00]" strokeWidth={3} />
                 </div>
                 <div>
                    <h4 className="text-2xl font-black text-black uppercase italic leading-none">Tutorial Center</h4>
                    <p className="text-black/50 font-bold uppercase tracking-tight text-[10px] mt-1">Learn how to maximize your matrix invites</p>
                 </div>
              </div>
              <ChevronRight className="w-8 h-8 text-black/20 group-hover:text-black transition-colors" />
           </div>
        </div>

      </div>
    </div>
  );
};

export default Invite;
