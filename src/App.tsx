/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { LanguageProvider } from './components/LanguageContext';
import { Layout } from './components/Layout';
import { Web3Provider } from './components/Web3Provider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ConfigProvider } from './components/ConfigContext';
import { ModeProvider } from './components/ModeContext';
import Home from './pages/Home';
import System from './pages/System';
import Account from './pages/Account';
import Team from './pages/Team';
import Earnings from './pages/Earnings';
import Invite from './pages/Invite';
import Transactions from './pages/Transactions';
import AdminPanel from './pages/Admin';

const ReferrerTracker = () => {
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      localStorage.setItem('tronblock_ref', ref);
    }
  }, [searchParams]);
  return null;
};

export default function App() {
  return (
    <LanguageProvider>
      <Web3Provider>
        <ConfigProvider>
          <ModeProvider>
            <Router>
              <ReferrerTracker />
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/system" element={<ProtectedRoute><System /></ProtectedRoute>} />
                  <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                  <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
                  <Route path="/earnings" element={<ProtectedRoute><Earnings /></ProtectedRoute>} />
                  <Route path="/invite" element={<ProtectedRoute><Invite /></ProtectedRoute>} />
                  <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
                  {/* Fallback to Home for now for other links */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </Layout>
            </Router>
          </ModeProvider>
        </ConfigProvider>
      </Web3Provider>
    </LanguageProvider>
  );
}
