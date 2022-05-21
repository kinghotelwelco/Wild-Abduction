// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.0;

contract Seed {

    uint256 _seed;
    constructor() {}

    function seed() external view returns(uint256) {
        return _seed;
    }


    function update(uint256 __seed) external returns(uint256) {

        _seed = uint256(keccak256(abi.encodePacked(
                tx.origin,
                blockhash(block.number - 1),
                block.timestamp,
                __seed
            ))) ^ __seed;

            return _seed;
    }
}