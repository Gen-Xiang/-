import React, { Component } from 'react';
import {Card, Button,Layout,Col,Row ,Modal, List,Image,Descriptions,Badge,Tag,Form,Input,InputNumber} from 'antd'
import {LeftOutlined,FormOutlined, DollarCircleOutlined, SketchOutlined,QuestionCircleOutlined } from '@ant-design/icons'
import Background from './123.jpeg';
import {Link} from 'react-router-dom'
import { Color } from '@antv/attr';
import { ListItem } from 'semantic-ui-react';
import { toInteger } from '@antv/util';
const {Meta} = Card
let web3 = require('./web3');
let lotteryInstance = require('./eth')
const {Content } = Layout


function States  (e) {
    if(e.e.onsale){
        return <Tag color="magenta">竞拍中</Tag>
    }
    else{
        if(e.e.setaside==true){
            return <Tag color="orange">等待确认</Tag>
        }
        else{
            return <Tag color="blue">持有</Tag>
        }
    }
}

class App extends Component {
    
    constructor() {
        super()

        this.state = {
            data:[],
            loading:false,
            visible:false,
            visible2:false,
            visible3:false,
            visible4:false,
            ownerhistory:[],
            bidderhistory:[],
            choosedmodelid:0,
            auctiondurationday:0,
            auctiondurationhour:0,
            auctiondurationminute:0,
            maxprice:0,
            startprice:0,
        }
    }

    async componentWillMount() {

        // //获取当前的所有地址
        let accounts = await web3.eth.getAccounts()
        if(accounts.length!=0){
            console.log(accounts.length)
            this.state.disabled=false;
        }
        
            let result = await lotteryInstance.methods.getCharacter(accounts[0]).call();
            console.log(result);
            for(let i=0;i<=result.length-1;i++){
            this.state.data.push({
                id:i,
                ntfid:result[i][0],
                name:result[i][1],
                imgurl:result[i][2],
                magic:result[i][3],
                strth:result[i][4],
                integ:result[i][5],
                lucky:result[i][6],
                level:result[i][7],
                ownerhistory:result[i][8],
                onsale:result[i][9],
                startprice:result[i][10]*1.0/100,
                bidderhistory:result[i][11],
                bidpricehistory:result[i][12],
                setaside:result[i][13],

                
            })
            }
        
        
        
        this.setState({
            
        })
        
    }
    
    
    showModal = (e) => {
        
        delete this.state.ownerhistory
        this.state.ownerhistory=[];

        for(let i=0;i<=e.ownerhistory.length-1;i++){
            this.state.ownerhistory.push({
                hi:e.ownerhistory[i]
            })
        }
        this.setState({
          visible: true,
          choosedmodelid:e.id,
        });
        if(e.bidderhistory.length==0){
            this.setState({
                maxprice:e.startprice
            })
        }
        else{
            this.setState({
                maxprice:e.bidpricehistory[e.bidderhistory.length-1]*1.0/100
            })
        }
      };
    
