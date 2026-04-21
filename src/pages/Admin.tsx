import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Users, 
  Settings, 
  Activity, 
  Ban, 
  CheckCircle, 
  BarChart, 
  Flag, 
  LogOut, 
  Search, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useMode } from '../components/ModeContext';
import { useLanguage } from '../components/LanguageContext';
import { useSystemConfig } from '../components/ConfigContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const Skeleton = ({ className }: { className?: string; key?: any }) => (
  <div className={`animate-pulse bg-black/5 rounded-lg border-2 border-transparent ${className}`}></div>
);

export default function AdminPanel() {
  const { t } = useLanguage();
  const { config } = useSystemConfig();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'rules' | 'banners' | 'deductions'>('dashboard');
  const [userSearch, setUserSearch] = useState('');
  const queryClient = useQueryClient();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginPromise = fetch('/api/admin/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ username, password })
    });

    toast.promise(loginPromise, {
      loading: 'Authorizing Node...',
      success: async (res) => {
        if (res.ok) {
           const data = await res.json();
           localStorage.setItem('adminToken', data.token);
           setIsAuthenticated(true);
           setLoginError('');
           return 'Access Granted';
        } else {
           setLoginError('Invalid credentials');
           throw new Error('Unauthorized');
        }
      },
      error: 'Authentication Failure'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    toast.success('Session Terminated');
  };

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
       const token = localStorage.getItem('adminToken');
       const res = await fetch('/api/admin/users', {
         headers: { 'Authorization': `Bearer ${token}` }
       });
       if (res.status === 401) {
          handleLogout();
          throw new Error('Unauthorized');
       }
       if (!res.ok) return [];
       return res.json();
    },
    enabled: isAuthenticated
  });

  const banMutation = useMutation({
    mutationFn: async ({ address, action }: { address: string, action: 'ban' | 'unban' }) => {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/users/${address}/ban`, {
         method: 'POST',
         headers: { 
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify({ action })
      });
      if (res.status === 401) {
          handleLogout();
          throw new Error('Unauthorized');
      }
      if (!res.ok) throw new Error('Failed to update ban status');
      return res.json();
    },
    onMutate: ({ action }) => {
      toast.loading(`${action === 'ban' ? 'Terminating' : 'Restoring'} node access...`);
    },
    onSuccess: (_, { action }) => {
      toast.dismiss();
      toast.success(`Node ${action === 'ban' ? 'Banned' : 'Unbanned'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (err) => {
      toast.dismiss();
      toast.error(err instanceof Error ? err.message : 'Action failed');
    }
  });

  if (!isAuthenticated) {
     return (
       <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center mt-20">
         <div className="bg-white border-4 border-black p-8 md:p-12 rounded-[2rem] shadow-[15px_15px_0_0_#000] w-full max-w-sm relative">
           <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]" />
           <h2 className="text-3xl font-black text-black uppercase italic tracking-tighter mb-2">Admin Login</h2>
           <p className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-6">Restricted Area</p>
           
           {loginError && <p className="text-red-500 font-bold mb-4 bg-red-50 p-2 rounded-lg border-2 border-red-500 text-sm">{loginError}</p>}
           
           <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
              <div>
                <label className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-1 block">Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  className="w-full p-4 border-2 border-black rounded-xl font-bold bg-[#F1F3F5] focus:bg-white focus:outline-none focus:border-[#0038FF] transition-colors" 
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-1 block">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full p-4 border-2 border-black rounded-xl font-bold bg-[#F1F3F5] focus:bg-white focus:outline-none focus:border-[#0038FF] transition-colors" 
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#0038FF] text-white font-black py-4 rounded-xl border-2 border-black hover:bg-[#CCFF00] hover:text-black transition-colors uppercase tracking-widest mt-2 shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none"
              >
                Enter Node
              </button>
           </form>
         </div>
       </div>
     );
  }

  return (
    <div className="w-full pb-32">
       {/* Header */}
       <section className="px-6 md:px-10 pt-32 pb-10 max-w-7xl mx-auto">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
           <div className="flex flex-col md:flex-row items-center gap-6">
             <div className="w-20 h-20 bg-red-500 flex items-center justify-center rounded-3xl border-4 border-black shadow-[6px_6px_0_0_#000]">
               <ShieldAlert className="w-10 h-10 text-white" />
             </div>
             <div>
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter shadow-black drop-shadow-md">
                  Admin Control Room
                </h1>
                <p className="text-red-400 font-bold uppercase tracking-widest mt-2">{username || 'ADMIN'} MODE ACTIVE</p>
             </div>
           </div>

           {isAuthenticated && (
             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 bg-black text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-full border-2 border-white/20 hover:bg-red-500 hover:border-red-500 transition-colors shrink-0"
             >
               <LogOut className="w-4 h-4" /> Disconnect 
             </button>
           )}
         </div>

         {/* Tabs */}
         <div className="flex overflow-x-auto no-scrollbar gap-4 mb-10 pb-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'deductions', label: 'Deductions & Logs', icon: Activity },
              { id: 'rules', label: 'System Rules', icon: Settings },
              { id: 'banners', label: 'Global Banners', icon: Flag }
            ].map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex items-center gap-2 px-6 py-4 rounded-xl border-4 border-black font-black uppercase text-sm tracking-widest transition-all whitespace-nowrap shadow-[4px_4px_0_0_#000] active:scale-95 ${
                   activeTab === tab.id ? 'bg-[#CCFF00] text-black' : 'bg-white/10 text-white hover:bg-white/20'
                 }`}
               >
                 <tab.icon className="w-5 h-5" />
                 {tab.label}
               </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="bg-white border-4 border-black rounded-[3rem] p-8 md:p-12 shadow-[15px_15px_0_0_#001A99] min-h-[50vh]">
            
            {activeTab === 'dashboard' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                 <h2 className="text-3xl font-black text-black uppercase italic">System Overview</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 bg-black/5 rounded-2xl border-2 border-black/10">
                       <p className="text-black/50 font-black uppercase tracking-widest text-xs mb-2">Total Users</p>
                       <p className="text-5xl font-black text-[#0038FF]">
                         {users ? users.length : (usersLoading ? '...' : '0')}
                       </p>
                    </div>
                    <div className="p-8 bg-black/5 rounded-2xl border-2 border-black/10">
                       <p className="text-black/50 font-black uppercase tracking-widest text-xs mb-2">Rule Version</p>
                       <p className="text-4xl font-black text-black">{config?.version || 'N/A'}</p>
                    </div>
                    <div className="p-8 bg-[#CCFF00]/20 rounded-2xl border-2 border-[#CCFF00]">
                       <p className="text-black/50 font-black uppercase tracking-widest text-xs mb-2">Network Status</p>
                       <div className="flex items-center gap-2 text-2xl font-black text-green-600">
                         <Activity className="w-6 h-6 shrink-0" />
                         OPERATIONAL
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                 <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
                    <div>
                       <h2 className="text-3xl font-black text-black uppercase italic mb-1">User Registry</h2>
                       <p className="text-[10px] font-black uppercase text-black/40 tracking-widest">Network Node Management</p>
                    </div>
                    <div className="relative w-full md:w-96 text-black">
                       <input 
                          type="text" 
                          placeholder="Search address..."
                          value={userSearch}
                          onChange={e => setUserSearch(e.target.value)}
                          className="w-full bg-black/5 border-4 border-black p-4 pl-12 rounded-2xl font-bold focus:outline-none focus:bg-white transition-all shadow-[4px_4px_0_0_#000]"
                       />
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
                    </div>
                 </div>
                 
                 {usersLoading ? (
                    <div className="space-y-4">
                       {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                       ))}
                    </div>
                 ) : (
                    <div className="overflow-x-auto w-full">
                      <table className="w-full min-w-[900px] text-left border-collapse">
                         <thead>
                            <tr className="border-b-4 border-black text-black/50 font-black uppercase text-[10px] tracking-widest">
                              <th className="pb-4 pt-2 px-4">Node Profile</th>
                              <th className="pb-4 pt-2 px-4 text-center">Protocol Level</th>
                              <th className="pb-4 pt-2 px-4 text-center">Active Seats</th>
                              <th className="pb-4 pt-2 px-4 text-right">Team Volume</th>
                              <th className="pb-4 pt-2 px-4 text-right">Moderation</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y-2 divide-black/5">
                           {users?.filter((u: any) => u.address.toLowerCase().includes(userSearch.toLowerCase())).map((u: any) => (
                             <tr key={u.address} className="hover:bg-black/5 transition-colors group">
                                <td className="py-5 px-4 text-black">
                                   <div className="flex items-center gap-3">
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000] ${u.is_banned ? 'bg-red-500' : 'bg-white'}`}>
                                         <Users className={`w-5 h-5 ${u.is_banned ? 'text-white' : 'text-black/20'}`} />
                                      </div>
                                      <div>
                                         <p className="font-mono text-sm font-bold text-black">{u.address.slice(0, 8)}...{u.address.slice(-8)}</p>
                                         <div className="flex gap-2 items-center mt-0.5">
                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                                              u.account_mode === 'ADMIN' ? 'bg-red-500 text-white' : 
                                              u.account_mode === 'TEST' ? 'bg-orange-400 text-white' : 'bg-gray-100 text-black/40'
                                            }`}>{u.account_mode}</span>
                                            {u.is_banned === 1 && <span className="text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter bg-red-100 text-red-600">BANNED</span>}
                                         </div>
                                      </div>
                                   </div>
                                </td>
                                <td className="py-5 px-4 text-center">
                                   <span className="bg-black text-[#CCFF00] px-3 py-1 rounded-lg font-black text-sm border-2 border-black italic">V{u.level || 1}</span>
                                </td>
                                <td className="py-5 px-4 text-center">
                                   <span className="font-black text-xl text-black">{u.validSeats || 0}</span>
                                </td>
                                <td className="py-5 px-4 text-right">
                                   <p className="font-black text-[#0038FF] text-lg leading-none">{u.totalTeamVolume?.toLocaleString() || '0'}</p>
                                   <p className="text-[8px] font-black uppercase text-black/20 mt-1">USDT FLOW</p>
                                </td>
                                <td className="py-5 px-4">
                                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {u.is_banned === 1 ? (
                                        <button 
                                          onClick={() => banMutation.mutate({ address: u.address, action: 'unban' })}
                                          className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded-xl text-white font-black text-[10px] uppercase border-2 border-black hover:bg-green-600 shadow-[3px_3px_0_0_#000] active:translate-y-1 active:shadow-none transition-all">
                                          <CheckCircle className="w-3 h-3" /> Lift Ban
                                        </button>
                                      ) : (
                                        <button 
                                          onClick={() => banMutation.mutate({ address: u.address, action: 'ban' })}
                                          className="flex items-center gap-2 px-4 py-2 bg-red-500 rounded-xl text-white font-black text-[10px] uppercase border-2 border-black hover:bg-red-600 shadow-[3px_3px_0_0_#000] active:translate-y-1 active:shadow-none transition-all">
                                          <Ban className="w-3 h-3" /> Terminate
                                        </button>
                                      )}
                                   </div>
                                </td>
                             </tr>
                           ))}
                           {users?.length === 0 && (
                             <tr><td colSpan={5} className="py-20 text-center font-black text-black/40 uppercase tracking-widest italic">No network nodes detected in registry.</td></tr>
                           )}
                         </tbody>
                      </table>
                    </div>
                 )}
              </motion.div>
            )}

            {activeTab === 'deductions' && (
               <DeductionsTab />
            )}

            {activeTab === 'rules' && (
              <RulesTab />
            )}

             {activeTab === 'banners' && (
              <BannersTab />
             )}

         </div>
       </section>
    </div>
  );
}

function DeductionsTab() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['adminTransactions'],
    queryFn: async () => {
       const token = localStorage.getItem('adminToken');
       const res = await fetch('/api/admin/transactions', {
         headers: { 'Authorization': `Bearer ${token}` }
       });
       if (!res.ok) return [];
       return res.json();
    }
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
       <div className="mb-10">
          <h2 className="text-3xl font-black text-black uppercase italic mb-1">Financial Traffic</h2>
          <p className="text-[10px] font-black uppercase text-black/40 tracking-widest">On-chain movement & Reward settlement</p>
       </div>
       
       {isLoading ? (
          <div className="space-y-4">
             {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
             ))}
          </div>
       ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px] text-left border-collapse">
               <thead>
                  <tr className="border-b-4 border-black text-black/50 font-black uppercase text-[10px] tracking-widest">
                    <th className="pb-4 pt-2 px-4">Transaction Profile</th>
                    <th className="pb-4 pt-2 px-4">Target Node</th>
                    <th className="pb-4 pt-2 px-4 text-right">Settlement</th>
                    <th className="pb-4 pt-2 px-4">Verification</th>
                    <th className="pb-4 pt-2 px-4 text-right">Protocol Time</th>
                  </tr>
               </thead>
               <tbody className="divide-y-2 divide-black/5">
                 {transactions?.map((tx: any) => (
                   <tr key={tx.id} className="hover:bg-black/5 transition-colors">
                      <td className="py-5 px-4">
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 border-black ${
                              tx.type.includes('Deduction') ? 'bg-black text-white' : 'bg-[#CCFF00] text-black'
                            }`}>
                               {tx.type.includes('Deduction') ? <TrendingUp className="w-4 h-4 rotate-180" /> : <TrendingUp className="w-4 h-4" />}
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase text-black tracking-widest">{tx.type}</p>
                               <p className="text-[8px] font-bold text-black/30 font-mono">#{tx.id.slice(0, 12)}...</p>
                            </div>
                         </div>
                      </td>
                      <td className="py-5 px-4">
                         <div className="flex flex-col">
                            <p className="font-mono text-[10px] font-bold text-black">{tx.address}</p>
                            {tx.to_address && <div className="flex items-center gap-1 mt-0.5">
                               <ChevronRight className="w-2 h-2 text-black/20" />
                               <span className="text-[8px] font-black uppercase text-black/30">{tx.to_address.slice(0, 10)}...</span>
                            </div>}
                         </div>
                      </td>
                      <td className="py-5 px-4 text-right">
                         <p className="text-lg font-black text-black leading-none">{tx.amount} <span className="text-[8px] opacity-30">USDT</span></p>
                      </td>
                      <td className="py-5 px-4">
                         <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3 text-green-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-green-600">VERIFIED</span>
                         </div>
                      </td>
                      <td className="py-5 px-4 text-right">
                         <div className="flex flex-col items-end">
                            <p className="text-[10px] font-black text-black leading-none">{new Date(tx.timestamp).toLocaleDateString()}</p>
                            <p className="text-[8px] font-bold text-black/20 mt-1">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                         </div>
                      </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
       )}
    </motion.div>
  );
}

