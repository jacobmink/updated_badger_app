import React, { Component } from 'react';
import './App.css';
import { Route, Switch, withRouter } from 'react-router-dom';
import Profile from './Profile/Profile';
import Login from './Auth/Login/Login';
import UsersContainer from './UsersContainer/UsersContainer';
import BadgeContainer from './BadgeContainer/BadgeContainer';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import MyProfile from './MyProfile/MyProfile';

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
      user: {},
      loggedIn: {},
      users: []
    }
  }

  getUsers = async ()=>{
    const url = `${process.env.REACT_APP_BACKEND}/users`;
    try{
        const foundUsers = await fetch(url, {
        method: 'GET',
        credentials: 'include'
        })
        if(!foundUsers.ok){
            throw Error(foundUsers.statusText);
        }
        const parsed = await foundUsers.json();
        console.log(parsed.data, ' foundUsers');
        this.setState({
            users: parsed.data
        })
    }catch(err){
        console.log(err);
        return err;
    }
  }

  getUserInfo = (userInfo)=>{
    // console.log('in getUserInfo', userInfo);
    this.setState({
      loggedIn: userInfo
    }, ()=>{
      this.props.history.push('/myprofile');
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
          loggedIn: parsed.data
      })
      this.props.history.push("/myprofile");
    }catch(err){
      console.log(err);
      return err;
    }
    
  }
  addBadge = async (data)=>{
    console.log(data, ' raw ass data');
    try{
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/users/${this.state.loggedIn._id}/badges`,
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
        loggedIn: parsed.data
      })
      this.props.history.push("/myprofile");
    }catch(err){
      console.log(err);
      return err;
    }
  }

  likeUser = async (id)=>{
    console.log('adding user with id ' + id + ' to likedUser array');
    id = {id: id};
    try{
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/users/${this.state.loggedIn._id}/connections`, {
        method: "POST",
        body: JSON.stringify(id),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // console.log(response, ' raw response from likeUser');
      if(!response.ok){
        throw Error(response.statusText);
      }
      const parsed = await response.json();
      this.setState({
        loggedIn: parsed.data
      })
      // console.log(parsed.data, ' parsed likeUser data');
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
        user: {},
        loggedIn: {}
      }, ()=>{
        this.props.history.push('/');
      });
      console.log(this.state, ' logout state');
      
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
    console.log(this.state, 'app.js render state');
    // console.log(this.props, 'app.js props');
    return(
      <main className="App">
        <Header logout={this.logout}/>
        {JSON.stringify(this.state.loggedIn) === "{}" ?  <Login getUserInfo={this.getUserInfo}/>: 
        <Switch>
          <Route exact path="/" render={props => <Login getUserInfo={this.getUserInfo}/> } />
          <Route path="/myprofile" render={props => {
            // console.log('my profile');
            return <MyProfile user={this.state.loggedIn} getUsers={this.getUsers} users={this.state.users}/> }} />
          <Route exact path="/users/:userId/badges/:badgeId" render={props => {
            console.log('badgeContainer');
            return <BadgeContainer deleteBadge={this.deleteBadge}  /> }} />
          <Route exact path="/newbadge" render={props => <NewBadge addBadge={this.addBadge} badgeTitles={badgeTitles} />} />
          <Route exact path="/profile/:id" render={props => <Profile /> } />
          <Route exact path="/swipe" render={props => <UsersContainer user={this.state.loggedIn} likeUser={this.likeUser}/>} />
          <Route component={ My404 } />
        </Switch>
        }
        <Footer />
      </main>
    )
    
  }
}

export default withRouter(App);

/* TODO 
- make review component, only allow review if match exists
- delete user account fix
*/