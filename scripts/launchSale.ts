import { ethers } from "hardhat";
import * as readline from "readline";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"; 
import * as dotenv from 'dotenv' 
import { MyToken__factory, PixelsForPeaceNFT__factory, SaleFactory__factory } from "../typechain-types";
import { arrayify, Bytes, isBytes, keccak256, parseBytes32String } from "ethers/lib/utils";
import { saleFactorySol } from "../typechain-types/contracts";
dotenv.config()
import { BigNumberish } from "ethers";
import saleFactoryJson from '../artifacts/contracts/SaleFactory.sol/SaleFactory.json'

const saleFactoryIface = new ethers.utils.Interface(saleFactoryJson.abi)


const STARTING_BID = 30;
const URI = 'QmPrXKWKzNofkgZ236iufwxk3wt9L7hh6DUhihsfMZvpcC'
const CLOSING_TIME = 1670902234
const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000'
const altAddress = "0x06263e1A856B36e073ba7a50D240123411501611"
const ERC20 = "0xc9269d42d7450d7c62038B301e2F9b4ed6DF2155"
const ERC721 = "0x2d2b1310E029334eeaD85D1a33796c1b367e712C"
const SALE_CONTRACT = "0x765b6b2477cDd8cE419d9fF939BecbE3AC5FF04b"

async function main() {
 const provider = new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY )
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
 const signer = wallet.connect(provider)
//// for testing in VM
////const provider = ethers.getDefaultProvider();
////const accounts = await ethers.getSigners();
////  const signer = accounts[0]; 
//// // deploy example ERC20
//const TokenContractFactory = new MyToken__factory(signer);
//const TokenContract = await TokenContractFactory.deploy()
//await TokenContract.deployed();
//const TokenAddress = TokenContract.address;
//const signerBalance = await TokenContract.balanceOf(signer.address);
//console.log(`example ERC20 was deployed at ${TokenAddress} and the signer has ${signerBalance} tokens`)
//
//// deploy example NFT
// const NFTContractFactory = new PixelsForPeaceNFT__factory(signer);
// const NFTContract = await NFTContractFactory.deploy()
// await NFTContract.deployed();
// const NFTaddress = NFTContract.address
// console.log(`NFT deployed at ${NFTContract.address} by ${signer.address} \n`)
//
// //deploy example sale contract
// const saleContractFactory = new SaleFactory__factory(signer);
// const saleContract = await saleContractFactory.deploy(NFTaddress)
// await saleContract.deployed();
// const saleContractAddress = saleContract.address;
// console.log(`the sale contract was deployed to ${saleContractAddress} with the nft ${NFTaddress} \n`)
// // grant admin role to sale contract for nft - to assign other minters 
// await NFTContract.grantRole(ethers.utils.arrayify(DEFAULT_ADMIN_ROLE), saleContractAddress);
 // laucnch auction
// const saleContract = SaleFactory__factory.connect("0x765b6b2477cDd8cE419d9fF939BecbE3AC5FF04b", signer)
// const launchAuctionTx = await saleContract.launchAuction(30, ERC20, URI, altAddress, CLOSING_TIME);
// await launchAuctionTx.wait()
// console.log(launchAuctionTx.hash);
const launchAuctionReceipt = await provider.getTransactionReceipt("0x3c19d105641105027a8ad5eac6246bd7e267e1069236c18054c8eaaad8583700")
console.log(launchAuctionReceipt)
const launchAuctionLog = launchAuctionReceipt.logs[1].data;
console.log(`${launchAuctionLog} \n`)
let decodedAuctionData = saleFactoryIface.parseLog(launchAuctionReceipt.logs[1]);

console.log(decodedAuctionData.args[1])
    
 //    const mintTxReceipt = await provider.getTransactionReceipt(mintTx.hash)
 //    const mintTxLog =   mintTxReceipt.logs[0].topics[3]
 //    console.log(parseInt(mintTxLog));
// 
 // console.log(`my 1st NFT was minted to ${recipientAddress} with ID of ${parseInt(mintTxLog)} \n`)

 
}

main();


