// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import {Auction} from "./Auction.sol";
import {Lottery} from "./Lottery.sol";



interface IMemeFunderNFT {
    function safeMint(address to, uint256 tokenId) external; 
}

contract SaleFactory {
    Auction auction;
    Lottery lottery;

    constructor(){
    }
 function launchLottery(uint256 betPrice,
        address paymentToken,
        address nft,
        uint nftId,
        address recipient) external payable {
            lottery = new Lottery(betPrice, paymentToken, nft, nftId, recipient);
        }

function launchAuction(uint startingBid,
        address paymentToken,
        address nft,
        uint nftId,
        address recipient) external payable {
            auction = new Auction(startingBid, paymentToken, nft, nftId, recipient);
        }
}
