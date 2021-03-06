const { assert } = require('chai')


const DaiToken = artifacts.require("DaiToken")
const DappToken = artifacts.require("DappToken")
const TokenFarm = artifacts.require("TokenFarm")

require('chai')
    .use(require('chai-as-promised'))
    .should()
function tokens(n){
    return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
    //Write tests here 
    let daiToken, dappToken, tokenFarm 
    
    before(async () => {
        //load contracts
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        // Transfer all Dapp tokens to farm (1 million)
        await dappToken.transfer(tokenFarm.address, tokens('1000000'))

        // Send tokens to investor 
        await daiToken.transfer(investor, tokens('100'), {from: owner}) // {from: accounts[0]} meta data telling where its coming from because we want to be explicit
    })

    describe('Mock DAI deployment', async () => {
        it('has a name', async () => {
            const name = await daiToken.name()
            assert.equal(name, "Mock DAI Token")
        })
    })

    describe('Dapp Token deployment', async () => {
        it('has a name', async () => {
            const name = await dappToken.name()
            assert.equal(name, "DApp Token")
        })
    })

    describe('Token Farm deployment', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, "Dapp Token Farm")
        })
        it('contract has tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe("Farming Tokens " , async () => {
        it('rewards investors for staking mDai tokens', async () => {
            let result

            // Check investor balance before staking 
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')


            // Stake Mock Dai Tokens 
            await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor}) //must approve tokens first before using transferFrom ie. give permission 
            await tokenFarm.stakeTokens(tokens('100'), { from: investor })

            //Check staking result 
            result = await daiToken.balanceOf(investor) //check balance of investor 
            assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking') // balance is now 0 because 100 tokens have been staked         })
            
            result = await daiToken.balanceOf(tokenFarm.address) // check balance of dai in Token farm 
            assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')
           
            result = await tokenFarm.stakingBalance(investor) 
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor) //check that the investor is staking 
            assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

            //Issue Tokens 
            await tokenFarm.issueTokens({ from: owner })

            //Check balance after issuance 
            result = await dappToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct after issuance')
      
            //Ensure that the owner is the only one that can issue tokens 
            await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

            //Unstake tokens 
            await tokenFarm.unstakeTokens({ from: investor })

            //check result after unstaking 
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAi wallet balance correct after unstaking')
            
            //dai token balance of tokenFarm 
            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'Token Farm Mock Dai Balance correct after staking')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('0'), 'Investor staking balance correct after staking')
            
            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
        })
    })
})
