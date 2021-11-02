//moves smart contracts to different places with migration 
//put smart contracts on the blockchain ie. changes the state of blockchain 
const DaiToken = artifacts.require("DaiToken")
const DappToken = artifacts.require("DappToken")
const TokenFarm = artifacts.require("TokenFarm")

module.exports = async function(deployer, network, accounts) {
  //deployer deploys the token to the blockchain so that we can access it later 
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed() //fetch the daiToken address 
  
  //deploy TokenFarm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()

  //Transfer all tokens to TokenFarm (1 million)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

  //Transfer 100 Mock Dai tokens to investor 
  //accounts[1] is the second account on Ganache - we will use it as the investor(person staking their tokens)
  //accounts[0] was used to deploy the TokenFarm Contract onto the blockchain 
  await daiToken.transfer(accounts[1], '100000000000000000000')

};
