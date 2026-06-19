import React, { useState } from 'react';
import { Search, ExternalLink, Copy, Check, Clock, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';

export default function TransactionHistory() {
  const { isConnected, transactions, addToast } = useWeb3();
  const [search, setSearch] = useState('');
  const [copiedHash, setCopiedHash] = useState(null);

  const copyToClipboard = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    addToast('success', 'Hash Copied', 'Transaction hash copied to clipboard.');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredTransactions = transactions.filter(tx =>
    tx.hash.toLowerCase().includes(search.toLowerCase()) ||
    tx.action.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <ShieldCheck className="text-success" size={16} />;
      case 'pending':
        return <Clock className="text-warning animate-pulse" size={16} />;
      default:
        return <AlertTriangle className="text-danger" size={16} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return (
          <span className="px-2 py-0.5 bg-success/15 border border-success/20 rounded-full text-success text-[10px] font-semibold">
            Success
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-0.5 bg-warning/15 border border-warning/20 rounded-full text-warning text-[10px] font-semibold animate-pulse">
            Pending
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-danger/15 border border-danger/20 rounded-full text-danger text-[10px] font-semibold">
            Failed
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Transaction History</h1>
          <p className="text-slate-400 text-sm mt-1">Lacak riwayat lengkap pengiriman transaksi blockchain dan biaya komputasi gas.</p>
        </div>

        {/* Search bar */}
        {isConnected && transactions.length > 0 && (
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium"
              placeholder="Cari hash atau operasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {!isConnected ? (
        <div className="glass-panel p-8 rounded-2xl text-center space-y-4 border border-yellow-500/10">
          <AlertTriangle className="mx-auto text-warning" size={48} />
          <h3 className="text-xl font-bold">Dompet Tidak Terhubung</h3>
          <p className="text-slate-400 max-w-md mx-auto text-sm">
            Silakan sambungkan dompet Anda terlebih dahulu untuk melihat catatan aktivitas lokal.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-900 overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-20 text-slate-500 space-y-3">
              <RefreshCw className="mx-auto text-slate-600 animate-spin-slow" size={32} />
              <div>
                <p className="text-sm font-semibold">Belum Ada Transaksi Tercatat</p>
                <p className="text-xs text-slate-600 max-w-xs mx-auto mt-1">
                  Transaksi yang Anda lakukan pada smart contract platform ini akan tercatat secara lokal di sini.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 border-b border-slate-900 text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Aksi / Operasi</th>
                    <th className="px-6 py-4">Transaction Hash</th>
                    <th className="px-6 py-4">Waktu</th>
                    <th className="px-6 py-4">Gas Used (Units)</th>
                    <th className="px-6 py-4 text-right">Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-xs">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.hash} className="hover:bg-slate-900/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(tx.status)}
                          {getStatusBadge(tx.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-200">{tx.action}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 font-mono text-slate-400">
                          <span>{tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}</span>
                          <button
                            onClick={() => copyToClipboard(tx.hash)}
                            className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedHash === tx.hash ? <Check className="text-success" size={13} /> : <Copy size={13} />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                        {new Date(tx.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-400">
                        {tx.gasUsed !== '0' ? parseInt(tx.gasUsed).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <a
                          href={`https://etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors font-medium"
                        >
                          Verify <ExternalLink size={11} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
