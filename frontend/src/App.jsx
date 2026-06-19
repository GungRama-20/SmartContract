import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Web3Provider, useWeb3 } from './hooks/useWeb3';
import DashboardLayout from './components/DashboardLayout';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import TransactionHistory from './pages/TransactionHistory';
import Settings from './pages/Settings';

// Lucide icon helper
import { AlertCircle, X, ShieldAlert, CheckCircle, Info } from 'lucide-react';

function DashboardWrapper({ children }) {
  const { isConnected, connectWallet, isLoading } = useWeb3();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center p-6 text-center">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full space-y-6 border border-slate-800">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
            <ShieldAlert size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-100">Akses Dibatasi</h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Halaman ini membutuhkan koneksi dompet Web3 MetaMask. Hubungkan dompet Anda untuk mengakses fitur dashboard platform.
            </p>
          </div>
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl transition-all shadow shadow-purple-900/30 cursor-pointer"
          >
            {isLoading ? 'Menghubungkan...' : 'Hubungkan MetaMask'}
          </button>
          
          <Link to="/" className="text-xs text-purple-400 hover:text-purple-300 block pt-2">
            Kembali ke Landing Page
          </Link>
        </div>
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

function Toast({ toast, onClose }) {
  const config = {
    success: { bg: 'bg-emerald-950/80 border-emerald-500/20 text-emerald-200', icon: CheckCircle },
    warning: { bg: 'bg-amber-950/80 border-amber-500/20 text-amber-200', icon: AlertCircle },
    error: { bg: 'bg-rose-950/80 border-rose-500/20 text-rose-200', icon: ShieldAlert },
    info: { bg: 'bg-purple-950/80 border-purple-500/20 text-purple-200', icon: Info },
  }[toast.type] || { bg: 'bg-slate-900 border-slate-800 text-slate-200', icon: Info };

  const IconComponent = config.icon;

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 shadow-2xl max-w-sm w-full backdrop-blur-md ${config.bg} transition-all duration-300`}>
      <IconComponent size={18} className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-xs">{toast.title}</h4>
        <p className="text-[11px] opacity-90 mt-0.5 leading-snug break-words">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
}

function MainApp() {
  const { toasts, removeToast } = useWeb3();

  return (
    <BrowserRouter>
      {/* Dynamic Toasts Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm px-4">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/dashboard" element={
          <DashboardWrapper>
            <Dashboard />
          </DashboardWrapper>
        } />
        
        <Route path="/users" element={
          <DashboardWrapper>
            <UserManagement />
          </DashboardWrapper>
        } />

        <Route path="/history" element={
          <DashboardWrapper>
            <TransactionHistory />
          </DashboardWrapper>
        } />

        <Route path="/settings" element={
          <DashboardWrapper>
            <Settings />
          </DashboardWrapper>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <MainApp />
    </Web3Provider>
  );
}
