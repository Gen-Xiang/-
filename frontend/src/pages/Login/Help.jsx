import React, { Component } from 'react';
import {Card, Button,Layout,Col,Row , List} from 'antd'
import {FormOutlined, DollarCircleOutlined, SketchOutlined,QuestionCircleOutlined ,LeftOutlined} from '@ant-design/icons'
import Background from './123.jpeg';
import {Link} from 'react-router-dom'
import { Color } from '@antv/attr';
import { toInteger } from '@antv/util';
const {Meta} = Card
let web3 = require('./web3');
let lotteryInstance = require('./eth')
const {Content } = Layout

const data = [
    {
      title: 'Title 1',
    },
    {
      title: 'Title 2',
    },
    {
      title: 'Title 3',
    },
    {
      title: 'Title 4',
    },
    {
      title: 'Title 5',
    },
    {
      title: 'Title 6',
    },
  ];
  for (let i = 0; i < 23; i++) {
    data.push({
        
        title: 'Title'+i,
        
      });
  }
class App extends Component {

    play = async () => {
        console.log('play Button click')
        //1.调用合约方法
        //2.转钱1ETH
        this.setState({ isClicked: true })
        let accounts = await web3.eth.getAccounts()
        try {
            await lotteryInstance.methods.play().send({
                from: accounts[0],
                value: web3.utils.toWei('0.1', 'ether'),
                gas: '3000000',
            })
            window.location.reload()
            this.setState({ isClicked: false })
            alert('投注成功')
        } catch (e) {
            console.log(e)
            this.setState({ isClicked: false })
            alert('投注失败')
        }
    }
    draw = async () => {
        console.log('kaijiang Button click')
        //1.调用合约方法
        //2.转钱1ETH
        this.setState({ isClicked: true })
        let accounts = await web3.eth.getAccounts()
        try {
            await lotteryInstance.methods.draw().send({
                from: accounts[0],
                // value: web3.utils.toWei('1', 'ether'),
                gas: '3000000',
            })
            //显示中奖人
            let winner = await lotteryInstance.methods.winner().call()
            window.location.reload()
            this.setState({ isClicked: false })
            alert(`开奖成功!\n中奖人: ${winner}`)
        } catch (e) {
            console.log(e)
            this.setState({ isClicked: false })
            alert('开奖失败')
        }
    }
    refund = async () => {
        console.log('tuijiang Button click')
        //1.调用合约方法
        //2.转钱1ETH
        this.setState({ isClicked: true })
        let accounts = await web3.eth.getAccounts()
        try {
            await lotteryInstance.methods.refund().send({
                from: accounts[0],
                // value: web3.utils.toWei('1', 'ether'),
                gas: '3000000',
            })
            window.location.reload()
            this.setState({ isClicked: false })
            alert('退奖成功')
        } catch (e) {
            console.log(e)
            this.setState({ isClicked: false })
            alert('退奖失败')
        }
    }
    oc = () =>{
        console.log("click")
    }
    constructor() {
        super()
        this.state = {
            disabled:true,
            manager: '',
            round: '',
            winner: '',
            playerCounts: 0,
            balance: 0,
            players: [],
            currentAccount: '',
            isClicked: false,
            isShowButton: '',
        }
    }

    componentDidMount() {
    }

    async componentWillMount() {
        
        //获取当前的所有地址
        let accounts = await web3.eth.getAccounts()

        if(accounts.length!=0){
            console.log(accounts.length)
            this.state.disabled=false;
        }
    }

    helpFunction = () => {
        let manager = this.state.manager.toLowerCase()
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts[0]) {
                let isShowButton = accounts[0].toLowerCase() === manager ? 'inline' : 'none'
                this.setState({ currentAccount: accounts[0], isShowButton: isShowButton })
            }
        })
    }

    render() {
        // this.helpFunction()
        return (
            
            <div className="login2">
                
                <div className="login-content-wrap2">
                    <br/><br/><h1 style={{textAlign:"center"}} >什么是NFT?</h1>
                    
                </div>
                <div className="login-content-wrap3" style={{}}>
                    
                    <Button style={{marginLeft: 20, marginTop:25}} type="default">
                        <Link to={{pathname:"/List"}}>
                            <LeftOutlined />返回
                        </Link>    
                    </Button>
                </div>

                <div className="login-content-wraphelp">
                    <br/>
                    <h2>
                    NFT，全称为非同质代币，是指非同质代币，是唯一用于表示数字资产（包括JPG和视频剪辑形式）的加密货币代币。NFT可以买卖，就像有形资产一样。
                    </h2>
                </div>
                
            </div>
        );
    }
}

export default App;