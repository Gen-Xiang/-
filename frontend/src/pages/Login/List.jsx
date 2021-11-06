import React, { Component } from 'react';
import {Card, Button,Layout,Col,Row , List,Modal,Image,Descriptions,Form,InputNumber,Tag} from 'antd'
import {FormOutlined, DollarCircleOutlined, SketchOutlined,QuestionCircleOutlined,FieldTimeOutlined } from '@ant-design/icons'
import Background from './123.jpeg';
import {Link} from 'react-router-dom'
import { Color } from '@antv/attr';
import { toInteger } from '@antv/util';
const {Meta} = Card
let web3 = require('./web3');
let lotteryInstance = require('./eth')


function States  (e) {
  if(e.e.onsale){
      return <Tag color="magenta">竞拍中</Tag>
  }
  else{
      if(e.e.setaside==false){
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
        ownerhistory:[],
        choosedmodelid:0,
        auctiondurationday:0,
        auctiondurationhour:0,
        auctiondurationminute:0,
        startprice:0,
        bidprice:null,
        maxprice:0,
        maximumbid:'N/A',
        day:'N/A',
        hour:'N/A',
        minute:'N/A'
    }
  }
  async componentWillMount() {
        
    // //获取当前的所有地址
    let accounts = await web3.eth.getAccounts()
    if(accounts.length!=0){
        console.log(accounts.length)
    }

    
    
    let result = await lotteryInstance.methods.getAuction().call();
    let result2=await lotteryInstance.methods.refreshAllAuction().call();
    console.log(result2);

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
            endtime:result[i][14],
        })
    }
    
    this.setState({
        
    })
    
  }
  showModal = async  (e) => {
        
    delete this.state.ownerhistory
    this.state.ownerhistory=[];

    for(let i=0;i<=e.ownerhistory.length-1;i++){
        this.state.ownerhistory.push({
            hi:e.ownerhistory[i]
        })
    }
    let accounts = await web3.eth.getAccounts()
    let t=0;
    for(let i=0;i<=e.bidderhistory.length-1;i++){
      if(accounts[0]==e.bidderhistory[i]){
        this.setState({
          maximumbid:e.bidpricehistory[i]*1.0/100,
        })
        t=1;
      }
    }
    if(t==0){
        this.setState({
            maximumbid:'N/A',
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
    let time=(new Date().getTime()/1000);
    let time2=toInteger(time);
    console.log(time2);
    let diff=this.state.data[this.state.choosedmodelid].endtime-time2;
    if(diff<=0){
        this.setState({
            day:'N/A',
            hour:'N/A',
            minute:'N/A'
        })
    }
    else{
        let day=toInteger(diff/3600/24);
        let hour=toInteger((diff-day*3600*24)/3600);
        let minute=toInteger((diff-day*3600*24-hour*3600)/60);
        this.setState({
            day:day,
            hour:hour,
            minute:minute,
        })
        console.log(day,hour,minute);
    }
    
    

  };
  bid=async()=>{
    let accounts = await web3.eth.getAccounts()
    if(this.state.data[this.state.choosedmodelid].ownerhistory[this.state.data[this.state.choosedmodelid].ownerhistory.length-1]==accounts[0]){
        alert("该图片已经是您所有!");
    }
    else
    this.setState({
      visible2:true,
    })
    console.log(this);
  }
  changebideprice=(value)=>{
    this.setState({
      bidprice:value
    })
  }
  participateauction = async()=>{
    let accounts = await web3.eth.getAccounts()
    if(accounts.length!=0){
        console.log(accounts.length)
    }
    console.log(this.state.data[this.state.choosedmodelid].ntfid);
        try{
            await lotteryInstance.methods.bid(this.state.data[this.state.choosedmodelid].ntfid,accounts[0]).send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.bidprice.toString(), 'ether'),
                gas: '200000',
            })
            alert("竞价成功!");
        }
        catch(e){
          console.log(e);
            alert("竞价失败!");
        }
  }
  
  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleCancel2 = () => {
      this.setState({ visible2: false });
  };

    render() {
        // this.helpFunction()
        return (
            
            <div className="login2">
                
                <div className="login-content-wrap2">
                    <br/><br/><h1 style={{textAlign:"center"}} >在售NFT图片</h1>
                    
                </div>
                <div className="login-content-wrap3" style={{textAlign:'left'}}>
                    <Button style={{marginLeft: 20,marginTop:20}} type="primary" className="login-form-button3">
                        <Link to={{pathname:"/Create"}}>
                            {/* <FormOutlined /> */}创建属于您的图片
                        </Link> 
                    </Button>
                    <Button style={{marginLeft: 20}} type="primary" className="login-form-button3">
                        <Link to={{pathname:"/Own"}}>
                        {/* <DollarCircleOutlined /> */}已拥有图片
                        </Link>  
                        
                    </Button>
                    <Button style={{marginLeft: 20}} type="primary" className="login-form-button3">
                        <Link to={{pathname:"/Bidding"}}>
                        {/* <SketchOutlined /> */}竞拍的图片
                        </Link>
                    </Button>
                    <Button style={{marginLeft: 20}} ghost type="primary" className="login-form-button3">
                        <Link to={{pathname:"/Help"}}>
                            {/* <QuestionCircleOutlined /> */}什么是NFT？
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
                                    <Button key="submit" type="primary" onClick={()=>this.bid(item)}>
                                    竞拍
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
                                        <Descriptions.Item label="剩余时间" span={3}><Tag color="green"><FieldTimeOutlined /> {this.state.day}天 : {this.state.hour}小时 : {this.state.minute}分钟</Tag></Descriptions.Item>
                                        <Descriptions.Item label="当前竞拍价格" span={1.5}>
                                          <svg t="1634640039778" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2518" width="16" height="16"><path d="M509.610667 766.72L195.413333 581.12 509.568 1024l314.453333-442.88-314.538666 185.6h0.128zM514.389333 0L200.106667 521.514667l314.24 185.770666 314.24-185.6L514.389333 0z" p-id="2519"></path></svg>
                                          {this.state.maxprice}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="您的最大竞价" span={1.5}>
                                          <svg t="1634640039778" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2518" width="16" height="16"><path d="M509.610667 766.72L195.413333 581.12 509.568 1024l314.453333-442.88-314.538666 185.6h0.128zM514.389333 0L200.106667 521.514667l314.24 185.770666 314.24-185.6L514.389333 0z" p-id="2519"></path></svg>
                                          {this.state.maximumbid}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="等级" span={1.5}>{this.state.data[this.state.choosedmodelid].level}</Descriptions.Item>
                                        <Descriptions.Item label="状态" span={1.5}><States e={this.state.data[this.state.choosedmodelid]}/></Descriptions.Item>
                                        
                                        <Descriptions.Item label="魔力值" span={1.5}>{this.state.data[this.state.choosedmodelid].magic}</Descriptions.Item>
                                        <Descriptions.Item label="力量值" span={1.5}>{this.state.data[this.state.choosedmodelid].strth}</Descriptions.Item>
                                        <Descriptions.Item label="智力值" span={1.5}>{this.state.data[this.state.choosedmodelid].integ}</Descriptions.Item>
                                        <Descriptions.Item label="幸运值" span={1.5}>{this.state.data[this.state.choosedmodelid].lucky}</Descriptions.Item>
                                        <Descriptions.Item label="历史拥有者">
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
                                title={"参与竞拍"}
                                onCancel={this.handleCancel2}
                                footer={[
                                ]}
                                width={window.innerWidth*0.6}
                                >
                            <div id="body" className="login-formown">
                            
                            <Form onFinish={this.participateauction} style={{textAlign:'center'}}>
                                
                                <Form.Item label="起始价格:"  name="startingsrice" >
                                <svg t="1634640039778" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2518" width="16" height="16"><path d="M509.610667 766.72L195.413333 581.12 509.568 1024l314.453333-442.88-314.538666 185.6h0.128zM514.389333 0L200.106667 521.514667l314.24 185.770666 314.24-185.6L514.389333 0z" p-id="2519"></path></svg>
                                    {this.state.maxprice}
                                    
                                </Form.Item>
                                <Form.Item label="当前价格:"  name="startingsrice" >
                                  <svg t="1634640039778" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2518" width="16" height="16"><path d="M509.610667 766.72L195.413333 581.12 509.568 1024l314.453333-442.88-314.538666 185.6h0.128zM514.389333 0L200.106667 521.514667l314.24 185.770666 314.24-185.6L514.389333 0z" p-id="2519"></path></svg>
                                    {this.state.maxprice}
                                    
                                </Form.Item>
                                <Form.Item label={<div>您的竞拍价格<svg t="1634640039778" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2518" width="16" height="16"><path d="M509.610667 766.72L195.413333 581.12 509.568 1024l314.453333-442.88-314.538666 185.6h0.128zM514.389333 0L200.106667 521.514667l314.24 185.770666 314.24-185.6L514.389333 0z" p-id="2519"></path></svg></div>}  name="bidprice" rules={
                                    [
                                        { required: true, message: '请输入竞拍价格' }
                                    ]
                                }>
                                    
                                    <InputNumber min={this.state.maxprice-(-0.01)} value={this.state.bidprice} onChange={this.changebideprice} />
                                    
                                </Form.Item>
                                
                                <Form.Item>
                                    <Button ghost  htmlType="submit" type="primary"  size='large'>
                                        竞拍！
                                    </Button>
                                </Form.Item>
                            </Form>
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