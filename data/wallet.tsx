import * as nearAPI from 'near-api-js';
import { WalletConnection } from 'near-api-js';
import { createContext, useContext, useEffect, useState } from 'react';

type WalletState = {
  wallet: nearAPI.WalletConnection | null;
  isConnected: boolean;
}

type WalletActions = {
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const intializeNearWallet = async () => {
  console.info('Intializing NEAR/Wallet Connection');
  const { keyStores, connect, WalletConnection } = nearAPI;
  const keyStore = new keyStores.BrowserLocalStorageKeyStore();

  const config: nearAPI.ConnectConfig = {
    networkId: "mainnet",
    keyStore, 
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.mainnet.near.org",
    headers: {},
  };
  const near = await connect(config);
  const wallet: WalletConnection = new WalletConnection(near, null);
  return {
    near,
    wallet,
    isConnected: wallet.isSignedIn()
  }
};

const WalletContext = createContext<WalletState & WalletActions>({ 
  wallet: null, 
  isConnected: false,
  connectWallet: () => null,
  disconnectWallet: () => null,
});

export const WalletProvider = ({ children }) => {
  const [state, setState] = useState<WalletState>()
  useEffect(() => {
    // prevent ssr
    if (typeof window === 'undefined') {
      return;
    }
    
    (async () => {
      // TODO: if sender wallet is detected, use it!  
      if (global.near) {
        console.info('has sender!')
      }
      const { wallet, near, isConnected } = await intializeNearWallet();
      // For future mintbase examples, might be nice to include these: 
      // if (isConnected) {
      //   const account = await near.account(wallet.getAccountId());
      //   const details = await account.getAccountDetails();
      //   console.log(account, details);
      // }
      
      setState({ wallet, isConnected });
    })()
    // This effect should only be fired once, because redirect from wallet happens.
  }, [])

  const connectWallet = () => {
    state.wallet.requestSignIn(
      "run.mintbase1.near", // contract requesting access
      // "Run!", // optional
      // "http://YOUR-URL.com/success", // optional
      // "http://YOUR-URL.com/failure" // optional
    )
  }

  const disconnectWallet = () => {
    state.wallet.signOut()
  }
  
  return (
    <WalletContext.Provider value={{...state, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext);
