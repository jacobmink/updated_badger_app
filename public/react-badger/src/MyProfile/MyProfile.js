import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import EditUser from '../EditUser/EditUser';

class MyProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: this.props.user,
            userData: '',
            showModal: false,
            showReviewForm: false,
            message: ''
        }
    }

    showModal = (e)=>{
        this.setState({
            showModal: !this.state.showModal
        })
    }
    showReviewForm = (e)=>{
        this.setState({
            showReviewForm: !this.state.showReviewForm
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
    componentDidMount(){
        console.log('myprofile mounted');
        // this.props.getUsers();
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

        return(
            <div>
                <h3>Your Profile <img className="pencil-icon" src="/pencil_icon.png" alt="pencil" onClick={this.showModal}/>
                {this.state.message} <button onClick={this.props.logout}>Logout</button></h3>
                

                
                {this.state.showModal ? <div>
                    <EditUser editUser={this.editUser} user={this.state.user} deleteUser={this.props.deleteUser}/> <br/>
                </div>  : null}
                 
                 {this.state.showModal ? null : 
                 <div>
                    <img src={this.state.user.img} alt={this.state.user.img} className="profile-pic" /> <br/>
                    Age: { this.state.user.age } <br/>
                    Gender: { this.state.user.gender } <br/>
                    About: { this.state.user.about } <br/>
                    Badges: <br/>
                    {badgeListRender} <br/>
                    <Link to="/newbadge"><button>Add Badge</button></Link>
                </div>}
                
            </div>
        )
    }
}
export default withRouter(MyProfile);


// {this.state.showModal ? null : 
//     <Link to="/newbadge"><button>Add Badge</button></Link>}
//      <br/>
// {this.state.showModal ? null : <div>Your Matches: <br/>
//     <ul className="match-list">
//         {renderMatches}
//     </ul></div> }