    sell =(e)=>{
        if(e.onsale==true||e.setaside==true){
            alert('此图片已经在拍卖!');
        }
        else{
            this.setState({ visible2: true });
        }
    }
    auctionstatus =(e)=>{
        if(this.state.data[this.state.choosedmodelid].onsale==true||this.state.data[this.state.choosedmodelid].setaside==true){
            delete this.state.bidderhistory;
            this.state.bidderhistory=[];
            for(let i=0;i<=e.bidderhistory.length-1;i++){
                this.state.bidderhistory.push({
                    buyer:e.bidderhistory[i],
                    price:e.bidpricehistory[i]*1.0/100
                })

            }
            console.log(e.bidderhistory);
            console.log(this.state.bidderhistory);
            this.setState({
                visible3:true,
            })
        }
        else{
            alert("此图片不在竞拍中!");
        }
    }
    confirm=async()=>{
        let accounts = await web3.eth.getAccounts()
        console.log(accounts);
        if(this.state.data[this.state.choosedmodelid].onsale==false&&this.state.data[this.state.choosedmodelid].setaside==true){
            if(this.state.data[this.state.choosedmodelid].bidderhistory.length==0){
                try{
                    await lotteryInstance.methods.ownerconfirm(this.state.data[this.state.choosedmodelid].ntfid).send({
                        from:accounts[0],
                        value: 0,
                        gas: '200000',
                    })
                    // alert("Sell success!");
                    alert("没有人竞拍您的图片，竞拍结束.");
                }
                catch(e){
                    alert("失败!");
                    console.log(e);
                }
                
            }
            else{
                this.setState({
                    visible4:true,
                })
            }
        }
        else{
            alert("竞拍还未结束!");
        }
    }
    confirm2=async()=>{
        let accounts = await web3.eth.getAccounts()
        try{
            await lotteryInstance.methods.ownerconfirm(this.state.data[this.state.choosedmodelid].ntfid).send({
                from:accounts[0],
                value: 0,
                gas: '200000',
            });
            alert("出售成功!");
        }
        catch(e){
            alert("失败!");
            console.log(e);
        }
    }
    changeauctiondurationday=(value)=>{
        this.setState({
            auctiondurationday:value
        })
    }
    changeauctiondurationhour=(value)=>{
        this.setState({
            auctiondurationhour:value
        })
    }
    changeauctiondurationminute=(value)=>{
        this.setState({
            auctiondurationminute:value
        })
    }
    changestartprice=(value)=>{
        this.setState({
            startprice:value
        })
        console.log(this.state.startprice*100)
    }
    createauction =async()=>{
        let accounts = await web3.eth.getAccounts()
        console.log(this.state.startprice,this.state.auctionduration);
        let seconds=this.state.auctiondurationday*24*3600+this.state.auctiondurationhour*3600+this.state.auctiondurationminute*60;
        try{
            await lotteryInstance.methods.createNewAuction(this.state.data[this.state.choosedmodelid].ntfid,seconds,this.state.startprice*100).send({
                from: accounts[0],
                value: web3.utils.toWei('0.1', 'ether'),
                gas: '3000000',
            })
            alert("创建成功!");
        }
        catch(e){
            alert("创建失败!");
            console.log(e);
        }
    }
    handleCancel = () => {
        this.setState({ visible: false });
    };
    handleCancel2 = () => {
        this.setState({ visible2: false });
    };
    handleCancel3 = () => {
        this.setState({ visible3: false });
    };
    handleCancel4 = () => {
        this.setState({ visible4: false });
    };

