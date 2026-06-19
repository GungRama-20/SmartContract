import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Wallet, Users, Key, AlertCircle, PlusCircle, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';

export default function Dashboard() {
  const {
    isConnected,
    isCorrectNetwork,
    address,
    ethBalance,
    currentUser,
    isRegistered,
    allUsers,
    transactions,
    createUser,
    isLoading,
    contractAddress,
  } = useWeb3();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    const success = await createUser(data.name, data.email);
    if (success) reset();
  };

  const getRecentTransactions = () => {
    return transactions.slice(0, 5); // display only 5 recent txs
  };

  const stats = [
    {
      title: 'Total Active Registries',
      value: allUsers?.length || 0,
      sub: 'On-chain profiles',
      icon: Users,
      color: 'text-purple-400',
    },
    {
      title: 'Your Transacted Operations',
      value: transactions?.length || 0,
      sub: 'All-time operations logs',
      icon: Clock,
      color: 'text-blue-400',
    },
    {
      title: 'Smart Contract Status',
      value: contractAddress ? 'Active' : 'Uninitialized',
      sub: contractAddress ? `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}` : 'N/A',
      icon: Key,
      color: 'text-green-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Status real-time, aktivitas transaksi, dan ringkasan profil dompet Anda.</p>
      </div>

      {!isConnected ? (
        <div className="glass-panel p-8 rounded-2xl text-center space-y-4 border border-yellow-500/10">
          <AlertCircle className="mx-auto text-warning" size={48} />
          <h3 className="text-xl font-bold">Dompet Tidak Terhubung</h3>
          <p className="text-slate-400 max-w-md mx-auto text-sm">
            Silakan sambungkan MetaMask di Landing Page atau klik tombol koneksi di sidebar untuk melihat dashboard blockchain Anda.
          </p>
        </div>
      ) : (
        <>
          {/* ── CARD METADATA / WALLET INFO ────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Wallet Info Main Panel */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-48">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Active Wallet Address</span>
                  <span className="text-lg md:text-xl font-mono font-semibold text-slate-200 tracking-tight block truncate">
                    {address}
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg text-purple-400 border border-slate-800">
                  <Wallet size={20} />
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">ETH Balance</span>
                  <span className="text-2xl font-bold font-mono text-slate-100">
                    {parseFloat(ethBalance).toFixed(4)} ETH
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-success/15 border border-success/20 rounded-full text-success text-[10px] font-semibold">
                  <CheckCircle size={12} />
                  <span>Synchronized</span>
                </div>
              </div>
            </div>

            {/* Profile Summary Card */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-48">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block mb-2">Web3 Identity Status</span>
                {isRegistered && currentUser ? (
                  <div className="space-y-1">
                    <span className="text-lg font-bold text-slate-200 block truncate">{currentUser.name}</span>
                    <span className="text-xs text-slate-400 block truncate">{currentUser.email}</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-sm font-semibold text-warning block">Identity Unregistered</span>
                    <p className="text-[11px] text-slate-400 leading-tight mt-1">
                      Dompet Anda belum dikaitkan dengan profil on-chain di platform kami.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-900/50 flex justify-between items-center text-xs">
                <span className="text-slate-500">Registration ID:</span>
                <span className="font-mono font-semibold text-slate-300">
                  {isRegistered && currentUser ? `#${currentUser.id}` : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* ── STATS CARDS ────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                <div className={`p-3 bg-slate-900 rounded-xl border border-slate-800 ${stat.color}`}>
                  <stat.icon size={22} />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{stat.title}</span>
                  <span className="text-xl font-bold text-slate-200">{stat.value}</span>
                  <span className="text-[10px] text-slate-400 block">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── QUICK ACTIONS (FORM REGISTRASI) ─────────────────────────────────── */}
            <div className="lg:col-span-1 glass-panel p-6 rounded-2xl space-y-6">
              <div className="flex items-center gap-2">
                <PlusCircle className="text-purple-400" size={20} />
                <h3 className="text-base font-bold text-slate-200">Registrasi Identitas</h3>
              </div>

              {isRegistered ? (
                <div className="bg-purple-950/20 border border-purple-500/10 p-5 rounded-xl text-center space-y-3">
                  <CheckCircle className="mx-auto text-purple-400" size={32} />
                  <p className="text-xs text-slate-300">
                    Dompet Anda sudah terdaftar! Anda dapat memperbarui profil atau menghapusnya di halaman <strong>User Directory</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">Nama Lengkap</label>
                    <input
                      type="text"
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-medium"
                      placeholder="Masukkan nama..."
                      {...register('name', { required: 'Nama wajib diisi' })}
                    />
                    {errors.name && <span className="text-[10px] text-danger">{errors.name.message}</span>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">Alamat Email</label>
                    <input
                      type="email"
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-medium"
                      placeholder="Masukkan email..."
                      {...register('email', {
                        required: 'Email wajib diisi',
                        pattern: { value: /^\S+@\S+$/i, message: 'Format email tidak valid' }
                      })}
                    />
                    {errors.email && <span className="text-[10px] text-danger">{errors.email.message}</span>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !isCorrectNetwork}
                    className="w-full py-3 bg-primary hover:bg-primary-hover disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all shadow hover:shadow-purple-500/15 cursor-pointer"
                  >
                    {isLoading ? 'Memproses Transaksi...' : 'Daftar ke Smart Contract'}
                  </button>
                </form>
              )}
            </div>

            {/* ── RECENT ACTIVITY (LOG TRANSAKSI) ─────────────────────────────────── */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-200">Aktivitas Transaksi Terkini</h3>
                <span className="text-[10px] text-slate-500 font-mono">Limit 5 entries</span>
              </div>

              <div className="space-y-3">
                {getRecentTransactions().length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs">
                    Belum ada riwayat transaksi terdaftar di browser ini.
                  </div>
                ) : (
                  getRecentTransactions().map((tx, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/40"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            tx.status === 'success'
                              ? 'bg-success'
                              : tx.status === 'pending'
                              ? 'bg-warning animate-pulse'
                              : 'bg-danger'
                          }`}
                        />
                        <div>
                          <span className="text-xs font-semibold text-slate-200 block">{tx.action}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-[10px] text-slate-400">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </span>
                        <a
                          href={`https://etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-0.5"
                        >
                          Verify <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
