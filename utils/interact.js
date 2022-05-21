const Web3 = require('web3')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
//const whitelist = require('../../demos/Wild-Abduction/boredape-minting-dapp/scripts/whitelist.js')
const og = require('../scripts/og.js')
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL))

import { config } from '../dapp.config'


//for wl/public
const contract = require('../artifacts/contracts/staking/WildAbduction.sol/WildAbduction.json')
const nftContract = new web3.eth.Contract(contract.abi, config.contractAddressWildAbduction)

//for staking
const contract2 = require('../artifacts/contracts/staking/Bank.sol/Bank.json')
const stakingContract = new web3.eth.Contract(contract2.abi, config.contractAddressBank)

//for land
const contract3 = require('../artifacts/contracts/staking/Land.sol/LAND.json')
const landContract = new web3.eth.Contract(contract3.abi, config.contractAddressLand)

//for nft
const contract4  = require('../artifacts/contracts/staking/WAGGame.sol/WAGGame.json')
const gameContract = new web3.eth.Contract(contract4.abi, config.contractAddressWaGGame)

//for fastDraw
const contract5 = require('../artifacts/contracts/staking/FastDraw.sol/FastDraw.json')
const fastdrawContract = new web3.eth.Contract(contract5.abi, config.contractAddressFastDraw)

//for approval





export const getOG = async () => {
  const validog = (og.indexOf(window.ethereum.selectedAddress) > -1)
  console.log(validog)
  if (validog) {
    return true
  } else {
    return false
  }
}

export const getLandBalance = async () => {
  const result = await landContract.methods.balanceOf(window.ethereum.selectedAddress).call(); // 29803630997051883414242659
  return result
} 

export const getUnclaimedLand = async () => {
 const balance = await stakingContract.methods.balanceOf(window.ethereum.selectedAddress).call()
 return balance
}

export const getLandEarned = async () => {
  const earnedLand = await stakingContract.methods.totalLANDEarned().call()
  return earnedLand
}


export const getTotalMinted = async () => {
  const totalMinted = await nftContract.methods.minted().call()
  return totalMinted
}

//export const getUserMinted = async () => {
 // const minted = await nftContract.methods.
//}

export const isPausedState = async () => {
  const paused = await gameContract.methods.paused().call()
  return paused
}

export const isPublicSaleState = async () => {
  const publicSale = await gameContract.methods.hasPublicSaleStarted().call()
  return publicSale
}

export const isPreSaleState = async () => {
  const preSale = await gameContract.methods.hasPublicSaleStarted().call()
  return preSale
}

export const getPrice = async () => {
  const price = await gameContract.methods.price().call()
  return price
}


export const ogmintandstake = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }

 // const leaf = keccak256(window.ethereum.selectedAddress)
  //const proof = merkleTree.getHexProof(leaf)

  // Verify Merkle Proof
 // const isValid = merkleTree.verify(proof, leaf, root)

////  if (!isValid) {
  //  return {
 //     success: false,
  //    status: 'Invalid Merkle Proof - You are not on the whitelist'
  //  }
  //}

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  
  const tx = {
    to: config.contractAddressWaGGame,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String(0), 'ether')
    ).toString(16), // hex
    data: gameContract.methods
      .mint(1,true)
      .encodeABI(),
    nonce: nonce.toString(16)
  }


  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Etherscan:</p>
          <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Smth went wrong:' + error.message
    }
  }
}

export const ogmint = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }

 // const leaf = keccak256(window.ethereum.selectedAddress)
  //const proof = merkleTree.getHexProof(leaf)

  // Verify Merkle Proof
 // const isValid = merkleTree.verify(proof, leaf, root)

////  if (!isValid) {
  //  return {
 //     success: false,
  //    status: 'Invalid Merkle Proof - You are not on the whitelist'
  //  }
  //}

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  
  const tx = {
    to: config.contractAddressWaGGame,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String(0), 'ether')
    ).toString(16), // hex
    data: gameContract.methods
      .mint(1,false)
      .encodeABI(),
    nonce: nonce.toString(16)
  }


  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Etherscan:</p>
          <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Smth went wrong:' + error.message
    }
  }
}

