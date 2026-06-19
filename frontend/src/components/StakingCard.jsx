import React, { useState } from 'react';

export default function StakingCard({
  tokenBalance,
  stakeInfo,
  totalStaked,
  isLoading,
  onStake,
  onUnstake,
  onClaimRewards
}) {
  const [stakeAmount, setStakeAmount] = useState('');
  const [activeTab, setActiveTab] = useState('stake');

  const fmt = (val, decimals = 4) => parseFloat(val || '0').toFixed(decimals);

  const isStaked = parseFloat(stakeInfo.stakedAmount) > 0;
  const hasRewards = parseFloat(stakeInfo.totalRewards) > 0;

  const handleStake = (e) => {
    e.preventDefault();
    if (!stakeAmount) return;
    onStake(stakeAmount);
    setStakeAmount('');
  };

  const setMax = () => {
    setStakeAmount(parseFloat(tokenBalance || '0').toFixed(6));
  };

  return (
    <div className="card card-cyan fade-in">
      <div className="card-header">
        <div className="card-title">
          <div className="card-icon card-icon-green">🔒</div>
          Staking
        </div>
        <span className="badge badge-green">5% APR</span>
      </div>

      {/* APR Display */}
      <div className="staking-apr">
        <div className="staking-apr-value">5%</div>
        <div className="staking-apr-label">Annual Percentage Rate</div>
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
        {['stake', 'manage'].map(tab => (
          <button
            key={tab}
            id={`staking-tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === tab ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: activeTab === tab ? 'var(--accent-green)' : 'var(--text-secondary)',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            {tab === 'stake' ? '⬆️ Stake' : '⚙️ Manage'}
          </button>
        ))}
      </div>

      {/* Stake Tab */}
      {activeTab === 'stake' && (
        <form onSubmit={handleStake} className="slide-up">
          <div className="action-info">
            <span className="action-info-label">Minimum Stake</span>
            <span className="action-info-value">10 SMT</span>
          </div>
          <div className="action-info" style={{ marginBottom: '1.5rem' }}>
            <span className="action-info-label">Your Balance</span>
            <span className="action-info-value font-mono">{fmt(tokenBalance, 2)} SMT</span>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="stake-amount">Amount to Stake</label>
              <button
                type="button"
                id="stake-max-btn"
                onClick={setMax}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                }}
              >
                MAX
              </button>
            </div>
            <div className="input-wrapper">
              <input
                id="stake-amount"
                className="form-input"
                type="number"
                placeholder="0.0"
                min="10"
                step="0.000001"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                style={{ paddingRight: '60px' }}
                required
              />
              <span className="input-suffix">SMT</span>
            </div>
          </div>

          {stakeAmount && parseFloat(stakeAmount) >= 10 && (
            <div style={{
              padding: '12px',
              background: 'rgba(16, 185, 129, 0.07)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '10px',
              marginBottom: '1rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span className="text-muted">Estimated daily reward</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
                  +{(parseFloat(stakeAmount) * 0.05 / 365).toFixed(6)} SMT
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '6px' }}>
                <span className="text-muted">Estimated yearly reward</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
                  +{(parseFloat(stakeAmount) * 0.05).toFixed(4)} SMT
                </span>
              </div>
            </div>
          )}

          <button
            id="stake-btn"
            type="submit"
            className={`btn btn-success btn-full ${isLoading ? 'btn-loading' : ''}`}
            disabled={isLoading || !stakeAmount || parseFloat(stakeAmount) < 10}
          >
            {isLoading ? (
              <><div className="spinner" /> Staking...</>
            ) : (
              <>🔒 Stake SMT</>
            )}
          </button>
        </form>
      )}

      {/* Manage Tab */}
      {activeTab === 'manage' && (
        <div className="slide-up">
          {isStaked ? (
            <>
              <div className="action-info">
                <span className="action-info-label">Staked Amount</span>
                <span className="action-info-value font-mono text-green">{fmt(stakeInfo.stakedAmount, 2)} SMT</span>
              </div>
              <div className="action-info">
                <span className="action-info-label">Pending Rewards</span>
                <span className="action-info-value font-mono" style={{ color: 'var(--accent-green)' }}>
                  +{fmt(stakeInfo.totalRewards, 6)} SMT
                </span>
              </div>
              <div className="action-info" style={{ marginBottom: '1.5rem' }}>
                <span className="action-info-label">Total Staked (Protocol)</span>
                <span className="action-info-value font-mono">{fmt(totalStaked, 2)} SMT</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
                <button
                  id="claim-rewards-btn"
                  className={`btn btn-success btn-full ${isLoading ? 'btn-loading' : ''}`}
                  onClick={onClaimRewards}
                  disabled={isLoading || !hasRewards}
                >
                  {isLoading ? (
                    <><div className="spinner" /> Claiming...</>
                  ) : (
                    <>🎁 Claim Rewards</>
                  )}
                </button>
                <button
                  id="unstake-btn"
                  className={`btn btn-danger btn-full ${isLoading ? 'btn-loading' : ''}`}
                  onClick={onUnstake}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><div className="spinner" /> Unstaking...</>
                  ) : (
                    <>🔓 Unstake All</>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="connect-prompt" style={{ padding: '1.5rem' }}>
              <div className="connect-prompt-icon" style={{ width: '60px', height: '60px', fontSize: '1.8rem' }}>💤</div>
              <div className="connect-prompt-title" style={{ fontSize: '1rem' }}>No Active Stake</div>
              <p className="connect-prompt-text" style={{ fontSize: '0.8rem' }}>
                Switch to the Stake tab and start earning 5% APR on your SMT tokens
              </p>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setActiveTab('stake')}
              >
                Start Staking →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
