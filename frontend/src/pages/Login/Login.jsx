import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
// import ManagerCenter from '../ManagerCenter/ManagerCenter'
// import StudentCenter from '../StudentCenter/StudentCenter'
import LoginInterface from './LoginInterface'
import ForgetPSW from './ForgetPSW'
import List from './List'
import Help from './Help'
import Create from './Create'
import Own from './Own'
import Bidding from './Bidding'
export default class Login extends Component {
    render() {
        return (
                <Switch>
                    {/* <Route path="/ManagerCenter" component={ManagerCenter}></Route>
                    <Route path="/StudentCenter" component={StudentCenter}></Route> */}
                    <Route path="/LoginInterface" component={LoginInterface}></Route>
                    <Route path="/List" component={List}></Route>
                    <Route path="/Help" component={Help}></Route>
                    <Route path="/Own" component={Own}></Route>
                    <Route path="/Bidding" component={Bidding}></Route>
                    <Route path="/Create" component={Create}></Route>
                    <Route path="/ForgetPSW" component={ForgetPSW}></Route>
                    <Redirect to="/LoginInterface"></Redirect>
                </Switch>
        )
    }
}