export const presaleMintandStake = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }

 // const leaf = keccak256(window.ethereum.selectedAddress)
  //const proof = merkleTree.getHexProof(leaf)

  // Verify Merkle Proof
 // const isValid = merkleTree.verify(proof, leaf, root)

////  if (!isValid) {
  //  return {
 //     success: false,
  //    status: 'Invalid Merkle Proof - You are not on the whitelist'
  //  }
  //}

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  
  const tx = {
    to: config.contractAddressWaGGame,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String(config.price * mintAmount), 'ether')
    ).toString(16), // hex
    data: gameContract.methods
      .mint(mintAmount,true)
      .encodeABI(),
    nonce: nonce.toString(16)
  }


  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Etherscan:</p>
          <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Smth went wrong:' + error.message
    }
  }
}


export const presaleMint = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }

 // const leaf = keccak256(window.ethereum.selectedAddress)
 // const proof = merkleTree.getHexProof(leaf)

  // Verify Merkle Proof
  //const isValid = merkleTree.verify(proof, leaf, root)

 // if (!isValid) {
  //  return {
   //   success: false,
   //   status: 'Invalid Merkle Proof - You are not on the whitelist'
   // }
 // }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )


  
  
  const tx = {
    to: config.contractAddressWaGGame,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String(config.price * mintAmount), 'ether')
    ).toString(16), // hex
    data: gameContract.methods
      .mint(mintAmount,false)
      .encodeABI(),
    nonce: nonce.toString(16)
  }


  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Etherscan:</p>
          <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Smth went wrong:' + error.message
    }
  }

}

export const publicMintandStake = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  // Set up our Ethereum transaction
  const tx = {
    to: config.contractAddressWaGGame,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String(config.price * mintAmount), 'ether')
    ).toString(16), // hex
    data: gameContract.methods
    .mint(mintAmount,true).encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Etherscan:</p>
          <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Smth went wrong:' + error.message
    }
  }
}

export const publicMint = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  // Set up our Ethereum transaction
  const tx = {
    to: config.contractAddressWaGGame,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String(config.price * mintAmount), 'ether')
    ).toString(16), // hex
    data: gameContract.methods.mint(mintAmount, false).encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Etherscan:</p>
          <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Smth went wrong:' + error.message
    }
  }
}


export const StakeIt = async () => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to stake, you need to connect your wallet'
    }
  }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  const address = window.ethereum.selectedAddress;
  const balanceOfOwner = +(await nftContract.methods.balanceOf(address).call());
  
  const tokensOfOwner = await Promise.all(
    Array.from(Array(balanceOfOwner).keys()).map(
      async (item) => {
        const tokenID = await nftContract.tokenOfOwnerByIndex(address, item)
        return await stakingContract.addManyToBankAndPack(address, tokenID)
      }
    )
  );

  return {
    success: true,
    status: (
      <a href={`https://rinkeby.etherscan.io/tx/${tokensOfOwner}`} target="_blank">
        <p>✅ Staked! See your transaction on Etherscan:</p>
        <p>{`https://rinkeby.etherscan.io/tx/${tokensOfOwner}`}</p>
      </a>
    ),
    tokens: tokensOfOwner.sort((prev, curr) => +prev.id - +curr.id)
  }
}

export const ClaimIt = async () => {

 const data = JSON.stringify({
   query : `query($id: String) {
    owners(id: $id) {
      tokens (where: {isStaked: true}) {
        tokenId
      }
    }
  }`, variables: {
    id: window.ethereum.selectedAddress
  }});

const tokenIdArray = []

  const stakedData = await fetch('https://api.thegraph.com/subgraphs/name/kinghotelwelco/wag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  })
    .then((res) => res.json())
    .then((result) => result.data.owners[0].tokens.forEach(token => 
      tokenIdArray.push(token.tokenId)))
    console.log(tokenIdArray)


  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )


  // Set up our Ethereum transaction
  const tx = {
    to: config.contractAddressBank,
    from: window.ethereum.selectedAddress,
    data: stakingContract.methods
    .claimManyFromBankAndPack(tokenIdArray,false).encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">
          <p> CLAIMED !
            ✅ Check out your transaction on Etherscan:</p>
          <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Smth went wrong:' + error.message
    }
  }
  } 
  

