pragma solidity ^0.7.0;

contract SimpleStorage {
    uint public stored;
    
    constructor(uint _input) {
        stored = _input;
    }
    
    function store(uint _newValue) public {
        stored = _newValue;
    }
}