    render() {
        // this.helpFunction()
        return (
            
            <div className="login2">
                
                <div className="login-content-wrap2">
                    <br/><br/><h1 style={{textAlign:"center"}} >您拥有的图片</h1>
                    
                </div>
                <div className="login-content-wrap3" >
                    <Button style={{marginLeft: 20, marginTop:25}} type="default">
                        <Link to={{pathname:"/List"}}>
                            <LeftOutlined />返回
                        </Link>    
                    </Button>
                </div>

                <div className="login-content-wrap4">
                    <br/>
                    <List
                        grid={{
                        gutter: 0,
                        xs: 1,
                        sm: 2,
                        md: 6,
                        lg: 6,
                        xl: 6,
                        xxl: 6,
                        }}
                        pagination={{
                            onChange: page => {
                              console.log(page);
                            },
                            pageSize: 6,
                          }}
                        dataSource={this.state.data}
                        renderItem={item => (
                        <List.Item>
                            <Card
                                hoverable
                                style={{ width: 250}}
                                cover={<img width={250} height={200} alt="example" src={item.imgurl} />}
                                onClick={()=>this.showModal(item)}
                            >
                                {item.name}
                            </Card>
                            
                            <Modal
                                visible={this.state.visible}
                                title="图片信息"
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                footer={[
                                    <Button key="back" onClick={this.handleCancel}>
                                    返回
                                    </Button>,
                                    <Button key="submit" type="primary" onClick={()=>this.auctionstatus(item)}>
                                    竞拍状态
                                    </Button>,
                                    <Button key="submit" type="primary" onClick={()=>this.sell(item)}>
                                    出售
                                    </Button>,
                                ]}
                                width={window.innerWidth*0.7}
                                >
                                 <Row>
                                    <Col span={8}>
                                        <Image
                                            width={200}
                                            height={300}
                                            src={this.state.data[this.state.choosedmodelid].imgurl}
                                            
                                        />
                                    </Col>
                                    <Col span={16}>
                                    <Descriptions layout="vertical" bordered size={"small"}>
                                        <Descriptions.Item label="名称" span={3}>{this.state.data[this.state.choosedmodelid].name}</Descriptions.Item>
                                        <Descriptions.Item label="等级" span={1.5}>{this.state.data[this.state.choosedmodelid].level}</Descriptions.Item>
                                        <Descriptions.Item label="状态" span={1.5}><States e={this.state.data[this.state.choosedmodelid]}/></Descriptions.Item>
                                        
                                        <Descriptions.Item label="魔力值" span={1.5}>{this.state.data[this.state.choosedmodelid].magic}</Descriptions.Item>
                                        <Descriptions.Item label="力量值" span={1.5}>{this.state.data[this.state.choosedmodelid].strth}</Descriptions.Item>
                                        <Descriptions.Item label="智力值" span={1.5}>{this.state.data[this.state.choosedmodelid].integ}</Descriptions.Item>
                                        <Descriptions.Item label="幸运值" span={1.5}>{this.state.data[this.state.choosedmodelid].lucky}</Descriptions.Item>
                                        <Descriptions.Item label="拥有者历史">
                                            <List dataSource={this.state.ownerhistory}
                                                renderItem={item2 => (
                                                    <div>{item2.hi}</div>
                                                )}
                                            />
                                                
                                        </Descriptions.Item>
                                    </Descriptions>
                                    </Col>
                                </Row>
                                
                                    
                            </Modal>
                            <Modal
                                visible={this.state.visible2}
                                title={"创建竞拍"}
                                onCancel={this.handleCancel2}
                                footer={[
                                ]}
                                width={window.innerWidth*0.6}
                                >
                            <div id="body" className="login-formown">
                            
                            <Form onFinish={this.createauction} style={{textAlign:'center'}}>
                                
                                <Form.Item label={<div>起始价格：<svg t="1634640039778" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2518" width="20" height="20"><path d="M509.610667 766.72L195.413333 581.12 509.568 1024l314.453333-442.88-314.538666 185.6h0.128zM514.389333 0L200.106667 521.514667l314.24 185.770666 314.24-185.6L514.389333 0z" p-id="2519"></path></svg></div>}  name="startingsrice" rules={
                                    [
                                        { required: true, message: '请输入起始价格' }
                                    ]
                                }>
                                    
                                    
                                    <InputNumber min={0.01} max={59}value={this.state.startprice} onChange={this.changestartprice} />
                                    
                                </Form.Item>
                                <Form.Item label="竞拍时长（天）：" name="auctiondurtionday" rules={
                                    [
                                        { required: true, message: '请输入竞拍持续天数' },

                                    ]
                                }>
                                    <InputNumber min={0} max={23} value={this.state.auctiondurationday} onChange={this.changeauctiondurationday} />
                                    
                                </Form.Item >
                                <Form.Item label="竞拍时长（小时）：" name="auctiondurtionhour" rules={
                                    [
                                        { required: true, message: '请输入竞拍持续小时数' },

                                    ]
                                }>
                                    
                                    <InputNumber min={0} max={29} value={this.state.auctiondurationhour} onChange={this.changeauctiondurationhour} />
                                    
                                </Form.Item >
                                <Form.Item label="竞拍时长（分钟）：" name="auctiondurtionminute" rules={
                                    [
                                        { required: true, message: '请输入竞拍持续分钟数' },

                                    ]
                                }>
                                    
                                    <InputNumber min={1-this.state.auctiondurationday-this.state.auctiondurationhour} value={this.state.auctiondurationminute} onChange={this.changeauctiondurationminute} />
                                </Form.Item >
                                <Form.Item>
                                    <Button htmlType="submit" type="primary" size='large'>
                                        创建!
                                    </Button>
                                </Form.Item>
                                
                            </Form>
                            </div>
                            </Modal>
                            <Modal
                                visible={this.state.visible3}
                                title={"竞拍状态"}
                                onCancel={this.handleCancel3}
                                footer={[
                                    <Button key="back" onClick={this.handleCancel3}>
                                    返回
                                    </Button>,
                                    <Button key="submit" type="primary" onClick={()=>this.confirm(item)}>
                                    确认
                                    </Button>,
                                ]}
                                width={window.innerWidth*0.6}
                                >
                            <Descriptions layout="vertical" bordered size={"small"}>
                                        <Descriptions.Item label="名称" span={3}>{this.state.data[this.state.choosedmodelid].name}</Descriptions.Item>
                                        
                                        <Descriptions.Item label="等级" span={1.5}>{this.state.data[this.state.choosedmodelid].level}</Descriptions.Item>
                                        <Descriptions.Item label="状态" span={1.5}><States e={this.state.data[this.state.choosedmodelid]}/></Descriptions.Item>
                                        <Descriptions.Item label="起始价格" span={1.5}>
                                          <svg t="1634640039778" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2518" width="16" height="16"><path d="M509.610667 766.72L195.413333 581.12 509.568 1024l314.453333-442.88-314.538666 185.6h0.128zM514.389333 0L200.106667 521.514667l314.24 185.770666 314.24-185.6L514.389333 0z" p-id="2519"></path></svg>
                                          {this.state.data[this.state.choosedmodelid].startprice}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="当前价格" span={1.5}>
                                          <svg t="1634640039778" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2518" width="16" height="16"><path d="M509.610667 766.72L195.413333 581.12 509.568 1024l314.453333-442.88-314.538666 185.6h0.128zM514.389333 0L200.106667 521.514667l314.24 185.770666 314.24-185.6L514.389333 0z" p-id="2519"></path></svg>
                                          {this.state.maxprice}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="竞拍历史">
                                            <List dataSource={this.state.bidderhistory}
                                                renderItem={item2 => (
                                                    <div>
                                                        {item2.buyer}:
                                                        <svg t="1634640039778" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2518" width="16" height="16"><path d="M509.610667 766.72L195.413333 581.12 509.568 1024l314.453333-442.88-314.538666 185.6h0.128zM514.389333 0L200.106667 521.514667l314.24 185.770666 314.24-185.6L514.389333 0z" p-id="2519"></path></svg>
                                                        {item2.price}
                                                    </div>
                                                )}
                                            />
                                                
                                        </Descriptions.Item>
                            </Descriptions>
                            </Modal>
                            <Modal
                                visible={this.state.visible4}
                                title={<div>确认出售 "{this.state.data[this.state.choosedmodelid].name}" 
                                <svg t="1634640039778" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2518" width="16" height="16"><path d="M509.610667 766.72L195.413333 581.12 509.568 1024l314.453333-442.88-314.538666 185.6h0.128zM514.389333 0L200.106667 521.514667l314.24 185.770666 314.24-185.6L514.389333 0z" p-id="2519"></path></svg>
                                 {this.state.maxprice}?</div>}
                                onCancel={this.handleCancel4}
                                footer={[
                                    <Button key="back" onClick={this.handleCancel4}>
                                    再想想
                                    </Button>,
                                    <Button key="submit" type="primary" onClick={()=>this.confirm2(item)}>
                                    确认!
                                    </Button>,
                                ]}
                                width={window.innerWidth*0.6}
                                >
                            <div id="body">
                                <h3>您会永久失去您的图片并无法恢复!</h3>
                            </div>
                            </Modal>
                        </List.Item>
                        )}
                    />
                </div>
                
                
            </div>
        );
    }
}

export default App;