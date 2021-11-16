import React, { Component } from 'react'
import Navbar from './Navbar'
import './App.css'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Main from './Main'

class App extends Component {

  async componentDidMount() { //lifecycle component 
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    //get network ID of the network we want to connect to ie.the one we used on metmask for now 
    const networkId = await web3.eth.net.getId()

    //load DaiToken 
    const daiTokenData = DaiToken.networks[networkId] //get the data of the daiToken that we deployed on the chain by using the ABI json
    
    if(daiTokenData) { 
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address) //create web3 version of the contract 
      this.setState({ daiToken }) //update state
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call() //get balance (use call() when reading information)
      this.setState({ daiTokenBalance: daiTokenBalance.toString() })
    } else { 
      window.alert('DaiToken contract not deployed to detected network')
    }


      //load DappToken 
      const dappTokenData = DappToken.networks[networkId] //get the data of the daiToken that we deployed on the chain by using the ABI json
  
      if(dappTokenData) { 
        const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address) //create web3 version of the contract 
        this.setState({ dappToken }) //update state
        let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call() //get balance (use call() when reading information)
        this.setState({ dappTokenBalance: dappTokenBalance.toString() })
      } else { 
        window.alert('DaiToken contract not deployed to detected network')
      }

      //load TokenFarm 
      const tokenFarmData = TokenFarm.networks[networkId]
      if(tokenFarmData) {
        const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
        this.setState({ tokenFarm })
        let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
        this.setState({ stakingBalance: stakingBalance.toString() })
      } else {
          window.alert('TokenFarm contract not deployed to detected network')
      }

      this.setState({ loading: false })
  }

  //connect app to blockchain 
  async loadWeb3() {
    if (window.ethereum) { //if ethereum object exists 
      window.web3 = new Web3(window.ethereum)
    }
    else if (window.web3) { //if web 3 object exists 
       window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
    
  }

  unstakeTokens = () => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }



  constructor(props) {
    super(props)
    this.state = {
      account: '0x0', 
      daiToken: {}, //smart contract 
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true // we don't want to show anything(data) until things are finished loading
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading....................breh</p>
    } else {
      content = <Main 
        daiTokenBalance = {this.state.daiTokenBalance}
        dappTokenBalance =   {this.state.dappTokenBalance}
        stakingBalance =   {this.state.stakingBalance}
        stakeTokens = {this.stakeTokens}
        unstakeTokens = {this.unstakeTokens}
       
      /> 
      
    }//load props into main 

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                { content }

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
