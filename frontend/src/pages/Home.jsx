import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Cpu, Wallet, Database, Zap, Globe, ArrowRight, Activity, Users, PlusCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';

export default function Home() {
  const { isConnected, connectWallet, allUsers, transactions } = useWeb3();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { label: 'Total Registered Users', value: allUsers?.length || '0', icon: Users, color: 'text-purple-500' },
    { label: 'Total Platform Txns', value: transactions?.length || '0', icon: Activity, color: 'text-blue-500' },
    { label: 'Blockchain Network', value: 'Localhost (31337)', icon: Cpu, color: 'text-green-500' },
    { label: 'Protocol Fee', value: '0.00 ETH (Free)', icon: Zap, color: 'text-yellow-500' },
  ];

  const features = [
    {
      title: 'Decentralized Profile Storage',
      description: 'Your user profile details (ID, Name, Email, Timestamp) are directly written to the Ethereum block, immutable and secure.',
      icon: Database,
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      title: 'Cryptographic Security',
      description: 'Transactions are secured using public-key cryptography and validated via Smart Contract with OpenZeppelin protection.',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Real-Time Event Logs',
      description: 'Our platform automatically listens to smart contract events, syncing your dashboard UI immediately upon creation or deletion.',
      icon: Cpu,
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Seamless Wallet Management',
      description: 'Connect and authenticate with MetaMask instantly. Automatic detection of account swaps and network chains.',
      icon: Wallet,
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  const benefits = [
    { title: 'Lightning Fast', description: 'Optimized block interaction and automatic gas buffer calculations make updates instantaneous.', icon: Zap },
    { title: 'Enterprise Secure', description: 'Protected by OpenZeppelin contracts, AccessControl modifiers, and ReentrancyGuard.', icon: Shield },
    { title: 'Fully Transparent', description: 'Every single record edit, deletion, or registration is visible in transparent block explorers.', icon: Globe },
    { title: 'True Ownership', description: 'You own your data. Deleting your profile wipes it off our mapping lists, giving you full data sovereignty.', icon: CheckCircle },
  ];

  const faqs = [
    {
      q: 'Bagaimana cara mulai menggunakan platform ini?',
      a: 'Anda memerlukan MetaMask terpasang di browser Anda. Aktifkan local Hardhat Node atau hubungkan ke testnet, lalu klik tombol "Connect Wallet" di sudut kanan atas untuk menyinkronkan identitas Web3 Anda.',
    },
    {
      q: 'Apakah data saya benar-benar disimpan di blockchain?',
      a: 'Ya. Seluruh profil (ID, Nama, Email, dan Waktu Pembuatan) ditulis secara on-chain di dalam mapping struct smart contract kami. Perubahan apa pun dicatat sebagai transaksi blockchain yang valid.',
    },
    {
      q: 'Bagaimana smart contract dilindungi?',
      a: 'Smart contract kami menggunakan standar keamanan tertinggi dari OpenZeppelin Contracts, termasuk ReentrancyGuard untuk mencegah reentrancy attacks, dan pembatasan kepemilikan (Ownable) untuk akses administratif.',
    },
    {
      q: 'Mengapa saya perlu membayar gas?',
      a: 'Setiap aksi menulis data (Create, Update, Delete) di blockchain memerlukan komputasi EVM. Biaya komputasi ini (gas fee) dibayarkan kepada validator jaringan menggunakan koin native (misalnya ETH lokal pada Hardhat).',
    },
  ];

  const handleCTA = () => {
    if (isConnected) {
      navigate('/dashboard');
    } else {
      connectWallet();
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col font-sans">
      {/* ── HERO SECTION ────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden flex-1 flex flex-col justify-center items-center">
        {/* Background glow effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs text-secondary font-medium mb-6 hover:border-purple-500/30 transition-colors"
          >
            <Activity size={12} className="animate-pulse" />
            <span>Next-Gen Web3 Identity Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6"
          >
            Kelola Identitas On-Chain Anda Secara <span className="text-gradient font-extrabold">Desentralisasi</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 font-light leading-relaxed"
          >
            Platform CRUD Web3 premium yang memungkinkan pendaftaran, pembaruan, dan pengelolaan profil pengguna secara real-time langsung ke smart contract blockchain. Cepat, aman, dan tanpa perantara.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16"
          >
            <button
              onClick={handleCTA}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 hover:shadow-purple-500/20 transition-all cursor-pointer"
            >
              {isConnected ? 'Buka Dashboard' : 'Hubungkan Dompet Anda'}
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white rounded-xl font-medium transition-colors cursor-pointer"
            >
              Pelajari Fitur
            </button>
          </motion.div>
        </div>

        {/* Dashboard UI Preview Container */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-4xl px-4 z-10"
        >
          <div className="glass-panel rounded-2xl p-2 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 rounded-2xl pointer-events-none" />
            <div className="bg-slate-950/80 rounded-xl overflow-hidden aspect-[1.8/1] border border-slate-800/60 p-6 flex flex-col justify-between">
              {/* Fake top bar */}
              <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-xs text-slate-500 ml-4 font-mono">web3-user-management.eth</span>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-24 bg-slate-900 rounded-md" />
                  <div className="h-6 w-16 bg-purple-950 rounded-md border border-purple-500/20" />
                </div>
              </div>

              {/* Fake inner body */}
              <div className="grid grid-cols-3 gap-4 my-auto">
                <div className="glass-panel p-4 rounded-xl border border-slate-800">
                  <div className="h-2 w-12 bg-slate-800 rounded mb-2" />
                  <div className="h-5 w-20 bg-slate-700 rounded" />
                </div>
                <div className="glass-panel p-4 rounded-xl border border-slate-800">
                  <div className="h-2 w-16 bg-slate-800 rounded mb-2" />
                  <div className="h-5 w-12 bg-slate-700 rounded" />
                </div>
                <div className="glass-panel p-4 rounded-xl border border-slate-800">
                  <div className="h-2 w-10 bg-slate-800 rounded mb-2" />
                  <div className="h-5 w-24 bg-slate-700 rounded" />
                </div>
              </div>

              {/* Fake Table */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-900 rounded" />
                <div className="h-4 w-5/6 bg-slate-900 rounded" />
                <div className="h-4 w-4/5 bg-slate-900 rounded" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── STATISTICS SECTION ─────────────────────────────────────────────────── */}
      <section className="py-12 bg-slate-950/40 border-y border-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon size={20} className={`${stat.color}`} />
                  <span className="text-sm text-slate-400 font-medium">{stat.label}</span>
                </div>
                <span className="text-3xl font-semibold text-slate-100">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ───────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase tracking-widest text-secondary font-semibold mb-3">Teknologi Blockchain</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold">Fitur Kunci Desentralisasi</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="glass-panel p-8 rounded-2xl border border-slate-800 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white mb-6 shadow-md`} >
                  <feat.icon size={22} />
                </div>
                <h4 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">{feat.title}</h4>
                <p className="text-slate-400 leading-relaxed text-sm">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS SECTION ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-950/30 px-6 border-t border-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
              <span className="text-xs uppercase tracking-widest text-purple-400 font-semibold mb-3 block">Mengapa Memilih Kami?</span>
              <h3 className="text-3xl md:text-4xl font-display font-bold mb-6">Efisiensi Tanpa Batas</h3>
              <p className="text-slate-400 leading-relaxed text-sm mb-8">
                Dengan menghilangkan server terpusat, kami menjamin kepemilikan data 100% di tangan Anda. Integrasi Web3 instan membuat semua eksekusi transparan.
              </p>
              <button
                onClick={handleCTA}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-sm font-medium flex items-center gap-2 border border-slate-700/50 transition-colors cursor-pointer"
              >
                {isConnected ? 'Buka Dashboard' : 'Hubungkan Sekarang'}
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((ben, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-xl border border-slate-800 flex gap-4">
                  <div className="text-purple-400 bg-purple-500/10 p-2.5 h-11 w-11 rounded-lg flex items-center justify-center shrink-0">
                    <ben.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold mb-1.5 text-slate-100">{ben.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{ben.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-display font-bold mb-4">Pertanyaan yang Sering Diajukan</h3>
          <p className="text-slate-400 text-sm">Semua yang perlu Anda ketahui tentang DApp CRUD identitas berbasis blockchain.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-slate-900/30 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-slate-200 text-sm md:text-base">{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} className="text-purple-400" /> : <ChevronDown size={18} className="text-slate-500" />}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-400 text-xs md:text-sm leading-relaxed border-t border-slate-900/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-slate-900 bg-slate-950/80 mt-auto text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold font-display shadow-md shadow-purple-900/30">
              W3
            </div>
            <span className="font-display font-bold text-slate-300 text-sm">Web3 UserRegistry</span>
          </div>

          <div className="flex gap-6">
            <span className="hover:text-purple-400 transition-colors cursor-pointer">Security Audits</span>
            <span className="hover:text-purple-400 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-purple-400 transition-colors cursor-pointer">Developer API</span>
          </div>

          <div className="text-center md:text-right">
            <span>Built with React · Vite · Tailwind v4 · Hardhat · Solidity</span>
            <p className="mt-1 text-[10px] text-slate-600">© 2026 Web3 UserRegistry. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
