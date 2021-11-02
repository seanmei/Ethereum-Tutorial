// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0; 

import "./DappToken.sol";
import "./DaiToken.sol";


contract TokenFarm {
    string public name = "Dapp Token Farm";
    DappToken public dappToken; // state varriables 
    DaiToken public daiToken;

    //addresses of token are passed 
    constructor(DappToken _dappToken, DaiToken _daiToken) public { //special function run once, whenever the smart contract is deployed 
        dappToken  = _dappToken;
        daiToken = _daiToken; 

    }
}