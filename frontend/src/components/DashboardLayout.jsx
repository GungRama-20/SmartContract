import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Wallet, Activity, Users, Settings, LogOut, Menu, X, ShieldAlert, CheckCircle, Database } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';

export default function DashboardLayout({ children }) {
  const {
    isConnected,
    isCorrectNetwork,
    address,
    switchNetwork,
    disconnectWallet,
    currentUser,
    isRegistered,
  } = useWeb3();

  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'User Directory', path: '/users', icon: Users },
    { name: 'Transaction History', path: '/history', icon: Database },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col md:flex-row font-sans">
      {/* ── MOBILE HEADER ───────────────────────────────────────────────────────── */}
      <div className="md:hidden flex justify-between items-center px-6 py-4 bg-slate-900 border-b border-slate-800 z-30">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-900/30">
            W3
          </div>
          <span className="font-display font-bold text-slate-100 text-sm">Web3 Registry</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── SIDEBAR (DESKTOP) ────────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 w-64 bg-slate-950/80 border-r border-slate-900/80 p-6 flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out`}
      >
        <div className="space-y-8">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-base shadow-md shadow-purple-900/30">
              W3
            </div>
            <div>
              <span className="font-display font-bold text-slate-100 text-sm block leading-none">Web3 Platform</span>
              <span className="text-[10px] text-slate-500 font-mono">v1.0.0 (Hardhat)</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-600 font-bold px-3 block mb-2">Navigation</span>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-primary/20 text-purple-300 border-l-2 border-primary'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/40'
                }`}
              >
                <item.icon size={18} className={isActive(item.path) ? 'text-purple-400' : 'text-slate-500'} />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Profile Card & Wallet controls */}
        <div className="pt-6 border-t border-slate-900 space-y-4">
          {/* Status Indicator */}
          {isConnected ? (
            <div className="glass-panel p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-slate-500">Wallet Connected</span>
                <div className={`w-2.5 h-2.5 rounded-full ${isCorrectNetwork ? 'bg-success' : 'bg-danger'} animate-pulse`} />
              </div>
              <div className="font-mono text-xs text-slate-300 flex justify-between items-center bg-slate-900/60 p-2 rounded border border-slate-800">
                <span>{formatAddress(address)}</span>
              </div>

              {currentUser ? (
                <div className="pt-2 border-t border-slate-900/50 flex items-center gap-2">
                  <CheckCircle size={14} className="text-success" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-900/50 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                  <span className="text-[10px] text-slate-400">Unregistered Profile</span>
                </div>
              )}

              <button
                onClick={disconnectWallet}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg text-xs transition-colors cursor-pointer"
              >
                <LogOut size={12} />
                Disconnect
              </button>
            </div>
          ) : (
            <div className="glass-panel p-4 rounded-xl text-center space-y-3">
              <p className="text-xs text-slate-400">Wallet not connected.</p>
              <button
                onClick={() => navigate('/')}
                className="w-full py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold shadow transition-colors cursor-pointer"
              >
                Go Connect Wallet
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Wrong network warning banner */}
        {isConnected && !isCorrectNetwork && (
          <div className="bg-danger/10 border-b border-danger/20 px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 z-20">
            <div className="flex items-center gap-2 text-danger text-sm font-medium">
              <ShieldAlert size={16} />
              <span>You are connected to the wrong network. Please switch to localhost (Hardhat Node).</span>
            </div>
            <button
              onClick={switchNetwork}
              className="px-4 py-1.5 bg-danger text-white rounded-lg text-xs font-semibold hover:bg-danger/95 transition-colors cursor-pointer"
            >
              Switch Network
            </button>
          </div>
        )}

        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
