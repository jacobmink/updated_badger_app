import React, { Component } from 'react';
import { Route, Switch, withRouter, Link } from 'react-router-dom';
import EditUser from '../EditUser/EditUser';
import NewBadge from '../NewBadge/NewBadge';
import BadgeContainer from '../BadgeContainer/BadgeContainer';

class MyProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: this.props.user,
            userData: '',
            showModal: false,
            message: ''
        }
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
            this.props.history.push('/')
        }catch(err){
            console.log(err);
            return err;
        }
    }
    showModal = (e)=>{
        this.setState({
            showModal: !this.state.showModal
        })
    }
    editUser = async (data, e)=>{
        e.preventDefault();
        console.log(data);
        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/users/${this.state.user._id}`, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(!response.ok){
                throw Error(response.statusText);
            }
            const parsed = await response.json();
            console.log(parsed.data, ' parsed updatedUser');
            if(parsed.code && parsed.code === 11000){
                this.setState({
                    message: 'This username is already taken! Try again.'
                })
            }
            this.setState({
                showModal: false,
                user: parsed.data,
                message: ''
            })

        }catch(err){
            console.log(err);
            return err;
        }
    }
    deleteBook = async (id)=>{
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/users/books/${id}`, {
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
        this.getUser(this.state.user._id); //  TEST WITHOUT THIS LINE
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
        console.log(this.state, '  state from profile');
        // const likedBooks = this.state.userData.length === 0 ? 'None' : this.state.userData.data.likedBooks.map((book)=>{
        //     return(
        //         <ul key={book._id} className="liked-books">
        //             <li><img src={book.image} alt={book.image}/></li>
        //             <li>{book.title}</li>
        //             <li>by: {book.author}</li>
        //             <li><button onClick={this.deleteBook.bind(null, book._id)}>Remove from Favorites</button></li>
        //         </ul>
        //     )
        // });
        // const editAndDelete = this.state.user._id.toString() === sessionId.toString() ? <a href=`/users/${ this.state.user._id }/edit`><button>Edit profile</button></a>
        //     <form onSubmit={this.deleteUser.bind(null, this.state.user._id)}><button>Delete this account</button>
        //     </form> : null;

        const badgeListRender = this.state.user.badgeList.length === 0 ? "This user has no badges yet" : this.state.user.badgeList.map((badge, i)=>{
            return (
                
                <li key={i}>
                    <Link to={{
                    pathname: `/users/${this.state.user._id}/badges/${badge._id}`,
                    state: {
                        user: this.state.user,
                        loggedIn: this.state.user,
                        badge: badge
                    }
                }}>{badge.title}</Link></li>
            )
        })

        const matchList = this.state.user.matchedUsers.length === 0 ? "You haven't matched with anyone yet..." : this.state.user.matchedUsers.map((match, i)=>{
            return(
                <li key={i}>
                    {match.username}
                </li>
            )
        })

        return(
            <div>
                <h2>{this.state.user.displayName}'s Profile <button onClick={this.showModal} >Edit</button> <br/>
                {this.state.message}</h2>
                

                <img src={this.state.user.img} /> <br/>
                Username: { this.state.user.username } <br/>
                Age: { this.state.user.age } <br/>
                Gender: { this.state.user.gender } <br/>
                About: { this.state.user.about } <br/>
                 <br/>
                {this.state.showModal ? <EditUser editUser={this.editUser} user={this.state.user}/> : null}
                <button onClick={this.deleteUser.bind(null, this.state.user._id)} >Delete your Account</button> <br/>

                Badges: <br/>
                    {badgeListRender} <br/>
                
                <Link to="/newbadge"><button>Add Badge</button></Link> <br/>
                Your Matches: <br/>
                {matchList}
            </div>
        )
    }
}
export default withRouter(MyProfile);