// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC1155Mintable is ERC1155, AccessControl {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => string) private _tokenURIs;
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC1155("PixelsForPeace") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
    internal
    virtual
    {
       _tokenURIs[tokenId] = _tokenURI;
    }

    function mint(address recipient, string memory _tokenURI)
        public
    
        returns (uint256)
        // Check that the calling account has the minter role
    {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");

       _tokenIds.increment();
       uint256 newItemId = _tokenIds.current();
       _mint(recipient, newItemId, 1, "");
       _setTokenURI(newItemId, _tokenURI);
       return newItemId;

    }


}