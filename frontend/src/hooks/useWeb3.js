import { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';

export { Web3Provider } from '../contexts/Web3Context';

/**
 * Custom hook to easily consume the Web3Context state and operations.
 */
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
