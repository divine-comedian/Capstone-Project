import { ethers } from "hardhat";
import * as readline from "readline";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"; 
import * as dotenv from 'dotenv' 
import { Auction__factory, MyToken__factory, PixelsForPeaceNFT__factory, SaleFactory__factory } from "../typechain-types";
import { arrayify, Bytes, isBytes, keccak256, parseBytes32String } from "ethers/lib/utils";
import { saleFactorySol } from "../typechain-types/contracts";
dotenv.config()
import { BigNumberish } from "ethers";
import AuctionJson from '../artifacts/contracts/Auction.sol/Auction.json'

const auctionIface = new ethers.utils.Interface(AuctionJson.abi)


const STARTING_BID = 30;
const URI = 'QmPrXKWKzNofkgZ236iufwxk3wt9L7hh6DUhihsfMZvpcC'
const CLOSING_TIME = 1670955531
const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000'
const altAddress = "0x06263e1A856B36e073ba7a50D240123411501611"
const paymentToken = "0xc9269d42d7450d7c62038B301e2F9b4ed6DF2155"
const nftAddress = "0x2d2b1310E029334eeaD85D1a33796c1b367e712C"
const SALE_CONTRACT = "0x765b6b2477cDd8cE419d9fF939BecbE3AC5FF04b"

async function main() {
    // connect signers
 const provider = new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY )
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
const altWallet = new ethers.Wallet(process.env.PRIVATE_KEY2 ?? "")
const altSigner = altWallet.connect(provider);
 const signer = wallet.connect(provider);

 // const CurrentAuctionContract = Auction__factory.connect('0x377840fdcb761e5ee3fc4845fdc00cd2a9012635e6ee12dd7b71222088d8ac96', signer);
 //   const highestBidder =  await CurrentAuctionContract.highestBidder()
 //   const highestBid = await CurrentAuctionContract.highestBid();
    //     console.log(`the highest bid is ${highestBid} placed by ${highestBidder}`);
//    
    //    console.log(Date.now())
    //    console.log(CLOSING_TIME)
//    
    //     if (Date.now() > CLOSING_TIME) {
    //        const endTx = await CurrentAuctionContract.end()
    //        await endTx.wait();
    //        console.log(`auction ended with ${endTx.hash} \n`)
        const endAuctionReceipt = await provider.getTransactionReceipt('0x377840fdcb761e5ee3fc4845fdc00cd2a9012635e6ee12dd7b71222088d8ac96')
    const decodedAuctionData = auctionIface.parseLog(endAuctionReceipt.logs[3])
    console.log(decodedAuctionData)
    
   //      }
   //  else {
   //     console.log('too early to end')
   //  }

}

main()