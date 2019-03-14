import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import NewReview from '../NewReview/NewReview';

class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: this.props.location.state.user,
            userData: '',
            showModal: false,
            message: ''
        }
    }
    getUser = async (id)=>{
        try{
            const foundUser = await fetch(`${process.env.REACT_APP_BACKEND}/users/${id}`, {
            method: 'GET',
            credentials: 'include'
            })
            if(!foundUser.ok){
                throw Error(foundUser.statusText);
            }
            const parsed = await foundUser.json();
            this.setState({
                userData: parsed
            })
        }catch(err){
            console.log(err);
            return err;
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
    handlePageClick = (id, e)=>{
        if(e.target.id === "likeButton"){
            this.props.likeUser(id);
        }
        this.props.history.push('/swipe');
    }
    componentDidMount(){
        this.getUser(this.state.user._id);
    }
    render(){
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
                        loggedIn: this.props.location.state.loggedIn,
                        badge: badge
                    }
                }}>{badge.title}</Link></li>
            )
        })
        return(
            <div>
                <h2>{this.state.user.displayName}'s Profile <br/>
                {this.state.message}</h2>
                

                <img src={this.state.user.img} alt={this.state.user.img}/> <br/>
                Username: { this.state.user.username } <br/>
                Age: { this.state.user.age } <br/>
                Gender: { this.state.user.gender } <br/>
                About: { this.state.user.about } <br/>
                

                Badges: <br/>
                    {badgeListRender}
                <br/>
                <button onClick={this.handlePageClick.bind(null, this.state.user._id)} id="likeButton">Like</button> <button onClick={this.handlePageClick.bind(null, this.state.user._id)} id="DislikeButton">Not Like</button>
                
                
            </div>
        )
    }
}
export default withRouter(Profile);

// {this.props.loggedIn.likedUsers.includes(this.state.user._id) ? <NewReview loggedIn={this.props.location.state.loggedIn} user={this.props.location.state.user} /> : null}