import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import contractAddressesJson from '../utils/contractAddresses.json';
import UserManagementAbi from '../utils/abis/UserManagement.json';

export const Web3Context = createContext(null);

const HARDHAT_CHAIN_ID = 31337;
const CONTRACT_ADDRESS = contractAddressesJson.UserManagement;

export function Web3Provider({ children }) {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    address: null,
    chainId: null,
    ethBalance: '0',
    isConnected: false,
    isCorrectNetwork: false,
    isLoading: false,
    currentUser: null,
    isRegistered: false,
    allUsers: [],
    contractAddress: CONTRACT_ADDRESS,
  });

  const [toasts, setToasts] = useState([]);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('web3_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const contractRef = useRef(null);

  // ── Toast System ───────────────────────────────────────────────────────────
  const addToast = useCallback((type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Save transactions to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('web3_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Log transactions helper
  const logTransaction = useCallback((hash, action, status, gasUsed = '0') => {
    const newTx = {
      hash,
      action,
      timestamp: Date.now(),
      status,
      gasUsed,
    };
    setTransactions(prev => [newTx, ...prev].slice(0, 50)); // Keep last 50 transactions
  }, []);

  // ── Load Contract & User Details ───────────────────────────────────────────
  const loadContractData = useCallback(async (provider, signer, address) => {
    if (!CONTRACT_ADDRESS || !provider || !signer) return;

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, UserManagementAbi, signer);
      contractRef.current = contract;

      // Check registration
      const isRegistered = await contract.isUserRegistered(address);
      let currentUser = null;

      if (isRegistered) {
        const userData = await contract.getUser(address);
        currentUser = {
          id: Number(userData[0]),
          name: userData[1],
          email: userData[2],
          createdAt: Number(userData[3]),
        };
      }

      // Fetch all users
      const rawUsers = await contract.getAllUsers();
      const allUsers = rawUsers.map(u => ({
        id: Number(u[0]),
        name: u[1],
        email: u[2],
        createdAt: Number(u[3]),
      }));

      const ethBal = await provider.getBalance(address);

      setState(prev => ({
        ...prev,
        ethBalance: ethers.formatEther(ethBal),
        currentUser,
        isRegistered,
        allUsers,
      }));
    } catch (err) {
      console.error('Error loading contract data:', err);
    }
  }, []);

  // Refresh current data wrapper
  const refreshData = useCallback(async () => {
    const s = stateRef.current;
    if (s.provider && s.signer && s.address) {
      await loadContractData(s.provider, s.signer, s.address);
    }
  }, [loadContractData]);

  // ── Network Switching ──────────────────────────────────────────────────────
  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${HARDHAT_CHAIN_ID.toString(16)}` }],
      });
      addToast('success', 'Network Switched', 'Connected to Hardhat Local Network');
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${HARDHAT_CHAIN_ID.toString(16)}`,
                chainName: 'Hardhat Localhost',
                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['http://127.0.0.1:8545'],
              },
            ],
          });
          addToast('success', 'Network Added', 'Hardhat network added and switched');
        } catch (addError) {
          addToast('error', 'Network Switch Failed', addError.message);
        }
      } else {
        addToast('error', 'Network Switch Failed', switchError.message);
      }
    }
  }, [addToast]);

  // ── Connect Wallet ─────────────────────────────────────────────────────────
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      addToast('error', 'MetaMask Required', 'Please install MetaMask to use this application.');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      const signer = await browserProvider.getSigner();
      const address = accounts[0];
      const network = await browserProvider.getNetwork();
      const chainId = Number(network.chainId);
      const isCorrectNetwork = chainId === HARDHAT_CHAIN_ID;

      setState(prev => ({
        ...prev,
        provider: browserProvider,
        signer,
        address,
        chainId,
        isConnected: true,
        isCorrectNetwork,
        isLoading: false,
      }));

      if (!isCorrectNetwork) {
        addToast('warning', 'Wrong Network', 'Please switch to Hardhat Local network.');
        await switchNetwork();
      } else {
        addToast('success', 'Wallet Connected', `${address.substring(0, 6)}...${address.substring(address.length - 4)}`);
        await loadContractData(browserProvider, signer, address);
      }
    } catch (err) {
      console.error(err);
      setState(prev => ({ ...prev, isLoading: false }));
      addToast('error', 'Connection Failed', err.message || 'MetaMask connection rejected');
    }
  }, [addToast, loadContractData, switchNetwork]);

  // Disconnect wallet simulation
  const disconnectWallet = useCallback(() => {
    setState({
      provider: null,
      signer: null,
      address: null,
      chainId: null,
      ethBalance: '0',
      isConnected: false,
      isCorrectNetwork: false,
      isLoading: false,
      currentUser: null,
      isRegistered: false,
      allUsers: [],
      contractAddress: CONTRACT_ADDRESS,
    });
    addToast('info', 'Disconnected', 'Wallet connection disconnected.');
  }, [addToast]);

  // ── CRUD Operations ────────────────────────────────────────────────────────
  const createUser = useCallback(async (name, email) => {
    const { signer, address, provider } = stateRef.current;
    if (!contractRef.current || !signer || !provider) {
      addToast('error', 'Wallet Error', 'Wallet not connected.');
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    let txHash = '';
    try {
      // Estimate gas
      let gasEstimate;
      try {
        gasEstimate = await contractRef.current.createUser.estimateGas(name, email);
      } catch (e) {
        gasEstimate = 150000n; // fallback
      }

      // Trigger transaction
      const tx = await contractRef.current.createUser(name, email, {
        gasLimit: (gasEstimate * 120n) / 100n, // +20% buffer
      });
      txHash = tx.hash;
      logTransaction(txHash, 'Register User', 'pending');
      addToast('info', 'Transaction Initiated', 'Sign the transaction in MetaMask and wait.');

      const receipt = await tx.wait();
      logTransaction(txHash, 'Register User', 'success', receipt.gasUsed.toString());
      addToast('success', 'Registration Successful', 'Your Web3 identity has been registered.');
      await loadContractData(provider, signer, address);
      return true;
    } catch (err) {
      console.error(err);
      if (txHash) {
        logTransaction(txHash, 'Register User', 'failed');
      }
      addToast('error', 'Transaction Failed', err.reason || err.message || 'Transaction rejected.');
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [addToast, logTransaction, loadContractData]);

  const updateUser = useCallback(async (name, email) => {
    const { signer, address, provider } = stateRef.current;
    if (!contractRef.current || !signer || !provider) {
      addToast('error', 'Wallet Error', 'Wallet not connected.');
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    let txHash = '';
    try {
      let gasEstimate;
      try {
        gasEstimate = await contractRef.current.updateUser.estimateGas(name, email);
      } catch (e) {
        gasEstimate = 100000n;
      }

      const tx = await contractRef.current.updateUser(name, email, {
        gasLimit: (gasEstimate * 120n) / 100n,
      });
      txHash = tx.hash;
      logTransaction(txHash, 'Update Profile', 'pending');
      addToast('info', 'Transaction Initiated', 'Updating profile on-chain...');

      const receipt = await tx.wait();
      logTransaction(txHash, 'Update Profile', 'success', receipt.gasUsed.toString());
      addToast('success', 'Profile Updated', 'Your profile details have been saved on-chain.');
      await loadContractData(provider, signer, address);
      return true;
    } catch (err) {
      console.error(err);
      if (txHash) {
        logTransaction(txHash, 'Update Profile', 'failed');
      }
      addToast('error', 'Update Failed', err.reason || err.message || 'Transaction rejected.');
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [addToast, logTransaction, loadContractData]);

  const deleteUser = useCallback(async () => {
    const { signer, address, provider } = stateRef.current;
    if (!contractRef.current || !signer || !provider) {
      addToast('error', 'Wallet Error', 'Wallet not connected.');
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    let txHash = '';
    try {
      let gasEstimate;
      try {
        gasEstimate = await contractRef.current.deleteUser.estimateGas();
      } catch (e) {
        gasEstimate = 80000n;
      }

      const tx = await contractRef.current.deleteUser({
        gasLimit: (gasEstimate * 120n) / 100n,
      });
      txHash = tx.hash;
      logTransaction(txHash, 'Delete Profile', 'pending');
      addToast('info', 'Transaction Initiated', 'Deleting profile from smart contract...');

      const receipt = await tx.wait();
      logTransaction(txHash, 'Delete Profile', 'success', receipt.gasUsed.toString());
      addToast('success', 'Profile Deleted', 'Your profile data has been removed from blockchain.');
      await loadContractData(provider, signer, address);
      return true;
    } catch (err) {
      console.error(err);
      if (txHash) {
        logTransaction(txHash, 'Delete Profile', 'failed');
      }
      addToast('error', 'Deletion Failed', err.reason || err.message || 'Transaction rejected.');
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [addToast, logTransaction, loadContractData]);

  // ── Auto Reconnect ─────────────────────────────────────────────────────────
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await browserProvider.listAccounts();
          if (accounts.length > 0) {
            const signer = await browserProvider.getSigner();
            const address = accounts[0].address;
            const network = await browserProvider.getNetwork();
            const chainId = Number(network.chainId);
            const isCorrectNetwork = chainId === HARDHAT_CHAIN_ID;

            setState(prev => ({
              ...prev,
              provider: browserProvider,
              signer,
              address,
              chainId,
              isConnected: true,
              isCorrectNetwork,
            }));

            if (isCorrectNetwork) {
              await loadContractData(browserProvider, signer, address);
            }
          }
        } catch (err) {
          console.error('Auto reconnect failed:', err);
        }
      }
    };
    checkConnection();
  }, [loadContractData]);

  // ── Listen for accounts & network changes ──────────────────────────────────
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        const address = accounts[0];
        const network = await browserProvider.getNetwork();
        const chainId = Number(network.chainId);
        const isCorrectNetwork = chainId === HARDHAT_CHAIN_ID;

        setState(prev => ({
          ...prev,
          provider: browserProvider,
          signer,
          address,
          chainId,
          isConnected: true,
          isCorrectNetwork,
        }));

        if (isCorrectNetwork) {
          await loadContractData(browserProvider, signer, address);
        }
        addToast('info', 'Account Switched', `Switched to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`);
      }
    };

    const handleChainChanged = (_chainId) => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [disconnectWallet, loadContractData, addToast]);

  // ── Smart Contract Event Listeners ─────────────────────────────────────────
  useEffect(() => {
    const contract = contractRef.current;
    if (!contract) return;

    const onUserCreated = (userAddress, id, name, email, createdAt) => {
      addToast('success', 'New User Registered', `${name} joined the platform!`);
      refreshData();
    };

    const onUserUpdated = (userAddress, name, email) => {
      addToast('info', 'User Updated', `${name} updated their profile.`);
      refreshData();
    };

    const onUserDeleted = (userAddress, id) => {
      addToast('warning', 'User Deleted', `Profile with ID ${id} was deleted.`);
      refreshData();
    };

    contract.on('UserCreated', onUserCreated);
    contract.on('UserUpdated', onUserUpdated);
    contract.on('UserDeleted', onUserDeleted);

    return () => {
      contract.off('UserCreated', onUserCreated);
      contract.off('UserUpdated', onUserUpdated);
      contract.off('UserDeleted', onUserDeleted);
    };
  }, [state.isConnected, state.isCorrectNetwork, refreshData, addToast]);

  return (
    <Web3Context.Provider
      value={{
        ...state,
        toasts,
        transactions,
        addToast,
        removeToast,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        createUser,
        updateUser,
        deleteUser,
        refreshData,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}
