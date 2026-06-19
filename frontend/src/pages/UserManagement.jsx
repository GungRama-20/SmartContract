import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit, Trash2, Calendar, Mail, User, ShieldAlert, Key, Plus, X } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';

export default function UserManagement() {
  const {
    isConnected,
    isCorrectNetwork,
    currentUser,
    isRegistered,
    allUsers,
    updateUser,
    deleteUser,
    isLoading,
  } = useWeb3();

  const [search, setSearch] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const openUpdateModal = () => {
    if (currentUser) {
      setValue('name', currentUser.name);
      setValue('email', currentUser.email);
      setIsUpdateModalOpen(true);
    }
  };

  const handleUpdate = async (data) => {
    const success = await updateUser(data.name, data.email);
    if (success) setIsUpdateModalOpen(false);
  };

  const handleDelete = async () => {
    const success = await deleteUser();
    if (success) setIsDeleteModalOpen(false);
  };

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp * 1000).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">User Directory</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola identitas mandiri Anda dan jelajahi seluruh profil terdaftar di blockchain.</p>
        </div>

        {/* Search bar */}
        {isConnected && isCorrectNetwork && (
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {!isConnected ? (
        <div className="glass-panel p-8 rounded-2xl text-center space-y-4 border border-yellow-500/10">
          <ShieldAlert className="mx-auto text-warning" size={48} />
          <h3 className="text-xl font-bold">Dompet Tidak Terhubung</h3>
          <p className="text-slate-400 max-w-md mx-auto text-sm">
            Hubungkan dompet MetaMask Anda di Landing Page untuk berinteraksi dengan database terdistribusi.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* ── OWN USER PROFILE PROFILE SECTION ─────────────────────────────────── */}
          {isRegistered && currentUser ? (
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-purple-300">
                    <User size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-100">{currentUser.name}</h2>
                      <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-purple-300 text-[10px] font-semibold">
                        Profil Anda
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Mail size={12} className="text-slate-500" /> {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={openUpdateModal}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit size={12} />
                    Edit Profil
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="px-4 py-2 bg-danger/10 hover:bg-danger/20 border border-danger/20 text-danger rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                    Hapus Akun
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl text-center border border-dashed border-slate-800 space-y-2">
              <p className="text-sm text-slate-400">Anda belum mendaftarkan identitas Anda ke smart contract.</p>
              <p className="text-xs text-slate-500">Gunakan form pendaftaran cepat di Dashboard untuk mendaftar.</p>
            </div>
          )}

          {/* ── ALL USERS DIRECTORY GRID ────────────────────────────────────────── */}
          <div>
            <h3 className="text-base font-bold text-slate-200 mb-4">Semua Pengguna Terdaftar</h3>

            {isLoading && allUsers.length === 0 ? (
              // Skeleton Screen
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-panel p-6 rounded-2xl space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-800 rounded w-2/3" />
                        <div className="h-3 bg-slate-800 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-3 bg-slate-800 rounded w-full" />
                    <div className="h-3 bg-slate-800 rounded w-5/6" />
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              // Empty State
              <div className="glass-panel p-12 rounded-2xl text-center text-slate-500 space-y-2">
                <p className="text-sm">Tidak ada profil yang ditemukan.</p>
                <p className="text-xs">Ubah query pencarian Anda atau daftarkan profil baru.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-purple-500/20 hover:shadow-purple-500/5 transition-all group"
                  >
                    <div className="space-y-4">
                      {/* Top Info */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400 font-mono text-xs font-semibold">
                            {user.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-200 group-hover:text-purple-400 transition-colors truncate">
                              {user.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                              <Mail size={10} className="text-slate-500" /> {user.email}
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-full font-mono text-[9px] text-slate-500 font-semibold shrink-0">
                          ID: #{user.id}
                        </span>
                      </div>

                      {/* Date details */}
                      <div className="pt-3 border-t border-slate-900/60 flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Calendar size={11} />
                        <span>Joined: {formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── UPDATE PROFILE MODAL ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-md p-6 rounded-2xl space-y-6 relative border border-slate-850"
            >
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div>
                <h3 className="text-lg font-bold">Edit Profil On-Chain</h3>
                <p className="text-xs text-slate-400 mt-1">Perbarui detail nama atau email Anda pada contract database.</p>
              </div>

              <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Nama Lengkap</label>
                  <input
                    type="text"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-medium"
                    placeholder="Nama lengkap..."
                    {...register('name', { required: 'Nama wajib diisi' })}
                  />
                  {errors.name && <span className="text-[10px] text-danger">{errors.name.message}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Alamat Email</label>
                  <input
                    type="email"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-medium"
                    placeholder="Email..."
                    {...register('email', {
                      required: 'Email wajib diisi',
                      pattern: { value: /^\S+@\S+$/i, message: 'Format email tidak valid' }
                    })}
                  />
                  {errors.email && <span className="text-[10px] text-danger">{errors.email.message}</span>}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow transition-colors cursor-pointer"
                  >
                    {isLoading ? 'Mengirim Tx...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CONFIRMATION DELETE PROFILE MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-sm p-6 rounded-2xl space-y-6 relative border border-slate-850"
            >
              <div className="text-center space-y-3">
                <Trash2 className="mx-auto text-danger" size={40} />
                <h3 className="text-lg font-bold text-slate-100">Hapus Profil Blockchain?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tindakan ini akan menghapus data profil Anda secara permanen dari daftar pemetaan smart contract. Anda harus menyetujui transaksi blockchain.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-danger hover:bg-danger/90 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {isLoading ? 'Mengapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
