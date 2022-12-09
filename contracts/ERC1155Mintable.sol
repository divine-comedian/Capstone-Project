// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts@4.8.0/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts@4.8.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.8.0/token/ERC1155/extensions/ERC1155Supply.sol";

contract PixelsForPeace is ERC1155, Ownable, ERC1155Supply {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC1155("") {
    }

     function _setTokenURI(uint256 tokenId, string memory _tokenURI)
     internal
     virtual
     {
        _tokenURIs[tokenId] = _tokenURI;
     }

    function mint(address recipient, string memory _tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
       _tokenIds.increment();
       uint256 newItemId = _tokenIds.current();
       _mint(recipient, newItemId, 1, "");
       _setTokenURI(newItemId, _tokenURI);
       return newItemId;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

}