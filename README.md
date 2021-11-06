# NFT图片竞拍网站
这是一个简易的NFT图片竞拍网站，以下是正确启动打开网站

1. 打开Ganache客户端，进入本地链，确保端口为8545。
2. 命令行进入contract位置，输入`truffle compile`编译合约，再输入`truffle migrate`获得合约地址。修改../frontend/src/pages/Login/eth.js末尾的contract合约地址为刚生成的合约地址。
3. 命令行进入frontend位置，输入`npm start`，启动前端界面。
4. 网页打开后，使用MetaMask登录连上本地链的账户，再刷新网页，就可以正常登录了。

页面内容：

1. 第一个按键为创建新的NFT图片
2. 第二个按钮为查看已有的图片
3. 第三个按钮是查看正在竞拍的图片
4. 第四个按钮为一个简单的NFT介绍





