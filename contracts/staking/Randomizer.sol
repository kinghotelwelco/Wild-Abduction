// SPDX-License-Identifier: MIT LICENSE

pragma solidity ^0.8.1;
import "./interfaces/ISeed.sol";

contract Randomizer {
    

    ISeed public randomSource;
    address admin;



    function setRandomSource(ISeed _seed) external {
        require(msg.sender == admin);
        randomSource = _seed;
    }


    constructor() {
        admin = msg.sender;
    }
    /**
     * generates a pseudorandom number
     * @param seed a value ensure different outcomes for different sources in the same block
   * @return a pseudorandom value
   */
    function random(uint256 seed) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
                tx.origin,
                blockhash(block.number - 1),
                block.timestamp,
                seed
            ))) ^ randomSource.seed();
    }

}