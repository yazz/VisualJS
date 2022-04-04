pragma solidity ^0.8.7;

contract Counter {
    uint256 public count = 1;

    function increment() public {
        count += 1;
    }
}
