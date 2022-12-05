// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;



interface IMemeFunderNFT {
    function safeMint(address to, uint256 tokenId) external; 
    function burnFrom(uint256 tokenId) external; 
}

contract TokenSale {
    uint256 public ratio;
    uint256 public price;

    constructor(uint256 _ratio, uint256 _price ,address _paymentToken, address _nftContract){
        ratio = _ratio;
        price = _price;
       // nftContract = IMemeFunderNFT(_nftContract); 
    }
//  function buyTokens() external payable {
//         uint256 amount = msg.value / ratio;
//         paymentToken.mint(msg.sender, amount);
//     }
//     function returnTokens(uint256 amount) external payable  {
//         paymentToken.burnFrom(msg.sender, amount);
//         payable(msg.sender).transfer(amount * ratio);
//     }
// function buyNFT(uint256 tokenId) external payable {
//     paymentToken.transferFrom(msg.sender, address(this), price);
//     nftContract.safeMint(msg.sender, tokenId);
// }
}
