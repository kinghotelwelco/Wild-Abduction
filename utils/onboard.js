import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseModule from '@web3-onboard/coinbase'
import fortmaticModule from '@web3-onboard/fortmatic'


const RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL

const fortmatic = fortmaticModule({
  apiKey: process.env.NEXT_PUBLIC_FORTMATIC_KEY
})

const injected = injectedModule()
const walletConnect = walletConnectModule()
const coinbaseWallet = coinbaseModule()

const initOnboard = init({
  wallets: [walletConnect, coinbaseWallet, injected, fortmatic],
  chains: [
     {
       id: '0x1',
       token: 'ETH',
       label: 'Ethereum Mainnet',
       rpcUrl: 'https://mainnet.infura.io/v3/ababf9851fd845d0a167825f97eeb12b'
     },
    // {
    //   id: '0x3',
    //   token: 'tROP',
    //   label: 'Ethereum Ropsten Testnet',
    //   rpcUrl: 'https://ropsten.infura.io/v3/ababf9851fd845d0a167825f97eeb12b'
    // },
   // {
     // id: '0x4',
    //  token: 'rETH',
   //   label: 'Ethereum Rinkeby Testnet',
    //  rpcUrl: RPC_URL
  //  }
    // {
    //   id: '0x89',
    //   token: 'MATIC',
    //   label: 'Matic Mainnet',
    //   rpcUrl: 'https://matic-mainnet.chainstacklabs.com'
    // }
  ],

})

export { initOnboard }
