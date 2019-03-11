import React, { Component } from 'react';
import './App.css';
import { Route, Switch, withRouter } from 'react-router-dom';
import Profile from './Profile/Profile';
import Login from './Auth/Login/Login';
import UsersContainer from './UsersContainer/UsersContainer';
import Registration from './Auth/Registration/Registration';
import BadgeContainer from './BadgeContainer/BadgeContainer';
import Header from './Header/Header';
import Footer from './Footer/Footer';

import NewBadge from './NewBadge/NewBadge';

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
  deleteBadge = async (id)=>{
    try{
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/users/${this.state.user._id}/badges/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if(!response.ok){
          throw Error(response.statusText);
      }
      const parsed = await response.json();
      this.setState({
          user: parsed.data
      })
      this.props.history.push("/profile");
    }catch(err){
      console.log(err);
      return err;
    }
    
  }
  addBadge = async (data)=>{
    console.log(data, ' raw ass data');
    try{
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/users/${this.state.user._id}`,
      {
        method: "POST",
        body: JSON.stringify(data),
        credentials: 'include',
        headers: {
          'Content-Type':'application/json'
        }
      });
      if(!response.ok){
        throw Error(response.statusText);
      }
      const parsed = await response.json();
      this.setState({
        user: parsed.data
      })
      this.props.history.push("/profile");
    }catch(err){
      console.log(err);
      return err;
    }
    

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
    const badgeTitles = [
      'hike',
      'bike',
      'swim',
      'cook',
      'fish',
      'music',
      'climb',
      'religion',
      'videogame',
      'ski/snowboard',
      'bar games',
      'boardgames',
      'running',
      'international travel',
      'calligraphy',
      'exercise',
      'vegan',
      'volunteering',
      'team sports',
      'reading',
      'coding',
      'trivia',
      'movie buff'
    ];
    return(
      <main className="App">
        <Header logout={this.logout}/>
        {JSON.stringify(this.state.user) === "{}" ?  <Login getUserInfo={this.getUserInfo}/>: 
        <Switch>
          <Route exact path="/" render={props => <Login getUserInfo={this.getUserInfo}/> } />
          <Route exact path="/profile" render={props => <Profile user={this.state.user}/> } />
          <Route exact path="/users/:userId/badges/:badgeId" render={props => <BadgeContainer deleteBadge={this.deleteBadge} /> } />
          <Route exact path="/swipe" render={props => <UsersContainer />} />
          <Route exact path="/newbadge" render={props => <NewBadge addBadge={this.addBadge} badgeTitles={badgeTitles} />} />
          <Route component={ My404 } />
        </Switch>
        }
        <Footer />
      </main>
    )
    
  }
}

export default withRouter(App);