function RulesTab() {
  const { config, isLoading } = useSystemConfig();
  const queryClient = useQueryClient();
  const [editingConfig, setEditingConfig] = useState(config ? JSON.stringify(config, null, 2) : '');
  const [errorMsg, setErrorMsg] = useState('');

  // Update local state when config finally loads if it was null initially
  React.useEffect(() => {
    if (config && !editingConfig) {
       setEditingConfig(JSON.stringify(config, null, 2));
    }
  }, [config]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: editingConfig
      });
      if (!res.ok) throw new Error('Failed to update config');
      return res.json();
    },
    onMutate: () => {
      toast.loading('Synchronizing protocol rules...');
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success('Protocol Parameters Updated');
      queryClient.invalidateQueries({ queryKey: ['systemConfig'] });
    },
    onError: (err) => {
      toast.dismiss();
      toast.error(err instanceof Error ? err.message : 'Calibration failed');
    }
  });

  const handleUpdate = () => {
    try {
      JSON.parse(editingConfig);
      setErrorMsg('');
      updateMutation.mutate();
    } catch (e) {
      setErrorMsg('Invalid JSON format.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
       <div className="flex items-center justify-between">
         <h2 className="text-3xl font-black text-black uppercase italic">Protocol Configuration</h2>
         <button 
           onClick={handleUpdate}
           disabled={updateMutation.isPending}
           className="bg-[#CCFF00] text-black px-6 py-2 font-black text-xs uppercase tracking-widest rounded-xl border-2 border-black shadow-[4px_4px_0_0_#000] hover:bg-black hover:text-white transition-colors"
         >
           Save Config
         </button>
       </div>
       
       {errorMsg && <p className="p-3 bg-red-100 text-red-600 border-2 border-red-500 rounded-xl font-bold">{errorMsg}</p>}
       
       <div className="bg-black/5 border-2 border-black p-2 rounded-2xl relative">
          <textarea
             value={editingConfig}
             onChange={e => setEditingConfig(e.target.value)}
             className="w-full h-[500px] text-xs font-mono font-bold text-black p-4 bg-white rounded-xl focus:outline-none border-2 border-transparent focus:border-[#0038FF]"
             spellCheck={false}
          />
       </div>
    </motion.div>
  );
}

function BannersTab() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');
  const [type, setType] = useState('info');

  const { data: banners, isLoading } = useQuery({
    queryKey: ['adminBanners'],
    queryFn: async () => {
       const res = await fetch('/api/banners');
       if (!res.ok) return [];
       return res.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: msg, type })
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onMutate: () => {
      toast.loading('Deploying global announcement...');
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success('Banner Deployed Broadcastly');
      setMsg('');
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['adminBanners'] });
    },
    onError: () => {
      toast.dismiss();
      toast.error('Broadcast Transmission Failed');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onMutate: () => {
      toast.loading('Terminating announcement...');
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success('Banner Removed');
      queryClient.invalidateQueries({ queryKey: ['adminBanners'] });
    },
    onError: () => {
      toast.dismiss();
      toast.error('Termination Aborted');
    }
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
       <div className="flex items-center justify-between">
         <div>
            <h2 className="text-3xl font-black text-black uppercase italic mb-1">Global Announcements</h2>
            <p className="text-[10px] font-black uppercase text-black/40 tracking-widest">Network-wide broadcast priority</p>
         </div>
         <button 
           onClick={() => setShowForm(!showForm)}
           className={`px-6 py-3 font-black text-xs uppercase tracking-widest rounded-xl border-2 border-black shadow-[4px_4px_0_0_#000] transition-all active:translate-y-1 active:shadow-none ${
              showForm ? 'bg-black text-white' : 'bg-[#0038FF] text-white hover:bg-[#CCFF00] hover:text-black'
           }`}
         >
           {showForm ? 'Close Portal' : '+ Deploy Banner'}
         </button>
       </div>

       {showForm && (
         <div className="bg-black/5 p-6 rounded-2xl border-2 border-black mb-6">
           <div className="space-y-4">
             <div>
               <label className="text-[10px] font-black text-black/50 uppercase tracking-widest block mb-2">Message</label>
               <input 
                 autoFocus
                 type="text" 
                 value={msg}
                 onChange={e => setMsg(e.target.value)}
                 className="w-full p-3 rounded-xl border-2 border-black font-bold focus:outline-none focus:border-[#0038FF]" 
                 placeholder="Enter announcement text..."
               />
             </div>
             <div>
               <label className="text-[10px] font-black text-black/50 uppercase tracking-widest block mb-2">Type</label>
               <select 
                 value={type}
                 onChange={e => setType(e.target.value)}
                 className="w-full p-3 rounded-xl border-2 border-black font-bold uppercase text-xs focus:outline-none focus:border-[#0038FF]"
               >
                 <option value="info">Info (Blue)</option>
                 <option value="warning">Warning (Yellow)</option>
                 <option value="error">Critical (Red)</option>
               </select>
             </div>
             <button 
               onClick={() => createMutation.mutate()}
               disabled={!msg || createMutation.isPending}
               className="w-full bg-[#CCFF00] font-black py-3 rounded-xl border-2 border-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-50"
             >
               Publish Banner
             </button>
           </div>
         </div>
       )}
       
       <div className="space-y-4">
         {isLoading && <p className="text-black/50 font-bold">Loading...</p>}
         {!isLoading && banners?.length === 0 && (
           <div className="p-8 border-4 border-dashed border-black/20 rounded-3xl flex items-center justify-center text-center">
              <p className="text-black/40 font-black uppercase tracking-widest text-sm">No active banners. System clear.</p>
           </div>
         )}
         {banners?.map((b: any) => (
           <div key={b.id} className={`p-4 rounded-2xl border-2 border-black flex justify-between items-center ${b.type === 'error' ? 'bg-red-100' : b.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
             <div>
               <p className="font-bold text-black">{b.message}</p>
               <p className="text-[10px] font-black text-black/50 uppercase tracking-widest mt-1">ID: {b.id} | {b.type}</p>
             </div>
             <button 
               onClick={() => deleteMutation.mutate(b.id)}
               className="p-2 bg-white text-red-500 rounded-lg border-2 border-black hover:bg-red-500 hover:text-white transition-colors"
             >
               <Trash2 className="w-4 h-4" />
             </button>
           </div>
         ))}
       </div>
    </motion.div>
  );
}
