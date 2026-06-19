import React, { useState } from 'react';

export default function TokenCard({ tokenBalance, faucetCooldown, isLoading, onFaucet, onTransfer }) {
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [activeTab, setActiveTab] = useState('faucet');

  const formatCooldown = (seconds) => {
    if (seconds <= 0) return null;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    if (!transferTo || !transferAmount) return;
    onTransfer(transferTo, transferAmount);
    setTransferTo('');
    setTransferAmount('');
  };

  const isFaucetReady = faucetCooldown <= 0;
  const cooldownText = formatCooldown(faucetCooldown);

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-title">
          <div className="card-icon card-icon-violet">◈</div>
          Token Management
        </div>
        <span className="badge badge-violet">SMT</span>
      </div>

      {/* Tab switcher */}
      <div style={{
        display: 'flex',
        gap: '4px',
        background: 'rgba(255,255,255,0.04)',
        padding: '4px',
        borderRadius: '12px',
        marginBottom: '1.5rem',
      }}>
        {['faucet', 'transfer'].map(tab => (
          <button
            key={tab}
            id={`token-tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === tab ? 'rgba(124, 58, 237, 0.25)' : 'transparent',
              color: activeTab === tab ? 'var(--accent-violet-light)' : 'var(--text-secondary)',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)',
              textTransform: 'capitalize',
            }}
          >
            {tab === 'faucet' ? '🚰 Faucet' : '📤 Transfer'}
          </button>
        ))}
      </div>

      {/* Faucet Tab */}
      {activeTab === 'faucet' && (
        <div className="slide-up">
          <div className="action-info">
            <span className="action-info-label">Faucet Amount</span>
            <span className="action-info-value" style={{ color: 'var(--accent-violet-light)' }}>1,000 SMT</span>
          </div>
          <div className="action-info">
            <span className="action-info-label">Cooldown</span>
            <span className="action-info-value">{isFaucetReady ? '✅ Ready' : `⏳ ${cooldownText}`}</span>
          </div>
          <div className="action-info" style={{ marginBottom: '1.5rem' }}>
            <span className="action-info-label">Your Balance</span>
            <span className="action-info-value font-mono">{parseFloat(tokenBalance || 0).toFixed(2)} SMT</span>
          </div>

          <button
            id="faucet-btn"
            className={`btn btn-primary btn-full btn-lg ${isLoading ? 'btn-loading' : ''}`}
            onClick={onFaucet}
            disabled={!isFaucetReady || isLoading}
          >
            {isLoading ? (
              <><div className="spinner" /> Processing...</>
            ) : isFaucetReady ? (
              <>🚰 Claim 1,000 SMT</>
            ) : (
              <>⏳ Cooldown {cooldownText}</>
            )}
          </button>

          <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Claimable once every 24 hours
          </p>
        </div>
      )}

      {/* Transfer Tab */}
      {activeTab === 'transfer' && (
        <form onSubmit={handleTransfer} className="slide-up">
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="transfer-to">Recipient Address</label>
            <div className="input-wrapper">
              <input
                id="transfer-to"
                className="form-input"
                type="text"
                placeholder="0x..."
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="transfer-amount">Amount</label>
            <div className="input-wrapper">
              <input
                id="transfer-amount"
                className="form-input"
                type="number"
                placeholder="0.0"
                min="0"
                step="0.000001"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                style={{ paddingRight: '60px' }}
                required
              />
              <span className="input-suffix">SMT</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span className="text-xs text-muted">
                Balance: <span className="text-accent">{parseFloat(tokenBalance || 0).toFixed(2)} SMT</span>
              </span>
            </div>
          </div>

          <button
            id="transfer-btn"
            type="submit"
            className={`btn btn-primary btn-full ${isLoading ? 'btn-loading' : ''}`}
            disabled={isLoading || !transferTo || !transferAmount}
          >
            {isLoading ? (
              <><div className="spinner" /> Sending...</>
            ) : (
              <>📤 Send SMT</>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
