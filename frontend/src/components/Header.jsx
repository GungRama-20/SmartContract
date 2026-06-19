import React from 'react';

export default function Header({ address, chainId, isConnected, isCorrectNetwork, onConnect, isLoading }) {
  const shortenAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  const networkName = () => {
    if (!isConnected) return 'Not Connected';
    if (chainId === 31337) return 'Hardhat Local';
    if (chainId === 11155111) return 'Sepolia';
    if (chainId === 1) return 'Ethereum';
    return `Chain ${chainId}`;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">⬡</div>
            <span className="logo-text">SmartToken</span>
            <span className="logo-badge">DApp</span>
          </div>

          {/* Right side */}
          <div className="header-right">
            {/* Network badge */}
            <div className="network-badge">
              <div className={`network-dot ${isConnected && isCorrectNetwork ? '' : 'disconnected'}`} />
              {networkName()}
            </div>

            {/* Wallet button or address */}
            {isConnected ? (
              <div
                className="address-display"
                onClick={copyAddress}
                title="Click to copy address"
                id="address-display"
              >
                <div className="address-avatar" />
                <span className="address-text">{shortenAddress(address)}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>📋</span>
              </div>
            ) : (
              <button
                id="connect-wallet-btn"
                className={`btn btn-primary ${isLoading ? 'btn-loading' : ''}`}
                onClick={onConnect}
                disabled={isLoading}
              >
                {isLoading ? (
                  <><div className="spinner" /> Connecting...</>
                ) : (
                  <>🦊 Connect Wallet</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
