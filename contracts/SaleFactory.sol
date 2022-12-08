// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import {Auction} from "./Auction.sol";
import {Lottery} from "./Lottery.sol";



interface IMemeFunderNFT {
    function safeMint(address to, uint256 tokenId) external; 
    function grantRole(bytes32 role, address account) external;
}

contract SaleFactory is Ownable {
    event SaleCreated(address contractAddress);
    Auction auction;
    Lottery lottery;
    address public nftAddress;
    IMemeFunderNFT public nft;

    constructor(
        address _nft
        
    ){
        nft = IMemeFunderNFT(_nft);
    }
 function launchLottery(uint256 betPrice,
        address paymentToken,
        string memory uri,
        address recipient,
        address saleOwner) external payable {
            lottery = new Lottery(betPrice, paymentToken, nftAddress, uri, recipient, saleOwner);
          // need to give minter role to new sale contract !
          //  nft.grantRole(keccak256('MINTER_ROLE'), lottery);
        }


function launchAuction(uint startingBid,
        address paymentToken,
        string memory uri,
        address recipient,
        address saleOwner) external payable {
            auction = new Auction(startingBid, paymentToken, nftAddress, uri, recipient, saleOwner);
        }
        // how can we set a new base nft address?
// function setNFT(address nftAddress) external payable onlyOwner {
//     nftAddress = nft;
// } 
}
