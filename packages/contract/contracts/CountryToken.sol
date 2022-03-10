// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CountryToken is ERC721 {
    using Counters for Counters.Counter;

    constructor() ERC721("CountryToken","CNFT"){
    }
    function acquireCountry(address puchaser, string memory ISO_A3) public {
        uint256 newItemId = uint256(keccak256(abi.encodePacked(ISO_A3)));
        _mint(puchaser, newItemId);
    }
    function getCountryOwner(string calldata ISO_A3) public view returns(address owner){

    }
}