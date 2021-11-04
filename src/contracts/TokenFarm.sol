// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0; 

import "./DappToken.sol";
import "./DaiToken.sol";


contract TokenFarm {
    string public name = "Dapp Token Farm";
    DappToken public dappToken; // state varriables 
    DaiToken public daiToken;

    address[] public stakers; 
    mapping(address => uint ) public stakingBalance;
    mapping(address => bool) public hasStaked; 
    mapping(address => bool) public isStaking; 


    //addresses of token are passed 
    constructor(DappToken _dappToken, DaiToken _daiToken) public { //special function run once, whenever the smart contract is deployed 
        dappToken  = _dappToken;
        daiToken = _daiToken; 

    }

    //1. Stakes Tokens (Deposite)
    function stakeTokens(uint _amount) public {
         
         //Transfer Mock Dai tokens to this contract for staking 
         daiToken.transferFrom(msg.sender, address(this), _amount);

         //update staking balance 
         stakingBalance[msg.sender] = stakingBalance[msg.sender] +  _amount;

         //Add user to stakers iff they haven't already staked 
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        //update staking status to true after added to list 
        hasStaked[msg.sender] = true; 
        isStaking[msg.sender] = true; 

    }

    //2. Unstaking Tokens (Widthdraw)


    //3. Issuing Tokens 


}