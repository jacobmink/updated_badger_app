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
import NewReview from './NewReview/NewReview';
import ReviewsContainer from './ReviewsContainer/ReviewsContainer';
import MatchesContainer from './MatchesContainer/MatchesContainer';

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
    console.log('in getUsers');
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
        }, ()=>{
          console.log(this.state, ' state from getUsers, now pushing to myprofile')
          this.props.history.push('/myprofile');
        })
    }catch(err){
        console.log(err);
        return err;
    }
  }

  getUserInfo = (userInfo)=>{
    console.log('in getUserInfo');
    this.setState({
      loggedIn: userInfo
    }, ()=>{
      this.getUsers();
    })
    
  }

  deleteUser = async (id)=>{
        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/users/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if(!response.ok){
                throw Error(response.statusText);
            }
            const parsed = await response.json();
            
            console.log(parsed, ' deleteUser response');
            this.setState({
                loggedIn: {},
                user: {}
            }, ()=>{
                this.props.history.push('/');
            })
            
        }catch(err){
            console.log(err);
            return err;
        }
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
      }, ()=>{
        this.props.history.push("/myprofile");
      })
      
    }catch(err){
      console.log(err);
      return err;
    }
  }
  addReview = async (data)=>{
    console.log('trying to addReview')
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/users/${this.state.loggedIn._id}/reviews`, {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(!response.ok){
        throw Error(response.statusText);
      }
      const parsed = await response.json();
      console.log(parsed, ' parsed addReview response');
      this.setState({
        loggedIn: parsed.reviewer,
        users: parsed.users
      }, ()=>{
        this.props.history.push("/myprofile");
      })
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
      if(!response.ok){
        throw Error(response.statusText);
      }
      const parsed = await response.json();
      this.setState({
        loggedIn: parsed.data
      })
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
      'bar_games',
      'boardgames',
      'running',
      'international_travel',
      'calligraphy',
      'exercise',
      'vegan',
      'volunteering',
      'team_sports',
      'reading',
      'coding',
      'trivia',
      'movie_buff'
    ];
    console.log(this.state, 'app.js render state');
    // console.log(this.props, 'app.js props');
    return(
      <main className="App">
        
          <Header loggedIn={this.state.loggedIn} />
          <div className="wrapper">
          {JSON.stringify(this.state.loggedIn) === "{}" ?  <Login getUserInfo={this.getUserInfo}/>: 
          <Switch>
            <Route exact path="/" render={props => <Login getUserInfo={this.getUserInfo}/> } />

            <Route path="/myprofile" render={props => {
              return <MyProfile logout={this.logout} user={this.state.loggedIn} users={this.state.users} deleteUser={this.deleteUser} /> }} />

            <Route exact path="/users/:userId/badges/:badgeId" render={props => {
              console.log('badgeContainer');
              return <BadgeContainer deleteBadge={this.deleteBadge}  /> }} />

            <Route exact path="/newbadge" render={props => <NewBadge addBadge={this.addBadge} badgeTitles={badgeTitles} />} />

            <Route exact path="/newreview" render={props => <NewReview addReview={this.addReview} />} />

            <Route exact path="/matches" render={props => <MatchesContainer loggedIn={this.state.loggedIn} users={this.state.users} addReview={this.addReview} />} />

            <Route exact path="/profile/:id" render={props => <Profile likeUser={this.likeUser}/> } />

            <Route exact path="/swipe" render={props => <UsersContainer user={this.state.loggedIn} likeUser={this.likeUser}/>} />

            <Route component={ My404 } />
          </Switch>
          }
        </div>
        <Footer />
      </main>
    )
    
  }
}

export default withRouter(App);

/* TODO 
*/