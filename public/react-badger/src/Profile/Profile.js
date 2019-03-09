import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import EditUser from '../EditUser/EditUser';

class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: this.props.user,
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
            console.log(parsed, ' foundUser');
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
        // for(let i = 0; i < user.badgeList.length; i++) { 
        //     <li><a href="/users/{ user._id }/badges/{user.badgeList[i]._id}">{user.badgeList[i].title}</a></li>
        // }
            
        

        return(
            <div>
                <h2>{this.state.user.displayName}'s Profile</h2>
                

                <img src={this.state.user.img} /> <br/>
                Username: { this.state.user.username } <br/>
                Age: { this.state.user.age } <br/>
                Gender: { this.state.user.gender } <br/>
                About: { this.state.user.about } <br/>
                <button onClick={this.showModal} >Edit Profile</button> <br/>
                {this.state.message} <br/>
                {this.state.showModal ? <EditUser editUser={this.editUser} user={this.state.user}/> : null}
                <button onClick={this.deleteUser.bind(null, this.state.user._id)} >Delete your Account</button>

                Badges:
                
                <a href="/users/{ user._id }/badges/new"><button>Add Badge</button></a>
            </div>
        )
    }
}
export default withRouter(Profile);