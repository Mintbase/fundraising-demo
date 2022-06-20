import '../styles/globals.css'
import { WalletProvider } from '../data/wallet'

function MyApp({ Component, pageProps }) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  )
}

export default MyApp
