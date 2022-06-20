import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { fetchDonatableTokens } from '../data/tokens'
import { useWallet } from '../data/wallet'
import { Loader } from '../components/Loader'


export default function Home({ tokens }) {
  const { wallet, isInitializing, isConnected, connectWallet, disconnectWallet } = useWallet()
  return (
    <div className={styles.container}>
      <Head>
        <title>Run! A fundraiser POC on NEAR Protocol for the 2022 Dublin Marathon</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Image src="/run-logo.svg" width={400} height={190} alt="Run! A Fundraiser on NEAR protocol" />  
        
        <p className={styles.description}>
          This is a fundraising client demo on NEAR Protocol for the 2022 Dublin Marathon.
        </p>
        
        {isInitializing && <Loader text="Connecting to NEAR..." />}

        {!isInitializing && !isConnected &&  
            <button className={styles.button} onClick={connectWallet}>Connect NEAR Wallet</button>    
        }

        {!isInitializing && isConnected &&  
            <div className={styles.walletstatus}>
              <p>Connected to {wallet.getAccountId()}</p>
              <button className={styles.button} onClick={disconnectWallet}>Disconnect NEAR Wallet</button>    
            </div>
        }
        <br />
        
        <p className={styles.walletstatus}>
          To pledge a donation, then select a distance token/amount to pledge.
        </p>


        <code className={styles.code}>
          {/* {JSON.stringify(wallet.getAccountId())} */}
        </code>
        <div className={styles.tokens}>
          {tokens.map((token) => (
            <div key={token.referenceId} className={styles.token}>
              <Image src={token.media} width={400} height={400} alt={token.title} />
            </div>
          ))}
          <div className={styles.token}>
            <h2>
              All Proceeds are donated to charity! (TBD)
            </h2>
          </div>
        </div>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://min"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/mintbase1.svg" alt="Mintbase Logo" width={120} height={26} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps() {
  const tokens = await fetchDonatableTokens();
  const stats = {
    totalRaised: 0,
    totalGoal: 0
  };
  return {
    props: {
      tokens,
      stats    
    },
  };
}
