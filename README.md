# SmartToken DApp 🚀

A full-stack **Decentralized Application (DApp)** featuring:
- **SmartToken (SMT)** — ERC-20 token with built-in faucet
- **Staking Contract** — Earn 5% APR on staked SMT
- **Premium React Frontend** — Dark glassmorphism UI connected via ethers.js

## Project Structure

```
SmartContract/
├── contracts/
│   ├── SmartToken.sol     # ERC-20 Token (faucet, mint, burn, transfer)
│   └── Staking.sol        # Staking with 5% APR
├── scripts/
│   └── deploy.js          # Deployment script
├── hardhat.config.js      # Hardhat configuration
└── frontend/              # React + Vite app
    └── src/
        ├── App.jsx
        ├── index.css           # Premium design system
        ├── hooks/useWeb3.js    # Web3 & contract hook
        ├── components/
        │   ├── Header.jsx
        │   ├── Dashboard.jsx
        │   ├── TokenCard.jsx
        │   ├── StakingCard.jsx
        │   └── ToastContainer.jsx
        └── utils/
            └── contractAddresses.json  # Auto-filled on deploy
```

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MetaMask](https://metamask.io/) browser extension

---

### Step 1: Install Dependencies

```bash
# Root (Hardhat)
npm install

# Frontend
cd frontend
npm install
cd ..
```

### Step 2: Start Hardhat Local Node

Open a **new terminal** and keep it running:

```bash
npx hardhat node
```

You'll see 20 test accounts with 10,000 ETH each. Import one into MetaMask.

### Step 3: Deploy Contracts

In a **second terminal**:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

This will:
- Deploy `SmartToken` and `Staking` contracts
- Auto-save addresses to `frontend/src/utils/contractAddresses.json`

### Step 4: Start the Frontend

```bash
cd frontend
npm run dev
```

Open **http://localhost:5173**

---

## MetaMask Setup

Add Hardhat network to MetaMask:

| Field | Value |
|-------|-------|
| Network Name | Hardhat Local |
| RPC URL | http://127.0.0.1:8545 |
| Chain ID | 31337 |
| Currency | ETH |

Import a test account using the private key shown in `npx hardhat node` output.

---

## Smart Contracts

### SmartToken (SMT)

| Function | Description |
|----------|-------------|
| `faucet()` | Claim 1,000 SMT (24h cooldown) |
| `transfer(to, amount)` | Send SMT to any address |
| `approve(spender, amount)` | Approve spending allowance |
| `balanceOf(address)` | Check SMT balance |
| `burn(amount)` | Burn tokens |

### Staking

| Function | Description |
|----------|-------------|
| `stake(amount)` | Stake SMT (min: 10 SMT) |
| `unstake()` | Return all staked tokens |
| `claimRewards()` | Claim pending rewards |
| `calculateRewards(user)` | View pending rewards |
| `getStakeInfo(user)` | Full stake details |

**APR:** 5% annually  
**Formula:** `reward = (stakedAmount × 5 × timeElapsed) / (100 × 365 days)`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Solidity ^0.8.20 |
| Dev Environment | Hardhat 2 |
| Frontend | React + Vite |
| Web3 Library | ethers.js v6 |
| Wallet | MetaMask |
| Styling | Vanilla CSS (Glassmorphism) |
| Fonts | Inter + Space Grotesk |

---

> ⚠️ **For educational purposes only.** Not audited for production use.
