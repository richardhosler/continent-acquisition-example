// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ContinentToken is ERC721 {
    struct Continent {
        string name;
        address owner;
    }
    uint8[] private temp;
    mapping (uint8 => Continent) private _continents;
    uint256 private _currentPrice;

    event ContinentSold(address purchaser,uint8 UID);
    event ContinentBurned(uint8 UID);

    constructor() ERC721("ContinentToken","CNFT"){
        _continents[0] = Continent("Africa",address(0));
        _continents[1] = Continent("Antarctica",address(0));
        _continents[2] = Continent("Asia",address(0));
        _continents[3] = Continent("Europe",address(0));
        _continents[4] = Continent("North America",address(0));
        _continents[5] = Continent("Oceania",address(0));
        _continents[6] = Continent("South America",address(0));
        _currentPrice = 100000000000000000;
    }
    function acquireContinent(uint8 UID) public payable {
        require(msg.value == _currentPrice, "price not met");
        string memory revertMessage = string(abi.encodePacked("continent ",UID," doesn't exist"));
        require(UID > 0 && UID < 8, revertMessage);
        _safeMint(msg.sender, UID);
        _continents[UID].owner = msg.sender;
        _currentPrice += 100000000000000000;
        emit ContinentSold(msg.sender, UID);
    }
    function getContinentOwner(uint8 UID) public view returns(address owner){
        return _continents[UID].owner;
    }
    function relinquishContinent(uint8 UID) public {
        require(msg.sender == _continents[UID].owner);
        _continents[UID].owner = address(0);
        _burn(UID);
        emit ContinentBurned(UID);
    }
    function allContinentsStatus() external view returns(Continent[7] memory){
        Continent[7] memory out;
        for (uint8 i = 0; i < 7; i++) {
            out[i] = _continents[i];
        }
        return out;
    }
    function continentStatus(uint8 UID) external view returns(Continent memory){
        return _continents[UID];
    }
    function transferContinent(address from, address to, uint8 UID) public {
        require(msg.sender == _continents[UID].owner);
        _continents[UID].owner = to;
        _safeTransfer(from, to, UID, "");
    }
    function getCurrentPrice() public view returns(uint256 amount){
        return _currentPrice;
    }
}