// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0; 

import "./DappToken.sol";
import "./DaiToken.sol";


contract TokenFarm {
    address public owner; 
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
        owner = msg.sender; //person who deploys the contract 

    }

    //1. Stakes Tokens (Deposite)
    function stakeTokens(uint _amount) public {
         //require amount  to be greater than 0 
         require(_amount > 0,  'amount cannot be 0' );

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
    //2. Issuing Tokens 

    function issueTokens() public {
        require(msg.sender == owner, 'Call must be the owner'); //only allow the owner to call this contract otherwise anyone can call it any time 
        for (uint i=0; i<stakers.length; i++){ //interate through all the stakers 
            address recipient = stakers[i]; //get addressf of stakers 
            uint balance = stakingBalance[recipient]; //see how much DAi they staked (we are going to reward 1 Dapp token for each Dai )
            if(balance > 0 ) {
                //Transfer Dapp tokens to this contract as reward 
                dappToken.transfer(recipient, balance); 
            }
        }
    }

     //3. Unstaking Tokens (Widthdraw)

}