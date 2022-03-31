// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

struct Continent {
    string name;
    address owner;
}

contract ContinentToken is ERC721 {
    // uint8[] private temp;
    mapping(bytes2 => Continent) private _continents;
    uint256 private _currentPrice;

    event ContinentSold(address purchaser, bytes2 UID);
    event ContinentBurned(bytes2 ISO);

    constructor() ERC721("ContinentToken", "CNFT") {
        _continents["AF"] = Continent("Africa", address(0));
        _continents["AN"] = Continent("Antarctica", address(0));
        _continents["AS"] = Continent("Asia", address(0));
        _continents["EU"] = Continent("Europe", address(0));
        _continents["NA"] = Continent("North America", address(0));
        _continents["OC"] = Continent("Oceania", address(0));
        _continents["SA"] = Continent("South America", address(0));
        _currentPrice = 100000000000000000;
    }

    function acquireContinent(bytes2 ISO) public payable {
        require(msg.value == _currentPrice, "price not met");
        require(
            !strCompare(_continents[ISO].name, ""),
            string(abi.encodePacked("continent ", ISO, " doesn't exist"))
        );
        _safeMint(msg.sender, uint256(keccak256(abi.encode(ISO))));
        _continents[ISO].owner = msg.sender;
        _currentPrice += 100000000000000000;
        emit ContinentSold(msg.sender, ISO);
    }

    function getContinentOwner(bytes2 ISO) public view returns (address owner) {
        return _continents[ISO].owner;
    }

    function relinquishContinent(bytes2 ISO) public {
        require(msg.sender == _continents[ISO].owner);
        _continents[ISO].owner = address(0);
        _burn(uint256(keccak256(abi.encode(ISO))));
        emit ContinentBurned(ISO);
    }

    function allContinentsStatus() external view returns (Continent[7] memory) {
        return [
            _continents["AF"],
            _continents["AS"],
            _continents["EU"],
            _continents["NA"],
            _continents["SA"],
            _continents["OC"],
            _continents["AN"]
        ];
    }

    function continentStatus(bytes2 ISO)
        external
        view
        returns (Continent memory)
    {
        return _continents[ISO];
    }

    function transferContinent(
        address from,
        address to,
        bytes2 ISO
    ) public {
        require(msg.sender == _continents[ISO].owner);
        _continents[ISO].owner = to;
        _safeTransfer(from, to, uint256(keccak256(abi.encode(ISO))), "");
    }

    function getCurrentPrice() public view returns (uint256 amount) {
        return _currentPrice;
    }

    function strCompare(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        if (bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return keccak256(abi.encode(a)) == keccak256(abi.encode(b));
        }
    }
}
