import React from 'react';

export default function Dashboard({ ethBalance, tokenBalance, totalSupply, totalStaked, stakeInfo, address }) {
  const fmt = (val, decimals = 2) => {
    const n = parseFloat(val || '0');
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(2) + 'K';
    return n.toFixed(decimals);
  };

  const supplyPercent = totalSupply && totalStaked
    ? Math.min((parseFloat(totalStaked) / parseFloat(totalSupply)) * 100, 100)
    : 0;

  return (
    <div className="fade-in">
      {/* Top Stats Row */}
      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
        {/* ETH Balance */}
        <div className="card card-accent slide-up" style={{ animationDelay: '0ms' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="flex items-center gap-sm">
              <div className="card-icon card-icon-cyan">⟠</div>
              <span className="text-sm text-muted" style={{ fontWeight: 600 }}>ETH Balance</span>
            </div>
            <span className="badge badge-cyan">Native</span>
          </div>
          <div className="stat-value">{fmt(ethBalance, 4)}</div>
          <div className="stat-label">ETH</div>
        </div>

        {/* SMT Balance */}
        <div className="card slide-up" style={{ animationDelay: '80ms' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="flex items-center gap-sm">
              <div className="card-icon card-icon-violet">◈</div>
              <span className="text-sm text-muted" style={{ fontWeight: 600 }}>SMT Balance</span>
            </div>
            <span className="badge badge-violet">ERC-20</span>
          </div>
          <div className="stat-value">{fmt(tokenBalance)}</div>
          <div className="stat-label">SMT Tokens</div>
        </div>

        {/* Staked Amount */}
        <div className="card slide-up" style={{ animationDelay: '160ms' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="flex items-center gap-sm">
              <div className="card-icon card-icon-green">🔒</div>
              <span className="text-sm text-muted" style={{ fontWeight: 600 }}>Staked</span>
            </div>
            <span className="badge badge-green">Earning</span>
          </div>
          <div className="stat-value">{fmt(stakeInfo.stakedAmount)}</div>
          <div className="stat-label">SMT Staked</div>
        </div>
      </div>

      {/* Protocol Stats */}
      <div className="card slide-up" style={{ animationDelay: '200ms' }}>
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon card-icon-violet">📊</div>
            Protocol Overview
          </div>
          <span className="badge badge-cyan">Live</span>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-label">Total Supply</div>
            <div className="stat-value stat-value-sm">{fmt(totalSupply)}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>SMT Minted</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">Total Staked</div>
            <div className="stat-value stat-value-sm">{fmt(totalStaked)}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>SMT Locked</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">Pending Rewards</div>
            <div className="stat-value stat-value-sm" style={{ background: 'var(--grad-success)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {fmt(stakeInfo.totalRewards, 6)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>SMT Earned</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">Staking APR</div>
            <div className="stat-value stat-value-sm" style={{ background: 'var(--grad-success)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>5%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Annual Rate</div>
          </div>
        </div>

        {/* Staking ratio bar */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="text-xs text-muted">Staking Ratio</span>
            <span className="text-xs text-accent font-bold">{supplyPercent.toFixed(1)}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${supplyPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
