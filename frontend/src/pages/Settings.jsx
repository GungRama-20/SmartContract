import React from 'react';
import { Settings as SettingsIcon, Shield, Server, Key, LogOut, CheckCircle, RefreshCw } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';

export default function Settings() {
  const {
    isConnected,
    isCorrectNetwork,
    chainId,
    contractAddress,
    disconnectWallet,
    switchNetwork,
    refreshData,
    isLoading,
  } = useWeb3();

  const networks = [
    { name: 'Hardhat Localhost', id: 31337, rpc: 'http://127.0.0.1:8545', active: chainId === 31337 },
    { name: 'Ethereum Sepolia Testnet', id: 11155111, rpc: 'https://rpc.sepolia.org', active: chainId === 11155111 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Konfigurasi parameter jaringan Web3, detail smart contract, dan manajemen sesi.</p>
        </div>
        
        {isConnected && (
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl hover:bg-slate-850 transition-colors flex items-center justify-center cursor-pointer"
            title="Refresh Contract Data"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        )}
      </div>

      {!isConnected ? (
        <div className="glass-panel p-8 rounded-2xl text-center space-y-4 border border-yellow-500/10">
          <Shield className="mx-auto text-warning" size={48} />
          <h3 className="text-xl font-bold">Dompet Tidak Terhubung</h3>
          <p className="text-slate-400 max-w-md mx-auto text-sm">
            Silakan sambungkan dompet MetaMask Anda di Landing Page untuk mengakses pengaturan teknis platform.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Network controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Jaringan */}
            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <div className="flex items-center gap-2.5">
                <Server className="text-purple-400" size={20} />
                <h3 className="text-base font-bold text-slate-200">Konfigurasi Jaringan</h3>
              </div>

              <div className="space-y-4">
                {networks.map((net) => (
                  <div
                    key={net.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                      net.active
                        ? 'bg-purple-950/10 border-purple-500/30'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-200">{net.name}</span>
                        {net.active && (
                          <span className="px-2 py-0.5 bg-success/15 border border-success/20 rounded-full text-success text-[9px] font-semibold flex items-center gap-1">
                            <CheckCircle size={10} /> Active
                          </span>
                        )}
                      </div>
                      <div className="space-y-0.5 mt-1 font-mono text-[10px] text-slate-400">
                        <p>Chain ID: {net.id}</p>
                        <p>RPC URL: {net.rpc}</p>
                      </div>
                    </div>

                    {!net.active && net.id === 31337 && (
                      <button
                        onClick={switchNetwork}
                        className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-semibold shadow hover:shadow-purple-500/10 transition-colors cursor-pointer"
                      >
                        Switch Network
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Contract Details */}
            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <div className="flex items-center gap-2.5">
                <Key className="text-purple-400" size={20} />
                <h3 className="text-base font-bold text-slate-200">Metadata Smart Contract</h3>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between py-2 border-b border-slate-900">
                  <span className="text-slate-500">Contract Name:</span>
                  <span className="text-slate-300 font-semibold">UserManagement</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-900">
                  <span className="text-slate-500">Deployed Address:</span>
                  <span className="text-slate-300 font-semibold">{contractAddress || 'Not Deployed'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-900">
                  <span className="text-slate-500">Compiler Version:</span>
                  <span className="text-slate-300 font-semibold">Solidity 0.8.20</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Security Standard:</span>
                  <span className="text-slate-300 font-semibold">Ownable, ReentrancyGuard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Session actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-2xl space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <SettingsIcon className="text-purple-400" size={20} />
                  <h3 className="text-base font-bold text-slate-200">Manajemen Dompet</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Putuskan sambungan dompet MetaMask Anda secara aman dari aplikasi. Anda dapat menghubungkannya kembali kapan saja.
                </p>
              </div>

              <button
                onClick={disconnectWallet}
                className="w-full py-3 bg-danger/10 hover:bg-danger/25 border border-danger/25 text-danger rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut size={14} />
                Disconnect Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
