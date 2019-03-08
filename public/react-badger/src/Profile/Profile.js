import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import EditUser from '../EditUser/EditUser';

class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: this.props.user.username,
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
            console.log(parsed);
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
            showModal: true
        })
    }
    editUser = async (data, e)=>{
        e.preventDefault();
        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/users/${this.state.user._id}`, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify({"username":data}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(!response.ok){
                throw Error(response.statusText);
            }
            const parsed = await response.json();
            if(parsed.code && parsed.code === 11000){
                this.setState({
                    message: 'This username is already taken! Try again.'
                })
            }
            this.setState({
                showModal: false,
                username: parsed.data.username,
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
        const likedBooks = this.state.userData.length === 0 ? 'None' : this.state.userData.data.likedBooks.map((book)=>{
            return(
                <ul key={book._id} className="liked-books">
                    <li><img src={book.image} alt={book.image}/></li>
                    <li>{book.title}</li>
                    <li>by: {book.author}</li>
                    <li><button onClick={this.deleteBook.bind(null, book._id)}>Remove from Favorites</button></li>
                </ul>
            )
        });
        return(
            <div>
                <h2>{this.state.username}'s Profile</h2>
                <button onClick={this.showModal} >Edit Profile</button> <br/>
                {this.state.message} <br/>
                {this.state.showModal ? <EditUser editUser={this.editUser} user={this.state.user}/> : null}
                <button onClick={this.deleteUser.bind(null, this.state.user._id)} >Delete your Account</button>
                <h3>Your Favorite Books</h3>  <br/> 
                {likedBooks}
                
                

            </div>
        )
    }
}
export default withRouter(Profile);