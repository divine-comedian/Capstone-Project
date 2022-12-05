import { ethers } from "hardhat";
import * as readline from "readline";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"; 
import * as dotenv from 'dotenv' 
import { MemeFunderNFT__factory } from "../typechain-types";
dotenv.config()



async function main() {
 const provider = new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY )
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
// for testing in VM
// const provider = ethers.getDefaultProvider();
// const accounts = await ethers.getSigners();
  const signer = wallet.connect(provider); 
// // 
 const recipientAddress = '0x62Bb362d63f14449398B79EBC46574F859A6045D'
 const NFTContractFactory = new MemeFunderNFT__factory(signer);
 const NFTContract = await NFTContractFactory.deploy()
 await NFTContract.deployed();
 console.log(`NFT deployed at ${NFTContract.address} by ${signer.address}`)

 const mintTx = await NFTContract.safeMint(recipientAddress, 'QmPrXKWKzNofkgZ236iufwxk3wt9L7hh6DUhihsfMZvpcC');
 await mintTx.wait();
    
    const mintTxReceipt = await provider.getTransactionReceipt(mintTx.hash)
    const mintTxLog =   mintTxReceipt.logs[0].topics[3]
    console.log(parseInt(mintTxLog));

 console.log(`my 1st NFT was minted to ${recipientAddress} with ID of ${parseInt(mintTxLog)} \n`)

 
}

main();