export const ClaimItandUnstake = async () => {

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )


  const address = window.ethereum.selectedAddress;
  const balanceOfOwner = +(await nftContract.methods.balanceOf(address).call());
  
  const tokensOfOwner = await Promise.all(
    Array.from(Array(balanceOfOwner).keys()).map(
      async (item) => {
        const tokenID = await nftContract.tokenOfOwnerByIndex(address, item)
        return await stakingContract.claimManyToBankAndPack(tokenID, true )
      }
    )
  );

    return {
      success: true,
      status: (
        <a href={`https://rinkeby.etherscan.io/tx/${tokensOfOwner}`} target="_blank">
          <p>✅ Claimed and Unstaked! See your transaction on Etherscan:</p>
          <p>{`https://rinkeby.etherscan.io/tx/${tokensOfOwner}`}</p>
        </a>
      ),
      tokens: tokensOfOwner.sort((prev, curr) => +prev.id - +curr.id)
    }
  } 


//                           FAST DRAW                  \\
//player balance
export const getCurrentBalance = async () => {
  const currBalance = await fastdrawContract.methods.getUserBalance().call()
  console.log(currBalance.toString(10))
  return currBalance
}

export const getRemaining = async () => {
  var maxland = 750000000
  const won = await fastdrawContract.methods.getDistributedLand().call()

   var left = maxland - won
   return left
}

export const isPausedStateFastDraw = async () => {
  const paused = await fastdrawContract.methods.fast_draw_state().call()
  return paused
}


export const getWonLAND = async () => {
  const won = await fastdrawContract.methods.getDistributedLand().call()
  return won
}


export const Deposit = async (landAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to deposit, you need to connect your wallet'
    }
  }
  console.log(landAmount)
  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  // Set up our Ethereum transaction
  const tx = {
    to: config.contractAddressFastDraw,
    from: window.ethereum.selectedAddress,
    data: fastdrawContract.methods
    .addToBalance(landAmount).encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Etherscan:</p>
          <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Smth went wrong:' + error.message
    }
  }
}


export const WithdrawFastDraw = async (total) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to deposit, you need to connect your wallet'
    }
  }
  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  // Set up our Ethereum transaction
  const tx = {
    to: config.contractAddressFastDraw,
    from: window.ethereum.selectedAddress,
    data: fastdrawContract.methods
    .withdrawFromBalance(total).encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Etherscan:</p>
          <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Smth went wrong:' + error.message
    }
  }
}

export const BetLAND = async (amount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to deposit, you need to connect your wallet'
    }
  }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )
 console.log(amount)
  // Set up our Ethereum transaction
  const tx = {
    to: config.contractAddressFastDraw,
    from: window.ethereum.selectedAddress,
    data: fastdrawContract.methods
    .placeBet(amount).encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">
          {amount} $LAND has been bet!
          <p>✅ Check out your transaction on Etherscan:</p>
          <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Smth went wrong:' + error.message
    }
  }
}  


export const enable = async (total) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to deposit, you need to connect your wallet'
    }
  }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )


  const tx = {
    to: config.contractAddressLand,
    from: window.ethereum.selectedAddress,
    data: landContract.methods
    .approve(config.contractAddressFastDraw, total).encodeABI(),
    nonce: nonce.toString(16)
  }
  
  
  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Etherscan:</p>
          <p>{`https://rinkeby.etherscan.io/tx/${txHash}

          MAKE SURE TO CHECK IF IT HAS BEEN CONFIRMED (SUCCESS) BEFORE DEPOSITING`}</p>
        </a>
      )
    }
  }
    catch (error) {
      return {
        success: false,
        status: '😞 Smth went wrong:' + error.message
      }
    }
}