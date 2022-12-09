// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import {Auction} from "./Auction.sol";
import {Lottery} from "./Lottery.sol";



interface IMemeFunderNFT {
    function grantRole(bytes32 role, address account) external;
}

contract SaleFactory is Ownable {
    event SaleCreated(address saleAddress, string typeOfSale, address saleOwner, string nftURI);
    Auction auction;
    Lottery lottery;
    address public nftAddress;
    IMemeFunderNFT public nft;

    constructor(
        address _nft
        
    ){
        nft = IMemeFunderNFT(_nft);
        nftAddress = _nft;
    }
/// Launch Lottery token
///@param betPrice this is the price in WEI each user will pay to place a bet 
///@param paymentToken the address of the ERC20 token you will accept betPrice in
///@param uri the CID of the nft metadata
///@param recipient the address of the recipient/charity that will receive the raised sale funds 
 function launchLottery(uint256 betPrice,
        address paymentToken,
        string memory uri,
        address recipient
        ) external {
            address saleOwner = msg.sender;
            lottery = new Lottery(betPrice, paymentToken, nftAddress, uri, recipient, saleOwner);
          emit SaleCreated(address(lottery), 'lottery', saleOwner, uri);
          // need to give minter role to new sale contract !
          nft.grantRole(keccak256('MINTER_ROLE'), address(lottery));
        }

// launch a lottery 
///@param startingBid the initial bid price in WEI to begin your auction at 
///@param paymentToken the address of the ERC20 token you will accept betPrice in
///@param uri the CID of the nft metadata
///@param recipient the address of the recipient/charity that will receive the raised sale funds 
function launchAuction(uint startingBid,
        address paymentToken,
        string memory uri,
        address recipient   
        ) external {
            address saleOwner = msg.sender;
            auction = new Auction(startingBid, paymentToken, nftAddress, uri, recipient, saleOwner);
          emit SaleCreated(address(auction), 'auction', saleOwner, uri);
            nft.grantRole(keccak256('MINTER_ROLE'), address(auction));

        }
 // set a new base NFT contract to mint your sale nfts from
 ///@param newAddress the address of the nft contract to mint your nfts from
 function setNFT(address newAddress) external onlyOwner {
     nft = IMemeFunderNFT(newAddress);
     nftAddress = newAddress; 
     } 
}