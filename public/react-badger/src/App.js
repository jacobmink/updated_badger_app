import React, { Component } from 'react';
import './App.css';
import Profile from './Profile/Profile';
import Login from './Auth/Login/Login';
import UsersContainer from './UsersContainer/UsersContainer';
import Registration from './Auth/Registration/Registration';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { Route, Switch, withRouter } from 'react-router-dom';

const My404 = ()=>{
  return(
    <div>
      You are lost!!!
    </div>
  )
}

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      user: {}
    }
  }
  getUserInfo = (userInfo)=>{
    this.setState({
      user: userInfo
    })
  }
  logout = async ()=>{
    try{
      await fetch(`${process.env.REACT_APP_BACKEND}/auth/logout`, {
        method: 'GET',
        credentials: 'include'
      });
      this.setState({
        user: {}
      });
      this.props.history.push('/')
    }catch(err){
      console.log(err);
      return err;
    }
  }
  render(){
    return(
      <main className="App">
        <Header logout={this.logout}/>
        {JSON.stringify(this.state.user) === "{}" ?  <Login getUserInfo={this.getUserInfo}/>: 
        <Switch>
          <Route exact path="/" render={props => <Login getUserInfo={this.getUserInfo}/> } />
          <Route exact path="/profile" render={props => <Profile user={this.state.user}/> } />
          <Route exact path="/swipe" render={props => <UsersContainer />} />
          <Route component={ My404 } />
        </Switch>
        }
        <Footer />
      </main>
    )
    
  }
}

export default withRouter(App);
